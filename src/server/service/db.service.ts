import { Component, IComponentLifecycle, RegisterTap } from "@symph/core";
import { Value } from "@symph/config";
import { createConnection, getConnectionManager } from "typeorm";
import { User } from "../../utils/entity/UserDB";
import { EmailCodeDB } from "../../utils/entity/EmailCodeDB";
import { CaptchaDB } from "../../utils/entity/CaptchaDB";
import { PasswordDB } from "../../utils/entity/PasswordDB";
import { Account } from "../../utils/entity/AccountDB";

@Component()
export class DBService implements IComponentLifecycle {
  @Value({ configKey: "dbOptions" })
  public dbOptions;

  public connection;

  async initialize() {
    await createConnection({
      ...this.dbOptions,
      entities: [User, EmailCodeDB, CaptchaDB, PasswordDB, Account],
    }).then(async (connection) => {
      this.connection = connection;
    });
  }

  @RegisterTap({ hookId: "onBeforeShutdownHook" })
  async onBeforeShutdownHook() {
    this.connection.close();
  }
}
