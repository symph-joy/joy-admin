import { Component, IComponentLifecycle } from "@symph/core";
import jwt from "jsonwebtoken";
import { Value } from "@symph/config";
import { ObjectID } from "typeorm";
import { Payload, ReturnInterface } from "../../utils/common.interface";
import { CheckSuccess, ExpiredUser, SuccessCode, WrongCode, WrongToken } from "../../utils/constUtils";

@Component()
export class AuthService implements IComponentLifecycle {
  @Value({ configKey: "secret" })
  public secret: string;

  initialize() {}

  public generateToken(userId: ObjectID): string {
    const created = Math.floor(Date.now() / 1000);
    // Token 数据
    const payload = {
      userId,
      exp: created + 60 * 60 * 24 * 7, // 一周
      iat: created,
    };
    // 密钥
    const secret = this.secret;
    // 签发 Token
    const token = jwt.sign(payload, secret);
    return token;
  }

  public checkToken(token: string): ReturnInterface<Payload> {
    const res = jwt.verify(token, this.secret, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return {
            message: ExpiredUser,
            code: WrongCode,
          };
        } else {
          return {
            message: WrongToken,
            code: WrongCode,
          };
        }
      } else {
        return {
          message: CheckSuccess,
          code: SuccessCode,
          data: decoded,
        };
      }
    });
    return res as unknown as ReturnInterface<Payload>;
  }
}
