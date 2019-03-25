const path = require('path');
const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const TcbServerWS = require('./websocket-node-sdk');
const config = require('./config');

// 指向静态文件文件夹
app.use(serve(path.resolve(__dirname, './static')));

// 必须放在在所有app.use()之后
const server = require('http').Server(app.callback());
const tcbServerWS = new TcbServerWS(server, { config });
const DB = tcbServerWS.tcb.database();

async function leaveRoom(socket) {
    try {
        // 离开房间，从房间中将用户自己删除，如果再没有用户了，将房间也删除
        let user = socket.user;
        let room = await DB.collection('rooms').where({
            room: socket.room,
        }).get();
        let roomData = room.data || [];

        if (roomData.length) {
            let member = roomData[0].member;
            let index = member.indexOf(user.openId);

            if (index > -1) {
                member.splice(index, 1);
            }

            // 还有用户，则更新用户清单
            if (member.length) {
                await DB.collection('rooms').doc(roomData[0]._id).update({
                    member
                });
            }
            // 没有用户连房间也删除
            else {
                await DB.collection('rooms').doc(roomData[0]._id).remove();
            }
        }
    }
    catch (e) {
        console.error(e);
    }
}

async function joinRoom(socket, roomID) {
    try {
        let room = await DB.collection('rooms').where({
            room: roomID,
        }).get();
        let roomData = room.data || [];

        if (!roomData.length) {
            await DB.collection('rooms').add({
                room: roomID,
                member: [socket.user.openId]
            });
        }
        else {
            let member = new Set(roomData[0].member);
            member.add(socket.user.openId);
            await DB.collection('rooms').doc(roomData[0]._id).update({
                member: Array.from(member)
            });
        }
        socket.room = roomID;
    }
    catch (e) {
        console.error(e);
    }
}

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

tcbServerWS.open({
    connect: async (socket) => {
        const { user = {}} = socket;
        console.log('connect ' + socket.id);

        // await tcbServerWS.log({
        //     connect: socket.id
        // });

        tcbServerWS.onJoin(socket, async (roomID) => {
            // 加入房间
            await tcbServerWS.join(socket, roomID);
            let event = 'message';

            await joinRoom(socket, roomID);

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
            let roomID = socket.room;
            await leaveRoom(socket);
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
                let roomID = socket.room;
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
    error: (e) => {
        console.log(e);
    },
    disconnecting: (socket) => {
        console.log('disconnecting ' + socket.id);
    },
    disconnect: async (socket) => {
        const { user = {}} = socket;
        console.log('disconnect ' + socket.id);
        let roomID = socket.room;

        await leaveRoom(socket);

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

server.listen(3000);
