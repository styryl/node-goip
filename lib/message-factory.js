'use strict';

const ReqMessage = require('./messages/req');
const ReceiveMessage = require('./messages/receive')
const NotSupportedMessage = require('./messages/not-supported');
const DeliverMessage = require('./messages/deliver');
const HangupMessage = require('./messages/hangup')
const RecordMessage = require('./messages/record')
const StateMessage = require('./messages/state');

module.exports = class MessageFactory {
    
    constructor() {
        this._messages = {
            'req': ReqMessage,
            'receive': ReceiveMessage,
            'deliver': DeliverMessage,
            'hangup': HangupMessage,
            'record': RecordMessage,
            'state': StateMessage
        };
    }

    make( request ) {
        const type = Object.keys(request.all())[0];

        if( this._messages.hasOwnProperty(type) ) {
            return new this._messages[ type ]( request );
        }

        return new NotSupportedMessage(request);
    }
}