import React, { ReactNode, RefObject } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { AuthModel } from "../../../model/auth.model";
import { UserModel } from "../../../model/user.model";
import { confirmPasswordField, emailField, newPasswordField, oldPasswordField, usernameField } from "../../../../utils/apiField";
import { Button, Form, FormInstance, Input, message, Tabs } from "antd";
import {
  ChangeEmail,
  ChangePassword,
  ConfirmPasswordText,
  EmailText,
  NewPasswordText,
  noConfirmPassword,
  noNewPassword,
  noOldPassword,
  noUsername,
  OldPasswordText,
  PasswordAreNotSame,
  SaveText,
  SuccessCode,
  UserCenterText,
  UsernameSame,
  UsernameText,
} from "../../../../utils/constUtils";
import { PasswordModel } from "../../../model/password.model";
import { ReturnInterface } from "../../../../utils/common.interface";
const { TabPane } = Tabs;
@ReactController()
export default class AccountController extends BaseReactController {
  @Inject()
  authModel: AuthModel;

  @Inject()
  userModel: UserModel;

  @Inject()
  passwordModel: PasswordModel;

  formRef: RefObject<FormInstance> = React.createRef();

  formPasswordRef: RefObject<FormInstance> = React.createRef();

  state = {
    validateStatus: "success",
  };

  async componentDidMount(): Promise<void> {
    await this.authModel.checkToken();
    const { user } = this.userModel.state;
    if (!user) {
      await this.userModel.getUserByToken();
    }
    this.formRef.current.setFieldsValue({
      username: this.userModel.state.user?.username,
    });
  }

  changeUsername = (values: { username: string }) => {
    const username = values[usernameField];
    if (username !== this.userModel.state.user[usernameField]) {
      this.userModel.updateUsername(username);
    } else {
      message.error(UsernameSame);
    }
  };

  changePassword = async (values) => {
    const res = await this.passwordModel.changePassword(values);

    if (res.code === SuccessCode) {
      // 刷新页面
      message.success(res.message);
    } else {
      message.error(res.message);
    }
  };

  renderView(): ReactNode {
    const { user } = this.userModel.state;
    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab={UserCenterText} key="1">
          <Form ref={this.formRef} name="changeUsername" autoComplete="off" onFinish={this.changeUsername}>
            <Form.Item label={EmailText}>
              <span>
                {user && user[emailField]} <Button>{ChangeEmail}</Button>
              </span>
            </Form.Item>
            <Form.Item rules={[{ required: true, message: noUsername }]} style={{ width: 400 }} label={UsernameText} name={usernameField}>
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              {SaveText}
            </Button>
          </Form>
        </TabPane>
        <TabPane tab={ChangePassword} key="2">
          <Form ref={this.formPasswordRef} name="changePassword" onFinish={this.changePassword} autoComplete="off">
            <Form.Item style={{ width: 400 }} rules={[{ required: true, message: noOldPassword }]} label={OldPasswordText} name={oldPasswordField}>
              <Input.Password />
            </Form.Item>
            <Form.Item style={{ width: 400 }} rules={[{ required: true, message: noNewPassword }]} label={NewPasswordText} name={newPasswordField}>
              <Input.Password />
            </Form.Item>
            <Form.Item
              style={{ width: 400 }}
              label={ConfirmPasswordText}
              name={confirmPasswordField}
              validateTrigger={["onBlur", "onChange"]}
              dependencies={[newPasswordField]}
              rules={[
                { required: true, message: noConfirmPassword, validateTrigger: "onChange" },
                ({ getFieldValue }) => ({
                  required: true,
                  validateTrigger: "onBlur",
                  validator: async (_, value) => {
                    if (value) {
                      const newPassword = getFieldValue(newPasswordField);
                      if (value !== newPassword) {
                        return Promise.reject(new Error(PasswordAreNotSame));
                      }
                    } else {
                      return Promise.reject(new Error(noConfirmPassword));
                    }
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              {SaveText}
            </Button>
          </Form>
        </TabPane>
      </Tabs>
    );
  }
}
