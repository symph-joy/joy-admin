import { Body, Controller, Get, Post, Query, Request } from "@symph/server";
import { AuthService } from "../service/auth.service";
import { UserService } from "../service/user.service";
import { FastifyRequest } from "fastify";
import { ControllerReturn, ReturnInterface } from "../../utils/common.interface";
import { PasswordService } from "../service/password.service";
import { UserDB } from "../../utils/entity/UserDB";
import { SuccessCode } from "../../utils/constUtils";

@Controller()
export class UserController {
  constructor(private authService: AuthService, private userService: UserService, private passwordService: PasswordService) {}

  @Get("/getUser")
  async getUser(@Request() req: FastifyRequest): Promise<ControllerReturn<UserDB>> {
    const token = req.cookies.token;
    const res = await this.authService.checkToken(token);
    if (res.code === SuccessCode) {
      return {
        data: await this.userService.getUser(res.data.userId),
      };
    } else {
      return {
        data: res as ReturnInterface<null>,
      };
    }
  }

  @Get("/getAllUser")
  async getAllUser(@Request() req: FastifyRequest): Promise<ControllerReturn<UserDB[]>> {
    const token = req.cookies.token;
    const res = await this.authService.checkToken(token);
    if (res.code === SuccessCode) {
      return {
        data: await this.userService.getAllUser(),
      };
    } else {
      return {
        data: res as ReturnInterface<null>,
      };
    }
  }

  @Post("/updateUserMessage")
  async updateUserMessage(@Request() req: FastifyRequest, @Body() values: string): Promise<ControllerReturn<null>> {
    const token = req.cookies.token;
    const res = await this.authService.checkToken(token);
    if (res.code === SuccessCode) {
      return {
        data: await this.userService.updateUserMessage(JSON.parse(values)),
      };
    } else {
      return {
        data: res as ReturnInterface<null>,
      };
    }
  }

  @Post("/changePassword")
  async changePassword(@Request() req: FastifyRequest, @Body() values: string): Promise<ControllerReturn<null>> {
    const { oldPassword, newPassword, userId } = JSON.parse(values);
    const token = req.cookies.token;
    const res = await this.authService.checkToken(token);
    if (res.code === SuccessCode) {
      return {
        data: await this.passwordService.changePassword(userId, oldPassword, newPassword),
      };
    } else {
      return {
        data: res as ReturnInterface<null>,
      };
    }
  }

  @Get("/checkIsExistUsername")
  async checkIsExistEmail(@Query("value") value: string): Promise<{ data: boolean }> {
    return {
      data: await this.userService.checkIsExistUsername(value),
    };
  }

  @Post("/addUserByAdmin")
  addUserByAdmin(@Body() values: string): ControllerReturn<null> {
    return {
      data: this.userService.addUserByAdmin(JSON.parse(values)),
    };
  }
}
