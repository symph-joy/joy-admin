import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { RegisterModel } from "../../model/register.model";
import { CaptchaModel } from "../../model/captcha.model";
import styles from "./index.less";
import { Form, Input, Button, FormInstance, message, Modal } from "antd";
import { RegisterUser } from "../../../utils/common.interface";
import { emailReg } from "../../../utils/RegExp";
import { Link } from "@symph/react/router-dom";
import {
  noCaptcha,
  noPassword,
  noEmail,
  EmailErrorMessage,
  EmailExistMessage,
  noEmailCode,
  RegisterText,
  PasswordText,
  EmailText,
  EmailCodeText,
  SendEmailCode,
  LoginText,
  Sending,
  Registering,
  SecondAfter,
  SuccessCode,
  CaptchaText,
  okText,
  cancelText,
} from "../../../utils/constUtils";
import { RefObject } from "react";
import { passwordField, emailField, emailCodeField, captchaField } from "../../../utils/apiField";
import { PasswordModel } from "../../model/password.model";

@ReactController()
export default class RegisterController extends BaseReactController {
  @Inject()
  public registerModel: RegisterModel;

  @Inject()
  public captchaModel: CaptchaModel;

  @Inject()
  public passwordModel: PasswordModel;

  state = {
    IsExistEmail: true,
    second: 60,
    registering: false,
    sending: false,
    showModal: false,
    captchaImg: "",
    captchaId: "",
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

  showModal = () => {
    this.setState({
      showModal: true,
    });
    this.refreshCaptchaImg();
  };

  sendEmailCode = async () => {
    const email = this.formRef.current?.getFieldValue(emailField);
    this.setState({
      sending: true,
    });
    const res = await this.registerModel.sendEmailCode(email);
    this.setState({
      sending: false,
    });
    if (res.code === SuccessCode) {
      message.success(res.message);
      const Time = setInterval(() => {
        const { second } = this.state;
        if (second > 0) {
          this.setState({
            second: second - 1,
          });
        } else {
          this.setState({
            second: 60,
          });
          clearTimeout(Time);
        }
      }, 1000);
    } else {
      message.error(res.message);
    }
  };

  handleOk = async () => {
    const captcha = this.formRef.current.getFieldValue(captchaField);
    if (captcha) {
      const res = await this.captchaModel.checkCaptcha({
        captcha,
        captchaId: this.state.captchaId,
      });
      if (res.code !== SuccessCode) {
        message.error(res.message);
      } else {
        this.setState({
          showModal: false,
        });
        this.sendEmailCode();
      }
    }
  };

  handleCancel = () => {
    this.setState({
      showModal: false,
    });
  };

  refreshCaptchaImg = async () => {
    const { captchaId, captchaImg } = await this.captchaModel.getCaptchaImg();
    this.setState({
      captchaImg,
      captchaId,
    });
  };

  renderView(): ReactNode {
    const { IsExistEmail, second, registering, sending, showModal, captchaImg } = this.state;
    return (
      <>
        <h1 className={styles.title}>{RegisterText}</h1>
        <Form ref={this.formRef} className={styles.registerForm} name="register" onFinish={this.onFinish} autoComplete="off">
          <Form.Item
            label={EmailText}
            name={emailField}
            validateTrigger={["onBlur", "onChange"]}
            rules={[
              { required: true, message: noEmail, validateTrigger: "onChange" },
              { pattern: emailReg, message: EmailErrorMessage, validateTrigger: "onChange" },
              ({ setFieldsValue }) => ({
                required: true,
                validateTrigger: "onBlur",
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
            <Input type="email" autoComplete="off" />
          </Form.Item>
          {!IsExistEmail && (
            <>
              <Form.Item label={EmailCodeText} name={emailCodeField} rules={[{ required: true, message: noEmailCode }]}>
                <Input autoComplete="off" />
              </Form.Item>

              {second === 60 && !sending ? (
                <Button onClick={this.showModal}>{SendEmailCode}</Button>
              ) : sending ? (
                <Button disabled>{Sending}</Button>
              ) : (
                <Button disabled>
                  {second}
                  {SecondAfter}
                </Button>
              )}
            </>
          )}
          <Modal okText={okText} cancelText={cancelText} title={noCaptcha} visible={showModal} onOk={this.handleOk} onCancel={this.handleCancel}>
            <Form.Item className={styles.captcha} label={CaptchaText} name={captchaField} rules={[{ required: true, message: noCaptcha }]}>
              <Input autoComplete="off" />
            </Form.Item>
            <div onClick={this.refreshCaptchaImg} dangerouslySetInnerHTML={{ __html: captchaImg }}></div>
          </Modal>

          <Form.Item label={PasswordText} name={passwordField} rules={[{ required: true, message: noPassword }]}>
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
