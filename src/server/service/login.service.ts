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
} from "../../utils/constUtils";
import { passwordField, captchaField, captchaIdField, emailField, rememberPasswordField } from "../../utils/apiField";
import { DBService } from "./db.service";
import { ReturnInterface, LoginUser } from "../../utils/common.interface";
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
  public async login(values: LoginUser): Promise<ReturnInterface<string | number>> {
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
    const account = values[emailField];
    const accountDB = await this.accountService.getAccountByOptions({ account });
    if (!account) {
      return {
        message: NotExistUsernameOrEmail,
        code: NotExistCode,
      };
    } else {
      const resPassword = await this.passwordService.checkPassword(accountDB.userId, values[passwordField]);
      if (resPassword.code === WrongCode) {
        this.accountService.updateAccount(accountDB._id, { wrongTime: accountDB.wrongTime + 1 });
        return {
          message: PasswordWrong,
          code: WrongCode,
          data: accountDB.wrongTime + 1,
        };
      } else {
        const changePasswordTimes = (await this.userService.getUser(String(accountDB.userId))).data.changePasswordTimes;
        const token = this.authService.generateToken(accountDB.userId, values[rememberPasswordField], changePasswordTimes);
        if (accountDB.wrongTime > 0) {
          this.accountService.updateAccount(accountDB._id, { wrongTime: 0 });
        }
        return {
          data: token,
          message: LoginSuccess,
          code: SuccessCode,
        };
      }
    }
  }
}
