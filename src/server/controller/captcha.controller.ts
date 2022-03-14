import { Controller, Get, Body, Post } from "@symph/server";
import { CaptchaService } from "../service/captcha.service";
import { CaptchaImg, ControllerReturn } from "../../utils/common.interface";

@Controller()
export class CaptchaController {
  constructor(private captchaService: CaptchaService) {}

  @Get("/getCaptchaImg")
  async getCaptchaImg(): Promise<{ data: CaptchaImg }> {
    return {
      data: await this.captchaService.getCaptchaImg(),
    };
  }

  @Post("/checkCaptcha")
  async login(@Body() values): Promise<ControllerReturn<null>> {
    return {
      data: await this.captchaService.checkCaptcha(JSON.parse(values)),
    };
  }
}
