import { Component, IComponentLifecycle } from "@symph/core";
import { RoleEnum } from "../../utils/common.interface";
import { Admin, Common } from "../../utils/constUtils";
import bcrypt from "bcryptjs";
import { DBService } from "./db.service";
import { UserService } from "./user.service";
import { emailActiveField, emailField, passwordField, roleField, usernameField } from "../../utils/apiField";
import { RoleService } from "./role.service";
import { Value } from "@symph/config";
import crypto from "crypto";

@Component()
export class InitialService implements IComponentLifecycle {
  @Value({ configKey: "adminOptions" })
  public adminOptions;

  constructor(private dbService: DBService, private userService: UserService, private roleService: RoleService) {}

  public connection = this.dbService.connection;

  initialize() {
    this.initialUser();
    this.initialRole();
  }

  private async initialUser(): Promise<void> {
    const res = await this.userService.getUserByOptions({ username: Admin });
    if (!res) {
      const values = {};
      values[usernameField] = Admin;
      values[emailField] = this.adminOptions.email;
      values[roleField] = RoleEnum.Admin;
      values[emailActiveField] = false;
      values[passwordField] = crypto.createHash("md5").update(this.adminOptions.password).digest("hex");;
      this.userService.addUser(values);
    }
  }

  private async initialRole(): Promise<void> {
    const role1 = await this.roleService.getRoleByOptions({ roleName: Admin });
    const role2 = await this.roleService.getRoleByOptions({ roleName: Common });
    if (!role1) {
      this.roleService.addRole(Admin, RoleEnum.Admin);
    }
    if (!role2) {
      this.roleService.addRole(Common, RoleEnum.Common);
    }
  }
}
