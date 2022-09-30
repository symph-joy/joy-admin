import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { UserDB } from "../../utils/entity/UserDB";
import { ChangeUserInterface, ReturnInterface, UserByAdminInterface } from "../../utils/common.interface";
import { SuccessCode } from "../../utils/constUtils";
import { message } from "antd";

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
      // login页跳到menu
      if (document.location.pathname === "/login") {
        setTimeout(() => {
          location.href = "/menu";
        }, 1000);
      }
    } else {
      // 非login页跳到login
      if (document.location.pathname !== "/login") {
        message.error(res.message);
        setTimeout(() => {
          location.href = "/login";
        }, 1000);
      }
    }
  }

  async getAllUser(): Promise<ReturnInterface<UserDB[]>> {
    const resp = await this.joyFetchService.fetchApi("/getAllUser");
    const respJson = await resp.json();
    return respJson.data;
  }

  async updateUserMessage(values: ChangeUserInterface): Promise<void> {
    const resp = await this.joyFetchService.fetchApi("/updateUserMessage", {
      method: "POST",
      body: JSON.stringify({
        userId: this.state.user?._id,
        ...values,
      }),
    });
    const respJson = await resp.json();
    const res = respJson.data;
    if (res.code !== SuccessCode) {
      message.error(res.message);
    } else {
      this.setState({
        user: res.data,
      });
      message.success(res.message);
    }
  }

  async checkIsExistUsername(value: string): Promise<boolean> {
    const resp = await this.joyFetchService.fetchApi(`/checkIsExistUsername?value=${value}`);
    const respJson = await resp.json();
    return respJson.data;
  }

  async addUser(values: UserByAdminInterface): Promise<ReturnInterface<null>> {
    const resp = await this.joyFetchService.fetchApi("/addUser", { method: "POST", body: JSON.stringify(values) });
    const respJson = await resp.json();
    return respJson.data;
  }

  async editUserByAdmin(values: UserByAdminInterface): Promise<ReturnInterface<null>> {
    const resp = await this.joyFetchService.fetchApi("/editUserByAdmin", { method: "POST", body: JSON.stringify(values) });
    const respJson = await resp.json();
    return respJson.data;
  }

  async setUser(user: UserDB) {
    this.setState({
      user,
    });
  }
}
