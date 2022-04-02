import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { SuccessCode } from "../../utils/constUtils";
import { message } from "antd";
import { UserDB } from "../../utils/entity/UserDB";
import { ChangeUserInterface, ReturnInterface, UserByAdminInterface } from "../../utils/common.interface";

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

  async getUser(): Promise<void> {
    const resp = await this.joyFetchService.fetchApi("/getUser");
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

  async getAllUser(): Promise<ReturnInterface<UserDB[]>> {
    const resp = await this.joyFetchService.fetchApi("/getAllUser");
    const respJson = await resp.json();
    return respJson.data;
  }

  async updateUserMessage(values: ChangeUserInterface): Promise<ReturnInterface<null>> {
    const resp = await this.joyFetchService.fetchApi("/updateUserMessage", {
      method: "POST",
      body: JSON.stringify({
        userId: this.state.user?._id,
        ...values,
      }),
    });
    const respJson = await resp.json();
    return respJson.data;
  }

  async checkIsExistUsername(value: string): Promise<boolean> {
    const resp = await this.joyFetchService.fetchApi(`/checkIsExistUsername?value=${value}`);
    const respJson = await resp.json();
    return respJson.data;
  }

  async addUserByAdmin(values: UserByAdminInterface): Promise<ReturnInterface<null>> {
    const resp = await this.joyFetchService.fetchApi("/addUserByAdmin", { method: "POST", body: JSON.stringify(values) });
    const respJson = await resp.json();
    return respJson.data;
  }

  async editUserByAdmin(values: UserByAdminInterface): Promise<ReturnInterface<null>> {
    const resp = await this.joyFetchService.fetchApi("/editUserByAdmin", { method: "POST", body: JSON.stringify(values) });
    const respJson = await resp.json();
    return respJson.data;
  }
}
