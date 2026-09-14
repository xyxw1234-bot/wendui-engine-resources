# 服务器恢复说明

## 1. 静态资源

将仓库中的网页资源同步到：

`/var/www/projects/wendui-engine/`

至少包括：`index.html`、`assets/`、`login/`、`me/`、`production/`、`resources/`、`hermes/`。

## 2. 工具应用后端

将 `wendui_tool_api.py` 部署为：

`/opt/apps/wendui-engine-tool-api/app.py`

服务应只监听 `127.0.0.1:8147`，由 Nginx 通过 `/wendui-engine-api/` 转发。生产凭证通过服务器环境变量注入，不写入源码。

## 3. Nginx

保持网页入口 `/wendui-engine/` 和工具接口 `/wendui-engine-api/`。配置后先运行 Nginx 语法检查，再平滑加载。

## 4. 验收

1. 公网入口返回正确页面，而不是通用 200、登录占位页或错误页。
2. 登录、教师端、学生端分别验证。
3. 产品成果中心的个人／组织／官方范围正确。
4. 官方课程资源目录可加载、可搜索、可进入详情。
5. 工具应用完成真实生成、保存、重新打开和导出。
6. 浏览器控制台无阻断性错误。
7. 用户数据库和服务器凭证由独立备份恢复，不从 GitHub 获取。
