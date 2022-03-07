import { Controller, Get, Body, Post, Request } from "@symph/server";
import { CaptchaService } from "../service/captcha.service";
import { CaptchaImg, SendCodeReturn } from "../../utils/common.interface";

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
  async login(@Body() values): Promise<{ data: SendCodeReturn }> {
    
    return {
      data: await this.captchaService.checkCaptcha(JSON.parse(values)),
    };
  }
}
