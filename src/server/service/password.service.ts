import { Component, IComponentLifecycle } from "@symph/core";
import { WrongCode, SuccessCode, PasswordWrong, UpdateFail, UpdateSuccess, PasswordRight } from "../../utils/constUtils";
import { DBService } from "./db.service";
import { ReturnInterface } from "../../utils/common.interface";
import { PasswordDB } from "../../utils/entity/PasswordDB";
import bcrypt from "bcryptjs";
import { ObjectID } from "typeorm";
import { ObjectId } from "mongodb";

@Component()
export class PasswordService implements IComponentLifecycle {
  constructor(private dbService: DBService) {}

  public connection = this.dbService.connection;

  initialize() {}

  // 修改密码
  public async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<ReturnInterface<null>> {
    const resPassword = await this.checkPassword(new ObjectId(userId) as unknown as ObjectID, oldPassword);
    if (resPassword.code === WrongCode) {
      return {
        message: PasswordWrong,
        code: WrongCode,
      };
    } else {
      const password = this.encrypt(newPassword);
      const passwordDB = resPassword.data;
      const res = await this.updatePassword(passwordDB._id, password);
      if (res.affected === 1) {
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

  // 验证密码是否正确
  public async checkPassword(userId: ObjectID, password: string): Promise<ReturnInterface<PasswordDB>> {
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
  private encrypt(realPassword: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(realPassword, salt);
  }

  public async addPassword(realPassword: string, userId: ObjectID, transactionalEntityManager): Promise<PasswordDB> {
    const passwordDB = new PasswordDB();
    passwordDB.password = this.encrypt(realPassword);
    passwordDB.userId = userId;
    return await transactionalEntityManager.save(passwordDB);
  }

  private async updatePassword(_id: ObjectID, password: string) {
    return await this.connection.manager.update(PasswordDB, _id, { password });
  }

  private async getPassword(userId: ObjectID): Promise<PasswordDB> {
    return await this.connection.manager.findOne(PasswordDB, { userId });
  }
}
