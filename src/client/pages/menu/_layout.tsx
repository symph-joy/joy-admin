import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Outlet } from "@symph/react/router-dom";
import { Layout } from "antd";
const { Header, Sider, Content } = Layout;
import styles from "./layout.less";

@ReactController()
export default class IndexLayout extends BaseReactController {
  renderView(): ReactNode {
    return (
      <Layout className={styles.layout}>
        <Header>
          <div>Symph Joy Admin</div>
          <div>Menu2</div>
          <div>右边</div>
        </Header>
        <Layout>
          <Sider>Menu1</Sider>
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
