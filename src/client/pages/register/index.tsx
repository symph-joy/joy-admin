import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { RegisterModel } from "../../model/register.model";
import styles from "./index.less";
import { Form, Input, Button, FormInstance, message } from "antd";
import { RegisterUser } from "../../../utils/common.interface";
import { Link } from "@symph/react/router-dom";
import { noPassword, RegisterText, PasswordText, LoginText, Registering, SuccessCode } from "../../../utils/constUtils";
import { RefObject } from "react";
import { registerPasswordField } from "../../../utils/apiField";
import Email from "../../components/Email";

@ReactController()
export default class RegisterController extends BaseReactController {
  @Inject()
  public registerModel: RegisterModel;

  state = {
    registering: false,
  };

  formRef: RefObject<FormInstance> = React.createRef();

  onFinish = async (values: RegisterUser) => {
    this.setState({
      registering: true,
    });
    const res = await this.registerModel.register(values);
    if (res.code === SuccessCode) {
      message.success(res.message);
      setTimeout(() => {
        this.props.navigate("/login");
      }, 1000);
    } else {
      message.error(res.message);
    }
    this.setState({
      registering: false,
    });
  };

  renderView(): ReactNode {
    const { registering } = this.state;
    return (
      <>
        <h1 className={styles.title}>{RegisterText}</h1>
        <Form ref={this.formRef} className={styles.registerForm} name="register" onFinish={this.onFinish} autoComplete="off">
          <Email formRef={this.formRef} />

          <Form.Item label={PasswordText} name={registerPasswordField} rules={[{ required: true, message: noPassword }]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            {registering ? (
              <Button disabled type="dashed">
                {Registering}
              </Button>
            ) : (
              <Button type="primary" htmlType="submit">
                {RegisterText}
              </Button>
            )}

            <Button type="primary">
              <Link to={"/login"}>{LoginText}</Link>
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}
