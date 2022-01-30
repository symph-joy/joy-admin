import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Link } from "@symph/react/router-dom";

@ReactController()
export default class LoginController extends BaseReactController {
  renderView(): ReactNode {
    return (
      <>
        <h1>登录</h1>
        <Link to={"/register"}>注册</Link>
      </>
    );
  }
}
