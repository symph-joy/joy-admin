import { Controller, Get, Query } from "@symph/server";
import { AuthService } from "../service/auth.service";
import { UserService } from "../service/user.service";

@Controller()
export class UserController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Get("/getUser")
  async getUser(@Query("token") token: string) {
    const payload = await this.authService.checkToken(token);
    return {
      data: await this.userService.isTokenExpired(payload),
    };
  }
}
