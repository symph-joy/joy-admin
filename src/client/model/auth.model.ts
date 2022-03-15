import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { SuccessCode } from "../../utils/constUtils";
import { message } from "antd";

@ReactModel()
export class AuthModel extends BaseReactModel<{}> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService) {
    super();
  }

  getInitState() {
    return {};
  }

  async checkToken() {
    const resp = await this.joyFetchService.fetchApi("/checkToken");
    const respJson = await resp.json();
    const res = await respJson.data;
    if (res.code === SuccessCode) {
      console.log(location);

      if (location.pathname !== "/menu") {
        // location.href = "/menu";
      }
    } else {
      if (location.pathname !== "/login") {
        message.error(res.message);
        setTimeout(() => {
          location.href = "/login";
        }, 1000);
      }
    }
  }
}
