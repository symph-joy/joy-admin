import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { UserModel } from "../../model/user.model";
import { Menu, Dropdown, Button } from "antd";
import { Link } from "react-router-dom";
import { UserCenterText, Logout } from "../../../utils/constUtils";
import { LoginModel } from "../../model/login.model";

@ReactController()
export default class HeaderRight extends BaseReactController {
  @Inject()
  userModel: UserModel;

  @Inject()
  loginModel: LoginModel;

  async componentDidMount(): Promise<void> {
    const { user } = this.userModel.state;
    if (!user) {
      await this.userModel.getUser();
    }
  }

  handleLogout = async () => {
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    this.userModel.setUser(null);
    this.props.navigate("/login");
  };

  menu = (
    <Menu>
      <Menu.Item>
        <Link to="/menu/userCenter">{UserCenterText}</Link>
      </Menu.Item>
      <Menu.Item onClick={this.handleLogout}>{Logout}</Menu.Item>
    </Menu>
  );
  renderView(): ReactNode {
    const { user } = this.userModel.state;
    return (
      <Dropdown overlay={this.menu} placement="bottomRight">
        <Button>{user ? user?.email : "admin"}</Button>
      </Dropdown>
    );
  }
}
