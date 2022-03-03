import { Component, IComponentLifecycle } from "@symph/core";
import svgCaptcha from "svg-captcha";
import { Captcha, CaptchaImg, SendCodeReturn } from "../../client/utils/common.interface";
import { v1 as uuidv1 } from "uuid";
import { getConnection } from "typeorm";
import { CaptchaDB } from "../../client/utils/entity/CaptchaDB";
import { captchaField, captchaIdField } from "../../client/utils/apiField";
import { CaptchaRight, CaptchaWrong, NotExistCaptcha, NotExistCode, SuccessCode, WrongCode } from "../../client/utils/constUtils";

@Component()
export class CaptchaService implements IComponentLifecycle {
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
    await getConnection().manager.save(captchaDb);
    return {
      captchaImg: captcha.data,
      captchaId,
    };
  }

  public async checkCaptcha(values: Captcha): Promise<SendCodeReturn> {
    const captchaInput = values[captchaField];
    const captchaId = values[captchaIdField];
    const captchaDB = await getConnection().manager.findOne(CaptchaDB, { captchaId });
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
    getConnection().manager.delete(CaptchaDB, captchaDB);
    return {
      message: CaptchaRight,
      code: SuccessCode,
    };
  }
}
