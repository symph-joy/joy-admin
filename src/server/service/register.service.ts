import { Component, IComponentLifecycle } from "@symph/core";
import { Value } from "@symph/config";
import nodemailer from "nodemailer";
import { SendCodeReturn } from "../../common/register";

const code163 = "LLJVFVIPOVJOVLIH";

@Component()
export class RegisterService implements IComponentLifecycle {
  @Value({ configKey: "emailOptions" })
  public configEmailOptions: object;

  initialize() {}

  public checkIsExistEmail(email: string): boolean {
    const allEmails = this.getAllEmail();
    return allEmails.includes(email);
  }

  private getAllEmail(): Array<string> {
    // 数据库拿所有Email数据
    return [];
  }

  public async sendEmailCode(email: string): Promise<SendCodeReturn> {
    console.log(this.configEmailOptions);

    const emailCode = this.getEmailCodeFromDB();
    var transporter = nodemailer.createTransport({
      host: "smtp.163.com",
      secure: true,
      auth: {
        user: "symph_joy@163.com",
        pass: code163,
      },
    });
    var mailOptions = {
      from: "symph_joy@163.com", // 发送者
      to: email, // 接受者,可以同时发送多个,以逗号隔开
      subject: "@sympy/joy-admin注册用户激活码", // 标题
      html: `<h1>@sympy/joy-admin注册用户激活码</h1><h3>激活码${emailCode}</h3>`,
    };
    try {
      return await this.sendEmail(transporter, mailOptions);
    } catch (error) {
      return error;
    }
  }

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

  private getEmailCodeFromDB(): number {
    // 从数据库中随机取一个code
    return 1234;
  }

  private bindEmailAndEmailCode(email: string, emailCode: number) {
    // 绑定email和emailCode存在数据库中
    // 设置激活码期限
  }
}
