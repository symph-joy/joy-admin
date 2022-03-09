import { Component, IComponentLifecycle } from "@symph/core";
import {
  WrongCode,
  SuccessCode,
  PasswordAddFail,
  PasswordAddSuccess,
  PasswordWrong,
  UpdateFail,
  UpdateSuccess,
  PasswordRight,
} from "../../utils/constUtils";
import { DBService } from "./db.service";
import { PasswordInterface, SendCodeReturn } from "../../utils/common.interface";
import { PasswordDB } from "../../utils/entity/PasswordDB";
import bcrypt from "bcryptjs";
import { ObjectID } from "typeorm";
import { ObjectId } from "mongodb";

@Component()
export class PasswordService implements IComponentLifecycle {
  constructor(private dbService: DBService) {}

  public connection = this.dbService.connection;

  initialize() {}

  // 添加密码
  public async addPassword(realPassword: string, userId: ObjectID): Promise<SendCodeReturn> {
    const passwordDB = new PasswordDB();
    passwordDB.password = this.encrypt(realPassword);
    passwordDB.userId = userId;
    let res: PasswordInterface;
    try {
      res = await this.connection.manager.save(passwordDB);
    } catch (e) {
      return {
        code: WrongCode,
        message: PasswordAddFail,
      };
    }
    return {
      code: SuccessCode,
      message: PasswordAddSuccess,
      data: res,
    };
  }

  public async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<SendCodeReturn> {
    const resPassword = await this.checkPassword(new ObjectId(userId) as unknown as ObjectID, oldPassword);
    if (resPassword.code === WrongCode) {
      return {
        message: PasswordWrong,
        code: WrongCode,
      };
    } else {
      const password = this.encrypt(newPassword);
      const passwordDB = resPassword.data as PasswordInterface;
      const res = await this.updatePassword(passwordDB._id, password);
      if (res.raw.matchedCount === 1) {
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
    }
  }

  // 更改密码
  public async updatePassword(_id: ObjectID, password: string) {
    return await this.connection.manager.update(PasswordDB, _id, { password });
  }

  public async getPassword(userId: ObjectID): Promise<PasswordInterface> {
    return await this.connection.manager.findOne(PasswordDB, { userId });
  }

  // 验证密码是否正确
  public async checkPassword(userId: ObjectID, password: string): Promise<SendCodeReturn> {
    const userPassword = await this.getPassword(userId);
    if (!bcrypt.compareSync(password, userPassword.password)) {
      return {
        message: PasswordWrong,
        code: WrongCode,
      };
    } else {
      return {
        data: userPassword,
        code: SuccessCode,
        message: PasswordRight,
      };
    }
  }

  // 加密
  public encrypt(realPassword: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(realPassword, salt);
  }
}
