// eslint-disable-next-line no-unused-vars
const regeneratorRuntime = require('./polyfill');
import Auth from './auth';

export default class TcbJwt {

    constructor(options = {}) {
        this.options = options;
    }

    /**
     * 鉴权对象
     */
    static get auth() {
        return new Auth(this.options);
    }
}
