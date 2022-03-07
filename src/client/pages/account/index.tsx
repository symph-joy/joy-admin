import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { AuthModel } from "../../model/auth.model";

@ReactController()
export default class IndexController extends BaseReactController {
  @Inject()
  authModel: AuthModel;

  async componentDidMount(): Promise<void> {
    await this.authModel.checkToken();
  }
  renderView(): ReactNode {
    return <>个人中心</>;
  }
}
