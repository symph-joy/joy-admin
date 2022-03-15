import { Component, IComponentLifecycle } from "@symph/core";
import { DBService } from "./db.service";
import { AccountDB } from "../../utils/entity/AccountDB";
import { ObjectID } from "typeorm";

@Component()
export class AccountService implements IComponentLifecycle {
  constructor(private dbService: DBService) {}

  public connection = this.dbService.connection;

  initialize() {}

  public async addAccount(email: string, username: string, userId: ObjectID, transactionalEntityManager) {
    const account = new AccountDB();
    account.email = email;
    account.username = username;
    account.userId = userId;
    account.wrongTime = 0;
    return await transactionalEntityManager.save(account);
  }

  public updateAccount(_id: ObjectID, options: object) {
    return this.connection.manager.update(AccountDB, _id, options);
  }

  public updateAccountByUserId(userId: ObjectID, options: object, transactionalEntityManager) {
    return transactionalEntityManager.update(AccountDB, { userId }, options);
  }

  public async getAccountByOptions(options: object): Promise<AccountDB> {
    return await this.connection.manager.findOne(AccountDB, options);
  }
}
