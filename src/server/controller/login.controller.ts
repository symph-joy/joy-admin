import { Controller, Response, ServerApplication, Post, Body } from "@symph/server";
import { FastifyReply } from "fastify";
import { IComponentLifecycle } from "@symph/core";
import fastifyCookie from "fastify-cookie";
import { FastifyAdapter } from "@symph/server/dist/platform/fastify";
import { LoginService } from "../service/login.service";
import { SuccessCode } from "../../utils/constUtils";
import { ControllerReturn, tokenCookie } from "../../utils/common.interface";
import { rememberPasswordField } from "../../utils/apiField";

@Controller()
export class DocsController implements IComponentLifecycle {
  constructor(private httpServer: ServerApplication, private loginService: LoginService) {}

  initialize(): Promise<void> | void {
    (this.httpServer.getHttpAdapter() as FastifyAdapter).register(fastifyCookie, { secret: "my-secret-001" });
  }

  @Post("/login")
  async login(@Body() values: string, @Response({ passthrough: true }) res: FastifyReply): Promise<ControllerReturn> {
    const data = await this.loginService.login(JSON.parse(values));
    if (data.code === SuccessCode) {
      const temp = data.data as tokenCookie;
      if (temp[rememberPasswordField]) {
        const date = new Date().getTime();
        const expiresTime = new Date(date + 60 * 1000 * 60 * 24 * 7);
        res.setCookie("token", temp.token, { path: "/", expires: expiresTime });
      } else {
        res.setCookie("token", temp.token, { path: "/" });
      }
    }
    return {
      data,
    };
  }
}
