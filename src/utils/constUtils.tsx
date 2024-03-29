export const RegisterText = "注册";
export const UsernameText = "用户名";
export const PasswordText = "密码";
export const OldPasswordText = "旧密码";
export const NewPasswordText = "新密码";
export const ConfirmPasswordText = "确认密码";
export const EmailText = "邮箱";
export const RoleText = "角色";
export const EmailCodeText = "激活码";
export const UsernameExist = "用户名已存在！";
export const UserNoExist = "用户不存在";
export const noPassword = "请输入密码！";
export const noEmailActive = "请选择激活状态！";
export const noEmail = "请输入邮箱！";
export const noUsername = "请输入用户名！";
export const noOldPassword = "请输入旧密码！";
export const noNewPassword = "请输入新密码！";
export const noConfirmPassword = "请输入确认密码！";
export const PasswordAreNotSame = "新密码和确认密码不一致";
export const EmailErrorMessage = "邮箱格式不正确！";
export const EmailExistMessage = "邮箱已存在！";
export const noEmailCode = "请输入激活码！";
export const SendEmailCode = "发送激活码";
export const SendSuccess = "发送成功";
export const SendFail = "发送失败";
export const Sending = "发送中...";
export const Registering = "注册中...";
export const SecondAfter = "s 后";
export const LoginText = "登录";
export const SaveText = "保存";
export const CaptchaText = "验证码";
export const noCaptcha = "请输入验证码！";
export const RememberPassword = "记住密码";
export const InputEmailOrUsername = "请输入邮箱或用户名";
export const WrongCode = 10001;
export const SuccessCode = 10000;
export const NotExistCode = 10002;
export const RegisterSuccess = "注册成功";
export const LoginSuccess = "登录成功";
export const LogoutSuccess = "推出成功";
export const GetSuccess = "获取成功";
export const CheckSuccess = "验证成功";
export const RegisterFail = "注册失败，请重试";
export const UserDeleteFail = "用户删除失败";
export const UserDeleteSuccess = "用户删除成功";
export const UserAddFail = "用户添加失败";
export const UserAddSuccess = "用户添加成功";
export const EmailCodeWrong = "激活码不正确";
export const CaptchaWrong = "验证码不正确";
export const PasswordWrong = "密码错误";
export const PasswordRight = "密码正确";
export const NotExistEmailCode = "激活码不存在，请重新发送激活码";
export const NotExistUsernameOrEmail = "用户名或邮箱不存在";
export const NotExistUser = "用户不存在，请重新登录";
export const ExpiredUser = "登录过期，请重新登录";
export const WrongToken = "无效的token，请重新登录";
export const NotExistToken ='token为空'
export const NotExistCaptcha = "验证码已过期，请刷新";
export const ExpiredEmailCode = "激活码已过期，请重新发送激活码";
export const EmailCodeRight = "激活码正确";
export const CaptchaRight = "验证码正确";
export const okText = "确定";
export const cancelText = "取消";
export const UpdateSuccess = "修改成功";
export const DeleteSuccess = "删除成功";
export const DeleteFail = "删除失败";
export const UpdateFail = "修改失败，请重试";
export const UsernameEmailSame = "用户名、邮箱均未改变";
export const NoChange = "没有内容改变";
export const UserCenterText = "个人中心";
export const ChangePassword = "修改密码";
export const ChangeEmail = "修改邮箱";
export const Logout = "退出登录";
export const Admin = "超级管理员";
export const Common = "普通角色";
export const NoPermissionCode = 10004;
export const PasswordNotChange = "密码未更改";
export const UserManagerText = "用户管理";
export const RoleManagerText = "角色管理";
export const AddUser = "新增用户";
export const EditUser = "编辑用户";
export const Add = "新增";
export const EmailActiveStatus = "激活状态";
export const EditText = "编辑";
export const ReferWrong = '来源错误'

export default class constUtils {
  static toArray(enumType) {
    const a = [];
    for (const p in enumType) {
      if (enumType.hasOwnProperty(p)) {
        a.push(enumType[p]);
      }
    }
    return a;
  }

  static getItem(enumType, value) {
    for (const p in enumType) {
      if (enumType.hasOwnProperty(p) && value === enumType[p].value) {
        return enumType[p];
      }
    }
    return null;
  }

  static getItems(enumType, filter) {
    const items = [];
    for (const p in enumType) {
      if (enumType.hasOwnProperty(p) && typeof enumType[p] !== "function") {
        const item = enumType[p];
        if (filter) {
          if (filter(item)) {
            items.push(item);
          }
        } else {
          items.push(item);
        }
      }
    }
    return items;
  }

  static getItemName(enumType, value) {
    if (value === undefined || value === null) {
      return null;
    }
    for (const p in enumType) {
      if (enumType.hasOwnProperty(p) && value === enumType[p].value) {
        return enumType[p].name;
      }
    }
    return null;
  }
}
export const EmailActiveEnum = {
  ACTIVE: {
    value: true,
    name: "已激活",
  },
  UN_ACTIVE: {
    value: false,
    name: "未激活",
  },
};

export const RoleManagerColumns = [
  {
    title: "角色编号",
    dataIndex: "roleId",
    key: "roleId",
  },
  {
    title: "角色名称",
    dataIndex: "roleName",
    key: "roleName",
  },
  {
    title: "操作",
    key: "option",
  },
];
