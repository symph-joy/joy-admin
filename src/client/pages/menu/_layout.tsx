import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Outlet } from "@symph/react/router-dom";
import { Layout } from "antd";
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
          <Sider theme="light">Menu1</Sider>
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
