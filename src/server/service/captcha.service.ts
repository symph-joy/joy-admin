import { Component, IComponentLifecycle } from "@symph/core";
import svgCaptcha from "svg-captcha";
import { Captcha, CaptchaImg, CaptchaInterface, SendCodeReturn } from "../../utils/common.interface";
import { v1 as uuidv1 } from "uuid";
import { DBService } from "./db.service";
import { CaptchaDB } from "../../utils/entity/CaptchaDB";
import { captchaField, captchaIdField } from "../../utils/apiField";
import { CaptchaRight, CaptchaWrong, NotExistCaptcha, NotExistCode, SuccessCode, WrongCode } from "../../utils/constUtils";

@Component()
export class CaptchaService implements IComponentLifecycle {
  constructor(private dbService: DBService) {}

  public connection = this.dbService.connection;

  initialize() {}

  // 获取验证码
  public async getCaptchaImg(): Promise<CaptchaImg> {
    const captcha = svgCaptcha.create({
      inverse: false, // 翻转颜色
      fontSize: 48, // 字体大小
      noise: 2, // 噪声线条数
      size: 4, // 验证码长度
      ignoreChars: "0o1i", // 验证码字符中排除 0o1i
    });
    const captchaId = uuidv1();
    const captchaDb = new CaptchaDB();
    captchaDb.captcha = captcha.text.toLowerCase();
    captchaDb.captchaId = captchaId;
    const date = new Date();
    const min = date.getMinutes();
    date.setMinutes(min + 5);
    captchaDb.expiration = date.getTime();
    await this.connection.manager.save(captchaDb);
    return {
      captchaImg: captcha.data,
      captchaId,
    };
  }

  public async getCaptcha(captchaId: string): Promise<CaptchaInterface> {
    return await this.connection.manager.findOne(CaptchaDB, { captchaId });
  }

  public deleteCaptcha(captchaDB: CaptchaInterface) {
    this.connection.manager.delete(CaptchaDB, captchaDB);
  }

  public async checkCaptcha(values: Captcha): Promise<SendCodeReturn> {
    const captchaInput = values[captchaField];
    const captchaId = values[captchaIdField];
    const captchaDB = await this.getCaptcha(captchaId);
    if (!captchaDB) {
      return {
        message: NotExistCaptcha,
        code: NotExistCode,
      };
    }
    const date = new Date().getTime();
    if (captchaDB.expiration < date) {
      this.deleteCaptcha(captchaDB);
      return {
        code: WrongCode,
        message: NotExistCaptcha,
      };
    }
    if (captchaDB.captcha !== captchaInput.toLowerCase()) {
      return {
        message: CaptchaWrong,
        code: WrongCode,
      };
    }
    this.deleteCaptcha(captchaDB);
    return {
      message: CaptchaRight,
      code: SuccessCode,
    };
  }
}
