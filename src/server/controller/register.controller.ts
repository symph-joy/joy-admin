import { Controller, Post, Body } from "@symph/server";
import { RegisterService } from "../service/register.service";
import { ControllerReturn } from "../../utils/common.interface";

@Controller()
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  @Post("/register")
  async register(@Body() values: string): Promise<ControllerReturn<null>> {
    return {
      data: await this.registerService.register(JSON.parse(values)),
    };
  }
}
