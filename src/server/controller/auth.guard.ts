import { CanActivate, Controller, ExecutionContext } from "@symph/server";
import { AuthService } from "../service/auth.service";

@Controller()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.token;
    const res = await this.authService.checkToken(token);
    console.log("request:", request.cookies);
    return true;
  }
}
