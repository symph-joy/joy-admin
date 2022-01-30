import { Controller, Get, Query } from "@symph/server";
import { RegisterService } from "../service/register.service";

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
  sendEmailCode(@Query("email") email: string): { data: boolean } {
    return {
      data: this.registerService.sendEmailCode(email),
    };
  }

  
}
