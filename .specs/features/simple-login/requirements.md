# simple-login Requirements

## What We Need
实现一个简单的登录与注册：用户名或邮箱 + 密码；无第三方、无验证码、无需邮件确认；登录成功跳转仪表盘。

## Input & Output
Input: 登录{ identifier, password, remember? }；注册{ username, email?, password, confirm_password }
Output: 登录成功{ redirect: "/dashboard" }；注册成功{ redirect: "/dashboard" }；失败{ error }

## Success Criteria
- [ ] 可登录并跳转
- [ ] 可注册并跳转

## Anchors
- [@req.login.redirect] 登录/注册成功后跳转
