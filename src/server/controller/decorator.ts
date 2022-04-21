import { SuccessCode } from "../../utils/constUtils";
import { FastifyRequest } from "fastify";
import { ControllerReturn, ReturnInterface } from "../../utils/common.interface";
import { UserDB } from "../../utils/entity/UserDB";

export function authToken() {
  return (target: any, methodName: string, desc: any) => {
    const oMethod = desc.value;
    desc.value = async function (req: FastifyRequest, ...args): Promise<ControllerReturn<UserDB>> {
      const token = ''
      const res = await this.authService.checkToken(token);
      if (res.code === SuccessCode) {
        return {
          data: await oMethod.call(this, res.data.userId, ...args),
        };
      } else {
        return {
          data: res as ReturnInterface<null>,
        };
      }
    };
  };
}
