import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { RegisterModelState, RegisterUser } from "../../utils/register.interface";
import { SendCodeReturn } from "../../utils/common.interface";
import { PasswordModel } from "./password.model";
import { passwordField } from "../../utils/apiField";
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

  async register(values: RegisterUser): Promise<SendCodeReturn> {
    values[passwordField] = this.passwordModel.encryptByMD5(values[passwordField]);
    const resp = await this.joyFetchService.fetchApi("/register", { method: "POST", body: JSON.stringify(values) });
    const respJson = await resp.json();
    return respJson.data;
  }
}
