import React, { ReactNode, RefObject } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { AuthModel } from "../../../model/auth.model";
import { UserModel } from "../../../model/user.model";
import { emailField, usernameField } from "../../../../utils/apiField";
import { Button, Form, FormInstance, Input, message } from "antd";
import { EmailText, UsernameSame, UsernameText } from "../../../../utils/constUtils";

@ReactController()
export default class AccountController extends BaseReactController {
  @Inject()
  authModel: AuthModel;

  @Inject()
  userModel: UserModel;

  formRef: RefObject<FormInstance> = React.createRef();

  async componentDidMount(): Promise<void> {
    await this.authModel.checkToken();
    await this.userModel.getUserByToken();
    this.formRef.current.setFieldsValue({
      username: this.userModel.state.user?.username,
    });
  }

  updateUsername = () => {
    const username = this.formRef.current.getFieldValue(usernameField);
    if (username !== this.state.user[usernameField]) {
      this.userModel.updateUsername(username);
    } else {
      message.error(UsernameSame);
    }
  };

  renderView(): ReactNode {
    const { user } = this.userModel.state;
    return (
      <Form ref={this.formRef} name="changeUser" autoComplete="off">
        <Form.Item label={EmailText} name={emailField}>
          <span>
            {user && user[emailField]} <Button>修改邮箱</Button>
          </span>
        </Form.Item>
        <Form.Item label={UsernameText} name={usernameField}>
          <Input />
        </Form.Item>
        <Button onClick={this.updateUsername}>修改用户名</Button>
        <Button type="primary">修改密码</Button>
      </Form>
    );
  }
}
