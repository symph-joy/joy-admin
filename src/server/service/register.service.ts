import { Component, IComponentLifecycle } from "@symph/core";
import { SuccessCode, RegisterSuccess } from "../../utils/constUtils";
import { SendCodeReturn } from "../../utils/common.interface";
import { UserService } from "./user.service";
import { RegisterUser } from "../../utils/register.interface";

@Component()
export class RegisterService implements IComponentLifecycle {
  constructor(private userService: UserService) {}

  initialize() {}

  // 注册
  public async register(values: RegisterUser): Promise<SendCodeReturn> {
    const res = await this.userService.addUser(values);
    if (res.code === SuccessCode) {
      return {
        ...res,
        message: RegisterSuccess,
      };
    } else {
      return res;
    }
  }
}
