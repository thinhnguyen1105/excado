"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CategoryInputError = void 0;

var _errors = require("@feathersjs/errors");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CategoryInputError =
/*#__PURE__*/
function (_BadRequest) {
  _inherits(CategoryInputError, _BadRequest);

  function CategoryInputError(message) {
    var _this;

    _classCallCheck(this, CategoryInputError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CategoryInputError).call(this, message));
    _this.name = 'CategoryInputError';
    return _this;
  }

  return CategoryInputError;
}(_errors.BadRequest);

exports.CategoryInputError = CategoryInputError;
//# sourceMappingURL=CategoryInputError.js.map