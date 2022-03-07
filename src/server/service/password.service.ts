import { Component, IComponentLifecycle } from "@symph/core";
import { WrongCode, SuccessCode, publicKeyExist, NotExistPublicKey, PasswordAddFail, PasswordAddSuccess } from "../../utils/constUtils";
import { DBService } from "./db.service";
import { PasswordInterface, SendCodeReturn } from "../../utils/common.interface";
import { KeyDB } from "../../utils/entity/KeyDB";
import { generateKeyPairSync, privateDecrypt } from "crypto";
import { PasswordDB } from "../../utils/entity/PasswordDB";
import bcrypt from "bcryptjs";
import { ObjectID } from "typeorm";

@Component()
export class PasswordService implements IComponentLifecycle {
  constructor(private dbService: DBService) {}

  public connection = this.dbService.connection;

  initialize() {}

  // 添加密码
  public async addPassword(realPassword: string, userId: ObjectID): Promise<SendCodeReturn> {
    const passwordDB = new PasswordDB();
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(realPassword, salt);
    passwordDB.password = password;
    passwordDB.userId = userId;
    let res: PasswordInterface;
    try {
      res = await this.connection.manager.save(passwordDB);
    } catch (e) {
      return {
        code: WrongCode,
        message: PasswordAddFail,
      };
    }
    return {
      code: SuccessCode,
      message: PasswordAddSuccess,
      data: res,
    };
  }

  





  
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
