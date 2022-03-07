import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { LoginUser } from "../../utils/login.interface";
import { PasswordModel } from "./password.model";
import { SendCodeReturn } from "../../utils/common.interface";
@ReactModel()
export class LoginModel extends BaseReactModel<{}> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService, private passwordModel: PasswordModel) {
    super();
  }

  getInitState() {
    return {};
  }

  async login(values: LoginUser, hasEncrypt: boolean): Promise<SendCodeReturn> {
    values = (await this.passwordModel.encrypt(values, hasEncrypt)) as LoginUser;
    const resp = await this.joyFetchService.fetchApi("/login", { method: "POST", body: JSON.stringify(values) });
    const respJson = await resp.json();
    return respJson.data;
  }

  async getWrongTime(email: string): Promise<number> {
    const resp = await this.joyFetchService.fetchApi("/getWrongTime?email=" + email);
    const respJson = await resp.json();
    return respJson.data;
  }
}
