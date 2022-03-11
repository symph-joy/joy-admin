import { Body, Controller, Get, Post, Request } from "@symph/server";
import { AuthService } from "../service/auth.service";
import { UserService } from "../service/user.service";
import { FastifyRequest } from "fastify";
import { SuccessCode } from "../../utils/constUtils";
import { ControllerReturn } from "../../utils/common.interface";
import { PasswordService } from "../service/password.service";

@Controller()
export class UserController {
  constructor(private authService: AuthService, private userService: UserService, private passwordService: PasswordService) {}

  @Get("/getUserByToken")
  async getUserByToken(@Request() req: FastifyRequest): Promise<ControllerReturn> {
    const token = req.cookies.token;
    const payload = this.authService.checkToken(token);
    return {
      data: await this.userService.getUserByToken(payload),
    };
  }

  @Post("/updateUsername")
  async updateUsername(@Request() req: FastifyRequest, @Body() values: string): Promise<ControllerReturn> {
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

  @Post("/changePassword")
  async changePassword(@Request() req: FastifyRequest, @Body() values: string): Promise<ControllerReturn> {
    const token = req.cookies.token;
    const payload = this.authService.checkToken(token);
    if (payload.code === SuccessCode) {
      const { oldPassword, newPassword, userId } = JSON.parse(values);
      const res = await this.passwordService.changePassword(userId, oldPassword, newPassword);
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
