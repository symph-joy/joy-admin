import { Controller, Post, Body, Get, Query } from "@symph/server";
import { LoginService } from "../service/login.service";
import { ControllerReturn } from "../../utils/common.interface";
import { AccountService } from "../service/account.service";

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
  async getWrongTime(@Query("email") email: string): Promise<{ data: number }> {
    const res = await this.accountService.getAccountByOptions({ account: email });
    return {
      data: res.wrongTime,
    };
  }
}
