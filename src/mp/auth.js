// eslint-disable-next-line no-unused-vars
const regeneratorRuntime = require('./polyfill');

export default class Auth {
    constructor(options = {}) {
        let {
            storageKey = 'tcb-token',
        } = options;
        this.storageKey = storageKey;

        if (typeof wx !== 'undefined') {
            this.isMiniprogram = true;
        }
    }

    /**
     * 获取小程序token
     */
    getToken() {
        let token;
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
    async login(userInfo) {
        let r = await wx.cloud.callFunction({
            name: 'auth',
            data: {
                action: 'login',
                data: userInfo
            }
        });

        let res = r.result;
        if (res.data) {
            wx.setStorageSync(this.storageKey, res.data.token);
            return res.data.token;
        } else {
            throw new Error('Login Failed');
        }
    }

    /**
     * 小程序用户登出
     */
    logout() {
        if (this.isMiniprogram) {
            wx.removeStorageSync(this.storageKey);
        }
    }

    // 首次授权后，可自动获取用户信息并登陆
    async autoLogin() {
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success: (res) => {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        wx.getUserInfo({
                            success: (res) => {
                                if (!wx.getStorageSync(this.storageKey)) {
                                    this._getAuth(res);
                                }

                                resolve(res);
                            },
                            fail: () => {
                                this.logout();
                                reject(new Error('wx.getUserInfo failed'));
                            }
                        });
                    }
                    else {
                        this.logout();
                        resolve();
                        // reject(new Error('scope.userInfo permission should be got.'));
                    }
                },
                fail: () => {
                    this.logout();
                    reject(new Error('wx.getSetting failed'));
                }
            });
        });
    }

    /**
     * 首次授权，获取用户信息并登陆
     * @param {object} e 小程序授权按钮事件及数据
     * @return {object} 用户信息
     */
    async tapToLogin(e) {
        let info = e.detail;
        await this._getAuth(info);
        return info;
    }

    async _getAuth(info) {
        let result = await this.login(info);
        return result;
    }
}
