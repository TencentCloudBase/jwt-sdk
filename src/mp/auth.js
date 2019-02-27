export default class Auth {
    constructor(storageKey) {
        this.storageKey = storageKey || 'tcb-token';
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
     * @param {Object} userInfo 小程序用户信息
     */
    login(userInfo) {
        return wx.cloud.callFunction({
            name: 'auth',
            data: {
                action: 'login',
                data: userInfo
            }
        }).then(r => {
            let res = r.result;
            if (res.data) {
                wx.setStorageSync(this.storageKey, res.data.token);
                return res.data.token;
            } else {
                throw new Error('login failed');
            }
        });
    }

    /**
     * 小程序用户登出
     */
    logout() {
        if (this.isMiniprogram) {
            wx.removeStorageSync(this.storageKey);
        }
    }
}
