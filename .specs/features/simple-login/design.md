# simple-login Design

## API/Routes (前端场景)
- Contract: /login, /register, /dashboard（前端路由）
- Errors: 字段级错误 + 顶部通用提示

## Key Decisions
- Tech: React + Context（localStorage 演示存储）
- Data Flow: 表单→校验→本地用户集合→更新登录态→跳转

## Anchors
- [@des.guard.protected] /dashboard 受保护，未登录重定向 /login
