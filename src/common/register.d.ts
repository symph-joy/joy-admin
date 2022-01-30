import { message } from "antd";

export interface RegisterUser {
  username: string;
  password: string;
  email: string;
  emailCode: string;
}
export interface User {
  username: string;
  password: string;
  email: string;
  id: string;
}

export type RegisterModelState = {
  email: string;
};

export interface SendCodeReturn {
  message: string;
  data: boolean;
}

export interface EmailOption {
  host: string;
  port?: number;
  secure?: boolean; // true for 465, false for other ports
  auth: {
    user: string;
    pass: string;
  };
}
