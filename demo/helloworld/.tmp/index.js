// 接入 Koa2
const Koa = require('koa');
const app = new Koa();
const TcbServerWS = require('@cloudbase/websocket-sdk');
const server = require('http').Server(app.callback());

const userApp = require('./app.js');

const tcbServerWS = new TcbServerWS(server, {
    config: {
        secretId: 'AKIDe7ewComxskQVKMotiHl4G5mySSMdC1SL',
        secretKey: 'HKArSwiNxemmrmHkBYFafQ5MSKU3IH8q'
    }
});

tcbServerWS.open({
    connect: userApp.onConnect ? userApp.onConnect.bind(tcbServerWS) : () => {},
    disconnecting: userApp.disconnecting ? userApp.disconnecting.bind(tcbServerWS) : () => {},
    disconnect: userApp.onDisconnect ? userApp.onDisconnect.bind(tcbServerWS) : () => {},
    error: userApp.onError ? userApp.onError.bind(tcbServerWS) : () => {}
});

server.listen(3000);