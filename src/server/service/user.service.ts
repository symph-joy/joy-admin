import { Component, IComponentLifecycle } from "@symph/core";
import { DBService } from "./db.service";
import { ChangeUserInterface, ReturnInterface, RoleEnum, UserByAdminInterface } from "../../utils/common.interface";
import {
  GetSuccess,
  NotExistUser,
  SuccessCode,
  UpdateFail,
  UpdateSuccess,
  WrongCode,
  UserAddFail,
  UserAddSuccess,
  UsernameExist,
} from "../../utils/constUtils";
import { UserDB } from "../../utils/entity/UserDB";
import { ObjectId } from "mongodb";
import { RegisterUser } from "../../utils/common.interface";
import { emailActiveField, emailCodeField, emailField, passwordField, roleField, usernameField } from "../../utils/apiField";
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

  // 注册用户（暂时没有开放前端注册入口）
  public async addUserByRegister(values: RegisterUser): Promise<ReturnInterface<null>> {
    const email = values[emailField];
    const emailCode = values[emailCodeField];
    // 邮箱和激活码是否匹配
    const res = await this.emailService.checkEmailCodeIsRight(email, emailCode);
    if (res.code !== SuccessCode) {
      return res;
    }
    const password = values[passwordField];
    const username = uuidv1();
    const params = {
      username,
      email,
      [roleField]: RoleEnum.Common,
      [emailActiveField]: true,
      password,
    };
    const addRes = await this.addUser(params);
    if (addRes.code === SuccessCode) {
      this.emailService.deleteEmailCode(email);
    }
    return addRes;
  }

  public addUser(values: UserByAdminInterface): ReturnInterface<null> {
    const username = values[usernameField];
    const email = values[emailField];
    const roleId = values[roleField];
    const emailActive = values[emailActiveField];
    const password = values[passwordField];
    return this.connection
      .transaction(async (transactionalEntityManager) => {
        const user = await this.addUserToDB(username, email, roleId, emailActive, 0, transactionalEntityManager);
        await this.passwordService.addPassword(password, user._id, transactionalEntityManager);
        await this.accountService.addAccount(email, user._id, transactionalEntityManager);
        await this.accountService.addAccount(username, user._id, transactionalEntityManager);
      })
      .then(() => {
        return {
          code: SuccessCode,
          message: UserAddSuccess,
        };
      })
      .catch((e) => {
        console.log(e);
        return {
          code: WrongCode,
          message: UserAddFail,
        };
      });
  }

  // 修改用户
  public async updateUserMessage(values: ChangeUserInterface, originUser: UserDB): Promise<ReturnInterface<null>> {
    const { userId } = values;
    const _id = new ObjectId(userId) as unknown as ObjectID;
    const originEmail = originUser[emailField];
    const originUsername = originUser[usernameField];
    const params = {};
    const email = values[emailField];
    const username = values[usernameField];
    if (email) {
      const emailCode = values[emailCodeField];
      // 邮箱和激活码是否匹配
      const res = await this.emailService.checkEmailCodeIsRight(email, emailCode);
      if (res.code !== SuccessCode) {
        return res;
      }
      params[emailField] = email;
      params[emailActiveField] = true;
    }
    if (username) {
      if ((await this.getAllColumn("username")).includes(username)) {
        return {
          code: WrongCode,
          message: UsernameExist,
        };
      }
      params[usernameField] = username;
    }
    return this.connection
      .transaction(async (transactionalEntityManager) => {
        const res = await this.updateUser(_id, { ...params }, transactionalEntityManager);
        const res1 = [];
        if (email) {
          res1.push(await this.accountService.updateAccountByAccount(originEmail, { account: email }, transactionalEntityManager));
        }
        if (username) {
          res1.push(await this.accountService.updateAccountByAccount(originUsername, { account: username }, transactionalEntityManager));
        }
        return [res, res1];
      })
      .then(async (res) => {
        if (email) {
          this.emailService.deleteEmailCode(email);
        }
        if (res[0].affected !== 0 && res[1][0]?.affected !== 0 && res[1][1]?.affected !== 0) {
          return {
            code: SuccessCode,
            message: UpdateSuccess,
            data: await this.getUserByOptions({ _id }),
          };
        } else {
          console.log(res);
          return {
            code: WrongCode,
            message: UpdateFail,
          };
        }
      })
      .catch((e) => {
        console.log(e);
        return {
          code: WrongCode,
          message: UpdateFail,
        };
      });
  }

  public async checkIsExistUsername(username: string): Promise<boolean> {
    const res = await this.getUserByOptions({ username });
    return res ? true : false;
  }

  public async getUser(userId: string): Promise<ReturnInterface<UserDB>> {
    const user = await this.getUserByOptions({ _id: new ObjectId(userId) });
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

  public async getAllUser(): Promise<ReturnInterface<UserDB[]>> {
    const users = await this.getAllUsersByDB();
    if (users) {
      return {
        message: GetSuccess,
        code: SuccessCode,
        data: users,
      };
    } else {
      return {
        message: NotExistUser,
        code: WrongCode,
      };
    }
  }

  private async addUserToDB(
    username: string,
    email: string,
    roleId: number,
    emailActive: boolean,
    changePasswordTimes: number,
    transactionalEntityManager
  ): Promise<UserDB> {
    const user = new UserDB();
    user.username = username;
    user.email = email;
    user.roleId = roleId;
    user.emailActive = emailActive;
    user.changePasswordTimes = changePasswordTimes;
    return await transactionalEntityManager.save(user);
  }

  public updateUser(_id: ObjectID, options: object, transactionalEntityManager) {
    return transactionalEntityManager.update(UserDB, _id, options);
  }

  public async getUserByOptions(options: object): Promise<UserDB> {
    return await this.connection.manager.findOne(UserDB, options);
  }

  private async getAllUsersByDB(): Promise<UserDB[]> {
    return await this.connection.manager.find(UserDB);
  }

  private async getAllColumn(column: string): Promise<string[]> {
    const res = await this.getAllUsersByDB();
    return res.map((value) => value[column]);
  }
}
