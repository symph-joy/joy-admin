import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { ReturnInterface } from "../../utils/common.interface";
import { PasswordModel } from "./password.model";
@ReactModel()
export class EmailModel extends BaseReactModel<{}> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService, private passwordModel: PasswordModel) {
    super();
  }

  getInitState() {
    return {};
  }

  async checkIsExistEmail(value: string): Promise<boolean> {
    const resp = await this.joyFetchService.fetchApi(`/checkIsExistEmail?value=${value}`);
    const respJson = await resp.json();
    return respJson.data;
  }

  async sendEmailCode(email: string): Promise<ReturnInterface<null>> {
    const resp = await this.joyFetchService.fetchApi("/sendEmailCode?email=" + email);
    const respJson = await resp.json();
    return respJson.data;
  }
}
