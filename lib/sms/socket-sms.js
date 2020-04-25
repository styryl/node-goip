const dgram = require('dgram');
const {randomInt} = require('../util');

module.exports = class SocketSms {

    constructor(address,port,password) {
        
        this._requestStatus = {
            error: 0,
            success: 2,
        };

        this._address = address;
        this._port = port;
        this._id = null;
        this._password = password;
        this._socket = dgram.createSocket('udp4');
        this._pendingRequest = null;
        this._expectedResponse = null;
        this._timeoutHandler = null;

        this._socket.on('message', (msg) => {
            let utf8msg = msg.toString('utf-8');
             
            if( utf8msg && this._checkResponse( utf8msg, 'ERROR') ) {
                
                clearTimeout(this._timeoutHandler);

                this._socket.emit('expected-' + this._expectedResponse, {
                    'status': this._requestStatus.error,
                    'message': new Error(this._pendingRequest + ': ' + utf8msg)
                });

                this.close();
            }

            if( utf8msg && this._checkResponse(utf8msg,this._expectedResponse) ) {

                clearTimeout(this._timeoutHandler);

                this._socket.emit('expected-' + this._expectedResponse, {
                    'status': this._requestStatus.success,
                    'message': utf8msg
                });
            }

            
        });
    }

    _isTimeout ( reject, time = 8000 ) {
        this._timeoutHandler = setTimeout(() => {
            reject( new Error('Timeout in ' + this._pendingRequest) )
            this.close()
        }, time)
    }

    _checkResponse( msg, expected ) {
        return msg.substr(0, ( 1 + expected.length +  this._id.toString().length ) ) === expected + ' ' + this._id.toString();
    }

    async send(number,message,id) {

        this._id = id || randomInt(10000,99999);

        const bulk = await this._sendBulkSmsRequest(message);
        const auth = await this._sendAuthRequest();
        const send = await this._sendNumberRequest(number);
        const end = await this._sendEndRequest();

        const prepare = send.trim().split(' ');

        return {
            'sendid': prepare[1], // bulk SMS session identifier
            'telid': prepare[2], // Integer, unique sequence number in SubmitNumberRequest.
            'sms_no': prepare[3], // number count of SMS sending in GoIP
            'raw': send.trim()
        };
    }

    async sendOne(number,message,id) {
        const send = await this.send(number,message,id);
        this.close();
        return send;
    }

    close() {
        this._socket.close();
    }

    _sendRequest(msg, expected, request) {
        this._expectedResponse = expected;
        this._pendingRequest = request;

        return new Promise( (resolve, reject) => {
            const message = msg + '\n';
            this._socket.send(message, 0, message.length, this._port, this._address );
            this._isTimeout(reject);
            this._socket.once('expected-' + expected, (res) => {

                if( res.status === this._requestStatus.error ) {
                    reject( res.message );
                } else {
                    resolve( res.message )
                }
            });
        });  
    }

    _sendBulkSmsRequest( message ) {
        const cutmessage = message.substr(0,3000)
        const msg = 'MSG ' + this._id + ' ' + cutmessage.length + ' ' + cutmessage;
        return this._sendRequest(msg, 'PASSWORD', 'sendBulkSmsRequest');
    }

    _sendAuthRequest() {
        const msg = 'PASSWORD ' + this._id + ' ' + this._password;
        return this._sendRequest(msg, 'SEND', 'sendAuthRequest');
    }

    _sendNumberRequest( number ) {
        const msg = 'SEND ' + this._id + ' 1 ' + number;
        return this._sendRequest(msg, 'OK', 'sendNumberRequest');
    }

    _sendEndRequest() {
        const msg = 'DONE ' + this._id;
        return this._sendRequest(msg, 'DONE', 'sendEndRequest');
    }

}