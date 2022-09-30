import { Controller, Post, Body, Get, Query, ServerApplication, Res, Request, UseGuards } from "@symph/server";
import { LoginService } from "../service/login.service";
import { ControllerReturn, ReturnInterface } from "../../utils/common.interface";
import { AccountService } from "../service/account.service";
import { NotExistCode, SuccessCode, NotExistUsernameOrEmail, GetSuccess, LogoutSuccess } from "../../utils/constUtils";
import type { FastifyReply } from "fastify";
import fastifyCookie from "fastify-cookie";
import { Value } from "@symph/config";
import { rememberPasswordField } from "../../utils/apiField";
import { AuthGuard } from "../guard/auth.guard";
import { UserDB } from "../../utils/entity/UserDB";
import type { FastifyRequest } from "fastify";

@Controller()
export class DocsController {
  @Value({ configKey: "domain" })
  public domain: string;

  constructor(private httpServer: ServerApplication, private loginService: LoginService, private accountService: AccountService) {}

  initialize(): Promise<void> | void {
    this.httpServer.getHttpAdapter().getInstance().register(fastifyCookie, { secret: "my-secret-001" });
  }

  // 验证token
  @Get("/checkToken")
  @UseGuards(AuthGuard)
  async checkToken(@Request() req: FastifyRequest): Promise<ReturnInterface<UserDB>> {
    console.log(req.params, "checkToken");
    return req.params as ReturnInterface<UserDB>;
  }

  @Post("/login")
  async login(@Body() values: string, @Res({ passthrough: true }) res: FastifyReply): Promise<ControllerReturn<string | number>> {
    const data = await this.loginService.login(JSON.parse(values));
    if (data.code === SuccessCode) {
      const token = data.data;
      if (values[rememberPasswordField]) {
        const date = new Date().getTime();
        // const expiresTime = new Date(date + 60 * 1000 * 60 * 24 * 7);
        const expiresTime = new Date(date + 60 * 1000 * 60);
        res.setCookie("token", token, { domain: this.domain, path: "/", httpOnly: true, expires: expiresTime });
      } else {
        // 期限为一个session
        res.setCookie("token", token, { domain: this.domain, path: "/", httpOnly: true });
      }
    }
    return {
      data,
    };
  }

  @Post("/logout")
  async logout(@Res({ passthrough: true }) res: FastifyReply): Promise<ControllerReturn<undefined>> {
    res.setCookie("token", "", { domain: this.domain, path: "/", expires: "Thu, 01 Jan 1970 00:00:00 UTC" });
    return {
      data: {
        code: SuccessCode,
        message: LogoutSuccess,
      },
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
