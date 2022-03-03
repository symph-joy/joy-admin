import { Controller, Post, Body, Get, Query } from "@symph/server";
import { LoginService } from "../service/login.service";

@Controller()
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Get("/getWrongTime")
  async getWrongTime(@Query("email") email: string): Promise<{ data: number }> {
    return {
      data: await this.loginService.getWrongTime(email),
    };
  }

  @Post("/login")
  async login(@Body() values: string) {
    return {
      data: await this.loginService.login(JSON.parse(values)),
    };
  }
}
