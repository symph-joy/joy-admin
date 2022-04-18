import { Component, IComponentLifecycle } from "@symph/core";
import { SuccessCode, RegisterSuccess, RegisterFail } from "../../utils/constUtils";
import { ReturnInterface, RegisterUser } from "../../utils/common.interface";
import { UserService } from "./user.service";

@Component()
export class RegisterService implements IComponentLifecycle {
  constructor(private userService: UserService) {}

  initialize() {}

  // 注册
  public async register(values: RegisterUser): Promise<ReturnInterface<null>> {
    const res = await this.userService.addUserByRegister(values);
    if (res.code === SuccessCode) {
      return {
        ...res,
        message: RegisterSuccess,
      };
    } else {
      return {
        ...res,
        message: RegisterFail,
      };
    }
  }
}
