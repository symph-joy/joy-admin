import { Component, IComponentLifecycle } from "@symph/core";
import { DBService } from "./db.service";
import { Payload, SendCodeReturn, UserInterface } from "../../utils/common.interface";
import {
  ExpiredUser,
  LoginSuccess,
  NotExistUser,
  RegisterFail,
  RegisterSuccess,
  SuccessCode,
  UserDeleteFail,
  UserDeleteSuccess,
  WrongCode,
} from "../../utils/constUtils";
import { User } from "../../utils/entity/UserDB";
import { ObjectId } from "mongodb";
import { RegisterUser } from "../../utils/register.interface";
import { emailCodeField, emailField, passwordField } from "../../utils/apiField";
import { EmailCodeDB } from "../../utils/entity/EmailCodeDB";
import { EmailService } from "./email.service";
import { v1 as uuidv1 } from "uuid";
import { PasswordService } from "./password.service";
import { AccountService } from "./account.service";
import { ObjectID } from "typeorm";
@Component()
export class UserService implements IComponentLifecycle {
  constructor(
    private dbService: DBService,
    private emailService: EmailService,
    private passwordService: PasswordService,
    private accountService: AccountService
  ) {}

  public connection = this.dbService.connection;

  initialize() {}

  // 新增用户
  public async addUser(values: RegisterUser): Promise<SendCodeReturn> {
    const email = values[emailField];
    const emailCode = values[emailCodeField];
    // 邮箱和激活码是否匹配
    const res = await this.emailService.checkEmailCodeIsRight(email, emailCode);
    if (res.code !== SuccessCode) {
      return res;
    }
    const username = uuidv1();
    const user = new User();
    user.username = username;
    user.email = email;
    let userRes: UserInterface;
    try {
      userRes = await this.connection.manager.save(user);
    } catch (e) {
      return {
        code: WrongCode,
        message: RegisterFail,
      };
    }
    this.connection.manager.delete(EmailCodeDB, { email });
    const password = values[passwordField];
    const resAll = await Promise.all([
      this.passwordService.addPassword(password, userRes._id),
      this.accountService.addCount(email, username, userRes._id),
    ]);
    if (resAll[0].code === WrongCode) {
      this.deleteOnlyUser(userRes._id);
      return resAll[0];
    }
    if (resAll[1].code === WrongCode) {
      this.deleteOnlyUser(userRes._id);
      return resAll[1];
    }
    return {
      code: SuccessCode,
      message: RegisterSuccess,
    };
  }

  // 删除User，不删除password和account
  public async deleteOnlyUser(userId: ObjectID): Promise<SendCodeReturn> {
    try {
      await this.connection.manager.deleteById(User, userId);
    } catch (e) {
      return {
        code: WrongCode,
        message: UserDeleteFail,
      };
    }
    return {
      code: SuccessCode,
      message: UserDeleteSuccess,
    };
  }

  public async isTokenExpired(payload: SendCodeReturn) {
    if (payload.code === WrongCode) {
      return payload;
    } else {
      const date = Math.floor(Date.now() / 1000);
      let data = payload.data as Payload;
      if (data.exp > date) {
        const user = await this.getUser(data.userId);
        if (user) {
          return {
            message: LoginSuccess,
            code: SuccessCode,
            data: user,
          };
        } else {
          return {
            message: NotExistUser,
            code: WrongCode,
          };
        }
      } else {
        return {
          message: ExpiredUser,
          code: WrongCode,
        };
      }
    }
  }

  public async getUser(userId: string): Promise<UserInterface> {
    return await this.connection.manager.findOne(User, { _id: new ObjectId(userId) });
  }
}
