import { Controller, Get, Query } from "@symph/server";
import { ControllerReturn } from "../../utils/common.interface";
import { EmailService } from "../service/email.service";

@Controller()
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Get("/checkIsExistEmail")
  async checkIsExistEmail(@Query("value") value: string): Promise<{ data: boolean }> {
    return {
      data: await this.emailService.checkIsExistEmail(value),
    };
  }

  @Get("/sendEmailCode")
  async sendEmailCode(@Query("email") email: string): Promise<ControllerReturn<null>> {
    return {
      data: await this.emailService.sendEmailCode(email),
    };
  }
}
