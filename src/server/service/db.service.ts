import { Component, IComponentLifecycle, RegisterTap } from "@symph/core";
import { Value } from "@symph/config";
import { createConnection } from "typeorm";
import { UserDB } from "../../utils/entity/UserDB";
import { EmailCodeDB } from "../../utils/entity/EmailCodeDB";
import { CaptchaDB } from "../../utils/entity/CaptchaDB";
import { PasswordDB } from "../../utils/entity/PasswordDB";
import { AccountDB } from "../../utils/entity/AccountDB";
import { RoleDB } from "../../utils/entity/RoleDB";

@Component()
export class DBService implements IComponentLifecycle {
  @Value({ configKey: "dbOptions" })
  public dbOptions;

  public connection;

  async initialize() {
    await createConnection({
      ...this.dbOptions,
      entities: [UserDB, EmailCodeDB, CaptchaDB, PasswordDB, AccountDB, RoleDB],
    }).then(async (connection) => {
      this.connection = connection;
    });
  }

  @RegisterTap({ hookId: "onBeforeShutdownHook" })
  async onBeforeShutdownHook() {
    await this.connection.close();
  }
}
