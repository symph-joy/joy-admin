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
