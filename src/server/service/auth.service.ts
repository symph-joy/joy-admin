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

  @Value({ configKey: "tokenConfig" })
  public tokenConfig: { exp: number; rememberExp: number };

  initialize() {}

  public generateToken(userId: ObjectID, rememberPassword: boolean, changePasswordTimes: number): string {
    // Token 数据
    const payload = {
      userId,
      exp: this.tokenConfig.exp,
      changePasswordTimes,
    };
    if (rememberPassword) {
      payload.exp = this.tokenConfig.rememberExp;
    }
    // 签发 Token
    const token = jwt.sign(payload, this.secret);
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
            return {
              message: CheckSuccess,
              code: SuccessCode,
              data: user,
            };
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
