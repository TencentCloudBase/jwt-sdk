const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const TcbServerWS = require('./tcb-websocket-node-sdk');
const config = require('./config');

// 指向静态文件文件夹
app.use(serve('./static'));

// 必须放在在所有app.use()之后
const server = require('http').Server(app.callback());
const tcbServerWS = new TcbServerWS(server, { config });

let appData = {
    roomList: {
        'Lobby': {}
    },
    sockets: {},

    async joinRoom(socket, roomID) {
        appData.sockets[socket.id] = {
            room: roomID
        };

        if (!this.roomList.hasOwnProperty(roomID)) {
            this.roomList[roomID] = {};
        }

        if (!this.roomList[roomID].hasOwnProperty(socket.id)) {
            this.roomList[roomID][socket.id] = true;
        }

        await tcbServerWS.send(socket, { mode: 'broadcast', event: 'room-list', message: this.roomList });
        await tcbServerWS.send(socket, { event: 'room-list', message: this.roomList });

    },

    async leaveRoom(socket) {
        let roomID = this.sockets[socket.id].room;
        this.sockets[socket.id] = {
            room: ''
        };

        if (this.roomList.hasOwnProperty(roomID) && this.roomList[roomID].hasOwnProperty(socket.id)) {
            delete this.roomList[roomID][socket.id];

            if (roomID !== 'Lobby' && !Object.keys(this.roomList[roomID]).length) {
                delete this.roomList[roomID];
            }
        }

        await tcbServerWS.send(socket, { mode: 'broadcast', event: 'room-list', message: this.roomList });
        await tcbServerWS.send(socket, { event: 'room-list', message: this.roomList });
    }
};

async function sendMessage(socket, { roomID, event, msgRoom, msgSelf }) {
    await tcbServerWS.send(socket, {
        roomID,
        event,
        message: msgSelf,
        // ack: (data) => {
        //     console.log('====ack=====');
        //     console.log(data);
        // }
    });

    await tcbServerWS.send(socket, {
        roomID,
        mode: 'room',
        event,
        message: msgRoom,
    });
}

// tcbServerWS.io.use(async (socket, next) => {
//     let token = socket.handshake.query.token;

//     let res = (await tcbServerWS.verifyLogin(token)).result;
//     // console.log(res);

//     if (res.code) {
//         return next(new Error(res.code));
//     } else {
//         socket.user = res;
//         return next();
//     }
// });

tcbServerWS.open({
    connect: async (socket) => {
        const { user = {}} = socket;
        console.log('connect ' + socket.id);
        appData.sockets[socket.id] = {
            room: ''
        };

        tcbServerWS.onJoin(socket, async (roomID) => {
            // 加入房间
            await tcbServerWS.join(socket, roomID);
            let event = 'message';

            if (appData.sockets[socket.id].room) {
                let msgRoom = {
                    type: 'exit',
                    nickName: user.nickName || 'anonymity',
                    avatarUrl: user.avatarUrl,
                    value: `exits room ${roomID}.`
                };
                let msgSelf = {
                    type: 'exit',
                    nickName: user.nickName || 'anonymity',
                    avatarUrl: user.avatarUrl,
                    isSelf: true,
                    value: `exit room ${roomID}.`
                };

                await appData.leaveRoom(socket);

                sendMessage(socket, { roomID: appData.sockets[socket.id].room, event, msgRoom, msgSelf });
            }

            await appData.joinRoom(socket, roomID);

            let msgRoom = {
                type: 'join',
                nickName: user.nickName || 'anonymity',
                avatarUrl: user.avatarUrl,
                value: `enters room ${roomID}.`
            };
            let msgSelf = {
                type: 'join',
                nickName: user.nickName || 'anonymity',
                avatarUrl: user.avatarUrl,
                isSelf: true,
                value: `enter room ${roomID}.`
            };

            sendMessage(socket, { roomID, event, msgRoom, msgSelf });

        });

        tcbServerWS.onLeave(socket, async (data) => {
            // 离开房间
            let roomID = appData.sockets[socket.id].room;
            await appData.leaveRoom(socket);
            await tcbServerWS.leave(socket, roomID);

            let event = 'message';
            let message = {
                type: 'exit',
                nickName: user.nickName || 'anonymity',
                avatarUrl: user.avatarUrl,
                value: `exits room ${roomID}.`
            };

            await tcbServerWS.send(socket, {
                roomID,
                mode: 'room',
                event,
                message,
            });
        });

        tcbServerWS.receive(socket, {
            event: 'message',
            callback: (data) => {
                let roomID = appData.sockets[socket.id].room;
                let event = 'message';
                let msgRoom = {
                    type: 'message',
                    nickName: user.nickName || 'anonymity',
                    avatarUrl: user.avatarUrl,
                    value: `${data}`
                };
                let msgSelf = {
                    type: 'message',
                    nickName: user.nickName || 'anonymity',
                    avatarUrl: user.avatarUrl,
                    isSelf: true,
                    value: `${data}`
                };

                sendMessage(socket, { roomID, event, msgRoom, msgSelf });
            }
        });

    },
    disconnecting: (socket) => {
        console.log('disconnecting ' + socket.id);
    },
    disconnect: async (socket) => {
        const { user = {}} = socket;
        console.log('disconnect ' + socket.id);
        let roomID = appData.sockets[socket.id].room;

        await appData.leaveRoom(socket);

        let event = 'message';
        let message = {
            type: 'exit',
            nickName: user.nickName || 'anonymity',
            avatarUrl: user.avatarUrl,
            value: `exits room ${roomID}.`
        };

        await tcbServerWS.send(socket, {
            roomID,
            mode: 'room',
            event,
            message,
        });
    }
});

server.listen(1809);
