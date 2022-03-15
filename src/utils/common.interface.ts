import { ObjectID } from "typeorm";

// 用户
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
export interface ChangePasswordInterface {
  userId: ObjectID;
  oldPassword: string;
  newPassword: string;
}

// 验证码
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

// 角色
export enum RoleEnum {
  Admin = 1,
  Common = 2,
}
