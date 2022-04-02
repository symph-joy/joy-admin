import { Controller, Get } from "@symph/server";
import { ControllerReturn } from "../../utils/common.interface";
import { RoleDB } from "../../utils/entity/RoleDB";
import { RoleService } from "../service/role.service";

@Controller()
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get("/getRoles")
  async getRoles(): Promise<ControllerReturn<RoleDB[]>> {
    return {
      data: await this.roleService.getRoles(),
    };
  }
}
