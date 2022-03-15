import { Component, IComponentLifecycle, RegisterTap } from "@symph/core";
import { Value } from "@symph/config";
import { createConnection } from "typeorm";
import { UserDB } from "../../utils/entity/UserDB";
import { EmailCodeDB } from "../../utils/entity/EmailCodeDB";
import { CaptchaDB } from "../../utils/entity/CaptchaDB";
import { PasswordDB } from "../../utils/entity/PasswordDB";
import { AccountDB } from "../../utils/entity/AccountDB";
import { TokenDB } from "../../utils/entity/TokenDB";
import { RoleDB } from "../../utils/entity/RoleDB";
import { RoleEnum } from "../../utils/common.interface";
import { Admin, Common } from "../../utils/constUtils";
import bcrypt from "bcryptjs";
import crypto from "crypto";

@Component()
export class DBService implements IComponentLifecycle {
  @Value({ configKey: "dbOptions" })
  public dbOptions;

  public connection;

  async initialize() {
    await createConnection({
      ...this.dbOptions,
      entities: [UserDB, EmailCodeDB, CaptchaDB, PasswordDB, AccountDB, TokenDB, RoleDB],
    }).then(async (connection) => {
      this.connection = connection;
      this.addUser(connection);
      this.addRole(connection, RoleEnum.Admin, Admin);
      this.addRole(connection, RoleEnum.Common, Common);
    });
  }

  private async addUser(connection) {
    const res = await connection.manager.findOne(UserDB, { username: Admin });
    if (!res) {
      connection
        .transaction(async (transactionalEntityManager) => {
          const email = "admin@123.com";
          let realPassword = "123456";
          const userDB = new UserDB();
          userDB.email = email;
          userDB.username = Admin;
          userDB.roleId = RoleEnum.Admin;
          const user = await transactionalEntityManager.save(userDB);
          const passwordDB = new PasswordDB();
          realPassword = crypto.createHash("md5").update(realPassword).digest("hex");
          passwordDB.password = bcrypt.hashSync(realPassword, bcrypt.genSaltSync(10));
          passwordDB.userId = user._id;
          const accountDB = new AccountDB();
          accountDB.userId = user._id;
          accountDB.email = email;
          accountDB.username = Admin;
          accountDB.wrongTime = 0;
          const password = await transactionalEntityManager.save(passwordDB);
          const account = await transactionalEntityManager.save(accountDB);
          return [user, password, account];
        })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  private async addRole(connection, roleId: number, roleName: string) {
    const res = await connection.manager.findOne(RoleDB, { roleId });
    if (!res) {
      const roleDB = new RoleDB();
      roleDB.roleName = roleName;
      roleDB.roleId = roleId;
      console.log(await connection.manager.save(roleDB));
    }
  }

  @RegisterTap({ hookId: "onBeforeShutdownHook" })
  async onBeforeShutdownHook() {
    await this.connection.close();
  }
}
