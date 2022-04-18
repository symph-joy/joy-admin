import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { ReturnInterface, RegisterUser } from "../../utils/common.interface";
import { PasswordModel } from "./password.model";
import { passwordField, registerPasswordField } from "../../utils/apiField";
@ReactModel()
export class RegisterModel extends BaseReactModel<{}> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService, private passwordModel: PasswordModel) {
    super();
  }

  getInitState() {
    return {};
  }

  async register(values: RegisterUser): Promise<ReturnInterface<null>> {
    values[passwordField] = this.passwordModel.encryptByMD5(values[registerPasswordField]);
    values[registerPasswordField] = undefined;
    const resp = await this.joyFetchService.fetchApi("/register", { method: "POST", body: JSON.stringify(values) });
    const respJson = await resp.json();
    return respJson.data;
  }
}
