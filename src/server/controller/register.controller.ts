import { Controller, Get, Query, Post, Body } from "@symph/server";
import { RegisterService } from "../service/register.service";
import { SendCodeReturn, RegisterUser } from "../../common/register";

@Controller()
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  @Get("/checkIsExistEmail")
  checkIsExistEmail(@Query("email") email: string): { data: boolean } {
    return {
      data: this.registerService.checkIsExistEmail(email),
    };
  }

  @Get("/sendEmailCode")
  async sendEmailCode(@Query("email") email: string): Promise<{ data: SendCodeReturn }> {
    const { message, data } = await this.registerService.sendEmailCode(email);
    return {
      data: {
        message,
        data,
      },
    };
  }

  @Post("/registerUser")
  registerUser(@Body() values: RegisterUser) {
    return {
      data: this.registerService.registerUser(values),
    };
  }
}
