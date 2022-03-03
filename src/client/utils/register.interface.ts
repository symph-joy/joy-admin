export interface RegisterUser {
  password: string;
  email: string;
  emailCode: string;
}

export type RegisterModelState = {};

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
