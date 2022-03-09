import { Controller, Get, Query, Post, Body } from "@symph/server";
import { RegisterService } from "../service/register.service";
import { SendCodeReturn } from "../../utils/common.interface";
import { EmailService } from "../service/email.service";

@Controller()
export class RegisterController {
  constructor(private registerService: RegisterService, private emailService: EmailService) {}

  @Get("/checkIsExistEmail")
  async checkIsExistEmail(@Query("value") value: string): Promise<{ data: boolean }> {
    return {
      data: await this.emailService.checkIsExistEmail(value),
    };
  }

  @Get("/sendEmailCode")
  async sendEmailCode(@Query("email") email: string): Promise<{ data: SendCodeReturn }> {
    return {
      data: await this.emailService.sendEmailCode(email),
    };
  }

  @Post("/register")
  async register(@Body() values: string): Promise<{ data: SendCodeReturn }> {
    return {
      data: await this.registerService.register(JSON.parse(values)),
    };
  }
}
