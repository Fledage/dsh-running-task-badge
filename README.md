# dsh-running-task-badge

给 [DeepSeek Harness](https://github.com/deepseek-ai) Web UI 用的插件：**在浏览器标签页图标上显示正在运行的任务数量**。

## 功能

- **标签页角标** —— 只要有会话在运行，标签页图标就会变成「鲸鱼 + 数字角标」，自绘 SVG 通过 `data:` URI 改写页面上亮/暗两个 `link[rel="icon"]`，因此**所有浏览器**都可见，不依赖 PWA 安装。超过 99 显示 `99+`。
- **应用角标** —— 额外镜像到 `navigator.setAppBadge()`，支持的浏览器（已安装为 PWA 时）会在任务栏/程序坞上也显示数字。

## 统计口径

**每个正在运行的会话算一个任务**，子代理（subagent）会话不计入。数据不靠轮询 —— 直接复用 `shell.overlay` 座位标准属性里的 `useSessions` 选择器钩子，它本身已订阅会话元数据列表与实时的 `api-session/status` 流。

## 安装

```
plugin_manager { action: "install_bundle", target: "github:Fledage/dsh-running-task-badge" }
```

安装会写入当前 profile 的 `package.json` 与 `cordis.patch.yml`，对该 profile 下**所有会话**生效，并且**重启后保留**。装完刷新页面即可。

## 使用说明

- **多标签页**：每个标签页的角标各自独立显示。
- **纯浏览器行为**：本插件不渲染任何页面内容（座位返回 `null`），也不写入 DOM 的其他部分，只在计数大于 0 时临时改写页面自带的 favicon 链接，归零或卸载时**完整还原**。

## 兼容性

- 角标需要浏览器支持 SVG favicon（现代浏览器均支持）；`setAppBadge` 是**可选增强**，缺失时静默降级，角标仍然工作。
- `setAppBadge` 需要安全上下文（`https://` 或 `http://127.0.0.1`）。

## 文件结构

| 文件 | 作用 |
|---|---|
| `client.js` | 全部逻辑：角标绘制与还原 |
| `index.js` | Host 半侧，空实现（无 Host 侧行为） |
| `package.json` | Bundle 清单 + Client 清单 |
| `cordis.patch.yml` | 插入 `running-task-badge` 行 |
| `icon.svg` | 插件管理器的显示图标 |
| `locale/{zh,en}.json` | 插件管理器中的中英文标题与描述 |

## 说明

角标是自绘图形，使用**固定颜色**而非主题令牌 —— favicon 渲染在页面之外，拿不到 `--dsw-alias-*` 令牌，这是刻意的取舍。

鲸鱼轮廓取自 Harness 自带的 `favicon.svg`，逐字节一致。

> v1.0 曾内置「任务完成系统通知」，v1.1 起移除，只保留角标（通知交给 dsh-pet 等专门插件）。

## English

A DeepSeek Harness Web UI plugin that shows **the number of running tasks as a badge on the browser tab icon**.

One running session is one task; subagent sessions are not counted. The count comes from the `useSessions` selector hook on the `shell.overlay` seat — no polling. The tab badge retargets the page's own light/dark `link[rel="icon"]` hrefs to a generated `data:` SVG, so it works in every browser; the count is also mirrored to `navigator.setAppBadge()` where available. The plugin paints nothing and restores the original favicons when the count reaches zero or the seat is disposed.

## License

MIT
