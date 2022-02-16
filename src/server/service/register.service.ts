import { Component, IComponentLifecycle } from "@symph/core";
import { Value } from "@symph/config";
import nodemailer from "nodemailer";
import { SendCodeReturn, EmailOption, RegisterUser } from "../../common/register";
@Component()
export class RegisterService implements IComponentLifecycle {
  @Value({ configKey: "emailOptions" })
  public configEmailOptions: EmailOption;

  @Value({ configKey: "mailTitle" })
  public mailTitle: string;

  initialize() {}

  // 检查是否存在该邮箱
  public checkIsExistEmail(email: string): boolean {
    const allEmails = this.getAllEmail();
    return allEmails.includes(email);
  }

  // 获取数据库中所有邮箱；未完成
  private getAllEmail(): Array<string> {
    // 数据库拿所有Email数据
    return ['wangyi11860@163.com'];
  }

  // 向邮箱发送验证码
  public async sendEmailCode(email: string): Promise<SendCodeReturn> {
    const emailCode = this.getEmailCodeFromDB();
    const transporter = nodemailer.createTransport(this.configEmailOptions);
    const mailOptions = {
      from: this.configEmailOptions.auth.user, // 发送者
      to: email, // 接受者,可以同时发送多个,以逗号隔开
      subject: this.mailTitle, // 标题
      html: `<h1>${this.mailTitle}</h1><h3>激活码${emailCode}</h3>`,
    };
    try {
      return await this.sendEmail(transporter, mailOptions);
    } catch (error) {
      return error;
    }
  }

  // 发送邮件
  private sendEmail(transporter, mailOptions): Promise<SendCodeReturn> {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          reject({ message: "发送失败", data: false });
        } else {
          console.log("senEmailSuccess:", info);
          resolve({ message: "发送成功", data: true });
        }
      });
    });
  }

  // 从数据库随机获取验证码；未完成
  private getEmailCodeFromDB(): number {
    // 从数据库中随机取一个code
    return 1234;
  }

  // 在数据库中将邮箱和验证码进行绑定；未完成
  private bindEmailAndEmailCode(email: string, emailCode: number) {
    // 绑定email和emailCode存在数据库中
    // 设置激活码期限
  }

  // 在数据库中解除邮箱和验证码绑定
  private unbindEmailAndEmailCode(email: string, emailCode: number) {
    // 解除绑定email和emailCode存在数据库中
  }

  // 注册用户
  public registerUser(values: RegisterUser) {
    const { username, password, email, emailCode } = values;
    if (this.checkIsExistEmail(email)) {
      return {
        message: "该邮箱已注册",
        code: 10001,
      };
    }
    if (!this.checkEmailCodeIsRight) {
      return {
        message: "验证码错误",
        code: 10002,
      };
    }
    // 存一个user数据
    // db.users.insert({username, password, email })
    return {
      message: "注册成功",
      code: 10000,
    };
  }

  // 验证邮箱和验证码是否匹配；未完成
  private checkEmailCodeIsRight(email: string, emailCode: string): boolean {
    return true;
  }
}
