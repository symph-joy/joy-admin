import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { RoleDB } from "../../utils/entity/RoleDB";
@ReactModel()
export class RoleModel extends BaseReactModel<{
  roles: RoleDB[];
}> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService) {
    super();
  }

  getInitState() {
    return {
      roles: [],
    };
  }

  async getRoles(): Promise<void> {
    const resp = await this.joyFetchService.fetchApi("/getRoles");
    const respJson = await resp.json();
    this.setState({
      roles: respJson.data?.data,
    });
  }
}
