"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@symph/react");

var _core = require("@symph/core");

var _register = require("../../model/register.model");

var _emptyModule = _interopRequireDefault(require("@symph/joy/dist/build/babel-src/empty-module.js"));

var _antd = require("antd");

var _RegExp = require("../../utils/RegExp");

var _routerDom = require("@symph/react/router-dom");

var _constUtils = require("../../utils/constUtils");

var _dec, _dec2, _dec3, _class, _class2, _descriptor;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __jsx = _react.default.createElement;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

let RegisterController = (_dec = (0, _react2.ReactController)(), _dec2 = (0, _core.Inject)(), _dec3 = Reflect.metadata("design:type", typeof _register.RegisterModel === "undefined" ? Object : _register.RegisterModel), _dec(_class = (_class2 = class RegisterController extends _react2.BaseReactController {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "registerModel", _descriptor, this);

    this.state = {
      IsExistEmail: true
    };
    this.formRef = _react.default.createRef();

    this.onFinish = values => {
      console.log("Success:", values);
    };

    this.sendEmailCode = async () => {
      const email = this.formRef.current?.getFieldValue("email");
      await this.registerModel.sendEmailCode(email);
    };
  }

  renderView() {
    return _react.default.createElement('div', 'jsx placeholder');
  }

}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "registerModel", [_dec2, _dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class);
exports.default = RegisterController;