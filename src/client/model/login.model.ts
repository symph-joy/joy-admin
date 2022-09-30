import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { PasswordModel } from "./password.model";
import { ReturnInterface, LoginUser } from "../../utils/common.interface";
import { passwordField } from "../../utils/apiField";
import { UserModel } from "./user.model";
import { SuccessCode } from "../../utils/constUtils";
@ReactModel()
export class LoginModel extends BaseReactModel<{}> {
  constructor(
    @Inject("joyFetchService") private joyFetchService: ReactFetchService,
    private passwordModel: PasswordModel,
    private userModel: UserModel
  ) {
    super();
  }

  getInitState() {
    return {};
  }

  async checkToken() {
    const resp = await this.joyFetchService.fetchApi("/checkToken");
    const respJson = await resp.json();
    return respJson;
  }

  async login(values: LoginUser): Promise<ReturnInterface<string | number>> {
    values[passwordField] = this.passwordModel.encryptByMD5(values[passwordField]);
    const resp = await this.joyFetchService.fetchApi("/login", { method: "POST", body: JSON.stringify(values) });
    const respJson = await resp.json();
    return respJson.data;
  }

  async logout(): Promise<ReturnInterface<undefined>> {
    const resp = await this.joyFetchService.fetchApi("/logout", { method: "POST" });
    const respJson = await resp.json();
    return respJson.data;
  }

  async getWrongTime(email: string): Promise<ReturnInterface<number>> {
    const resp = await this.joyFetchService.fetchApi("/getWrongTime?email=" + email);
    const respJson = await resp.json();
    return respJson.data;
  }
}
