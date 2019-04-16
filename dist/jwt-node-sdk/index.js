'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tcbAdminNode = _interopDefault(require('tcb-admin-node'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var os = _interopDefault(require('os'));

class TcbJwt {

    constructor(options = {}) {
        this.options = options;
        let {
            isAutoLogin = true,
            isLogOff = false,
            type = 'http',
            tcb,
            tcbConfig = {}
        } = options;

        this.isAutoLogin = isAutoLogin;
        this.isLogOff = isLogOff;
        this.type = type;
        this.tcb = tcb || tcbAdminNode.init(tcbConfig);
    }

    /**
     * 校验登陆态
     * @param {String} token login 获取到的 token
     */
    async verifyLogin(token) {
        return this.tcb.callFunction({
            name: 'tcb-auth',
            data: {
                action: 'verify',
                token
            }
        });
    }

    /**
     * 自动帮助用户校验登陆
     * @param {Socket} socket
     */
    async _autoVerifyWebsocketLogin(socket) {
        let token = socket.handshake.query.token || null;

        let res = (await this.verifyLogin(token));
        if (res.code || res.result.code) {
            throw new Error(res.code || res.result.code);
        }
        else {
            // 将用户信息存放到内存里了
            socket.user = res.result;
        }
    }

    /**
     * 自动帮助用户校验登陆
     * @param {Context} ctx
     */
    async _autoVerifyHttpLogin(ctx) {
        let token = ctx.request.query ? ctx.request.query.token : null;

        let res = (await this.verifyLogin(token));
        if (res.code || res.result.code) {
            throw new Error(res.code || res.result.code);
        }
        else {
            // 将用户信息存放到内存里了
            ctx.user = res.result;
        }
    }

    async init(obj) {
        // 鉴权
        if (this.isAutoLogin && this.type === 'http') {
            let ctx = obj;
            await this._autoVerifyHttpLogin(ctx);
        }
        else if (this.isAutoLogin && this.type === 'websocket') {
            let socket = obj;
            await this._autoVerifyWebsocketLogin(socket);
        }
    }

    /**
     * 打log
     * @param {Ojbect} jsonObj object 对象
     * @param {String} logPathParam 用户自定义的log路径
     */
    async log(jsonObj, logPathParam = null) {
        if (this.isLogOff) {
            return Promise.resolve();
        }

        let isWin = os.platform() === 'win32';
        let logPath = isWin ? path.resolve('./server.log') : '/data/logs/server.log';
        logPath = logPathParam ? logPathParam : logPath;

        return new Promise((resolve, reject) => {
            try {
                let jsonStr = JSON.stringify(jsonObj);
                fs.appendFile(logPath, `${jsonStr}\r\n`, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
}

var node = TcbJwt;

module.exports = node;
