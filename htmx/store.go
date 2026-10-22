package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"sort"
	"strings"
	"sync"
	"time"
)

// Store is the demo "database". All UI state lives here, on the server:
// the browser never holds a copy, it only asks for HTML fragments.
type Store struct {
	mu       sync.RWMutex
	projects []Project
	members  []Member
	keys     []APIKey
	logs     []LogEntry
	alerts   []Alert
	settings Settings
}

type Project struct {
	ID       string
	Name     string
	Key      string
	Owner    string
	Status   string // active | paused | archived
	Requests int
	Budget   float64
	Used     float64
	Updated  string
}

type Member struct {
	ID         string
	Name       string
	Email      string
	Role       string // owner | admin | developer | viewer
	TwoFA      bool
	LastActive string
	Initials   string
}

type APIKey struct {
	ID       string
	Name     string
	Prefix   string
	Scopes   []string
	Created  string
	LastUsed string
	Revoked  bool
}

type LogEntry struct {
	ID       string
	Date     string
	Time     string
	Model    string
	Provider string
	Status   string // success | error | retry
	Type     string // chat | embedding | completion | image
	Project  string
	Latency  int
	Tokens   int
	Cost     float64
	Request  string
	Response string
}

type Alert struct {
	ID       string
	Severity string // critical | warning | info
	Title    string
	Detail   string
	Time     string
	Acked    bool
}

type Settings struct {
	WorkspaceName string
	Timezone      string
	Retention     string
	Region        string
	MFARequired   bool
	IPAllowlist   string
	NotifyEmail   bool
	NotifySlack   bool
	DailyDigest   bool
}

func NewStore() *Store {
	s := &Store{
		settings: Settings{
			WorkspaceName: "Nova 生产环境",
			Timezone:      "Asia/Shanghai (UTC+8)",
			Retention:     "30 天",
			Region:        "ap-shanghai-1",
			MFARequired:   true,
			IPAllowlist:   "",
			NotifyEmail:   true,
			NotifySlack:   true,
			DailyDigest:   false,
		},
	}

	s.projects = []Project{
		{ID: "prj_01", Name: "智能客服中台", Key: "support-prod", Owner: "陈晓", Status: "active", Requests: 482310, Budget: 12000, Used: 9140, Updated: "10-21 14:28"},
		{ID: "prj_02", Name: "代码助手 Copilot", Key: "copilot-prod", Owner: "李明", Status: "active", Requests: 318204, Budget: 8000, Used: 6120, Updated: "10-21 14:22"},
		{ID: "prj_03", Name: "内部知识库 RAG", Key: "kb-rag", Owner: "张弛", Status: "active", Requests: 127840, Budget: 5000, Used: 1830, Updated: "10-21 13:58"},
		{ID: "prj_04", Name: "营销文案生成", Key: "marketing-gen", Owner: "王蕾", Status: "paused", Requests: 68210, Budget: 3000, Used: 2410, Updated: "10-20 19:12"},
		{ID: "prj_05", Name: "风控摘要", Key: "risk-summary", Owner: "赵敏", Status: "active", Requests: 96432, Budget: 4000, Used: 3675, Updated: "10-21 12:40"},
		{ID: "prj_06", Name: "多语言翻译", Key: "i18n-translate", Owner: "周然", Status: "archived", Requests: 41208, Budget: 2000, Used: 1998, Updated: "09-30 10:02"},
	}

	s.members = []Member{
		{ID: "usr_01", Name: "陈晓", Email: "admin@nova.dev", Role: "owner", TwoFA: true, LastActive: "2 分钟前", Initials: "陈"},
		{ID: "usr_02", Name: "李明", Email: "liming@nova.dev", Role: "developer", TwoFA: true, LastActive: "18 分钟前", Initials: "李"},
		{ID: "usr_03", Name: "王蕾", Email: "wanglei@nova.dev", Role: "viewer", TwoFA: false, LastActive: "1 小时前", Initials: "王"},
		{ID: "usr_04", Name: "张弛", Email: "zhangchi@nova.dev", Role: "developer", TwoFA: true, LastActive: "3 小时前", Initials: "张"},
		{ID: "usr_05", Name: "赵敏", Email: "zhaomin@nova.dev", Role: "admin", TwoFA: true, LastActive: "昨天 22:14", Initials: "赵"},
		{ID: "usr_06", Name: "周然", Email: "zhouran@nova.dev", Role: "viewer", TwoFA: false, LastActive: "10-18 16:30", Initials: "周"},
	}

	s.keys = []APIKey{
		{ID: "key_01", Name: "prod-main", Prefix: "nv_live_8f2c…a91d", Scopes: []string{"chat", "embeddings"}, Created: "2026-08-14", LastUsed: "2 分钟前"},
		{ID: "key_02", Name: "staging", Prefix: "nv_test_41ba…7c02", Scopes: []string{"chat"}, Created: "2026-09-02", LastUsed: "3 小时前"},
		{ID: "key_03", Name: "ci-pipeline", Prefix: "nv_live_c73e…18ff", Scopes: []string{"embeddings", "admin"}, Created: "2026-06-21", LastUsed: "18 分钟前"},
		{ID: "key_04", Name: "analytics-readonly", Prefix: "nv_live_2d90…bb41", Scopes: []string{"read"}, Created: "2026-07-08", LastUsed: "昨天 21:05"},
	}

	s.logs = seedLogs()
	s.alerts = []Alert{
		{ID: "alt_01", Severity: "critical", Title: "OpenAI 错误率超过阈值", Detail: "过去 10 分钟错误率 6.8%，阈值 5%。已自动重试 142 次。", Time: "14:26"},
		{ID: "alt_02", Severity: "warning", Title: "智能客服中台预算即将用尽", Detail: "本月已用 $9,140 / $12,000（76%），按当前速率预计 6 天后超支。", Time: "13:52"},
		{ID: "alt_03", Severity: "warning", Title: "DeepSeek P99 延迟升高", Detail: "P99 延迟 2,840 ms，较 24 小时基线上升 64%。", Time: "12:18"},
		{ID: "alt_04", Severity: "info", Title: "API 密钥即将到期", Detail: "密钥 ci-pipeline 将在 14 天后到期，请轮换后更新 CI 变量。", Time: "10:04"},
	}

	return s
}

func seedLogs() []LogEntry {
	models := []struct {
		name     string
		provider string
		latency  int
		per1k    float64
	}{
		{"gpt-4o", "OpenAI", 241, 0.0050},
		{"claude-sonnet-4-5", "Anthropic", 182, 0.0030},
		{"deepseek-v3", "DeepSeek", 211, 0.0004},
		{"gemini-2.5-pro", "Google", 308, 0.0013},
		{"gpt-4o-mini", "OpenAI", 96, 0.0002},
		{"claude-haiku-4.5", "Anthropic", 88, 0.0008},
		{"qwen3-max", "Alibaba", 174, 0.0006},
		{"llama-4-maverick", "Meta", 198, 0.0003},
	}
	projects := []string{"智能客服中台", "代码助手 Copilot", "内部知识库 RAG", "风控摘要", "营销文案生成"}
	types := []string{"chat", "chat", "chat", "embedding", "completion", "chat", "image"}
	statuses := []string{"success", "success", "success", "success", "retry", "success", "success", "error"}

	base := time.Date(2026, 10, 21, 14, 32, 8, 0, time.Local)
	logs := make([]LogEntry, 0, 36)
	for i := 0; i < 36; i++ {
		m := models[i%len(models)]
		status := statuses[i%len(statuses)]
		tokens := 420 + (i*733)%5200
		latency := m.latency + (i*97)%410
		if status == "error" {
			latency = 0
			tokens = 0
		}
		if status == "retry" {
			latency += 1050
		}
		cost := float64(tokens) / 1000 * m.per1k
		if status == "error" {
			cost = 0
		}
		ts := base.Add(-time.Duration(i*17+i*i%11) * time.Second)
		id := fmt.Sprintf("req_%06x", 0xa4f2c1-i*97)
		project := projects[i%len(projects)]
		typ := types[i%len(types)]
		logs = append(logs, LogEntry{
			ID:       id,
			Date:     ts.Format("10-02"),
			Time:     ts.Format("15:04:05"),
			Model:    m.name,
			Provider: m.provider,
			Status:   status,
			Type:     typ,
			Project:  project,
			Latency:  latency,
			Tokens:   tokens,
			Cost:     cost,
			Request:  requestBody(m.name, typ, project),
			Response: responseBody(status, tokens, latency),
		})
	}
	return logs
}

func requestBody(model, typ, project string) string {
	switch typ {
	case "embedding":
		return fmt.Sprintf(`{
  "model": %q,
  "input": ["退款流程是什么？", "如何修改收货地址？"],
  "encoding_format": "float",
  "metadata": {"project": %q}
}`, model, project)
	case "image":
		return fmt.Sprintf(`{
  "model": %q,
  "prompt": "电商主图，白底，极简，浅灰色背景",
  "size": "1024x1024",
  "n": 1,
  "metadata": {"project": %q}
}`, model, project)
	case "completion":
		return fmt.Sprintf(`{
  "model": %q,
  "prompt": "Summarize the following support transcript:\n<transcript>...</transcript>",
  "max_tokens": 512,
  "temperature": 0.2,
  "metadata": {"project": %q}
}`, model, project)
	default:
		return fmt.Sprintf(`{
  "model": %q,
  "messages": [
    {"role": "system", "content": "你是 Nova 智能客服，回答要简洁。"},
    {"role": "user", "content": "我的订单显示已签收，但没有收到货，怎么办？"}
  ],
  "temperature": 0.7,
  "stream": true,
  "metadata": {"project": %q}
}`, model, project)
	}
}

func responseBody(status string, tokens, latency int) string {
	if status == "error" {
		return `{
  "error": {
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded, retry after 2s"
  },
  "provider_status": 429
}`
	}
	return fmt.Sprintf(`{
  "id": "chatcmpl-9f3a21c8",
  "object": "chat.completion",
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "请先确认物流签收人信息，然后在订单页提交「未收到货」申诉，我们会在 24 小时内为您处理。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": %d,
    "completion_tokens": %d,
    "total_tokens": %d
  },
  "latency_ms": %d
}`, tokens*2/5, tokens*3/5, tokens, latency)
}

// ─── Queries ────────────────────────────────────────────────────────────────

func containsFold(haystack, needle string) bool {
	return strings.Contains(strings.ToLower(haystack), strings.ToLower(needle))
}

func (s *Store) FilterLogs(q, provider, status, typ string) []LogEntry {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]LogEntry, 0, len(s.logs))
	for _, entry := range s.logs {
		if q != "" && !containsFold(entry.ID+" "+entry.Model+" "+entry.Provider+" "+entry.Project, q) {
			continue
		}
		if provider != "" && provider != "all" && entry.Provider != provider {
			continue
		}
		if status != "" && status != "all" && entry.Status != status {
			continue
		}
		if typ != "" && typ != "all" && entry.Type != typ {
			continue
		}
		out = append(out, entry)
	}
	return out
}

func (s *Store) LogByID(id string) (LogEntry, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, entry := range s.logs {
		if entry.ID == id {
			return entry, true
		}
	}
	return LogEntry{}, false
}

func (s *Store) FilterProjects(q, status string) []Project {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]Project, 0, len(s.projects))
	for _, project := range s.projects {
		if q != "" && !containsFold(project.Name+" "+project.Key+" "+project.Owner, q) {
			continue
		}
		if status != "" && status != "all" && project.Status != status {
			continue
		}
		out = append(out, project)
	}
	sort.SliceStable(out, func(i, j int) bool { return out[i].Updated > out[j].Updated })
	return out
}

func (s *Store) FilterMembers(q string) []Member {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]Member, 0, len(s.members))
	for _, member := range s.members {
		if q != "" && !containsFold(member.Name+" "+member.Email+" "+member.Role, q) {
			continue
		}
		out = append(out, member)
	}
	return out
}

func (s *Store) AllKeys() []APIKey {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return append([]APIKey(nil), s.keys...)
}

func (s *Store) Alerts() []Alert {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return append([]Alert(nil), s.alerts...)
}

func (s *Store) UnackedAlerts() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	count := 0
	for _, alert := range s.alerts {
		if !alert.Acked {
			count++
		}
	}
	return count
}

func (s *Store) Settings() Settings {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.settings
}

// ─── Mutations ──────────────────────────────────────────────────────────────

func (s *Store) AddProject(name, owner, status string) Project {
	s.mu.Lock()
	defer s.mu.Unlock()
	if status == "" {
		status = "active"
	}
	project := Project{
		ID:      fmt.Sprintf("prj_%02d", len(s.projects)+1),
		Name:    name,
		Key:     strings.ToLower(strings.ReplaceAll(strings.TrimSpace(name), " ", "-")),
		Owner:   owner,
		Status:  status,
		Updated: time.Now().Format("01-02 15:04"),
	}
	s.projects = append([]Project{project}, s.projects...)
	return project
}

func (s *Store) SetProjectStatus(id, status string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	for i := range s.projects {
		if s.projects[i].ID == id {
			s.projects[i].Status = status
			s.projects[i].Updated = time.Now().Format("01-02 15:04")
			return true
		}
	}
	return false
}

func (s *Store) AddMember(name, email, role string) Member {
	s.mu.Lock()
	defer s.mu.Unlock()
	initials := name
	if r := []rune(name); len(r) > 0 {
		initials = string(r[0])
	}
	member := Member{
		ID:         fmt.Sprintf("usr_%02d", len(s.members)+1),
		Name:       name,
		Email:      email,
		Role:       role,
		LastActive: "刚刚",
		Initials:   initials,
	}
	s.members = append(s.members, member)
	return member
}

func (s *Store) SetMemberRole(id, role string) (Member, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for i := range s.members {
		if s.members[i].ID == id {
			s.members[i].Role = role
			return s.members[i], true
		}
	}
	return Member{}, false
}

func (s *Store) MemberByID(id string) (Member, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, member := range s.members {
		if member.ID == id {
			return member, true
		}
	}
	return Member{}, false
}

func (s *Store) AddKey(name string, scopes []string) (APIKey, string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	raw := make([]byte, 18)
	_, _ = rand.Read(raw)
	secret := "nv_live_" + hex.EncodeToString(raw)
	key := APIKey{
		ID:       fmt.Sprintf("key_%02d", len(s.keys)+1),
		Name:     name,
		Prefix:   secret[:14] + "…" + secret[len(secret)-4:],
		Scopes:   scopes,
		Created:  time.Now().Format("2006-01-02"),
		LastUsed: "尚未使用",
	}
	s.keys = append([]APIKey{key}, s.keys...)
	return key, secret
}

func (s *Store) RevokeKey(id string) (APIKey, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for i := range s.keys {
		if s.keys[i].ID == id {
			s.keys[i].Revoked = true
			return s.keys[i], true
		}
	}
	return APIKey{}, false
}

func (s *Store) KeyByID(id string) (APIKey, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, key := range s.keys {
		if key.ID == id {
			return key, true
		}
	}
	return APIKey{}, false
}

func (s *Store) AckAlert(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	for i := range s.alerts {
		if s.alerts[i].ID == id {
			s.alerts[i].Acked = true
			return true
		}
	}
	return false
}

func (s *Store) UpdateSettings(next Settings) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.settings = next
}

func (s *Store) WorkspaceName() string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.settings.WorkspaceName
}
