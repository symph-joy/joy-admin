import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Link } from "@symph/react/router-dom";
import styles from "./index.less";
import { Form, Input, Button, FormInstance, message } from "antd";
import { RefObject } from "react";
import { noUsername, noPassword, noEmail, EmailErrorMessage, EmailExistMessage } from "../../utils/constUtils";

@ReactController()
export default class LoginController extends BaseReactController {
  formRef: RefObject<FormInstance> = React.createRef();

  onFinish = (values) => {
    console.log(values);
  };

  renderView(): ReactNode {
    return (
      <>
        <h1 className={styles.title}>登录</h1>
        <Form ref={this.formRef} className={styles.loginForm} name="login" onFinish={this.onFinish} autoComplete="off">
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: noUsername }]}>
            <Input placeholder="请输入用户名或者邮箱" />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={[{ required: true, message: noPassword }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item label="验证码" name="identifyingCode" rules={[{ required: true, message: noPassword }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
            <Button type="primary">
              <Link to={"/register"}>注册</Link>
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}
