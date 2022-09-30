module.exports = {
  emailOptions: {
    host: "smtp.163.com",
    secure: true,
    auth: {
      user: "symph_joy@163.com",
      pass: "LLJVFVIPOVJOVLIH"
    }
  },
  mailTitle: "@sympy/joy-admin注册用户激活码",
  dbOptions: {
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "test",
    synchronize: true
  },
  secret: "Symph-joy",
  adminOptions: {
    email: "admin123@123.com",
    password: "123456"
  },
  domain: "localhost",
  tokenConfig: {
    rememberExp: Math.floor(Date.now()) + 60 * 1, // 7day
    exp: Math.floor(Date.now()) + 60 * 0.5  // 1h
  }
};
