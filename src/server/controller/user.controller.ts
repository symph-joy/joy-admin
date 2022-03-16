import { Body, Controller, Get, Post, Request } from "@symph/server";
import { AuthService } from "../service/auth.service";
import { UserService } from "../service/user.service";
import { FastifyRequest } from "fastify";
import { ControllerReturn } from "../../utils/common.interface";
import { PasswordService } from "../service/password.service";
import { UserDB } from "../../utils/entity/UserDB";
import { authToken } from "./decorator";

@Controller()
export class UserController {
  constructor(private authService: AuthService, private userService: UserService, private passwordService: PasswordService) {}

  @Get("/getUser")
  @authToken()
  async getUser(@Request() req: FastifyRequest): Promise<ControllerReturn<UserDB>> {
    return this.userService.getUser(req as unknown as string) as unknown as Promise<ControllerReturn<UserDB>>;
  }

  @Get("/getAllUser")
  @authToken()
  async getAllUser(@Request() req: FastifyRequest): Promise<ControllerReturn<UserDB[]>> {
    return this.userService.getAllUser() as unknown as Promise<ControllerReturn<UserDB[]>>;
  }

  @Post("/updateUserMessage")
  @authToken()
  async updateUserMessage(@Request() req: FastifyRequest, @Body() values: string): Promise<ControllerReturn<null>> {
    return this.userService.updateUserMessage(JSON.parse(values)) as unknown as Promise<ControllerReturn<null>>;
  }

  @Post("/changePassword")
  @authToken()
  async changePassword(@Request() req: FastifyRequest, @Body() values: string): Promise<ControllerReturn<null>> {
    const { oldPassword, newPassword, userId } = JSON.parse(values);
    return this.passwordService.changePassword(userId, oldPassword, newPassword) as unknown as Promise<ControllerReturn<null>>;
  }
}
