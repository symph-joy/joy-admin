import { Controller, Get, Request } from "@symph/server";
import { AuthService } from "../service/auth.service";
import { FastifyRequest } from "fastify";
import { ControllerReturn, ReturnInterface } from "../../utils/common.interface";
import { SuccessCode } from "../../utils/constUtils";

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("/checkToken")
  async checkToken(@Request() req: FastifyRequest): Promise<ControllerReturn<null>> {
    const token = req.cookies.token;
    const { message, code } = await this.authService.checkToken(token);
    return {
      data: {
        message,
        code,
      },
    };
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
