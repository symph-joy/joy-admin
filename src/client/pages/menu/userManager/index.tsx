import React, { ReactNode, RefObject } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { Button, Table, Form, Input } from "antd";
import { UserManagerColumns, UsernameText, EmailText, PasswordText, Add, AddUser } from "../../../../utils/constUtils";
import { UserModel } from "../../../model/user.model";
import { emailField, passwordField, usernameField } from "../../../../utils/apiField";
import Modal from "../../../components/Modal";

@ReactController()
export default class UserManager extends BaseReactController {
  @Inject()
  userModel: UserModel;

  state = {
    dataSource: [],
    showAddModal: false,
  };

  componentDidMount(): void {
    this.getUser();
  }

  async getUser() {
    const res = await this.userModel.getAllUser();
    this.setState({
      dataSource: res.data,
    });
  }

  showModal = (type: string) => {
    this.setState({
      [type]: true,
    });
  };

  hideModal = (type: string) => {
    this.setState({
      [type]: false,
    });
  };

  addUser = (values) => {
    console.log(values);
  };

  renderView(): ReactNode {
    const { dataSource, showAddModal } = this.state;
    return (
      <>
        <div>
          <Button onClick={() => this.showModal("showAddModal")}>{Add}</Button>
          <Modal title={AddUser} visible={showAddModal} onOk={this.addUser} onCancel={() => this.hideModal("showAddModal")}>
            <Form name="addUser" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} autoComplete="off">
              <Form.Item label={UsernameText} name={usernameField} rules={[{ required: true, message: "Please input your username!" }]}>
                <Input />
              </Form.Item>

              <Form.Item label={EmailText} name={emailField} rules={[{ required: true, message: "Please input your password!" }]}>
                <Input type="email" />
              </Form.Item>

              <Form.Item label={PasswordText} name={passwordField} rules={[{ required: true, message: "Please input your password!" }]}>
                <Input.Password autoComplete="new-password" />
              </Form.Item>
              <Form.Item label="role" name="role" rules={[{ required: true, message: "Please input your password!" }]}>
                <Input.Password />
              </Form.Item>
            </Form>
          </Modal>
          <Button>修改</Button>
          <Button>删除</Button>
          <Button>导入</Button>
          <Button>导出</Button>
        </div>
        <Table dataSource={dataSource} columns={UserManagerColumns} />
      </>
    );
  }
}
