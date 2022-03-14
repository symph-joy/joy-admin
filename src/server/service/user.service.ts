import { Component, IComponentLifecycle } from "@symph/core";
import { DBService } from "./db.service";
import { Payload, ReturnInterface, UserInterface } from "../../utils/common.interface";
import {
  GetSuccess,
  NotExistUser,
  SuccessCode,
  UpdateFail,
  UpdateSuccess,
  UserDeleteFail,
  UserDeleteSuccess,
  UsernameExist,
  WrongCode,
  UserAddFail,
  UserAddSuccess,
} from "../../utils/constUtils";
import { UserDB } from "../../utils/entity/UserDB";
import { ObjectId } from "mongodb";
import { RegisterUser } from "../../utils/common.interface";
import { emailCodeField, emailField, passwordField } from "../../utils/apiField";
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

    const password = values[passwordField];
    const username = uuidv1();
    return this.connection
      .transaction(async (transactionalEntityManager) => {
        const user = await this.addUserToDB(username, email, transactionalEntityManager);
        await this.passwordService.addPassword(password, user._id, transactionalEntityManager);
        await this.accountService.addAccount(email, username, user._id, transactionalEntityManager);
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

  public async addUserToDB(username: string, email: string, transactionalEntityManager) {
    const user = new UserDB();
    user.username = username;
    user.email = email;
    return await transactionalEntityManager.save(user);
  }

  // 删除User，不删除password和account
  public async deleteOnlyUser(userId: ObjectID): Promise<ReturnInterface<null>> {
    try {
      await this.connection.manager.deleteById(UserDB, userId);
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

  public async updateUsername(userId: string, username: string): Promise<ReturnInterface<null>> {
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
    return this.connection.manager.update(UserDB, _id, options);
  }

  public async getUserByOptions(options: object): Promise<UserInterface> {
    return await this.connection.manager.findOne(UserDB, options);
  }

  public async getUserByToken(res: ReturnInterface<Payload>): Promise<ReturnInterface<UserInterface | Payload>> {
    if (res.code === WrongCode) {
      return res;
    } else {
      const data = res.data;
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
