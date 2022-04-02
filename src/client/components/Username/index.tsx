import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { Form, Input } from "antd";
import { UsernameText, noUsername, UsernameExist } from "../../../utils/constUtils";
import { usernameField } from "../../../utils/apiField";
import { UserModel } from "../../model/user.model";

@ReactController()
export default class Username extends BaseReactController {
  @Inject()
  userModel: UserModel;

  renderView(): ReactNode {
    const { style, username } = this.props;
    const rules = [
      { required: true, message: noUsername, validateTrigger: "onChange" },
      () => ({
        required: true,
        validateTrigger: "onBlur",
        validator: async (_, value: string) => {
          if (value) {
            const result = await this.userModel.checkIsExistUsername(value);
            if (!result) {
              return Promise.resolve();
            } else {
              return Promise.reject(new Error(UsernameExist));
            }
          } else {
            return Promise.reject(new Error(noUsername));
          }
        },
      }),
    ];

    return (
      <Form.Item
        initialValue={username || undefined}
        style={style}
        label={UsernameText}
        name={usernameField}
        validateTrigger={["onBlur", "onChange"]}
        rules={rules}
      >
        <Input autoComplete="off" />
      </Form.Item>
    );
  }
}
