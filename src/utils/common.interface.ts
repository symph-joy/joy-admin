import { ObjectID } from "typeorm";

export interface UserInterface {
  email: string;
  _id: ObjectID;
  username: string;
}

export interface PasswordInterface {
  password: string;
  _id: ObjectID;
  userId: ObjectID;
}
export interface AccountInterface {
  _id: ObjectID;
  email: string;
  username: string;
  userId: ObjectID;
  wrongTime: number;
}

export interface CaptchaInterface {
  _id: ObjectID;
  captcha: string;
  captchaId: string;
  expiration: number;
}

export interface SendCodeReturn {
  data?: string | UserInterface | PasswordInterface | AccountInterface | Payload | tokenCookie;
  message: string;
  code: number;
}

export interface tokenCookie {
  token: string;
  rememberPassword: boolean;
}

export interface CaptchaImg {
  captchaImg: string;
  captchaId: string;
}

export interface Captcha {
  captcha: string;
  captchaId: string;
}

export interface Payload {
  userId: string;
  exp: number;
  iat: number;
}
