import { Value } from "@symph/config";
import { Component } from "@symph/core";
import { CanActivate, ExecutionContext, HttpException } from "@symph/server";
import { NotExistToken, ReferWrong, WrongCode, WrongToken } from "../../utils/constUtils";
import { AuthService } from "../service/auth.service";

@Component()
export class AuthGuard implements CanActivate {
  @Value({ configKey: "domain" })
  public domain: string;

  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.token;
    if (token) {
      const referer = request.headers.referer;
      const url = new URL(referer);
      // 判断来源
      if (url.hostname !== this.domain) {
        throw new HttpException(ReferWrong, 500);
      }
      // token错误
      const res = await this.authService.checkToken(token);
      if (res.code === WrongCode) {
        throw new HttpException(WrongToken, 500);
      }
      request.params = res;
      return true;
    } else {
      // cookie为空
      throw new HttpException(NotExistToken, 500);
    }
  }
}
