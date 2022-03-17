import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Modal as AntdModal } from "antd";
import { cancelText, okText } from "../../../utils/constUtils";

@ReactController()
export default class Modal extends BaseReactController {
  renderView(): ReactNode {
    return (
      <AntdModal cancelText={cancelText} okText={okText} {...this.props}>
        {this.props.children}
      </AntdModal>
    );
  }
}
