const socketIO = require('socket.io');
const Tcb = require('tcb-admin-node');
import Utils from '../common/utils';

class TcbServerWS {

    constructor(server, options = {}) {

        this.server = server;
        this.namespace = options.namespace || '/';
        this.options = options;

        this.io = this.io = socketIO(server, {
            ...options
        }).of(this.namespace);

        this.sockets = {};

        this.tcb = Tcb.init(options.config);

    }

    /**
     * 校验登陆态
     * @param {String} token login 获取到的 token
     */
    async verifyLogin(token) {
        return this.tcb.callFunction({
            name: 'auth',
            data: {
                action: 'verify',
                token
            }
        });
    }

    /**
     * 监听是否有客户端的链接尝试建立
     * @param {Object} param
     * @param {Function} param.connect 客户端成功与服务端建立连接回调
     * @param {Function} param.disconnecting 客户端与服务端正在断开连接回调
     * @param {Function} param.disconnect 客户端与服务端断开连接回调
     * @param {Function} param.error 错误信息回调
     */
    open({ connect = null, disconnecting = null, disconnect = null, error = null } = {}) {
        this.io.on('connect', (socket) => {
            if (!this.sockets.hasOwnProperty(socket.id)) {
                this.sockets[socket.id] = socket;
            }

            Utils.isFunction(connect) && connect.bind(this)(socket);

            // 监听正在断开连接的事件
            socket.on('disconnecting', () => {
                Utils.isFunction(disconnecting) && disconnecting.bind(this)(socket);
            });

            // 监听已经断开连接的事件
            socket.on('disconnect', () => {
                if (this.sockets.hasOwnProperty(socket.id)) {
                    delete this.sockets[socket.id];
                }
                Utils.isFunction(disconnect) && disconnect.bind(this)(socket);
            });

            // 监听报错事件
            socket.on('error', (err) => {
                Utils.isFunction(error) && error.bind(this)(err);
            });
        });
    }

    /**
     * 服务端 socket 断开服务
     * @param {Object} socket socket 对象
     */
    close(socket) {
        socket.disconnect(true);
    }

    /**
     * 加入房间
     * @param {Object} socket socket 对象
     * @param {String} roomID 房间ID
     * @return {Promise}
     */
    async join(socket, roomID) {
        return new Promise((resolve, reject) => {
            socket.join(roomID, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    /**
     * 离开房间
     * @param {Object} socket socket 对象
     * @param {String} roomID 房间ID
     * @return {Promise}
     */
    async leave(socket, roomID) {
        return new Promise((resolve, reject) => {
            socket.leave(roomID, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    /**
     * 监听加入房间事件
     * @param {Object} socket socket 对象
     * @param {String} callback 事件回调
     */
    onJoin(socket, callback) {
        socket.on('tcb-join-room', (data, ack) => {
            Utils.isFunction(callback) && callback(data);
            Utils.isFunction(ack) && ack(data);
        });
    }

    /**
     * 监听离开房间事件
     * @param {Object} socket socket 对象
     * @param {String} callback 事件回调
     */
    onLeave(socket, callback) {
        socket.on('tcb-leave-room', (data, ack) => {
            Utils.isFunction(callback) && callback(data);
            Utils.isFunction(ack) && ack(data);
        });
    }

    /**
     * 发送消息
     * @param {Object} socket socket 对象
     * @param {*} param
     * @param {String} param.event 事件名称
     * @param {String} param.mode 发送消息的模式
     * @param {String} param.roomID 房间ID
     * @param {String} param.message 消息数据
     * @param {Function} param.ack 接收客户端回调的数据
     * @return {Promise}
     */
    async send(socket, { roomID, mode, event, message, ack }) {
        switch (mode) {
            // 全世界广播
            case 'broadcast':
                return new Promise((resolve) => {
                    socket.broadcast.emit(event, message);
                    resolve();
                });
            // 发给房间里所有人，除了自己
            case 'room':
                return new Promise((resolve) => {
                    socket.to(roomID).emit(event, message);
                    resolve();
                });
            // 发送给自己
            default:
                return new Promise((resolve) => {
                    socket.emit(event, message, (data) => {
                        Utils.isFunction(ack) && ack(data);
                    });
                    resolve();
                });
        }
    }

    /**
     * 监听消息
     * @param {Object} socket socket 对象
     * @param {Object} param
     * @param {String} param.event 事件名称
     * @param {Function} param.callback 事件回调
     */
    receive(socket, { event, callback }) {
        socket.on(event, (data, ack) => {
            Utils.isFunction(callback) && callback(data);
            Utils.isFunction(ack) && ack(data); // 告诉客户端，我接收到了哪些数据
        });
    }
}

module.exports = TcbServerWS;
