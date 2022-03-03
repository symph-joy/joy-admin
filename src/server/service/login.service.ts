import { Component, IComponentLifecycle } from "@symph/core";
import { LoginUser } from "../../client/utils/login.interface";
import {
  WrongCode,
  SuccessCode,
  NotExistCode,
  CaptchaWrong,
  NotExistCaptcha,
  NotExistUsernameOrEmail,
  PasswordWrong,
  LoginSuccess,
} from "../../client/utils/constUtils";
import { passwordField, captchaField, captchaIdField, emailField, publicKeyField } from "../../client/utils/apiField";
import { getConnection } from "typeorm";
import { CaptchaDB } from "../../client/utils/entity/CaptchaDB";
import bcrypt from "bcryptjs";
import { SendCodeReturn } from "../../client/utils/common.interface";
import { PasswordDB } from "../../client/utils/entity/PasswordDB";
import { AuthService } from "./auth.service";
import { Account } from "../../client/utils/entity/AccountDB";
import { PasswordService } from "./password.service";

@Component()
export class LoginService implements IComponentLifecycle {
  public connection = getConnection();

  constructor(private authService: AuthService, private passwordService: PasswordService) {}

  initialize() {}

  // 登录
  public async login(values: LoginUser): Promise<SendCodeReturn> {
    // 验证码是否正确
    const captchaInput = values[captchaField];
    const captchaId = values[captchaIdField];
    if (captchaInput) {
      const captchaDB = await this.connection.manager.findOne(CaptchaDB, { captchaId });
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
    const account = await this.connection.manager.findOne(Account, { where: { $or: [{ email }, { username: email }] } });
    if (!account) {
      return {
        message: NotExistUsernameOrEmail,
        code: NotExistCode,
      };
    } else {
      const userPassword = await this.connection.manager.findOne(PasswordDB, { userId: account.userId });
      const password = values[passwordField];
      const publicKey = values[publicKeyField];
      const res = await this.passwordService.decrypt(password, publicKey);
      // 密钥是否存在
      if (res.code === WrongCode) {
        return res;
      } else {
        // 密码是否正确
        if (!bcrypt.compareSync(res.data, userPassword.password)) {
          this.connection.manager.update(Account, account._id, { wrongTime: account.wrongTime + 1 });
          return {
            message: PasswordWrong,
            code: WrongCode,
          };
        } else {
          const token = this.authService.generateToken(account.userId);
          if (account.wrongTime > 0) {
            this.connection.manager.update(Account, account._id, { wrongTime: 0 });
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

  public async getWrongTime(email: string): Promise<number> {
    const res = await this.connection.manager.findOne(Account, { email });
    return res?.wrongTime;
  }
}
