import { Controller, Get, Request } from "@symph/server";
import { AuthService } from "../service/auth.service";
import { FastifyRequest } from "fastify";

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("/checkToken")
  async checkToken(@Request() req: FastifyRequest) {
    const token = req.cookies.token;
    const { message, code } = this.authService.checkToken(token);
    return {
      data: {
        message,
        code,
      },
    };
  }
}
