import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import crypto from "crypto";
import { confirmPasswordField, newPasswordField, oldPasswordField } from "../../utils/apiField";
import { UserModel } from "./user.model";
import { ChangePasswordInterface, ReturnInterface } from "../../utils/common.interface";

@ReactModel()
export class PasswordModel extends BaseReactModel<{}> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService, private userModel: UserModel) {
    super();
  }

  getInitState() {
    return {};
  }

  encryptByMD5(password: string): string {
    const res = crypto.createHash("md5").update(password).digest("hex");
    return res;
  }

  async changePassword(values: ChangePasswordInterface): Promise<ReturnInterface<null>> {
    values[newPasswordField] = this.encryptByMD5(values[newPasswordField]);
    values[oldPasswordField] = this.encryptByMD5(values[oldPasswordField]);
    values.userId = this.userModel.state.user._id;
    values[confirmPasswordField] = null;
    const resp = await this.joyFetchService.fetchApi("/changePassword", { method: "POST", body: JSON.stringify(values) });
    const respJson = await resp.json();
    return respJson.data;
  }
}
