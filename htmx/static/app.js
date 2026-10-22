(() => {
  const root = document.documentElement;

  // 主题切换：偏好保存在浏览器，页面其余状态仍然在服务端。
  document.addEventListener("click", (event) => {
    const themeToggle = event.target.closest("[data-theme-toggle]");
    if (themeToggle) {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      if (next === "dark") {
        root.dataset.theme = "dark";
      } else {
        delete root.dataset.theme;
      }
      try {
        localStorage.setItem("nova-theme", next);
      } catch (error) {
        /* 隐私模式下忽略 */
      }
    }

    if (event.target.closest("[data-sidebar-toggle]")) {
      document.body.classList.toggle("sidebar-open");
    }
    if (event.target.closest("[data-sidebar-close]") || event.target.closest(".nav-item")) {
      document.body.classList.remove("sidebar-open");
    }
  });

  // 顶部细进度条：任何 HTMX 请求进行时显示。
  document.body.addEventListener("htmx:beforeRequest", () => {
    document.body.classList.add("htmx-busy");
  });
  document.body.addEventListener("htmx:afterRequest", () => {
    document.body.classList.remove("htmx-busy");
  });

  // ⌘K / Ctrl+K 跳到日志搜索。
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (window.location.pathname.endsWith("/logs")) {
        document.querySelector('input[name="q"]')?.focus();
      } else {
        window.location.href = "/htmx/logs";
      }
    }
  });
})();
