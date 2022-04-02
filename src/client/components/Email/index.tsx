import React, { ReactNode, RefObject } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { Button, Form, Input, message, FormInstance } from "antd";
import {
  EmailText,
  noEmail,
  EmailErrorMessage,
  EmailExistMessage,
  EmailCodeText,
  noEmailCode,
  okText,
  SecondAfter,
  SendEmailCode,
  Sending,
  cancelText,
  noCaptcha,
  CaptchaText,
  SuccessCode,
} from "../../../utils/constUtils";
import { captchaField, emailCodeField, emailField } from "../../../utils/apiField";
import { emailReg } from "../../../utils/RegExp";
import { EmailModel } from "../../model/email.model";
import { CaptchaModel } from "../../model/captcha.model";
import { UserModel } from "../../model/user.model";
import Modal from "../../components/Modal";

@ReactController()
export default class Email extends BaseReactController {
  @Inject()
  emailModel: EmailModel;

  @Inject()
  captchaModel: CaptchaModel;

  @Inject()
  userModel: UserModel;

  state = {
    IsExistEmail: true,
    second: 60,
    sending: false,
    showModal: false,
    captchaImg: "",
    captchaId: "",
  };

  formRef: RefObject<FormInstance> = this.props.formRef as RefObject<FormInstance>;

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
    const res = await this.emailModel.sendEmailCode(email);
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
    this.formRef.current.setFieldsValue({ captcha: null });
  };

  refreshCaptchaImg = async () => {
    const { captchaId, captchaImg } = await this.captchaModel.getCaptchaImg();
    this.setState({
      captchaImg,
      captchaId,
    });
  };

  renderView(): ReactNode {
    const { IsExistEmail, second, sending, showModal, captchaImg } = this.state;
    const { style, type, email } = this.props;
    const { user } = this.userModel.state;
    const commonRules = [
      { required: true, message: noEmail, validateTrigger: "onChange" },
      { pattern: emailReg, message: EmailErrorMessage, validateTrigger: "onChange" },
    ];
    const rules =
      type === "change"
        ? [
            ...commonRules,
            ({ setFieldsValue }) => ({
              required: true,
              validateTrigger: "onBlur",
              validator: async (_, value: string) => {
                if (value) {
                  if (emailReg.test(value)) {
                    // 比下面的多一步验证与当前邮箱是否一致
                    if (value === user?.email) {
                      this.setState({
                        IsExistEmail: true,
                      });
                      return Promise.resolve();
                    } else {
                      const result = await this.emailModel.checkIsExistEmail(value);
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
          ]
        : type === "addUser"
        ? [
            ...commonRules,
            // 不需要显示激活码
            () => ({
              required: true,
              validateTrigger: "onBlur",
              validator: async (_, value: string) => {
                if (value) {
                  if (emailReg.test(value)) {
                    const result = await this.emailModel.checkIsExistEmail(value);
                    if (!result) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error(EmailExistMessage));
                    }
                  } else {
                    return Promise.reject(new Error(EmailErrorMessage));
                  }
                } else {
                  return Promise.reject(new Error(noEmail));
                }
              },
            }),
          ]
        : [
            ...commonRules,
            ({ setFieldsValue }) => ({
              required: true,
              validateTrigger: "onBlur",
              validator: async (_, value: string) => {
                if (value) {
                  if (emailReg.test(value)) {
                    const result = await this.emailModel.checkIsExistEmail(value);
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
          ];
    return (
      <>
        <Form.Item
          initialValue={email || undefined}
          style={style}
          label={EmailText}
          name={emailField}
          validateTrigger={["onBlur", "onChange"]}
          rules={rules}
        >
          <Input type="email" autoComplete="off" />
        </Form.Item>
        {!IsExistEmail && (
          <>
            <Form.Item style={style} label={EmailCodeText} name={emailCodeField} rules={[{ required: true, message: noEmailCode }]}>
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
          <Form.Item label={CaptchaText} name={captchaField} rules={[{ required: true, message: noCaptcha }]}>
            <Input autoComplete="off" />
          </Form.Item>
          <div onClick={this.refreshCaptchaImg} dangerouslySetInnerHTML={{ __html: captchaImg }}></div>
        </Modal>
      </>
    );
  }
}
