import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { SuccessCode } from "../../utils/constUtils";
import { message } from "antd";
import { UserDB } from "../../utils/entity/UserDB";

@ReactModel()
export class UserModel extends BaseReactModel<{
  user: UserDB;
}> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService) {
    super();
  }

  getInitState() {
    return {
      user: null,
    };
  }

  async getUserByToken() {
    const resp = await this.joyFetchService.fetchApi("/getUserByToken");
    const respJson = await resp.json();
    const res = respJson.data;
    if (res.code === SuccessCode) {
      this.setState({
        user: res.data,
      });
    } else {
      message.error(res.message);
      setTimeout(() => {
        location.href = "/login";
      }, 1000);
    }
  }

  async updateUsername(username: string) {
    const resp = await this.joyFetchService.fetchApi("/updateUsername", {
      method: "POST",
      body: JSON.stringify({
        userId: this.state.user?._id,
        username,
      }),
    });
    const respJson = await resp.json();
    const res = respJson.data;
    if (res.code === SuccessCode) {
      const { user } = this.state;
      user.username = username;
      this.setState({
        user,
      });
      message.success(res.message);
    } else {
      message.error(res.message);
    }
  }
}
