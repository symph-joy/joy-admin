import { Component, IComponentLifecycle } from "@symph/core";
import { DBService } from "./db.service";
import { ChangeUserInterface, Payload, ReturnInterface, RoleEnum } from "../../utils/common.interface";
import {
  GetSuccess,
  NotExistUser,
  SuccessCode,
  UpdateFail,
  UpdateSuccess,
  UsernameExist,
  WrongCode,
  UserAddFail,
  UserAddSuccess,
  NoPermissionCode,
  CommonUser,
} from "../../utils/constUtils";
import { UserDB } from "../../utils/entity/UserDB";
import { ObjectId } from "mongodb";
import { RegisterUser } from "../../utils/common.interface";
import { emailCodeField, emailField, registerPasswordField, usernameField } from "../../utils/apiField";
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
  public async addUser(values: RegisterUser): Promise<ReturnInterface<null>> {
    const email = values[emailField];
    const emailCode = values[emailCodeField];
    // 邮箱和激活码是否匹配
    const res = await this.emailService.checkEmailCodeIsRight(email, emailCode);
    if (res.code !== SuccessCode) {
      return res;
    }
    const password = values[registerPasswordField];
    const username = uuidv1();
    return this.connection
      .transaction(async (transactionalEntityManager) => {
        const user = await this.addUserToDB(username, email, 2, transactionalEntityManager);
        await this.passwordService.addPassword(password, user._id, transactionalEntityManager);
        await this.accountService.addAccount(email, user._id, transactionalEntityManager);
        await this.accountService.addAccount(username, user._id, transactionalEntityManager);
      })
      .then(() => {
        this.emailService.deleteEmailCode(email);
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
  public async updateUserMessage(values: ChangeUserInterface): Promise<ReturnInterface<null>> {
    const { userId } = values;
    const _id = new ObjectId(userId) as unknown as ObjectID;
    const hasUser = await this.getUserByOptions({ _id: userId });
    if (!hasUser) {
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
      }
      if (username) {
        params[usernameField] = username;
      }
      return this.connection
        .transaction(async (transactionalEntityManager) => {
          const res = await this.updateUser(_id, { ...params }, transactionalEntityManager);
          const res1 = await this.accountService.updateAccountByUserId(_id, { ...params }, transactionalEntityManager);
          return [res, res1];
        })
        .then((res) => {
          if (email) {
            this.emailService.deleteEmailCode(email);
          }
          if (res[0].affected === 1 && res[1].affected === 1) {
            return {
              code: SuccessCode,
              message: UpdateSuccess,
            };
          } else {
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
    } else {
      return {
        message: UsernameExist,
        code: WrongCode,
      };
    }
  }

  public async addUserToDB(username: string, email: string, roleId: number, transactionalEntityManager) {
    const user = new UserDB();
    user.username = username;
    user.email = email;
    user.roleId = roleId;
    return await transactionalEntityManager.save(user);
  }

  public updateUser(_id: ObjectID, options: object, transactionalEntityManager) {
    return transactionalEntityManager.update(UserDB, _id, options);
  }

  public async getUserByOptions(options: object): Promise<UserDB> {
    return await this.connection.manager.findOne(UserDB, options);
  }

  public async getUser(userId: string): Promise<ReturnInterface<UserDB>> {
    const user = await this.getUserByOptions({ _id: new ObjectId(userId) });
    if (user) {
      if (user.roleId === RoleEnum.Common) {
        return {
          message: CommonUser,
          code: NoPermissionCode,
        };
      } else {
        return {
          message: GetSuccess,
          code: SuccessCode,
          data: user,
        };
      }
    } else {
      return {
        message: NotExistUser,
        code: WrongCode,
      };
    }
  }

  public async getAllUser(): Promise<ReturnInterface<UserDB[]>> {
    const users = await this.connection.manager.find(UserDB);
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
}
