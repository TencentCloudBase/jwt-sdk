function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

// eslint-disable-next-line no-unused-vars
var regeneratorRuntime = require('./polyfill');

var Auth =
/*#__PURE__*/
function () {
  function Auth(options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        _options$storageKey = _options.storageKey,
        storageKey = _options$storageKey === void 0 ? 'tcb-token' : _options$storageKey;
    this.storageKey = storageKey;

    if (typeof wx !== 'undefined') {
      this.isMiniprogram = true;
    }
  }
  /**
   * 获取小程序token
   */


  var _proto = Auth.prototype;

  _proto.getToken = function getToken() {
    var token;

    if (this.isMiniprogram) {
      token = wx.getStorageSync(this.storageKey);
    }

    return token;
  }
  /**
   * 小程序用户鉴权
   * @param {object} userInfo 小程序用户信息
   * @return {string} 用户 jwt token
   */
  ;

  _proto.login =
  /*#__PURE__*/
  function () {
    var _login = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(userInfo) {
      var r, res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return wx.cloud.callFunction({
                name: 'tcb-auth',
                data: {
                  action: 'login',
                  data: userInfo
                }
              });

            case 2:
              r = _context.sent;
              res = r.result;

              if (!res.data) {
                _context.next = 9;
                break;
              }

              wx.setStorageSync(this.storageKey, res.data.token);
              return _context.abrupt("return", res.data.token);

            case 9:
              throw new Error('Login Failed');

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function login(_x) {
      return _login.apply(this, arguments);
    }

    return login;
  }()
  /**
   * 小程序用户登出
   */
  ;

  _proto.logout = function logout() {
    if (this.isMiniprogram) {
      wx.removeStorageSync(this.storageKey);
    }
  } // 首次授权后，可自动获取用户信息并登陆
  ;

  _proto.autoLogin =
  /*#__PURE__*/
  function () {
    var _autoLogin = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var _this = this;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", new Promise(function (resolve, reject) {
                wx.getSetting({
                  success: function success(res) {
                    if (res.authSetting['scope.userInfo']) {
                      // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                      wx.getUserInfo({
                        success: function success(res) {
                          if (!wx.getStorageSync(_this.storageKey)) {
                            _this._getAuth(res);
                          }

                          resolve(res);
                        },
                        fail: function fail() {
                          _this.logout();

                          reject(new Error('wx.getUserInfo failed'));
                        }
                      });
                    } else {
                      _this.logout();

                      resolve(); // reject(new Error('scope.userInfo permission should be got.'));
                    }
                  },
                  fail: function fail() {
                    _this.logout();

                    reject(new Error('wx.getSetting failed'));
                  }
                });
              }));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function autoLogin() {
      return _autoLogin.apply(this, arguments);
    }

    return autoLogin;
  }()
  /**
   * 首次授权，获取用户信息并登陆
   * @param {object} e 小程序授权按钮事件及数据
   * @return {object} 用户信息
   */
  ;

  _proto.tapToLogin =
  /*#__PURE__*/
  function () {
    var _tapToLogin = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(e) {
      var info;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              info = e.detail;
              _context3.next = 3;
              return this._getAuth(info);

            case 3:
              return _context3.abrupt("return", info);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function tapToLogin(_x2) {
      return _tapToLogin.apply(this, arguments);
    }

    return tapToLogin;
  }();

  _proto._getAuth =
  /*#__PURE__*/
  function () {
    var _getAuth2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(info) {
      var result;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.login(info);

            case 2:
              result = _context4.sent;
              return _context4.abrupt("return", result);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function _getAuth(_x3) {
      return _getAuth2.apply(this, arguments);
    }

    return _getAuth;
  }();

  return Auth;
}();

// eslint-disable-next-line no-unused-vars
var regeneratorRuntime$1 = require('./polyfill');

var TcbJwt =
/*#__PURE__*/
function () {
  function TcbJwt(options) {
    if (options === void 0) {
      options = {};
    }

    this.options = options;
  }
  /**
   * 鉴权对象
   */


  _createClass(TcbJwt, null, [{
    key: "auth",
    get: function get() {
      return new Auth(this.options);
    }
  }]);

  return TcbJwt;
}();

export default TcbJwt;
