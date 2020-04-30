const dgram = require('dgram');
const {randomInt} = require('../util');

module.exports = class SocketSms {

    constructor(address,port,password, timeout = 8000) {
        
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
        this._timeout = timeout;

        this._socket.on('message', (msg) => {
            let utf8msg = msg.toString('utf-8');
             
            if( utf8msg && this._checkResponse( utf8msg, 'ERROR', this._id) ) {
                
                this._socket.emit('expected-' + this._expectedResponse, {
                    'status': this._requestStatus.error,
                    'error': new Error(this._pendingRequest + ': ' + utf8msg)
                });

                this.close();
            }

            if( utf8msg && this._checkResponse(utf8msg, this._expectedResponse, this._id) ) {

                this._socket.emit('expected-' + this._expectedResponse, {
                    'status': this._requestStatus.success,
                    'message': utf8msg
                });
            }
        });
    }

    _isTimeout ( reject ) {
        this._timeoutHandler = setTimeout(() => {
            reject( new Error('Timeout in ' + this._pendingRequest) )
            this.close()
        }, this._timeout)
    }

    _checkResponse( msg, expected, id ) {
        return msg.substr(0, ( 1 + expected.length +  id.toString().length ) ) === expected + ' ' + id.toString();
    }

    async send(number,message,id) {

        this._id = id || randomInt(10000,99999);

        const bulk = await this._sendBulkSmsRequest(message,this._id);
        const auth = await this._sendAuthRequest(this._password, this._id);
        const send = await this._sendNumberRequest(number,this._id);
        const end = await this._sendEndRequest(this._id);

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
            this._socket.once('expected-' + expected, (res) => {
                clearTimeout(this._timeoutHandler);
                if( res.status === this._requestStatus.error ) {
                    reject( res.error );
                } else {
                    resolve( res.message )
                }
            });
            this._socket.send(message, 0, message.length, this._port, this._address );
            this._isTimeout(reject);
        });  
    }

    _sendBulkSmsRequest( message, id ) {
        const cutmessage = message.substr(0,3000)
        const msg = 'MSG ' + id + ' ' + cutmessage.length + ' ' + cutmessage;
        return this._sendRequest(msg, 'PASSWORD', 'sendBulkSmsRequest');
    }

    _sendAuthRequest(password,id) {
        const msg = 'PASSWORD ' + id + ' ' + password;
        return this._sendRequest(msg, 'SEND', 'sendAuthRequest');
    }

    _sendNumberRequest( number, id ) {
        const msg = 'SEND ' + id + ' 1 ' + number;
        return this._sendRequest(msg, 'OK', 'sendNumberRequest');
    }

    _sendEndRequest(id) {
        const msg = 'DONE ' + id;
        return this._sendRequest(msg, 'DONE', 'sendEndRequest');
    }

}