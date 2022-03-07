import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
import { LoginUser } from "../../utils/login.interface";
import { publicEncrypt } from "crypto";
import { passwordField, publicKeyField } from "../../utils/apiField";
import { RegisterUser } from "../../utils/register.interface";
import crypto from "crypto";

@ReactModel()
export class PasswordModel extends BaseReactModel<{}> {
  constructor(@Inject("joyFetchService") private joyFetchService: ReactFetchService) {
    super();
  }

  getInitState() {
    return {};
  }

  encryptByMD5(password: string): string {
    const res = crypto.createHash("md5").update(password).digest("hex");
    return res;
  }

  async generatePublicKey() {
    const resp = await this.joyFetchService.fetchApi("/generatePublicKey");
    const respJson = await resp.json();
    return respJson.data;
  }

  // 加密
  async encrypt(values: LoginUser | RegisterUser, hasEncrypt: boolean): Promise<LoginUser | RegisterUser> {
    let publicKey = localStorage.getItem(publicKeyField);
    if (!publicKey) {
      publicKey = await this.generatePublicKey();
      localStorage.setItem(publicKeyField, publicKey);
    }
    let password = values[passwordField];
    if (!hasEncrypt) {
      password = publicEncrypt(publicKey, Buffer.from(password)).toString("base64");
    }
    values[publicKeyField] = publicKey;
    values[passwordField] = password;
    return values;
  }
}
