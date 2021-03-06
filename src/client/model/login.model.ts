import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { PasswordModel } from "./password.model";
import { ReturnInterface, LoginUser } from "../../utils/common.interface";
import { passwordField } from "../../utils/apiField";
@ReactModel()
export class LoginModel extends BaseReactModel<{}> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService, private passwordModel: PasswordModel) {
    super();
  }

  getInitState() {
    return {};
  }

  async login(values: LoginUser): Promise<ReturnInterface<string | number>> {
    values[passwordField] = this.passwordModel.encryptByMD5(values[passwordField]);
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
