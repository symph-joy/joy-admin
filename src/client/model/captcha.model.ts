import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { Captcha } from "../utils/common.interface";

@ReactModel()
export class CaptchaModel extends BaseReactModel<{}> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService) {
    super();
  }

  getInitState() {
    return {};
  }

  async getCaptchaImg() {
    const resp = await this.joyFetchService.fetchApi("/getCaptchaImg");
    const respJson = await resp.json();
    return respJson.data;
  }

  async checkCaptcha(values: Captcha) {
    const resp = await this.joyFetchService.fetchApi("/checkCaptcha", { method: "POST", body: JSON.stringify(values) });
    const respJson = await resp.json();
    return respJson.data;
  }
}
