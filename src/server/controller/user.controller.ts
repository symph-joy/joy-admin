import { Body, Controller, Get, Post, Request } from "@symph/server";
import { AuthService } from "../service/auth.service";
import { UserService } from "../service/user.service";
import { FastifyRequest } from "fastify";
import { SuccessCode } from "../../utils/constUtils";
import { ControllerReturn, Payload, ReturnInterface } from "../../utils/common.interface";
import { PasswordService } from "../service/password.service";
import { UserDB } from "../../utils/entity/UserDB";

@Controller()
export class UserController {
  constructor(private authService: AuthService, private userService: UserService, private passwordService: PasswordService) {}

  @Get("/getUserByToken")
  async getUserByToken(@Request() req: FastifyRequest): Promise<ControllerReturn<UserDB>> {
    const token = req.cookies.token;
    const payload = await this.authService.checkToken(token);
    if (payload.code === SuccessCode) {
      return {
        data: await this.userService.getUserByToken(payload),
      };
    } else {
      return {
        data: payload as ReturnInterface<null>,
      };
    }
  }

  @Get("/getAllUser")
  async getAllUser(@Request() req: FastifyRequest): Promise<ControllerReturn<UserDB[]>> {
    const token = req.cookies.token;
    const payload = await this.authService.checkToken(token);
    if (payload.code === SuccessCode) {
      return {
        data: await this.userService.getAllUser(),
      };
    } else {
      return {
        data: payload as ReturnInterface<null>,
      };
    }
  }

  @Post("/updateUserMessage")
  async updateUserMessage(@Request() req: FastifyRequest, @Body() values: string): Promise<ControllerReturn<null>> {
    const token = req.cookies.token;
    const payload = await this.authService.checkToken(token);
    if (payload.code === SuccessCode) {
      const res = await this.userService.updateUserMessage(JSON.parse(values));
      return {
        data: res,
      };
    } else {
      return {
        data: payload as ReturnInterface<null>,
      };
    }
  }

  @Post("/changePassword")
  async changePassword(@Request() req: FastifyRequest, @Body() values: string): Promise<ControllerReturn<null>> {
    const token = req.cookies.token;
    const res = await this.authService.checkToken(token);
    if (res.code === SuccessCode) {
      const { oldPassword, newPassword, userId } = JSON.parse(values);
      const res = await this.passwordService.changePassword(userId, oldPassword, newPassword);
      return {
        data: res,
      };
    } else {
      return {
        data: res as ReturnInterface<null>,
      };
    }
  }
}
