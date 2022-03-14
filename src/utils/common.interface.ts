import { ObjectID } from "typeorm";

// 用户
export interface UserInterface {
  email: string;
  _id: ObjectID;
  username: string;
}

export interface LoginUser {
  email: string;
  password: string;
  captcha?: string;
  captchaId?: string;
}

export interface RegisterUser {
  password: string;
  email: string;
  emailCode: string;
}

// 邮箱
export interface EmailOption {
  host: string;
  port?: number;
  secure?: boolean; // true for 465, false for other ports
  auth: {
    user: string;
    pass: string;
  };
}

export interface MailOptions {
  from: string; // 发送者
  to: string; // 接受者,可以同时发送多个,以逗号隔开
  subject: string; // 标题
  html: string;
}

// 密码
export interface PasswordInterface {
  password: string;
  _id: ObjectID;
  userId: ObjectID;
}

export interface ChangePasswordInterface {
  userId: ObjectID;
  oldPassword: string;
  newPassword: string;
}

// 账户
export interface AccountInterface {
  _id: ObjectID;
  email: string;
  username: string;
  userId: ObjectID;
  wrongTime: number;
}

// 验证码
export interface CaptchaInterface {
  _id: ObjectID;
  captcha: string;
  captchaId: string;
  expiration: number;
}

export interface CaptchaImg {
  captchaImg: string;
  captchaId: string;
}

export interface Captcha {
  captcha: string;
  captchaId: string;
}

// token
export interface TokenInterface {
  token: string;
  rememberPassword: boolean;
}

export interface Payload {
  userId: string;
  exp: number;
  iat: number;
}

// 公用
export interface ReturnInterface<T> {
  data?: T;
  message: string;
  code: number;
}

export interface ControllerReturn<T> {
  data: ReturnInterface<T>;
}
