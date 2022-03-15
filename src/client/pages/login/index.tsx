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
import { LoginUser } from "../../../utils/common.interface";
import { PasswordModel } from "../../model/password.model";
import { UserModel } from "../../model/user.model";
import { AuthModel } from "../../model/auth.model";

@ReactController()
export default class LoginController extends BaseReactController {
  @Inject()
  public loginModel: LoginModel;

  @Inject()
  public captchaModel: CaptchaModel;

  @Inject()
  public authModel: AuthModel;

  state = {
    captchaImg: "",
    captchaId: "",
    wrongTime: 0,
  };

  formRef: RefObject<FormInstance> = React.createRef();

  componentDidMount() {
    this.authModel.checkToken();
  }

  onFinish = async (values: LoginUser) => {
    if (this.state.wrongTime > 4) {
      const { captchaId } = this.state;
      values = {
        ...values,
        captchaId,
      };
    }
    const res = await this.loginModel.login(values);
    if (res.code === SuccessCode) {
      message.success(res.message);
      setTimeout(() => {
        this.props.navigate("/menu");
      }, 1000);
    } else {
      this.getWrongTime();
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

  getWrongTime = async () => {
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

  handleBlur = async () => {
    this.getWrongTime();
  };

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
