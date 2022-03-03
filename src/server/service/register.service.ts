import { Component, IComponentLifecycle } from "@symph/core";
import { Value } from "@symph/config";
import nodemailer from "nodemailer";
import { EmailOption, RegisterUser, MailOptions } from "../../client/utils/register.interface";
import { SendCodeReturn } from "../../client/utils/common.interface";
import {
  EmailCodeText,
  SendSuccess,
  NotExistEmailCode,
  NotExistCode,
  EmailCodeWrong,
  SuccessCode,
  WrongCode,
  EmailCodeRight,
  RegisterSuccess,
  RegisterFail,
} from "../../client/utils/constUtils";
import { emailCodeField, emailField, passwordField, publicKeyField } from "../../client/utils/apiField";
import { getConnection } from "typeorm";
import { User } from "../../client/utils/entity/UserDB";
import { EmailCodeDB } from "../../client/utils/entity/EmailCodeDB";
import { PasswordDB } from "../../client/utils/entity/PasswordDB";
import { Account } from "../../client/utils/entity/AccountDB";
import svgCaptcha from "svg-captcha";
import bcrypt from "bcryptjs";
import { v1 as uuidv1 } from "uuid";
import { PasswordService } from "./password.service";
@Component()
export class RegisterService implements IComponentLifecycle {
  @Value({ configKey: "emailOptions" })
  public configEmailOptions: EmailOption;

  @Value({ configKey: "mailTitle" })
  public mailTitle: string;

  public connection = getConnection();

  constructor(private passwordService: PasswordService) {}

  initialize() {}

  // 邮箱是否存在
  public async checkIsExistEmail(email: string): Promise<boolean> {
    const res = await this.connection.manager.findOne(User, { email });
    return res ? true : false;
  }

  // 向邮箱发送激活码
  public async sendEmailCode(email: string): Promise<SendCodeReturn> {
    const emailCode = this.getEmailCode();
    const transporter = nodemailer.createTransport(this.configEmailOptions);
    const mailOptions = {
      from: this.configEmailOptions.auth.user, // 发送者
      to: email, // 接受者,可以同时发送多个,以逗号隔开
      subject: this.mailTitle, // 标题
      html: `<h1>${this.mailTitle}</h1><h3>${EmailCodeText}${emailCode}</h3>`,
    };
    try {
      return await this.sendEmail(transporter, mailOptions, email, emailCode);
    } catch (error) {
      return error;
    }
  }

  // 发送邮件
  private sendEmail(transporter, mailOptions: MailOptions, email: string, emailCode: string): Promise<SendCodeReturn> {
    return new Promise(async (resolve, reject) => {
      transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
          console.log(err);
          reject({ message: err.response, code: WrongCode });
        } else {
          // 邮件发送成功再存数据库
          await this.bindEmailAndEmailCode(email, emailCode);
          console.log("senEmailSuccess:", info);
          resolve({ message: SendSuccess, code: SuccessCode });
        }
      });
    });
  }

  // 随机获取激活码
  private getEmailCode(): string {
    const captcha = svgCaptcha.create({
      inverse: false, // 翻转颜色
      fontSize: 48, // 字体大小
      noise: 2, // 噪声线条数
      size: 4, // 验证码长度
      ignoreChars: "0o1i", // 验证码字符中排除 0o1i
    });
    const emailCode = captcha.text.toLowerCase();
    return emailCode;
  }

  // 在数据库中将邮箱和激活码进行绑定
  private async bindEmailAndEmailCode(email: string, emailCode: string): Promise<void> {
    const emailCodeDB = new EmailCodeDB();
    // 先将数据库中关于该email的其它删除
    await this.connection.manager.delete(EmailCodeDB, { email });
    emailCodeDB.email = email;
    emailCodeDB.emailCode = emailCode;
    const date = new Date();
    const min = date.getMinutes();
    date.setMinutes(min + 5);
    emailCodeDB.expiration = date.getTime();
    await this.connection.manager.save(emailCodeDB);
  }

  // 注册用户
  public async registerUser(values: RegisterUser): Promise<SendCodeReturn> {
    const email = values[emailField];
    const emailCode = values[emailCodeField];
    const res = await this.checkEmailCodeIsRight(email, emailCode);
    if (res.code !== SuccessCode) {
      return res;
    }
    // 密钥过期提前判断
    const decryptRes = await this.passwordService.decrypt(values[passwordField], values[publicKeyField]);
    if (decryptRes.code === WrongCode) {
      return decryptRes;
    }
    const username = uuidv1();
    const user = new User();
    user.username = username;
    user.email = email;
    const userRes = await this.connection.manager.save(user);
    if (userRes._id) {
      // 注册成功删除激活码
      this.connection.manager.delete(EmailCodeDB, { email });
      const passwordDB = new PasswordDB();
      const passwordReal = decryptRes.data;
      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(passwordReal, salt);
      passwordDB.password = password;
      passwordDB.userId = userRes._id;
      const account = new Account();
      account.email = email;
      account.username = username;
      account.userId = userRes._id;
      account.wrongTime = 0;
      const res = await Promise.all([this.connection.manager.save(passwordDB), this.connection.manager.save(account)]);
      if (res[0]._id && res[1]._id) {
        return {
          code: SuccessCode,
          message: RegisterSuccess,
        };
      } else {
        return {
          code: WrongCode,
          message: RegisterFail,
        };
      }
    } else {
      return {
        code: WrongCode,
        message: RegisterFail,
      };
    }
  }

  // 验证邮箱和激活码是否匹配
  private async checkEmailCodeIsRight(email: string, emailCode: string): Promise<SendCodeReturn> {
    const res = await this.connection.manager.findOne(EmailCodeDB, { email });
    if (!res) {
      return {
        code: NotExistCode,
        message: NotExistEmailCode,
      };
    }
    if (res?.emailCode === emailCode.toLowerCase()) {
      return {
        code: SuccessCode,
        message: EmailCodeRight,
      };
    } else {
      return {
        code: WrongCode,
        message: EmailCodeWrong,
      };
    }
  }
}
