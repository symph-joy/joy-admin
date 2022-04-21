import { Body, Controller, Get, Post, Query } from "@symph/server";
import { AuthService } from "../service/auth.service";
import { UserService } from "../service/user.service";
import { ControllerReturn, ReturnInterface } from "../../utils/common.interface";
import { PasswordService } from "../service/password.service";
import { UserDB } from "../../utils/entity/UserDB";
import { SuccessCode } from "../../utils/constUtils";

@Controller()
export class UserController {
  constructor(private authService: AuthService, private userService: UserService, private passwordService: PasswordService) {}

  @Get("/getUser")
  async getUser(@Query("token") token: string): Promise<ControllerReturn<UserDB>> {
    return {
      data: await this.authService.checkToken(token),
    };
  }

  @Get("/getAllUser")
  async getAllUser(@Query("token") token: string): Promise<ControllerReturn<UserDB[]>> {
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
  async updateUserMessage(@Body() values: string): Promise<ControllerReturn<null>> {
    const params = JSON.parse(values);
    const res = await this.authService.checkToken(params.token);
    if (res.code === SuccessCode) {
      return {
        data: await this.userService.updateUserMessage(params, res.data),
      };
    } else {
      return {
        data: res as ReturnInterface<null>,
      };
    }
  }

  @Post("/changePassword")
  async changePassword(@Query("token") token: string, @Body() values: string): Promise<ControllerReturn<null>> {
    const { oldPassword, newPassword, userId } = JSON.parse(values);
    // const token = req.cookies.token;
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

  @Post("/addUser")
  addUser(@Body() values: string): ControllerReturn<null> {
    return {
      data: this.userService.addUser(JSON.parse(values)),
    };
  }
}
