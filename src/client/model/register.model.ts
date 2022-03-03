import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { RegisterModelState, RegisterUser } from "../utils/register.interface";
import { SendCodeReturn } from "../utils/common.interface";
import { PasswordModel } from "./password.model";
@ReactModel()
export class RegisterModel extends BaseReactModel<RegisterModelState> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService, private passwordModel: PasswordModel) {
    super();
  }

  getInitState(): RegisterModelState {
    return {};
  }

  async checkIsExistEmail(value: string): Promise<boolean> {
    const resp = await this.joyFetchService.fetchApi(`/checkIsExistEmail?value=${value}`);
    const respJson = await resp.json();
    return respJson.data;
  }

  async sendEmailCode(email: string): Promise<SendCodeReturn> {
    const resp = await this.joyFetchService.fetchApi("/sendEmailCode?email=" + email);
    const respJson = await resp.json();
    return respJson.data;
  }

  async registerUser(values: RegisterUser): Promise<SendCodeReturn> {
    values = (await this.passwordModel.encrypt(values, false)) as RegisterUser;
    const resp = await this.joyFetchService.fetchApi("/registerUser", { method: "POST", body: JSON.stringify(values) });
    const respJson = await resp.json();
    return respJson.data;
  }
}
