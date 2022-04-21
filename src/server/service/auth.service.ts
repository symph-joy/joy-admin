import { Component, IComponentLifecycle } from "@symph/core";
import jwt from "jsonwebtoken";
import { Value } from "@symph/config";
import { ObjectID } from "typeorm";
import { Payload, ReturnInterface } from "../../utils/common.interface";
import { CheckSuccess, ExpiredUser, SuccessCode, WrongCode, WrongToken } from "../../utils/constUtils";
import { DBService } from "./db.service";
import { UserService } from "./user.service";
import { ObjectId } from "mongodb";
import { UserDB } from "../../utils/entity/UserDB";

@Component()
export class AuthService implements IComponentLifecycle {
  constructor(private dbService: DBService, private userService: UserService) {}

  public connection = this.dbService.connection;

  @Value({ configKey: "secret" })
  public secret: string;

  initialize() {}

  public generateToken(userId: ObjectID, rememberPassword: boolean, changePasswordTimes: number): string {
    const created = Math.floor(Date.now() / 1000);
    // Token 数据
    const payload = {
      userId,
      exp: created + 60 * 60 * 1, // 默认1h
      iat: created,
      changePasswordTimes,
    };
    if (rememberPassword) {
      payload.exp = created + 60 * 60 * 24 * 7;
    }
    // 密钥
    const secret = this.secret;
    // 签发 Token
    const token = jwt.sign(payload, secret);
    return token;
  }

  public async checkToken(token: string): Promise<ReturnInterface<UserDB>> {
    const res = jwt.verify(token, this.secret, async (err, decoded: Payload) => {
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
        const user = await this.userService.getUserByOptions({ _id: new ObjectId(decoded.userId) });
        if (user) {
          if (user.changePasswordTimes === decoded.changePasswordTimes) {
            const date = Math.floor(Date.now() / 1000);
            if (date < decoded.exp) {
              return {
                message: CheckSuccess,
                code: SuccessCode,
                data: user,
              };
            }
          }
        }
        return {
          message: WrongToken,
          code: WrongCode,
        };
      }
    });
    return res as unknown as ReturnInterface<UserDB>;
  }
}
