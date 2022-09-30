import React, { ReactNode } from "react";
import { BaseReactController, ReactController } from "@symph/react";
import { Inject } from "@symph/core";
import { LoginModel } from "../../model/login.model";
import { SuccessCode } from "../../../utils/constUtils";
import { UserModel } from "../../model/user.model";
import { useNavigate } from "react-router";

@ReactController()
class CheckTokenNavigator extends BaseReactController {
  @Inject()
  public loginModel: LoginModel;

  @Inject()
  public userModel: UserModel;

  async componentDidMount(): Promise<void> {
    const res = await this.loginModel.checkToken();

    const { navigation } = this.props;
    console.log(navigation, 'xxx');
    // const navigate = useNavigate();
    // console.log(navigate);
    if (res.code === SuccessCode) {
      // console.log(this.props);
      await this.userModel.setUser(res.data);
      // navigation('menu')
     
      //   location.href = "/menu";
      // this.props.location.push('/menu')
    }
  }

  renderView(): ReactNode {
    return <></>;
  }
}

export default function () {
  const navigation = useNavigate();
  return <CheckTokenNavigator navigation={navigation} />;
}
