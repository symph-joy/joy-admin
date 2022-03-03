import { Component, IComponentLifecycle } from "@symph/core";
import { WrongCode, SuccessCode, publicKeyExist, NotExistPublicKey } from "../../client/utils/constUtils";
import { getConnection } from "typeorm";
import { SendCodeReturn } from "../../client/utils/common.interface";
import { KeyDB } from "../../client/utils/entity/KeyDB";
import { generateKeyPairSync, privateDecrypt } from "crypto";

@Component()
export class PasswordService implements IComponentLifecycle {
  public connection = getConnection();

  initialize() {}

  // 生成公钥
  public async generatePublicKey(): Promise<string> {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 1024,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });
    const key = new KeyDB();
    key.publicKey = publicKey;
    key.privateKey = privateKey;
    await this.connection.manager.save(key);
    return publicKey;
  }

  // 解密
  public async decrypt(password: string, publicKey: string): Promise<SendCodeReturn> {
    const res = await this.connection.manager.findOne(KeyDB, { publicKey });
    if (res) {
      const { privateKey } = res;
      const bufferData = Buffer.from(password, "base64");
      const realPassword = privateDecrypt(privateKey, bufferData).toString();
      return {
        code: SuccessCode,
        message: publicKeyExist,
        data: realPassword,
      };
    } else {
      return {
        message: NotExistPublicKey,
        code: WrongCode,
      };
    }
  }
}
