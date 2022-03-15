import React, { ReactNode, RefObject } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { AuthModel } from "../../../model/auth.model";
import { UserModel } from "../../../model/user.model";

@ReactController()
export default class RoleManager extends BaseReactController {
  renderView(): ReactNode {
    return <>角色管理</>;
  }
}
