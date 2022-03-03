import { Controller, Get, Query, Post, Body } from "@symph/server";
import { RegisterService } from "../service/register.service";
import { SendCodeReturn } from "../../client/utils/common.interface";

@Controller()
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  @Get("/checkIsExistEmail")
  async checkIsExistEmail(@Query("value") value: string): Promise<{ data: boolean }> {
    return {
      data: await this.registerService.checkIsExistEmail(value),
    };
  }

  @Get("/sendEmailCode")
  async sendEmailCode(@Query("email") email: string): Promise<{ data: SendCodeReturn }> {
    return {
      data: await this.registerService.sendEmailCode(email),
    };
  }

  @Post("/registerUser")
  async registerUser(@Body() values: string) {
    return {
      data: await this.registerService.registerUser(JSON.parse(values)),
    };
  }
}
