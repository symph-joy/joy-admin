import { Component, IComponentLifecycle } from "@symph/core";
import { WrongCode, SuccessCode, AccountAddFail, AccountAddSuccess } from "../../utils/constUtils";
import { DBService } from "./db.service";
import { AccountInterface, SendCodeReturn } from "../../utils/common.interface";
import { Account } from "../../utils/entity/AccountDB";
import { ObjectID } from "typeorm";

@Component()
export class AccountService implements IComponentLifecycle {
  constructor(private dbService: DBService) {}

  public connection = this.dbService.connection;

  initialize() {}

  // 添加账户
  public async addCount(email: string, username: string, userId: ObjectID): Promise<SendCodeReturn> {
    const account = new Account();
    account.email = email;
    account.username = username;
    account.userId = userId;
    account.wrongTime = 0;
    let res: AccountInterface;
    try {
      res = await this.connection.manager.save(account);
    } catch (e) {
      return {
        code: WrongCode,
        message: AccountAddFail,
      };
    }
    return {
      code: SuccessCode,
      message: AccountAddSuccess,
      data: res,
    };
  }
}
