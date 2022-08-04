# @symph/joy 后台管理平台

## 前端路由配置

- `pages`下创建文件，自动生成约定式路由

## 数据库连接

- `typeorm`使用`mongodb`，创建`entity`实例，具体参见`typeorm`使用
- 配置：`joy.config.js`中配置`dbOptions`

    ```javascript
    dbOptions: {
      type: "mongodb",
      host: "localhost",
      port: 27017,
      database: "test",
      synchronize: true
    }
    ```

## 逻辑

### 初始化

- `db.service`连接数据库
- `initial.service`初始化超级用户以及角色
  - 超级用户配置：`joy.config.js`中配置`adminOptions`中的`email`和`password`
  - `user.service`添加用户（事务`transaction`进行添加）
    - `account.service`添加账户
    - `password.service`添加密码
      - `bcrypt`加密
  - `role.service`添加角色
- 使用`initialize`方法

### 登录

- 前端
  - `cookie`判断`token`是否存在（不使用`localStorage`，因为容易受到`xss`攻击，而`cookie`容易受到`csrf`攻击只需要在后端判断`refer`；`csrf`攻击：用户登陆`A`网站，然后点入诱导链接`B`网站，`B`网站可以有一个按钮或者图片，是请求`A`网站修改用户信息的接口，此时就会带到`A`网站的`cookie`信息。还可以再给请求里加一个参数`token`，两个`token`，一个表示用户的登录信息，另一个用于表示当前发送请求的域名）
  - 输入邮箱或验证码，失去焦点后，在不为空且输入内容变化的情况下请求该账户密码输入错误次数，账户不存在弹窗；错误次数大于等于`5`次需输入验证码
  - 请求验证码图片，点击后更新
  - 记住密码，作用在于`cookie`保持`7`天，不记住密码只保存`1h`
  - 发送输入数据，对密码使用`crypto`进行`md5`加密后发送给后端接口
  - 请求成功返回`token`存入`cookie`
- 后端
  - 根据用户或邮箱查询账户是否存在，并返回该用户输入密码错误次数
  - `captcha.service`使用`svgCaptcha`创建验证码对象，`5min`过期，将验证码图片以及`id`返回给前端
  - `login.service`验证用户、密码、验证码，正确后，

### 表信息

- 用户表：
  - `_id`
  - `username`
  - `email`
  - `emailActive`：邮箱是否激活
  - `roleId`
  - `changePasswordTimes`：更改密码次数
- 账户表：
  - `_id`
  - `userId`
  - `account`：`username`或`email`
  - `wrongTime`：输入密码错误次数
- 密码表：
  - `_id`
  - `userId`
  - `password`
- 角色表
  - `_id`
  - `roleId`
  - `roleName`
- 验证码表
  - `_id`
  - `captcha`
  - `captchaId`
  - `createdDate`
