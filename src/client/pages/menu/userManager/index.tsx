import React, { ReactNode, RefObject } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { AuthModel } from "../../../model/auth.model";
import { UserModel } from "../../../model/user.model";

@ReactController()
export default class UserManager extends BaseReactController {
  renderView(): ReactNode {
    return <>用户管理</>;
  }
}
