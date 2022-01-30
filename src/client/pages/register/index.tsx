import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { RegisterModel } from "../../model/register.model";
import styles from "./index.less";
import { Form, Input, Button, FormInstance } from "antd";
import { RegisterUser } from "../../../common/register";
import { emailReg } from "../../utils/RegExp";
import { Link } from "@symph/react/router-dom";
import { noUsername, noPassword, noEmail, EmailErrorMessage, EmailExistMessage } from "../../utils/constUtils";
import { RefObject } from "react";

@ReactController()
export default class RegisterController extends BaseReactController {
  @Inject()
  public registerModel: RegisterModel;

  state = {
    IsExistEmail: true,
  };

  formRef: RefObject<FormInstance> = React.createRef();

  onFinish = (values: RegisterUser): void => {
    console.log("Success:", values);
  };

  sendEmailCode = async () => {
    const email = this.formRef.current?.getFieldValue("email");
    await this.registerModel.sendEmailCode(email);
  };

  renderView(): ReactNode {
    return (
      <>
        <h1 className={styles.title}>注册</h1>
        <Form ref={this.formRef} className={styles.registerForm} name="register" onFinish={this.onFinish} autoComplete="off">
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: noUsername }]}>
            <Input />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={[{ required: true, message: noPassword }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              ({ setFieldsValue }) => ({
                required: true,
                validator: async (_, value) => {
                  if (value) {
                    if (emailReg.test(value)) {
                      const result = await this.registerModel.checkIsExistEmail(value);
                      if (!result) {
                        this.setState({
                          IsExistEmail: false,
                        });
                        return Promise.resolve();
                      } else {
                        this.setState({
                          IsExistEmail: true,
                        });
                        setFieldsValue({
                          emailCode: undefined,
                        });
                        return Promise.reject(new Error(EmailExistMessage));
                      }
                    } else {
                      this.setState({
                        IsExistEmail: true,
                      });
                      setFieldsValue({
                        emailCode: undefined,
                      });
                      return Promise.reject(new Error(EmailErrorMessage));
                    }
                  } else {
                    this.setState({
                      IsExistEmail: true,
                    });
                    setFieldsValue({
                      emailCode: undefined,
                    });
                    return Promise.reject(new Error(noEmail));
                  }
                },
              }),
            ]}
          >
            <Input type="email" />
          </Form.Item>
          {!this.state.IsExistEmail && (
            <>
              <Form.Item label="验证码" name="emailCode" rules={[{ required: true, message: "请输入验证码！" }]}>
                <Input />
              </Form.Item>
              <Button onClick={this.sendEmailCode}>发送验证码</Button>
            </>
          )}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              注册
            </Button>
            <Button type="primary">
              <Link to={"/login"}>登录</Link>
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}
