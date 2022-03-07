import { Component, IComponentLifecycle, RegisterTap } from "@symph/core";
import { Value } from "@symph/config";
import { createConnection } from "typeorm";
import { User } from "../../utils/entity/UserDB";
import { EmailCodeDB } from "../../utils/entity/EmailCodeDB";
import { CaptchaDB } from "../../utils/entity/CaptchaDB";
import { PasswordDB } from "../../utils/entity/PasswordDB";
import { Account } from "../../utils/entity/AccountDB";
import { KeyDB } from "../../utils/entity/KeyDB";

@Component()
export class DBService implements IComponentLifecycle {
  // @RegisterTap({ hookId: "onBeforeShutdownHook" })
  // async onBeforeShutdownHook() {
  //   this.connection = await createConnection({
  //     ...this.dbOptions,
  //     entities: [User, EmailCodeDB, CaptchaDB, PasswordDB, Account, KeyDB],
  //   }).then(async (connection) => {
  // }

  @Value({ configKey: "dbOptions" })
  public dbOptions;

  public connection;

  async initialize() {
    await createConnection({
      ...this.dbOptions,
      entities: [User, EmailCodeDB, CaptchaDB, PasswordDB, Account, KeyDB],
    }).then(async (connection) => {
      this.connection = connection;
    });
  }
}
