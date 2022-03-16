import React, { ReactNode, RefObject } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { Table } from "antd";
import { UserManagerColumns } from "../../../../utils/constUtils";
import { UserModel } from "../../../model/user.model";
// import ProTable from "@ant-design/pro-table";

@ReactController()
export default class UserManager extends BaseReactController {
  @Inject()
  userModel: UserModel;

  state = {
    dataSource: [],
  };

  componentDidMount(): void {
    this.getUser();
  }

  async getUser() {
    const res = await this.userModel.getAllUser();
    this.setState({
      dataSource: res.data,
    });
    console.log(res);
  }
  renderView(): ReactNode {
    const { dataSource } = this.state;
    return <Table dataSource={dataSource} columns={UserManagerColumns} />;
  }
}
