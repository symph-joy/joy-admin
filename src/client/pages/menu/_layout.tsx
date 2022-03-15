import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Link, Outlet } from "@symph/react/router-dom";
import { Layout, Menu } from "antd";
import styles from "./layout.less";
import HeaderRight from "../../components/HeaderRight";
import { Inject } from "@symph/core";

const { Header, Sider, Content } = Layout;

@ReactController()
export default class IndexLayout extends BaseReactController {
  renderView(): ReactNode {
    return (
      <Layout className={styles.layout}>
        <Header>
          <div>Symph Joy Admin</div>
          <div>Menu2</div>
          <HeaderRight />
        </Header>
        <Layout>
          <Sider theme="light">
            <Menu mode="inline" defaultSelectedKeys={["1"]} style={{ height: "100%", borderRight: 0 }}>
              <Menu.Item key="1">
                <Link to="/menu/userManager">用户管理</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/menu/roleManager">角色管理</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content>
            <div className={styles.content}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
