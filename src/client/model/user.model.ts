import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";

@ReactModel()
export class UserModel extends BaseReactModel<{}> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService) {
    super();
  }

  getInitState() {
    return {};
  }

  async getUser(token: string) {
    const resp = await this.joyFetchService.fetchApi("/getUser?token=" + token);
    const respJson = await resp.json();
    return respJson.data;
  }
}
