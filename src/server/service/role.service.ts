import { Component, IComponentLifecycle } from "@symph/core";
import { DBService } from "./db.service";
import { RoleDB } from "../../utils/entity/RoleDB";
import { GetSuccess, NotExistUser, SuccessCode, WrongCode } from "../../utils/constUtils";
import { ReturnInterface } from "../../utils/common.interface";
@Component()
export class RoleService implements IComponentLifecycle {
  constructor(private dbService: DBService) {}

  public connection = this.dbService.connection;

  initialize() {}

  public async addRole(roleName: string, roleId: number): Promise<RoleDB> {
    const roleDB = new RoleDB();
    roleDB.roleName = roleName;
    roleDB.roleId = roleId;
    return await this.connection.manager.save(roleDB);
  }

  public async getRoles(): Promise<ReturnInterface<RoleDB[]>> {
    const roles = await this.getRolesByDB();
    if (roles) {
      return {
        message: GetSuccess,
        code: SuccessCode,
        data: roles,
      };
    } else {
      return {
        message: NotExistUser,
        code: WrongCode,
      };
    }
  }

  public async getRolesByDB(): Promise<RoleDB[]> {
    return await this.connection.manager.find(RoleDB);
  }

  public async getRoleByOptions(options: object): Promise<RoleDB> {
    return await this.connection.manager.findOne(RoleDB, options);
  }
}
