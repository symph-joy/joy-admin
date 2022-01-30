import { Component, IComponentLifecycle } from "@symph/core";

@Component()
export class RegisterService implements IComponentLifecycle {
  initialize() {}

  public checkIsExistEmail(email: string): boolean {
    const allEmails = this.getAllEmail();
    return allEmails.includes(email);
  }

  private getAllEmail(): Array<string> {
    // 数据库拿数据
    return ["wangyi11860@163.com"];
  }

  public sendEmailCode(email: string) {
    return true;
  }
}
