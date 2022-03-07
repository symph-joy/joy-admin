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

export interface SendCodeReturn {
  data?: string | UserInterface | PasswordInterface | AccountInterface | Payload;
  message: string;
  code: number;
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
