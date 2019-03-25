module.exports = {
    async onConnect(socket) {
        console.log('connect');
        await this.send(socket, {
            event: 'message',
            message: {
                type: 'welcome',
                val: `Hello ${socket.user.result.nickName}`
            }
        });
        await this.send(socket, {
            event: 'message',
            message: {
                type: 'goodbye',
                val: `Good Bye!`
            }
        });

        this.receive(socket, {
            event: 'message',
            callback: (data) => {
                console.log(`The client says: ${data}`);
            }
        });

        setTimeout(() => {
            this.close(socket);
        }, 2000);
    },
    onDisconnect(socket) {
        console.log('close');
    },
    onError(err, socket) {
        console.log('err:', err);
    }
};
