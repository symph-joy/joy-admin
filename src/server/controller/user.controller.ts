import { Body, Controller, Get, Post, Request } from "@symph/server";
import { AuthService } from "../service/auth.service";
import { UserService } from "../service/user.service";
import { FastifyRequest } from "fastify";
import { SuccessCode } from "../../utils/constUtils";

@Controller()
export class UserController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Get("/getUserByToken")
  async getUserByToken(@Request() req: FastifyRequest) {
    const token = req.cookies.token;
    const payload = this.authService.checkToken(token);
    return {
      data: await this.userService.getUserByToken(payload),
    };
  }

  @Post("/updateUsername")
  async updateUsername(@Request() req: FastifyRequest, @Body() values: string) {
    const token = req.cookies.token;
    const payload = this.authService.checkToken(token);
    if (payload.code === SuccessCode) {
      const { userId, username } = JSON.parse(values);
      const res = await this.userService.updateUsername(userId, username);
      return {
        data: res,
      };
    } else {
      return {
        data: payload,
      };
    }
  }
}
