"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegisterModel = void 0;

var _react = require("@symph/react");

var _core = require("@symph/core");

var _joy = require("@symph/joy");

var _dec, _dec2, _dec3, _dec4, _class;

let RegisterModel = (_dec = (0, _react.ReactModel)(), _dec2 = function (target, key) {
  return (0, _core.Inject)("joyFetchService")(target, undefined, 0);
}, _dec3 = Reflect.metadata("design:type", Function), _dec4 = Reflect.metadata("design:paramtypes", [typeof _joy.ReactFetchService === "undefined" ? Object : _joy.ReactFetchService]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = class RegisterModel extends _react.BaseReactModel {
  constructor(joyFetchService) {
    super();
    this.joyFetchService = joyFetchService;
  }

  getInitState() {
    return {};
  }

  async checkIsExistEmail(email) {
    const resp = await this.joyFetchService.fetchApi("/checkIsExistEmail?email=" + email);
    const respJson = await resp.json();
    return respJson.data;
  }

  async sendEmailCode(email) {
    const resp = await this.joyFetchService.fetchApi("/sendEmailCode?email=" + email);
    const respJson = await resp.json();
    return respJson.data;
  }

  async registerUser(values) {
    const resp = await this.joyFetchService.fetchApi("/registerUser", {
      method: "POST",
      body: JSON.stringify(values)
    });
    const respJson = await resp.json();
    return respJson.data;
  }

}) || _class) || _class) || _class) || _class);
exports.RegisterModel = RegisterModel;