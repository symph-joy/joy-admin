import { Component, IComponentLifecycle } from "@symph/core";
import { Value } from "@symph/config";
import nodemailer from "nodemailer";
import type { ReturnInterface, EmailOption, MailOptions } from "../../utils/common.interface";
import {
  EmailCodeText,
  SendSuccess,
  NotExistEmailCode,
  NotExistCode,
  EmailCodeWrong,
  SuccessCode,
  WrongCode,
  EmailCodeRight,
  ExpiredEmailCode,
  SendFail,
} from "../../utils/constUtils";
import { UserDB } from "../../utils/entity/UserDB";
import { EmailCodeDB } from "../../utils/entity/EmailCodeDB";
import svgCaptcha from "svg-captcha";
import { DBService } from "./db.service";
@Component()
export class EmailService implements IComponentLifecycle {
  @Value({ configKey: "emailOptions" })
  public configEmailOptions: EmailOption;

  @Value({ configKey: "mailTitle" })
  public mailTitle: string;

  constructor(private dbService: DBService) {}

  public connection = this.dbService.connection;

  initialize() {}

  // 邮箱是否存在
  public async checkIsExistEmail(email: string): Promise<boolean> {
    // 两个服务互相调用，所以这里无法用user服务的方法
    const res = await this.connection.manager.findOne(UserDB, { email });
    return res ? true : false;
  }

  // 向邮箱发送激活码
  public async sendEmailCode(email: string): Promise<ReturnInterface<null>> {
    const emailCode = this.generateEmailCode();
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
  private sendEmail(transporter, mailOptions: MailOptions, email: string, emailCode: string): Promise<ReturnInterface<null>> {
    return new Promise(async (resolve, reject) => {
      transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
          console.log(err);
          reject({ message: SendFail, code: WrongCode });
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
  private generateEmailCode(): string {
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
    // 先将数据库中关于该email的其它删除
    await this.deleteEmailCode(email);
    await this.addEmailCode(email, emailCode);
  }

  // 验证邮箱和激活码是否匹配，包括过期时间
  public async checkEmailCodeIsRight(email: string, emailCode: string): Promise<ReturnInterface<null>> {
    const emailCodeDB = await this.getEmailCode(email);
    if (!emailCodeDB) {
      return {
        code: NotExistCode,
        message: NotExistEmailCode,
      };
    }
    const date = new Date();
    const expiration = new Date(date.getMinutes() - 5);
    if (emailCodeDB.createdDate < expiration) {
      this.deleteEmailCode(emailCodeDB.email);
      return {
        code: WrongCode,
        message: ExpiredEmailCode,
      };
    }
    if (emailCodeDB?.emailCode === emailCode.toLowerCase()) {
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

  private async addEmailCode(email: string, emailCode: string): Promise<void> {
    const emailCodeDB = new EmailCodeDB();
    emailCodeDB.email = email;
    emailCodeDB.emailCode = emailCode;
    await this.connection.manager.save(emailCodeDB);
  }

  public async deleteEmailCode(email: string): Promise<void> {
    await this.connection.manager.delete(EmailCodeDB, { email });
  }

  private async getEmailCode(email: string): Promise<EmailCodeDB> {
    return await this.connection.manager.findOne(EmailCodeDB, { email });
  }
}
