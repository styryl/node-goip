const Socket = require('dgram').Socket;

module.exports = class FakeSocketServer extends Socket {

    close() {}

    send(msg,offset,length,port,address) {
        const message = msg.trim();
        const id = message.split(' ')[1];

        if( message === 'test message' ) {
            this.emit('expected-test-message', {
                'status': 2,
                'message': 'test message ok'
            });
        };

        if( message === 'test error' ) {
            this.emit('expected-test-error', {
                'status': 0,
                'error': new Error('test error')
            });
        };

        if( message.includes('MSG') ) {
            this.emit('expected-PASSWORD', {
                'status': 2,
                'message': 'PASSWORD ' + id
            });
        };

        if( message.includes('PASSWORD') ) {
            this.emit('expected-SEND', {
                'status': 2,
                'message': 'SEND ' + id
            });
        };

        if( message.includes('SEND') ) {
            this.emit('expected-OK', {
                'status': 2,
                'message': 'OK '+id+' 1 11'
            });
        };

        if( message.includes('DONE') ) {
            this.emit('expected-DONE', {
                'status': 2,
                'message': 'DONE ' + id
            });
        };
    }
}