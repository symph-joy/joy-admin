import { Controller, Post, Body, Get, Query, ServerApplication, Res } from "@symph/server";
import { LoginService } from "../service/login.service";
import { ControllerReturn } from "../../utils/common.interface";
import { AccountService } from "../service/account.service";
import { NotExistCode, SuccessCode, NotExistUsernameOrEmail, GetSuccess } from "../../utils/constUtils";
import type { FastifyReply } from "fastify";
import fastifyCookie from "fastify-cookie";
import { Value } from "@symph/config";
import { FastifyAdapter } from "@symph/server/dist/platform/fastify";
import { rememberPasswordField } from "../../utils/apiField";
import * as cookieParser from "cookie-parser";

@Controller()
export class DocsController {
  @Value({ configKey: "domain" })
  public domain: string;

  constructor(private httpServer: ServerApplication, private loginService: LoginService, private accountService: AccountService) {}

  initialize(): Promise<void> | void {
    // (this.httpServer.getHttpAdapter() as FastifyAdapter).register(fastifyCookie, { secret: "my-secret-001" });
    this.httpServer.use(cookieParser.default());
  }

  @Post("/login")
  async login(@Body() values: string, @Res({ passthrough: true }) res): Promise<ControllerReturn<string | number>> {
    const data = await this.loginService.login(JSON.parse(values));
    if (data.code === SuccessCode) {
      const token = data.data;
      if (values[rememberPasswordField]) {
        const date = new Date().getTime();
        // const expiresTime = new Date(date + 60 * 1000 * 60 * 24 * 7);
        const expiresTime = new Date(date + 60 * 1000 * 60);
        // res.setCookie("token", token, { expires: expiresTime, domain: this.domain });
      } else {
        // res.setCookie("token", token, { domain: this.domain });
      }
      res.cookie("token", token);
    }
    return {
      data,
    };
  }

  @Get("/getWrongTime")
  async getWrongTime(@Query("email") email: string): Promise<ControllerReturn<number>> {
    const res = await this.accountService.getAccountByOptions({ account: email });
    if (res) {
      return {
        data: {
          message: GetSuccess,
          data: res?.wrongTime,
          code: SuccessCode,
        },
      };
    } else {
      return {
        data: {
          code: NotExistCode,
          message: NotExistUsernameOrEmail,
        },
      };
    }
  }
}
