import React, { ReactNode, RefObject } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { UserModel } from "../../../model/user.model";
import { confirmPasswordField, emailField, newPasswordField, oldPasswordField, usernameField } from "../../../../utils/apiField";
import { Button, Form, FormInstance, Input, message, Tabs } from "antd";
import {
  ChangePassword,
  ConfirmPasswordText,
  NewPasswordText,
  noConfirmPassword,
  noNewPassword,
  noOldPassword,
  noUsername,
  OldPasswordText,
  PasswordAreNotSame,
  PasswordNotChange,
  SaveText,
  SuccessCode,
  UserCenterText,
  UsernameEmailSame,
  UsernameText,
} from "../../../../utils/constUtils";
import { PasswordModel } from "../../../model/password.model";
import { EmailModel } from "../../../model/email.model";
import Email from "../../../components/Email";
import { ChangeUserInterface } from "../../../../utils/common.interface";
const { TabPane } = Tabs;
@ReactController()
export default class UserCenter extends BaseReactController {
  @Inject()
  userModel: UserModel;

  @Inject()
  passwordModel: PasswordModel;

  @Inject()
  emailModel: EmailModel;

  formRef: RefObject<FormInstance> = React.createRef();

  formPasswordRef: RefObject<FormInstance> = React.createRef();

  async componentDidMount(): Promise<void> {
    const { user } = this.userModel.state;
    console.log("userCenter:", user);
    // if (!user) {
    //   await this.userModel.getUser();
    // }
    // this.formRef.current.setFieldsValue({
    //   username: this.userModel.state.user?.username,
    //   email: this.userModel.state.user?.email,
    // });
  }

  onFinish = async (values: ChangeUserInterface) => {
    const email = values[emailField];
    const username = values[usernameField];
    const { email: oldEmail, username: oldUsername } = this.userModel.state.user;
    if (username === oldUsername && email === oldEmail) {
      message.error(UsernameEmailSame);
    } else {
      if (username === oldUsername) {
        values[usernameField] = undefined;
      }
      if (email === oldEmail) {
        values[emailField] = undefined;
      }
      await this.userModel.updateUserMessage(values);
    }
  };

  changePassword = async (values) => {
    if (values[newPasswordField] === values[oldPasswordField]) {
      message.error(PasswordNotChange);
    } else {
      const res = await this.passwordModel.changePassword(values);
      if (res.code === SuccessCode) {
        message.success(res.message);
        setTimeout(async () => {
          this.props.navigate("/login");
        }, 1000);
      } else {
        message.error(res.message);
      }
    }
  };

  renderView(): ReactNode {
    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab={UserCenterText} key="1">
          <Form ref={this.formRef} name="change" autoComplete="off" onFinish={this.onFinish}>
            <Email type="change" style={{ width: 400 }} formRef={this.formRef} />
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
