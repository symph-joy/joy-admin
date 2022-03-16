import { Controller, Get, Query, Request } from "@symph/server";
import { AuthService } from "../service/auth.service";
import { FastifyRequest } from "fastify";
import { ControllerReturn, ReturnInterface } from "../../utils/common.interface";
import { SuccessCode } from "../../utils/constUtils";
import { authToken } from "./decorator";

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("/checkToken")
  @authToken()
  async checkToken(@Request() req: FastifyRequest): Promise<ControllerReturn<null>> {
    return this.authService.checkToken(req as unknown as string) as unknown as Promise<ControllerReturn<null>>;
  }

  @Get("/deleteTokenByToken")
  async deleteTokenByToken(@Request() req: FastifyRequest): Promise<ControllerReturn<null>> {
    const token = req.cookies.token;
    const res = await this.authService.checkToken(token);
    if (res.code === SuccessCode) {
      return {
        data: await this.authService.deleteTokenByToken(token),
      };
    } else {
      return {
        data: res as ReturnInterface<null>,
      };
    }
  }

  @Get("/deleteTokenAll")
  async deleteTokenAll(@Request() req: FastifyRequest): Promise<ControllerReturn<null>> {
    const token = req.cookies.token;
    const res = await this.authService.checkToken(token);
    if (res.code === SuccessCode) {
      return {
        data: await this.authService.deleteTokenAll(res.data.userId),
      };
    } else {
      return {
        data: res as ReturnInterface<null>,
      };
    }
  }
}
