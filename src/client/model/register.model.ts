import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { RegisterModelState, SendCodeReturn, RegisterUser } from "../../common/register";
@ReactModel()
export class RegisterModel extends BaseReactModel<RegisterModelState> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService) {
    super();
  }

  getInitState(): RegisterModelState {
    return {};
  }

  async checkIsExistEmail(email: string): Promise<boolean> {
    const resp = await this.joyFetchService.fetchApi("/checkIsExistEmail?email=" + email);
    const respJson = await resp.json();
    return respJson.data;
  }

  async sendEmailCode(email: string): Promise<SendCodeReturn> {
    const resp = await this.joyFetchService.fetchApi("/sendEmailCode?email=" + email);
    const respJson = await resp.json();
    return respJson.data;
  }

  async registerUser(values: RegisterUser) {
    const resp = await this.joyFetchService.fetchApi("/registerUser", { method: "POST", body: JSON.stringify(values) });
    const respJson = await resp.json();
    return respJson.data;
  }
}
