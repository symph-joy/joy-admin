import { Controller, Post, Body, Get, Query } from "@symph/server";
import { LoginService } from "../service/login.service";
import { ControllerReturn } from "../../utils/common.interface";
import { AccountService } from "../service/account.service";
import { NotExistCode, SuccessCode, NotExistUsernameOrEmail, GetSuccess } from "../../utils/constUtils";

@Controller()
export class DocsController {
  constructor(private loginService: LoginService, private accountService: AccountService) {}

  @Post("/login")
  async login(@Body() values: string): Promise<ControllerReturn<string | number>> {
    return {
      data: await this.loginService.login(JSON.parse(values)),
    };
  }

  @Get("/getWrongTime")
  async getWrongTime(@Query("email") email: string): Promise<ControllerReturn<number>> {
    const res = await this.accountService.getAccountByOptions({ account: email });
    if (res) {
      return {
        data: {
          message: GetSuccess,
          data: res?.wrongTime,
          code: SuccessCode,
        },
      };
    } else {
      return {
        data: {
          code: NotExistCode,
          message: NotExistUsernameOrEmail,
        },
      };
    }
  }
}
