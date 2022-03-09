import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { Button } from "antd";
import { Link } from "@symph/react/router-dom";
import { AuthModel } from "../../model/auth.model";

@ReactController()
export default class IndexController extends BaseReactController {
  renderView(): ReactNode {
    return <>首页</>;
  }
}
