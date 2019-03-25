// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from './polyfill';
import io from './socket.io-client';
import Utils from '../common/utils';

export default class TcbClientWS {

    constructor(url, options = {}) {
        this.io = io;
        this.socket = null;
        this.url = url;
        this.options = options;
        this.roomID = null;
    }

    /**
     *  建立 WebSocket 连接
     */
    open({ connect = null, disconnect = null } = {}) {
        this.socket = io(this.url, {
            transports: ['websocket'],
            ...this.options
        });
        this.socket.on('connect', () => {
            Utils.isFunction(connect) && connect.bind(this)(this.socket);
        });
        this.socket.on('disconnect', () => {
            Utils.isFunction(disconnect) && disconnect.bind(this)(this.socket);
        });
        return this.socket;
    }

    /**
     * 断开 WebSocket 连接
     */
    close() {
        if (this.socket) {
            this.socket.close();
        }
    }

    async join(roomID) {
        if (this.roomID) {
            await this.leave();
        }

        return new Promise((resolve, reject) => {

            if (!roomID) {
                return reject(new Error('roomID is null.'));
            }

            this.socket.emit('tcb-join-room', roomID, (data) => {
                this.roomID = roomID;
                resolve(data);
            });
        });
    }

    async leave(roomIDParam = null) {
        let roomID = this.roomID || roomIDParam;
        return new Promise((resolve, reject) => {
            if (!roomID) {
                return reject(new Error('roomID is null.'));
            }
            this.socket.emit('tcb-leave-room', roomID, (data) => {
                this.roomID = null;
                resolve(data);
            });
        });
    }

    async send({ event, message }) {
        return new Promise((resolve, reject) => {
            this.socket.emit(event, message, () => {
                resolve();
            });

        });
    }

    receive({ event, callback }) {
        this.socket.on(event, (data, ack) => {
            Utils.isFunction(callback) && callback(data);
            Utils.isFunction(ack) && ack(data);
        });
    }
}
