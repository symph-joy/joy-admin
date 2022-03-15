import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { UserModel } from "../../model/user.model";
import { Menu, Dropdown, Button } from "antd";
import { Link } from "react-router-dom";
import { UserCenterText, Logout } from "../../../utils/constUtils";
import { LoginModel } from "../../model/login.model";
import { AuthModel } from "../../model/auth.model";

@ReactController()
export default class HeaderRight extends BaseReactController {
  @Inject()
  userModel: UserModel;

  @Inject()
  loginModel: LoginModel;

  @Inject()
  authModel: AuthModel;

  async componentDidMount(): Promise<void> {
    const { user } = this.userModel.state;
    if (!user) {
      await this.userModel.getUserByToken();
    }
  }

  handleLogout = async () => {
    const date = new Date();
    const min = date.getMinutes();
    date.setMinutes(min - 5);
    await this.authModel.deleteTokenByToken();
    document.cookie = `token=;expires=${date}`;
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
