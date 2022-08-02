# @symph/joy 后台管理平台

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
  - `role.service`添加角色
- 使用`initialize`方法

### 登录

- 表信息
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
