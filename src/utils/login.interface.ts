export interface LoginUser {
  publicKey: string;
  email: string;
  password: string;
  captcha?: string;
  captchaId?: string;
}
