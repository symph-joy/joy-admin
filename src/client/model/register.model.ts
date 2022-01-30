import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { RegisterModelState } from "../../common/register";
@ReactModel()
export class RegisterModel extends BaseReactModel<RegisterModelState> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService) {
    super();
  }

  getInitState(): RegisterModelState {
    return { email: "" };
  }

  async checkIsExistEmail(email: string): Promise<boolean> {
    const resp = await this.joyFetchService.fetchApi("/checkIsExistEmail?email=" + email);
    const respJson = await resp.json();
    console.log(respJson);

    return respJson.data;
  }

  async sendEmailCode(email: string) {
    const resp = await this.joyFetchService.fetchApi("/sendEmailCode?email=" + email);
    const respJson = await resp.json();
    console.log(respJson);
  }
}
