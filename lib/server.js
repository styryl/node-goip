const dgram = require('dgram');
const GoipRequest = require('./request');

module.exports = class Server {

    constructor(port, {address, messageFactory, messageDispatcher} = {}) {
        this._port = port;
        this._address = address;
        this._socket = dgram.createSocket('udp4');
        this._messageFactory = messageFactory;
        this._messageDispatcher = messageDispatcher;
    }

    send(msg, address, port) {
        this._socket.send(msg, 0, msg.length, port, address )
    }

    run() {
        
        this._socket.on('error', (err) => {
            console.log(`server error:\n${err.stack}`);
            this._socket.close();
        });
          
        this._socket.on('message', (msg, rinfo) => {
            const req = new GoipRequest(msg.toString('utf-8'),rinfo.address,rinfo.port);
            const message = this._messageFactory.make( req ); 
            
            if( message.ack() ) {
                this.send( message.ack(), rinfo.address, rinfo.port );  
            } 
             
            this._messageDispatcher.dispatch( message.constructor.name.toLowerCase(), message );  
        });
          
        this._socket.on('listening', () => {
            const address = this._socket.address();
            console.log(`server listening ${address.address}:${address.port}`);
        });
          
        this._socket.bind(this._port, this._address);
    }

    onMessage( message, callback ) {
        this._messageDispatcher.listen(message,callback);
    }

    onAll( callback ) {
        this.onMessage('message', callback)
    }

    onRequest( callback ) {
        this.onMessage( 'request', callback );
    }

    onNotSupported( callback ) {
        this.onMessage( 'notsupported', callback );
    }

    onReceive( callback ) {
        this.onMessage( 'receive', callback );
    }

    onDeliver( callback ) {
        this.onMessage( 'deliver', callback );
    }

    onHangup( callback ) {
        this.onMessage( 'hangup', callback );
    }

    onRecord( callback ) {
        this.onMessage( 'record', callback );
    }

    onState( callback ) {
        this.onMessage( 'state', callback );
    }

    onServerError( callback ) {
        this._socket.on('error', callback);
    }

    onListening( callback ) {
        this._socket.on('listening', callback);
    }
};