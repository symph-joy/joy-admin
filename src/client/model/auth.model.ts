import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { SuccessCode, WrongToken } from "../../utils/constUtils";
import { UserModel } from "./user.model";
import { message } from "antd";
@ReactModel()
export class AuthModel extends BaseReactModel<{}> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService, private userModel: UserModel) {
    super();
  }

  getInitState() {
    return {};
  }

  async checkToken(): Promise<void> {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await this.userModel.getUser(token);
      console.log("res:", res);

      if (res.code !== SuccessCode) {
        message.error(res.message);
        localStorage.removeItem("token");
        setTimeout(() => {
          //   this.props.navigate("/login");
        }, 1000);
      }
    } else {
      message.error(WrongToken);
      setTimeout(() => {
        // this.props.navigate("/login");
      }, 1000);
    }
  }
}
