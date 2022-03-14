module.exports = {
  emailOptions: {
    host: "smtp.163.com",
    secure: true,
    auth: {
      user: "symph_joy@163.com",
      pass: "LLJVFVIPOVJOVLIH",
    },
  },
  mailTitle: "@sympy/joy-admin注册用户激活码",
  dbOptions: {
    type: "mongodb",
    host: "localhost",
    port: 27017,
    username: "root",
    password: "root",
    database: "test",
    synchronize: true
  },
  secret: "Symph-joy",
};
