import { Component, IComponentLifecycle } from "@symph/core";
import jwt from "jsonwebtoken";
import { Value } from "@symph/config";
import { ObjectID } from "typeorm";
import { Payload, ReturnInterface } from "../../utils/common.interface";
import { CheckSuccess, DeleteFail, DeleteSuccess, ExpiredUser, SuccessCode, WrongCode, WrongToken } from "../../utils/constUtils";
import { DBService } from "./db.service";
import { TokenDB } from "../../utils/entity/TokenDB";
import { ObjectId } from "mongodb";

@Component()
export class AuthService implements IComponentLifecycle {
  constructor(private dbService: DBService) {}

  public connection = this.dbService.connection;

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

  public async checkToken(token: string): Promise<ReturnInterface<Payload>> {
    const res = jwt.verify(token, this.secret, async (err, decoded) => {
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
        const tokenDB = await this.getToken({ token });
        if (tokenDB) {
          const date = new Date();
          const expiration = new Date(date.getDate() - 7);
          if (tokenDB.createdDate < expiration) {
            this.deleteToken(tokenDB);
            return {
              message: WrongToken,
              code: WrongCode,
            };
          }
          return {
            message: CheckSuccess,
            code: SuccessCode,
            data: decoded,
          };
        } else {
          return {
            message: WrongToken,
            code: WrongCode,
          };
        }
      }
    });
    return res as unknown as ReturnInterface<Payload>;
  }

  public async addToken(userId: ObjectID, token: string) {
    const tokenDB = new TokenDB();
    tokenDB.token = token;
    tokenDB.userId = userId;
    await this.connection.manager.save(tokenDB);
  }

  public deleteToken(tokenDB: TokenDB) {
    this.connection.manager.delete(TokenDB, tokenDB);
  }

  public async deleteTokenByToken(token: string): Promise<ReturnInterface<null>> {
    const res = await this.connection.manager.delete(TokenDB, { token });
    if (res.affected === 1) {
      return {
        code: SuccessCode,
        message: DeleteSuccess,
      };
    } else {
      return {
        code: WrongCode,
        message: DeleteFail,
      };
    }
  }

  public async deleteTokenAll(userId: string): Promise<ReturnInterface<null>> {
    const res = await this.connection.manager.delete(TokenDB, { userId: new ObjectId(userId) });
    if (res.affected !== 0) {
      return {
        code: SuccessCode,
        message: DeleteSuccess,
      };
    } else {
      return {
        code: WrongCode,
        message: DeleteFail,
      };
    }
  }

  public async getToken(options: object): Promise<TokenDB> {
    return await this.connection.manager.findOne(TokenDB, options);
  }
}
