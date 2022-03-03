import { Controller, Get } from "@symph/server";
import { PasswordService } from "../service/password.service";

@Controller()
export class PasswordController {
  constructor(private passwordService: PasswordService) {}

  @Get("/generatePublicKey")
  async generatePublicKey(): Promise<{ data: string }> {
    return {
      data: await this.passwordService.generatePublicKey(),
    };
  }
}
