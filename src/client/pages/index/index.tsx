import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { UserModel } from "../../model/user.model";
import { Inject } from "@symph/core";
import { SuccessCode, WrongToken } from "../../utils/constUtils";
import { message } from "antd";

@ReactController()
export default class IndexController extends BaseReactController {
  @Inject()
  userModel: UserModel;

  async componentDidMount(): Promise<void> {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await this.userModel.getUser(token);
      if (res.code !== SuccessCode) {
        message.error(res.message);
        localStorage.removeItem("token");
        setTimeout(() => {
          this.props.navigate("/login");
        }, 1000);
      }
    } else {
      message.error(WrongToken);
      setTimeout(() => {
        this.props.navigate("/login");
      }, 1000);
    }
  }
  renderView(): ReactNode {
    return <>首页</>;
  }
}