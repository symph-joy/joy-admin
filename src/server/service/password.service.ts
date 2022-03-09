import { Component, IComponentLifecycle } from "@symph/core";
import { WrongCode, SuccessCode, PasswordAddFail, PasswordAddSuccess } from "../../utils/constUtils";
import { DBService } from "./db.service";
import { PasswordInterface, SendCodeReturn } from "../../utils/common.interface";
import { PasswordDB } from "../../utils/entity/PasswordDB";
import bcrypt from "bcryptjs";
import { ObjectID } from "typeorm";

@Component()
export class PasswordService implements IComponentLifecycle {
  constructor(private dbService: DBService) {}

  public connection = this.dbService.connection;

  initialize() {}

  // 添加密码
  public async addPassword(realPassword: string, userId: ObjectID): Promise<SendCodeReturn> {
    const passwordDB = new PasswordDB();
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(realPassword, salt);
    passwordDB.password = password;
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

  public async getPassword(userId: ObjectID): Promise<PasswordInterface> {
    return await this.connection.manager.findOne(PasswordDB, { userId });
  }
}
