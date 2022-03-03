import { Component, IComponentLifecycle } from "@symph/core";
import { Value } from "@symph/config";
import { createConnection } from "typeorm";
import { User } from "../../client/utils/entity/UserDB";
import { EmailCodeDB } from "../../client/utils/entity/EmailCodeDB";
import { CaptchaDB } from "../../client/utils/entity/CaptchaDB";
import { PasswordDB } from "../../client/utils/entity/PasswordDB";
import { Account } from "../../client/utils/entity/AccountDB";
import { KeyDB } from "../../client/utils/entity/KeyDB";

@Component()
export class DBService implements IComponentLifecycle {
  @Value({ configKey: "dbOptions" })
  public dbOptions;

  public connection;

  async initialize() {
    await createConnection({
      ...this.dbOptions,
      entities: [User, EmailCodeDB, CaptchaDB, PasswordDB, Account, KeyDB],
    }).then(async (connection) => {
      this.connection = connection;
      // 删除过期数据
      const date = new Date().getTime();
      const resEmailCode = await connection.manager.find(EmailCodeDB);
      const res1EmailCode = resEmailCode.filter((value) => value.expiration < date);
      const resCaptcha = await connection.manager.find(CaptchaDB);
      const res1Captcha = resCaptcha.filter((value) => value.expiration < date);
      connection.manager.delete(EmailCodeDB, res1EmailCode);
      connection.manager.delete(CaptchaDB, res1Captcha);
    });
  }
}
