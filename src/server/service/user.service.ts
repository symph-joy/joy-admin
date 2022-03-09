import { Component, IComponentLifecycle } from "@symph/core";
import { DBService } from "./db.service";
import { Payload, SendCodeReturn, UserInterface } from "../../utils/common.interface";
import {
  GetSuccess,
  NotExistUser,
  RegisterFail,
  RegisterSuccess,
  SuccessCode,
  UpdateFail,
  UpdateSuccess,
  UserDeleteFail,
  UserDeleteSuccess,
  UsernameExist,
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
      this.accountService.addAccount(email, username, userRes._id),
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

  public async updateUsername(userId: string, username: string): Promise<SendCodeReturn> {
    const _id = new ObjectId(userId) as unknown as ObjectID;
    const hasUser = await this.getUserByOptions({ username });
    if (!hasUser) {
      try {
        const res = await Promise.all([this.upDateUser(_id, { username }), this.accountService.upDateAccountByUserId(_id, { username })]);
        if (res[0].raw.matchedCount === 1) {
          return {
            message: UpdateSuccess,
            code: SuccessCode,
          };
        } else {
          return {
            message: UpdateFail,
            code: WrongCode,
          };
        }
      } catch (e) {
        return {
          message: UpdateFail,
          code: WrongCode,
        };
      }
    } else {
      return {
        message: UsernameExist,
        code: WrongCode,
      };
    }
  }

  public upDateUser(_id: ObjectID, options: object) {
    return this.connection.manager.update(User, _id, options);
  }

  public async getUserByOptions(options: object): Promise<UserInterface> {
    return await this.connection.manager.findOne(User, options);
  }

  public async getUserByToken(payload: SendCodeReturn): Promise<SendCodeReturn> {
    if (payload.code === WrongCode) {
      return payload;
    } else {
      const data = payload.data as Payload;
      const user = await this.getUserByOptions({ _id: new ObjectId(data.userId) });
      if (user) {
        return {
          message: GetSuccess,
          code: SuccessCode,
          data: user,
        };
      } else {
        return {
          message: NotExistUser,
          code: WrongCode,
        };
      }
    }
  }
}
