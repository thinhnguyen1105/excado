"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadsRouter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var express = _interopRequireWildcard(require("express"));

var _replace = _interopRequireDefault(require("lodash/replace"));

var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));

var path = _interopRequireWildcard(require("path"));

var _core = require("../../../../core");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var downloadsRouter = express.Router();
exports.downloadsRouter = downloadsRouter;
downloadsRouter.get('/excel-template',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(req, res) {
    var idToken, decodedIdToken;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            idToken = (0, _replace.default)(req.headers.authorization || req.cookies.token, 'Bearer ', '');
            _context.next = 4;
            return _firebaseAdmin.default.auth().verifyIdToken(idToken);

          case 4:
            decodedIdToken = _context.sent;

            if (!(decodedIdToken.roles.indexOf('5c7f747708898183ac62f2af') > -1)) {
              _context.next = 9;
              break;
            }

            res.download(path.join(__dirname, "../../../../../../import-news-template.xlsx"));
            _context.next = 10;
            break;

          case 9:
            throw new _core.NotAuthorizedError();

          case 10:
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            res.status(_context.t0.status || 500).send(_context.t0.message || 'Internal Server Error');

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
//# sourceMappingURL=download.router.js.map