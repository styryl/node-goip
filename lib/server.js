'use strict';

const dgram = require('dgram');
const GoipRequest = require('./request');

module.exports = class Server {

    constructor({port, address, messageFactory, messageDispatcher}) {
        this._port = port;
        this._address = address;
        this._messageFactory = messageFactory;
        this._messageDispatcher = messageDispatcher;
        this._socket = dgram.createSocket('udp4');
    }

    _send(msg, address, port) {
        this._socket.send(msg, 0, msg.length, port, address )
    }

    run() {

        this._socket.on('error',this._errorHandler.bind(this));
          
        this._socket.on('message', this._messageHandler.bind(this));
          
        this._socket.on('listening', this._listeningHandler.bind(this));
          
        this._socket.bind(this._port, this._address);
    }

    _messageHandler(msg, rinfo) {
        const req = this._makeGoipRequest(msg,rinfo);
        const message = this._messageFactory.make( req ); 
        
        if( message.ack() ) {
            this._send( message.ack(), rinfo.address, rinfo.port );  
        } 
            
        this._messageDispatcher.dispatch( 'message', message );  
        this._messageDispatcher.dispatch( message.constructor.name.toLowerCase(), message );  
    }

    _errorHandler() {
        this.close();
    }

    _listeningHandler() {
        const address = this._socket.address();
        console.log(`server listening ${address.address}:${address.port}`);
    }

    _makeGoipRequest(msg,rinfo) {
        return new GoipRequest(msg.toString('utf-8'),rinfo.address,rinfo.port);
    }

    close() {
        this._socket.close()
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

    onServerListening( callback ) {
        this._socket.on('listening', callback);
    }
};