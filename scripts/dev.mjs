import { spawn } from "node:child_process";
import process from "node:process";

/**
 * 同时启动 Vite（React 两套风格）与 Go + HTMX 服务（第三套风格）。
 * 单独启动：npm run dev:web / npm run dev:htmx
 */

const children = [];
let shuttingDown = false;

const colors = {
  web: "\u001b[36m", // cyan
  htmx: "\u001b[32m", // green
  reset: "\u001b[0m",
};

function run(name, command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    stdio: ["inherit", "pipe", "pipe"],
    env: process.env,
  });
  children.push(child);

  const prefix = `${colors[name] ?? ""}[${name}]${colors.reset} `;
  const pipe = (stream, target) => {
    let buffer = "";
    stream.setEncoding("utf8");
    stream.on("data", (chunk) => {
      buffer += chunk;
      let index;
      while ((index = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, index).replace(/\r$/, "");
        buffer = buffer.slice(index + 1);
        if (line.length > 0) target.write(prefix + line + "\n");
      }
    });
    stream.on("end", () => {
      if (buffer.length > 0) target.write(prefix + buffer + "\n");
    });
  };

  pipe(child.stdout, process.stdout);
  pipe(child.stderr, process.stderr);

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    if (signal) {
      console.error(`${prefix}exited with signal ${signal}`);
    } else if (code !== 0) {
      console.error(`${prefix}exited with code ${code}`);
    }
    // Go 服务不可用时保留 Vite，前两套 React 风格仍然可用。
    if (name === "htmx") {
      console.error(`${prefix}/htmx 演示已停止；其余风格仍在 http://localhost:3000/ 运行。`);
      return;
    }
    shutdown(code ?? 1);
  });

  return child;
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  setTimeout(() => process.exit(code), 150);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

run("web", "npx", ["vite"], process.cwd());
run("htmx", "go", ["run", "."], `${process.cwd()}/htmx`);
