import { Component, IComponentLifecycle } from "@symph/core";
import {
  WrongCode,
  SuccessCode,
  NotExistCode,
  CaptchaWrong,
  NotExistCaptcha,
  NotExistUsernameOrEmail,
  PasswordWrong,
  LoginSuccess,
  NoPermissionCode,
  CommonUser,
} from "../../utils/constUtils";
import { passwordField, captchaField, captchaIdField, emailField, rememberPasswordField } from "../../utils/apiField";
import { DBService } from "./db.service";
import { ReturnInterface, TokenInterface, LoginUser, RoleEnum } from "../../utils/common.interface";
import { AuthService } from "./auth.service";
import { CaptchaService } from "./captcha.service";
import { AccountService } from "./account.service";
import { PasswordService } from "./password.service";
import { UserService } from "./user.service";

@Component()
export class LoginService implements IComponentLifecycle {
  constructor(
    private authService: AuthService,
    private dbService: DBService,
    private captchaService: CaptchaService,
    private accountService: AccountService,
    private passwordService: PasswordService,
    private userService: UserService
  ) {}

  public connection = this.dbService.connection;

  initialize() {}

  // 登录
  public async login(values: LoginUser): Promise<ReturnInterface<TokenInterface>> {
    // 验证码是否正确
    const captchaInput = values[captchaField];
    const captchaId = values[captchaIdField];
    if (captchaInput) {
      const captchaDB = await this.captchaService.getCaptcha(captchaId);
      if (!captchaDB) {
        return {
          message: NotExistCaptcha,
          code: NotExistCode,
        };
      }
      if (captchaDB.captcha !== captchaInput.toLowerCase()) {
        return {
          message: CaptchaWrong,
          code: WrongCode,
        };
      }
    }
    // 账户是否存在
    const email = values[emailField];
    const account = await this.accountService.getAccountByOptions({ where: { $or: [{ email }, { username: email }] } });
    if (!account) {
      return {
        message: NotExistUsernameOrEmail,
        code: NotExistCode,
      };
    } else {
      const resPassword = await this.passwordService.checkPassword(account.userId, values[passwordField]);
      if (resPassword.code === WrongCode) {
        this.accountService.updateAccount(account._id, { wrongTime: account.wrongTime + 1 });
        return {
          message: PasswordWrong,
          code: WrongCode,
        };
      } else {
        const user = await this.userService.getUserByOptions({ _id: account.userId });
        if (user?.roleId === RoleEnum.Admin) {
          const token = this.authService.generateToken(account.userId);
          const rememberPassword = values[rememberPasswordField] ? true : false;
          this.authService.addToken(user._id, token);
          if (account.wrongTime > 0) {
            this.accountService.updateAccount(account._id, { wrongTime: 0 });
          }
          return {
            data: {
              token,
              rememberPassword,
            },
            message: LoginSuccess,
            code: SuccessCode,
          };
        } else {
          return {
            message: CommonUser,
            code: NoPermissionCode,
          };
        }
      }
    }
  }
}
