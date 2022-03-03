import { ObjectID } from "typeorm";

export interface UserInterface {
  email: string;
  _id: ObjectID;
  username: string;
}
export interface SendCodeReturn {
  data?: string | UserInterface | Payload;
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
