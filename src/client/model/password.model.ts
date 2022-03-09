import { ReactModel, BaseReactModel } from "@symph/react";
import { Inject } from "@symph/core";
import { ReactFetchService } from "@symph/joy";
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
}
