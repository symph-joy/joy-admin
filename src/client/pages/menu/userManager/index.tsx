import React, { ReactNode, RefObject } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { Button, Table, Form, Input, Radio, FormInstance, message } from "antd";
import constUtils, {
  PasswordText,
  Add,
  AddUser,
  RoleText,
  noPassword,
  EmailActiveStatus,
  SuccessCode,
  EmailActiveEnum,
  EditText,
  EditUser,
  NoChange,
} from "../../../../utils/constUtils";
import { UserModel } from "../../../model/user.model";
import { emailActiveField, emailField, passwordField, roleField, usernameField } from "../../../../utils/apiField";
import Modal from "../../../components/Modal";
import Username from "../../../components/Username";
import Email from "../../../components/Email";
import { PasswordModel } from "../../../model/password.model";
import { RoleModel } from "../../../model/role.model";
import { ReturnInterface, RoleEnum } from "../../../../utils/common.interface";

@ReactController()
export default class UserManager extends BaseReactController {
  @Inject()
  userModel: UserModel;

  @Inject()
  passwordModel: PasswordModel;

  @Inject()
  roleModel: RoleModel;

  state = {
    dataSource: [],
    item: null,
    showAddOrEditModal: false,
    title: "",
  };

  addUserFormRef: RefObject<FormInstance> = React.createRef();

  componentDidMount(): void {
    this.roleModel.getRoles();
    this.getUser();
  }

  async getUser() {
    const res = await this.userModel.getAllUser();
    this.setState({
      dataSource: res.data,
    });
  }

  showModal = (type: string, item?) => {
    this.setState({
      [type]: true,
      item,
      title: item ? EditUser : AddUser,
    });
  };

  hideModal = (type: string) => {
    this.setState({
      [type]: false,
    });
  };

  addOrEditUser = async () => {
    const { title } = this.state;
    let res: ReturnInterface<null>;
    if (title === AddUser) {
      const values = this.addUserFormRef.current.getFieldsValue();
      values[passwordField] = this.passwordModel.encryptByMD5(values[passwordField]);
      res = await this.userModel.addUser(values);
    } else {
      const { username, email, emailActive, roleId } = this.addUserFormRef.current.getFieldsValue();
      const { item } = this.state;
      const usernameOrigin = item[usernameField];
      const emailOrigin = item[emailField];
      const emailActiveOrigin = item[emailActiveField];
      const roleIdOrigin = item[roleField];
      if (username === usernameOrigin && email === emailOrigin && emailActive === emailActiveOrigin && roleId === roleIdOrigin) {
        message.error(NoChange);
        return false;
      }
      const params = {
        userId: item.userId,
      };
      if (username !== usernameOrigin) {
        params[usernameField] = username;
      }
      if (email !== emailOrigin) {
        params[emailField] = email;
      }
      if (emailActive !== emailActiveOrigin) {
        params[emailActiveField] = emailActive;
      }
      if (roleId !== roleIdOrigin) {
        params[roleField] = roleId;
      }
      res = await this.userModel.editUserByAdmin(params);
    }
    if (res.code === SuccessCode) {
      message.success(res.message);
      this.hideModal("showAddOrEditModal");
      this.getUser();
    } else {
      message.error(res.message);
    }
  };

  renderView(): ReactNode {
    const { dataSource, showAddOrEditModal, item, title } = this.state;
    const { roles } = this.roleModel.state;

    const UserManagerColumns = [
      {
        title: "用户ID",
        dataIndex: "_id",
        key: "_id",
      },
      {
        title: "用户名",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "激活状态",
        dataIndex: "emailActive",
        key: "emailActive",
        render: (_) => constUtils.getItemName(EmailActiveEnum, _),
      },
      {
        title: "用户角色",
        dataIndex: "roleId",
        key: "roleId",
        render: (_) => roles?.filter((value) => value.roleId === _)[0]?.roleName,
      },
      {
        title: "操作",
        key: "option",
        render: (_, item) => <Button onClick={() => this.showModal("showAddOrEditModal", item)}>{EditText}</Button>,
      },
    ];

    return (
      <>
        <div>
          <Button onClick={() => this.showModal("showAddOrEditModal")}>{Add}</Button>
          <Modal title={title} visible={showAddOrEditModal} onOk={this.addOrEditUser} onCancel={() => this.hideModal("showAddOrEditModal")}>
            <Form ref={this.addUserFormRef} name="addUser" autoComplete="off">
              <Username username={item?.username} />
              <Email email={item?.email} type="addUser" />

              <Form.Item initialValue={item?.emailActive || EmailActiveEnum.UN_ACTIVE.value} label={EmailActiveStatus} name={emailActiveField}>
                <Radio.Group defaultValue={item?.emailActive || EmailActiveEnum.UN_ACTIVE.value}>
                  <Radio value={EmailActiveEnum.UN_ACTIVE.value}>{EmailActiveEnum.UN_ACTIVE.name}</Radio>
                  <Radio value={EmailActiveEnum.ACTIVE.value}>{EmailActiveEnum.ACTIVE.name}</Radio>
                </Radio.Group>
              </Form.Item>

              {title === AddUser && (
                <Form.Item label={PasswordText} name={passwordField} rules={[{ required: true, message: noPassword }]}>
                  <Input.Password autoComplete="new-password" />
                </Form.Item>
              )}

              <Form.Item label={RoleText} initialValue={item?.roleId || RoleEnum.Common} name={roleField}>
                <Radio.Group defaultValue={item?.roleId || RoleEnum.Common}>
                  {roles?.map((value, key) => (
                    <Radio key={key} value={value.roleId}>
                      {value.roleName}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Form>
          </Modal>
          <Button>删除</Button>
          <Button>导入</Button>
          <Button>导出</Button>
        </div>
        <Table
          rowSelection={{
            type: "checkbox",
          }}
          dataSource={dataSource}
          columns={UserManagerColumns}
        />
      </>
    );
  }
}
