import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Link } from "@symph/react/router-dom";
import styles from "./index.less";
import { Inject } from "@symph/core";
import { Form, Input, Button, FormInstance, message, Checkbox } from "antd";
import { RefObject } from "react";
import {
  noPassword,
  noCaptcha,
  LoginText,
  PasswordText,
  CaptchaText,
  RegisterText,
  RememberPassword,
  SuccessCode,
  EmailText,
  noEmail,
  InputEmailOrUsername,
} from "../../../utils/constUtils";
import { LoginModel } from "../../model/login.model";
import { CaptchaModel } from "../../model/captcha.model";
import { passwordField, captchaField, rememberPasswordField, emailField } from "../../../utils/apiField";
import { LoginUser } from "../../../utils/login.interface";
import { PasswordModel } from "../../model/password.model";

@ReactController()
export default class LoginController extends BaseReactController {
  @Inject()
  public loginModel: LoginModel;

  @Inject()
  public captchaModel: CaptchaModel;

  @Inject()
  public passwordModel: PasswordModel;

  state = {
    captchaImg: "",
    captchaId: "",
    wrongTime: 0,
    hasEncrypt: false,
  };

  formRef: RefObject<FormInstance> = React.createRef();

  onFinish = async (values: LoginUser) => {
    if (this.state.wrongTime > 4) {
      const { captchaId } = this.state;
      values = {
        ...values,
        captchaId,
      };
    }
    const { hasEncrypt } = this.state;
    const res = await this.loginModel.login(values, hasEncrypt);
    if (res.code === SuccessCode) {
      message.success(res.message);
      localStorage.setItem("token", res.data as string);
      const rememberPassword = this.formRef.current.getFieldValue("rememberPassword");
      if (rememberPassword) {
        localStorage.setItem(emailField, values[emailField]);
        localStorage.setItem(passwordField, values[passwordField]);
      } else {
        localStorage.removeItem(emailField);
        localStorage.removeItem(passwordField);
      }
      setTimeout(() => {
        this.props.navigate("/index");
      }, 1000);
    } else {
      this.handleBlur();
      message.error(res.message);
    }
  };

  refreshCaptchaImg = async () => {
    const { captchaId, captchaImg } = await this.captchaModel.getCaptchaImg();
    this.setState({
      captchaImg,
      captchaId,
    });
  };

  handleBlur = async () => {
    const email = this.formRef.current.getFieldValue(emailField);
    const wrongTime = await this.loginModel.getWrongTime(email);
    if (wrongTime) {
      this.setState({
        wrongTime,
      });
      if (wrongTime > 4) {
        this.refreshCaptchaImg();
      }
    }
  };

  componentDidMount(): void {
    // const email = localStorage.getItem(emailField);
    // const password = localStorage.getItem(passwordField);
    // if (email && password) {
    //   this.formRef.current.setFieldsValue({ email, password, rememberPassword: true });
    //   this.setState({
    //     hasEncrypt: true,
    //   });
    // }
  }

  renderView(): ReactNode {
    const { captchaImg, wrongTime } = this.state;
    return (
      <>
        <h1 className={styles.title}>{LoginText}</h1>
        <Form ref={this.formRef} className={styles.loginForm} name="login" onFinish={this.onFinish} autoComplete="off">
          <Form.Item label={EmailText} name={emailField} rules={[{ required: true, message: noEmail }]}>
            <Input placeholder={InputEmailOrUsername} />
          </Form.Item>

          <Form.Item label={PasswordText} name={passwordField} rules={[{ required: true, message: noPassword }]}>
            <Input.Password visibilityToggle={false} onBlur={this.handleBlur} />
          </Form.Item>

          {wrongTime > 4 && (
            <>
              <Form.Item className={styles.captcha} label={CaptchaText} name={captchaField} rules={[{ required: true, message: noCaptcha }]}>
                <Input autoComplete="off" />
              </Form.Item>
              <div onClick={this.refreshCaptchaImg} dangerouslySetInnerHTML={{ __html: captchaImg }}></div>
            </>
          )}

          <Form.Item name={rememberPasswordField} valuePropName="checked">
            <Checkbox>{RememberPassword}</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {LoginText}
            </Button>
            <Button type="primary">
              <Link to={"/register"}>{RegisterText}</Link>
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}
