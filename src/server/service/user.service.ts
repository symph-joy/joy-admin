import { Component, IComponentLifecycle } from "@symph/core";
import { getConnection } from "typeorm";
import { Payload, SendCodeReturn, UserInterface } from "../../client/utils/common.interface";
import { ExpiredUser, LoginSuccess, NotExistUser, SuccessCode, WrongCode } from "../../client/utils/constUtils";
import { User } from "../../client/utils/entity/UserDB";
import { ObjectId } from "mongodb";

@Component()
export class UserService implements IComponentLifecycle {
  public connection = getConnection();

  initialize() {}

  public async isTokenExpired(payload: SendCodeReturn) {
    if (payload.code === WrongCode) {
      return payload;
    } else {
      const date = Math.floor(Date.now() / 1000);
      let data = payload.data as Payload;
      if (data.exp > date) {
        const user = await this.getUser(data.userId);
        if (user) {
          return {
            message: LoginSuccess,
            code: SuccessCode,
            data: user,
          };
        } else {
          return {
            message: NotExistUser,
            code: WrongCode,
          };
        }
      } else {
        return {
          message: ExpiredUser,
          code: WrongCode,
        };
      }
    }
  }

  public async getUser(userId: string): Promise<UserInterface> {
    return await this.connection.manager.findOne(User, { _id: new ObjectId(userId) });
  }
}
