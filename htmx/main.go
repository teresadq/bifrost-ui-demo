package main

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"
	"io/fs"
	"log"
	"math"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

//go:embed templates/*.html
var templateFS embed.FS

//go:embed static
var staticFS embed.FS

const basePath = "/htmx"

type App struct {
	store *Store
	pages map[string]*template.Template
	frags *template.Template
}

func main() {
	addr := os.Getenv("NOVA_HTMX_ADDR")
	if addr == "" {
		addr = "127.0.0.1:8090"
	}

	app, err := NewApp()
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	app.routes(mux)

	log.Printf("Nova HTMX console → http://%s%s/", addr, basePath)
	server := &http.Server{
		Addr:              addr,
		Handler:           logRequests(mux),
		ReadHeaderTimeout: 5 * time.Second,
	}
	log.Fatal(server.ListenAndServe())
}

func NewApp() (*App, error) {
	pages := map[string]*template.Template{}
	for _, name := range []string{"dashboard", "logs", "projects", "members", "keys", "settings"} {
		tmpl, err := template.New("layout").Funcs(funcMap()).ParseFS(templateFS,
			"templates/layout.html",
			"templates/components.html",
			"templates/fragments.html",
			"templates/"+name+".html",
		)
		if err != nil {
			return nil, fmt.Errorf("parse %s: %w", name, err)
		}
		pages[name] = tmpl
	}

	frags, err := template.New("fragments").Funcs(funcMap()).ParseFS(templateFS,
		"templates/components.html",
		"templates/fragments.html",
	)
	if err != nil {
		return nil, fmt.Errorf("parse fragments: %w", err)
	}

	return &App{store: NewStore(), pages: pages, frags: frags}, nil
}

func (a *App) routes(mux *http.ServeMux) {
	static, err := fs.Sub(staticFS, "static")
	if err != nil {
		log.Fatal(err)
	}
	mux.Handle("GET "+basePath+"/static/", http.StripPrefix(basePath+"/static/", http.FileServer(http.FS(static))))

	mux.HandleFunc("GET "+basePath+"/", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, basePath+"/dashboard", http.StatusFound)
	})

	mux.HandleFunc("GET "+basePath+"/dashboard", a.dashboard)
	mux.HandleFunc("GET "+basePath+"/partials/alerts", a.alertsPanel)
	mux.HandleFunc("POST "+basePath+"/alerts/{id}/ack", a.ackAlert)

	mux.HandleFunc("GET "+basePath+"/logs", a.logsPage)
	mux.HandleFunc("GET "+basePath+"/logs/table", a.logsTable)
	mux.HandleFunc("GET "+basePath+"/logs/{id}", a.logDetail)

	mux.HandleFunc("GET "+basePath+"/projects", a.projectsPage)
	mux.HandleFunc("GET "+basePath+"/projects/table", a.projectsTable)
	mux.HandleFunc("POST "+basePath+"/projects", a.createProject)
	mux.HandleFunc("POST "+basePath+"/projects/{id}/status", a.setProjectStatus)

	mux.HandleFunc("GET "+basePath+"/members", a.membersPage)
	mux.HandleFunc("GET "+basePath+"/members/table", a.membersTable)
	mux.HandleFunc("POST "+basePath+"/members", a.createMember)
	mux.HandleFunc("POST "+basePath+"/members/{id}/role", a.setMemberRole)

	mux.HandleFunc("GET "+basePath+"/keys", a.keysPage)
	mux.HandleFunc("POST "+basePath+"/keys", a.createKey)
	mux.HandleFunc("DELETE "+basePath+"/keys/{id}", a.revokeKey)

	mux.HandleFunc("GET "+basePath+"/settings", a.settingsPage)
	mux.HandleFunc("POST "+basePath+"/settings", a.saveSettings)

	// 普通 302 在 HTMX 请求里会把登录页塞进局部区域，这里演示 HX-Redirect。
	mux.HandleFunc("POST "+basePath+"/logout", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("HX-Redirect", "/")
		w.WriteHeader(http.StatusOK)
	})
}

func logRequests(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s (%s)", r.Method, r.URL.RequestURI(), time.Since(start).Round(time.Millisecond))
	})
}

// ─── View models ────────────────────────────────────────────────────────────

type Base struct {
	Title      string
	Subtitle   string
	Active     string
	AlertCount int
	Workspace  string
	Now        string
}

type StatCard struct {
	Label    string
	Value    string
	Delta    string
	Positive bool
	Up       bool
	Foot     string
	Spark    string
	Accent   string
}

type ModelShare struct {
	Name     string
	Provider string
	Share    int
	Class    string
}

type TrendPoint struct {
	Label string
	Value int
}

type ChartGrid struct {
	Y     float64
	Label string
}

type ChartLabel struct {
	X    float64
	Text string
}

type ChartDot struct {
	X float64
	Y float64
}

type Chart struct {
	Width    int
	Height   int
	Left     float64
	Right    float64
	Top      float64
	Bottom   float64
	LinePath string
	AreaPath string
	Grid     []ChartGrid
	XLabels  []ChartLabel
	Dots     []ChartDot
	Last     ChartDot
}

type DashboardData struct {
	Base
	Stats      []StatCard
	Chart      Chart
	Models     []ModelShare
	Recent     []LogEntry
	RangeLabel string
	TotalReqs  string
}

type PageLink struct {
	Label  string
	URL    string
	Active bool
}

type LogsData struct {
	Base
	Logs      []LogEntry
	Total     int
	Page      int
	Pages     int
	HasPrev   bool
	HasNext   bool
	PrevURL   string
	NextURL   string
	PageLinks []PageLink
	Q         string
	Provider  string
	Status    string
	Type      string
	Filtered  bool
}

type ProjectsData struct {
	Base
	Projects      []Project
	Q             string
	Status        string
	Total         int
	ActiveCount   int
	PausedCount   int
	ArchivedCount int
}

type MembersData struct {
	Base
	Members []Member
	Q       string
	Total   int
}

type KeysData struct {
	Base
	Keys        []APIKey
	ActiveCount int
	OOB         bool
}

type AlertsData struct {
	Alerts []Alert
	Open   int
}

type SettingsData struct {
	Base
	Settings Settings
	Saved    bool
}

func (a *App) base(active, title, subtitle string) Base {
	return Base{
		Title:      title,
		Subtitle:   subtitle,
		Active:     active,
		AlertCount: a.store.UnackedAlerts(),
		Workspace:  a.store.WorkspaceName(),
		Now:        time.Now().Format("01-02 15:04"),
	}
}

// ─── Handlers ───────────────────────────────────────────────────────────────

func (a *App) dashboard(w http.ResponseWriter, r *http.Request) {
	trend := []TrendPoint{
		{"10-08", 51400}, {"10-09", 58300}, {"10-10", 49800}, {"10-11", 45100},
		{"10-12", 62700}, {"10-13", 71400}, {"10-14", 69300}, {"10-15", 76800},
		{"10-16", 84200}, {"10-17", 91800}, {"10-18", 88400}, {"10-19", 93600},
		{"10-20", 97100}, {"10-21", 89240},
	}

	data := DashboardData{
		Base: a.base("dashboard", "概览", "过去 14 天的网关运行状况与用量概览"),
		Stats: []StatCard{
			{Label: "总请求数", Value: "1,284,392", Delta: "+12.4%", Positive: true, Up: true, Foot: "较上周期 1,142,806", Spark: sparkPath([]int{38, 42, 40, 48, 52, 49, 58, 62, 60, 68, 74, 78}), Accent: "accent-teal"},
			{Label: "平均延迟", Value: "214 ms", Delta: "-8.1%", Positive: true, Up: false, Foot: "P50 168 ms · P99 1,842 ms", Spark: sparkPath([]int{64, 62, 58, 60, 54, 52, 50, 48, 46, 44, 42, 41}), Accent: "accent-blue"},
			{Label: "成功率", Value: "99.94%", Delta: "+0.02%", Positive: true, Up: true, Foot: "失败 771 次 · 重试 1,204 次", Spark: sparkPath([]int{58, 60, 57, 61, 63, 62, 66, 68, 67, 70, 72, 73}), Accent: "accent-green"},
			{Label: "Token 消耗", Value: "1.92 B", Delta: "+6.8%", Positive: false, Up: true, Foot: "输入 1.24 B · 输出 0.68 B", Spark: sparkPath([]int{30, 36, 34, 40, 38, 46, 44, 50, 55, 52, 58, 61}), Accent: "accent-amber"},
		},
		Chart: buildChart(trend),
		Models: []ModelShare{
			{"GPT-4o", "OpenAI", 38, "cat-1"},
			{"Claude Sonnet 4.5", "Anthropic", 27, "cat-2"},
			{"DeepSeek V3", "DeepSeek", 18, "cat-5"},
			{"Gemini 2.5 Pro", "Google", 11, "cat-3"},
			{"其他", "4 个提供商", 6, "cat-other"},
		},
		Recent:     a.store.FilterLogs("", "all", "all", "all")[:7],
		RangeLabel: "10-08 → 10-21",
		TotalReqs:  "1,284,392",
	}
	a.renderPage(w, "dashboard", data)
}

func (a *App) alertsPanel(w http.ResponseWriter, r *http.Request) {
	alerts := a.store.Alerts()
	open := 0
	for _, alert := range alerts {
		if !alert.Acked {
			open++
		}
	}
	a.renderFragment(w, "alerts_panel", AlertsData{Alerts: alerts, Open: open})
}

func (a *App) ackAlert(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if !a.store.AckAlert(id) {
		http.Error(w, "alert not found", http.StatusNotFound)
		return
	}
	alerts := a.store.Alerts()
	open := 0
	for _, alert := range alerts {
		if !alert.Acked {
			open++
		}
	}
	var buf bytes.Buffer
	_ = a.frags.ExecuteTemplate(&buf, "alerts_panel", AlertsData{Alerts: alerts, Open: open})
	if open > 0 {
		fmt.Fprintf(&buf, `<span id="alert-badge" class="nav-badge" hx-swap-oob="true">%d</span>`, open)
	} else {
		fmt.Fprintf(&buf, `<span id="alert-badge" class="nav-badge hidden" hx-swap-oob="true">0</span>`)
	}
	if open > 0 {
		fmt.Fprintf(&buf, `<span id="bell-dot" class="bell-dot" hx-swap-oob="true"></span>`)
	} else {
		fmt.Fprintf(&buf, `<span id="bell-dot" class="bell-dot" hx-swap-oob="true" hidden></span>`)
	}
	buf.WriteString(toastOOB("success", "告警已确认"))
	writeHTML(w, buf.String())
}

func (a *App) logsPage(w http.ResponseWriter, r *http.Request) {
	data := a.logsData(r, true)
	a.renderPage(w, "logs", data)
}

func (a *App) logsTable(w http.ResponseWriter, r *http.Request) {
	data := a.logsData(r, true)
	w.Header().Set("HX-Push-Url", logsURL(data.Q, data.Provider, data.Status, data.Type, data.Page))
	a.renderFragment(w, "logs_panel", data)
}

func (a *App) logsData(r *http.Request, paginate bool) LogsData {
	q := strings.TrimSpace(r.URL.Query().Get("q"))
	provider := r.URL.Query().Get("provider")
	status := r.URL.Query().Get("status")
	typ := r.URL.Query().Get("type")
	if provider == "" {
		provider = "all"
	}
	if status == "" {
		status = "all"
	}
	if typ == "" {
		typ = "all"
	}

	filtered := a.store.FilterLogs(q, provider, status, typ)
	page := 1
	if paginate {
		if n, err := strconv.Atoi(r.URL.Query().Get("page")); err == nil && n > 0 {
			page = n
		}
	}
	const perPage = 12
	pages := int(math.Ceil(float64(len(filtered)) / perPage))
	if pages == 0 {
		pages = 1
	}
	if page > pages {
		page = pages
	}
	start := (page - 1) * perPage
	end := start + perPage
	if start > len(filtered) {
		start = len(filtered)
	}
	if end > len(filtered) {
		end = len(filtered)
	}

	data := LogsData{
		Base:     a.base("logs", "请求日志", "逐条追踪每一次网关请求与服务商响应"),
		Logs:     filtered[start:end],
		Total:    len(filtered),
		Page:     page,
		Pages:    pages,
		HasPrev:  page > 1,
		HasNext:  page < pages,
		Q:        q,
		Provider: provider,
		Status:   status,
		Type:     typ,
		Filtered: q != "" || provider != "all" || status != "all" || typ != "all",
	}
	if data.HasPrev {
		data.PrevURL = logsTableURL(q, provider, status, typ, page-1)
	}
	if data.HasNext {
		data.NextURL = logsTableURL(q, provider, status, typ, page+1)
	}
	for p := 1; p <= pages; p++ {
		if pages > 7 && p > 2 && p < pages-1 && abs(p-page) > 1 {
			continue
		}
		data.PageLinks = append(data.PageLinks, PageLink{
			Label:  strconv.Itoa(p),
			URL:    logsTableURL(q, provider, status, typ, p),
			Active: p == page,
		})
	}
	return data
}

func (a *App) logDetail(w http.ResponseWriter, r *http.Request) {
	entry, ok := a.store.LogByID(r.PathValue("id"))
	if !ok {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	a.renderFragment(w, "log_detail", entry)
}

func (a *App) projectsPage(w http.ResponseWriter, r *http.Request) {
	data := a.projectsData(r)
	a.renderPage(w, "projects", data)
}

func (a *App) projectsTable(w http.ResponseWriter, r *http.Request) {
	data := a.projectsData(r)
	w.Header().Set("HX-Push-Url", projectsURL(data.Q, data.Status))
	a.renderFragment(w, "projects_panel", data)
}

func (a *App) projectsData(r *http.Request) ProjectsData {
	q := strings.TrimSpace(r.URL.Query().Get("q"))
	status := r.URL.Query().Get("status")
	if status == "" {
		status = "all"
	}
	projects := a.store.FilterProjects(q, status)
	data := ProjectsData{
		Base:     a.base("projects", "项目列表", "按工作负载隔离密钥、预算与限流策略"),
		Projects: projects,
		Q:        q,
		Status:   status,
		Total:    len(projects),
	}
	for _, project := range a.store.FilterProjects("", "all") {
		switch project.Status {
		case "active":
			data.ActiveCount++
		case "paused":
			data.PausedCount++
		case "archived":
			data.ArchivedCount++
		}
	}
	return data
}

func (a *App) createProject(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		http.Error(w, "bad form", http.StatusBadRequest)
		return
	}
	name := strings.TrimSpace(r.FormValue("name"))
	if name == "" {
		// 默认目标被改成错误区域；HTMX 默认不会替换 4xx 响应，所以返回 200。
		w.Header().Set("HX-Retarget", "#project-form-error")
		w.Header().Set("HX-Reswap", "innerHTML")
		writeHTML(w, `<p class="field-error">项目名称不能为空</p>`)
		return
	}
	owner := strings.TrimSpace(r.FormValue("owner"))
	if owner == "" {
		owner = "陈晓"
	}
	status := r.FormValue("status")
	if status == "" {
		status = "active"
	}
	a.store.AddProject(name, owner, status)

	var buf bytes.Buffer
	_ = a.frags.ExecuteTemplate(&buf, "projects_panel", a.projectsData(r))
	buf.WriteString(`<div id="toasts" hx-swap-oob="beforeend">` + toastHTML("success", "项目「"+template.HTMLEscapeString(name)+"」已创建") + `</div>`)
	w.Header().Set("HX-Trigger", "close-project-modal")
	writeHTML(w, buf.String())
}

func (a *App) setProjectStatus(w http.ResponseWriter, r *http.Request) {
	_ = r.ParseForm()
	status := r.FormValue("status")
	if status != "active" && status != "paused" && status != "archived" {
		status = "active"
	}
	a.store.SetProjectStatus(r.PathValue("id"), status)

	var buf bytes.Buffer
	_ = a.frags.ExecuteTemplate(&buf, "projects_panel", a.projectsData(r))
	labels := map[string]string{"active": "已启用", "paused": "已暂停", "archived": "已归档"}
	buf.WriteString(`<div id="toasts" hx-swap-oob="beforeend">` + toastHTML("success", "项目状态更新为"+labels[status]) + `</div>`)
	writeHTML(w, buf.String())
}

func (a *App) membersPage(w http.ResponseWriter, r *http.Request) {
	data := a.membersData(r)
	a.renderPage(w, "members", data)
}

func (a *App) membersTable(w http.ResponseWriter, r *http.Request) {
	data := a.membersData(r)
	w.Header().Set("HX-Push-Url", membersURL(data.Q))
	a.renderFragment(w, "members_panel", data)
}

func (a *App) membersData(r *http.Request) MembersData {
	q := strings.TrimSpace(r.URL.Query().Get("q"))
	members := a.store.FilterMembers(q)
	return MembersData{
		Base:    a.base("members", "团队成员", "管理工作区成员、角色与双因素认证状态"),
		Members: members,
		Q:       q,
		Total:   len(members),
	}
}

func (a *App) createMember(w http.ResponseWriter, r *http.Request) {
	_ = r.ParseForm()
	name := strings.TrimSpace(r.FormValue("name"))
	email := strings.TrimSpace(r.FormValue("email"))
	role := r.FormValue("role")
	if name == "" || email == "" {
		w.Header().Set("HX-Retarget", "#member-form-error")
		w.Header().Set("HX-Reswap", "innerHTML")
		writeHTML(w, `<p class="field-error">姓名与邮箱均为必填项</p>`)
		return
	}
	if role == "" {
		role = "viewer"
	}
	a.store.AddMember(name, email, role)

	var buf bytes.Buffer
	_ = a.frags.ExecuteTemplate(&buf, "members_panel", a.membersData(r))
	buf.WriteString(`<div id="toasts" hx-swap-oob="beforeend">` + toastHTML("success", "邀请已发送至 "+template.HTMLEscapeString(email)) + `</div>`)
	w.Header().Set("HX-Trigger", "close-member-modal")
	writeHTML(w, buf.String())
}

func (a *App) setMemberRole(w http.ResponseWriter, r *http.Request) {
	_ = r.ParseForm()
	role := r.FormValue("role")
	valid := map[string]bool{"owner": true, "admin": true, "developer": true, "viewer": true}
	if !valid[role] {
		http.Error(w, "invalid role", http.StatusBadRequest)
		return
	}
	member, ok := a.store.SetMemberRole(r.PathValue("id"), role)
	if !ok {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	var buf bytes.Buffer
	_ = a.frags.ExecuteTemplate(&buf, "member_row", member)
	buf.WriteString(`<div id="toasts" hx-swap-oob="beforeend">` + toastHTML("success", member.Name+" 的角色已更新为 "+roleLabel(role)) + `</div>`)
	writeHTML(w, buf.String())
}

func (a *App) keysPage(w http.ResponseWriter, r *http.Request) {
	a.renderPage(w, "keys", a.keysData(false))
}

func (a *App) keysData(oob bool) KeysData {
	keys := a.store.AllKeys()
	active := 0
	for _, key := range keys {
		if !key.Revoked {
			active++
		}
	}
	return KeysData{
		Base:        a.base("keys", "API 密钥", "密钥只在创建时明文展示一次，之后仅保留前缀"),
		Keys:        keys,
		ActiveCount: active,
		OOB:         oob,
	}
}

func (a *App) createKey(w http.ResponseWriter, r *http.Request) {
	_ = r.ParseForm()
	name := strings.TrimSpace(r.FormValue("name"))
	if name == "" {
		w.Header().Set("HX-Retarget", "#key-form-error")
		w.Header().Set("HX-Reswap", "innerHTML")
		writeHTML(w, `<p class="field-error">请为密钥填写一个名称</p>`)
		return
	}
	scopes := r.Form["scopes"]
	if len(scopes) == 0 {
		scopes = []string{"chat"}
	}
	_, secret := a.store.AddKey(name, scopes)

	var buf bytes.Buffer
	fmt.Fprintf(&buf, `<div class="secret-banner" x-data="{copied:false}">
  <div class="secret-head">%s<span>新密钥「%s」已生成，请立即复制。关闭后无法再次查看。</span></div>
  <div class="secret-row">
    <code id="new-secret">%s</code>
    <button type="button" class="btn btn-outline btn-xs" @click="navigator.clipboard.writeText('%s'); copied=true; setTimeout(()=>copied=false,1600)" x-text="copied ? '已复制' : '复制'">复制</button>
  </div>
</div>`, icon("key"), template.HTMLEscapeString(name), template.HTMLEscapeString(secret), template.HTMLEscapeString(secret))
	var row bytes.Buffer
	_ = a.frags.ExecuteTemplate(&row, "keys_panel", a.keysData(true))
	buf.WriteString(row.String())
	buf.WriteString(toastOOB("success", "API 密钥已创建"))
	w.Header().Set("HX-Trigger", "close-key-modal")
	writeHTML(w, buf.String())
}

func (a *App) revokeKey(w http.ResponseWriter, r *http.Request) {
	key, ok := a.store.RevokeKey(r.PathValue("id"))
	if !ok {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	var buf bytes.Buffer
	_ = a.frags.ExecuteTemplate(&buf, "key_row", key)
	keysData := a.keysData(false)
	fmt.Fprintf(&buf, `<span id="key-active-count" class="count" hx-swap-oob="true">%d 个有效</span>`, keysData.ActiveCount)
	buf.WriteString(toastOOB("warning", "密钥「"+template.HTMLEscapeString(key.Name)+"」已吊销"))
	writeHTML(w, buf.String())
}

func (a *App) settingsPage(w http.ResponseWriter, r *http.Request) {
	a.renderPage(w, "settings", SettingsData{
		Base:     a.base("settings", "设置", "工作区、安全策略与通知偏好"),
		Settings: a.store.Settings(),
	})
}

func (a *App) saveSettings(w http.ResponseWriter, r *http.Request) {
	_ = r.ParseForm()
	next := Settings{
		WorkspaceName: strings.TrimSpace(r.FormValue("workspace_name")),
		Timezone:      r.FormValue("timezone"),
		Retention:     r.FormValue("retention"),
		Region:        r.FormValue("region"),
		MFARequired:   r.FormValue("mfa_required") == "on",
		IPAllowlist:   strings.TrimSpace(r.FormValue("ip_allowlist")),
		NotifyEmail:   r.FormValue("notify_email") == "on",
		NotifySlack:   r.FormValue("notify_slack") == "on",
		DailyDigest:   r.FormValue("daily_digest") == "on",
	}
	if next.WorkspaceName == "" {
		next.WorkspaceName = "Nova 生产环境"
	}
	a.store.UpdateSettings(next)

	var buf bytes.Buffer
	_ = a.frags.ExecuteTemplate(&buf, "settings_form", SettingsData{
		Base:     a.base("settings", "设置", ""),
		Settings: next,
		Saved:    true,
	})
	buf.WriteString(`<div id="toasts" hx-swap-oob="beforeend">` + toastHTML("success", "设置已保存") + `</div>`)
	writeHTML(w, buf.String())
}

// ─── Rendering ──────────────────────────────────────────────────────────────

func (a *App) renderPage(w http.ResponseWriter, name string, data any) {
	tmpl, ok := a.pages[name]
	if !ok {
		http.NotFound(w, nil)
		return
	}
	var buf bytes.Buffer
	if err := tmpl.ExecuteTemplate(&buf, "layout", data); err != nil {
		log.Printf("render %s: %v", name, err)
		http.Error(w, "template error", http.StatusInternalServerError)
		return
	}
	writeHTML(w, buf.String())
}

func (a *App) renderFragment(w http.ResponseWriter, name string, data any) {
	var buf bytes.Buffer
	if err := a.frags.ExecuteTemplate(&buf, name, data); err != nil {
		log.Printf("render fragment %s: %v", name, err)
		http.Error(w, "template error", http.StatusInternalServerError)
		return
	}
	writeHTML(w, buf.String())
}

func writeHTML(w http.ResponseWriter, html string) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, _ = w.Write([]byte(html))
}

// ─── Template helpers ───────────────────────────────────────────────────────

func funcMap() template.FuncMap {
	return template.FuncMap{
		"icon":        icon,
		"num":         formatInt,
		"money":       formatMoney,
		"cost":        formatCost,
		"pct":         func(used, budget float64) int { return int(math.Round(used / budget * 100)) },
		"spark":       sparkPath,
		"statusLabel": statusLabel,
		"statusClass": statusClass,
		"typeLabel":   typeLabel,
		"roleLabel":   roleLabel,
		"severity":    severityLabel,
		"selected": func(a, b string) string {
			if a == b {
				return "selected"
			}
			return ""
		},
		"checked": func(ok bool) string {
			if ok {
				return "checked"
			}
			return ""
		},
		"add":  func(a, b int) int { return a + b },
		"sub":  func(a, b int) int { return a - b },
		"join": strings.Join,
		"dict": func(values ...any) map[string]any {
			m := make(map[string]any, len(values)/2)
			for i := 0; i+1 < len(values); i += 2 {
				m[values[i].(string)] = values[i+1]
			}
			return m
		},
	}
}

func toastOOB(tone, message string) string {
	return `<div id="toasts" hx-swap-oob="beforeend">` + toastHTML(tone, message) + `</div>`
}

func toastHTML(tone, message string) string {
	iconName := "check"
	if tone == "warning" {
		iconName = "alert-triangle"
	} else if tone == "error" {
		iconName = "x"
	}
	return `<div class="toast toast-` + tone + `" x-data x-init="setTimeout(() => $el.remove(), 4200)">
  <span class="toast-icon">` + string(icon(iconName)) + `</span>
  <span>` + template.HTMLEscapeString(message) + `</span>
</div>`
}

func icon(name string) template.HTML {
	return template.HTML(`<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-` + name + `"/></svg>`)
}

func formatInt(n int) string {
	s := strconv.Itoa(n)
	if len(s) <= 3 {
		return s
	}
	var b strings.Builder
	start := len(s) % 3
	if start > 0 {
		b.WriteString(s[:start])
		if len(s) > start {
			b.WriteByte(',')
		}
	}
	for i := start; i < len(s); i += 3 {
		b.WriteString(s[i : i+3])
		if i+3 < len(s) {
			b.WriteByte(',')
		}
	}
	return b.String()
}

func formatCost(f float64) string {
	if f <= 0 {
		return "—"
	}
	if f < 0.01 {
		return fmt.Sprintf("$%.4f", f)
	}
	return formatMoney(f)
}

func formatMoney(f float64) string {
	cents := int(math.Round(f * 100))
	whole := cents / 100
	frac := cents % 100
	return "$" + formatInt(whole) + "." + fmt.Sprintf("%02d", frac)
}

func statusLabel(s string) string {
	switch s {
	case "success":
		return "成功"
	case "error":
		return "失败"
	case "retry":
		return "重试"
	}
	return s
}

func statusClass(s string) string {
	switch s {
	case "success":
		return "pill-success"
	case "error":
		return "pill-error"
	case "retry":
		return "pill-warning"
	case "active":
		return "pill-success"
	case "paused":
		return "pill-warning"
	case "archived":
		return "pill-neutral"
	}
	return "pill-neutral"
}

func typeLabel(s string) string {
	switch s {
	case "chat":
		return "对话"
	case "embedding":
		return "向量"
	case "completion":
		return "补全"
	case "image":
		return "图像"
	}
	return s
}

func roleLabel(s string) string {
	switch s {
	case "owner":
		return "所有者"
	case "admin":
		return "管理员"
	case "developer":
		return "开发者"
	case "viewer":
		return "只读"
	}
	return s
}

func severityLabel(s string) string {
	switch s {
	case "critical":
		return "严重"
	case "warning":
		return "警告"
	case "info":
		return "提示"
	}
	return s
}

func sparkPath(vals []int) string {
	if len(vals) == 0 {
		return ""
	}
	min, max := vals[0], vals[0]
	for _, v := range vals {
		if v < min {
			min = v
		}
		if v > max {
			max = v
		}
	}
	if max == min {
		max = min + 1
	}
	const w, h, pad = 96.0, 28.0, 2.0
	var b strings.Builder
	for i, v := range vals {
		x := pad + (w-2*pad)*float64(i)/float64(len(vals)-1)
		y := h - pad - (h-2*pad)*float64(v-min)/float64(max-min)
		if i == 0 {
			fmt.Fprintf(&b, "M%.1f %.1f", x, y)
		} else {
			fmt.Fprintf(&b, " L%.1f %.1f", x, y)
		}
	}
	return b.String()
}

func buildChart(points []TrendPoint) Chart {
	chart := Chart{Width: 720, Height: 200, Left: 48, Right: 704, Top: 14, Bottom: 172}
	if len(points) == 0 {
		return chart
	}
	max := 0
	for _, point := range points {
		if point.Value > max {
			max = point.Value
		}
	}
	niceMax := float64((max/20000)+1) * 20000
	plotH := chart.Bottom - chart.Top
	plotW := chart.Right - chart.Left

	var line strings.Builder
	for i, point := range points {
		x := chart.Left + plotW*float64(i)/float64(len(points)-1)
		y := chart.Bottom - plotH*float64(point.Value)/niceMax
		if i == 0 {
			fmt.Fprintf(&line, "M%.1f %.1f", x, y)
		} else {
			fmt.Fprintf(&line, " L%.1f %.1f", x, y)
		}
		chart.Dots = append(chart.Dots, ChartDot{X: x, Y: y})
		if i%2 == 0 || i == len(points)-1 {
			chart.XLabels = append(chart.XLabels, ChartLabel{X: x, Text: point.Label})
		}
		if i == len(points)-1 {
			chart.Last = ChartDot{X: x, Y: y}
		}
	}
	chart.LinePath = line.String()
	chart.AreaPath = chart.LinePath + fmt.Sprintf(" L%.1f %.1f L%.1f %.1f Z", chart.Right, chart.Bottom, chart.Left, chart.Bottom)

	for i := 0; i <= 4; i++ {
		y := chart.Bottom - plotH*float64(i)/4
		value := niceMax * float64(i) / 4
		label := fmt.Sprintf("%.0fk", value/1000)
		if value == 0 {
			label = "0"
		}
		chart.Grid = append(chart.Grid, ChartGrid{Y: y, Label: label})
	}
	return chart
}

// ─── URL builders ───────────────────────────────────────────────────────────

func logsURL(q, provider, status, typ string, page int) string {
	v := url.Values{}
	if q != "" {
		v.Set("q", q)
	}
	if provider != "" && provider != "all" {
		v.Set("provider", provider)
	}
	if status != "" && status != "all" {
		v.Set("status", status)
	}
	if typ != "" && typ != "all" {
		v.Set("type", typ)
	}
	if page > 1 {
		v.Set("page", strconv.Itoa(page))
	}
	if enc := v.Encode(); enc != "" {
		return basePath + "/logs?" + enc
	}
	return basePath + "/logs"
}

func logsTableURL(q, provider, status, typ string, page int) string {
	return strings.Replace(logsURL(q, provider, status, typ, page), basePath+"/logs", basePath+"/logs/table", 1)
}

func projectsURL(q, status string) string {
	v := url.Values{}
	if q != "" {
		v.Set("q", q)
	}
	if status != "" && status != "all" {
		v.Set("status", status)
	}
	if enc := v.Encode(); enc != "" {
		return basePath + "/projects?" + enc
	}
	return basePath + "/projects"
}

func membersURL(q string) string {
	if q != "" {
		return basePath + "/members?q=" + url.QueryEscape(q)
	}
	return basePath + "/members"
}

func abs(n int) int {
	if n < 0 {
		return -n
	}
	return n
}
