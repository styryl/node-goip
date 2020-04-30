'use strict';

const MessageDispatcher = require('./message-dispatcher');
const MessageFactory = require('./message-factory');
const Server = require('./server');

module.exports = class ServerFactory {
    static make( port, {address, messageFactory, messageDispatcher} = {}) {

        const messageFactoryInstance = messageFactory || new MessageFactory();
        const messageDispatcherInstance = messageDispatcher || new MessageDispatcher();
        return new Server({
            'port': port,
            'address': address,
            'messageFactory': messageFactoryInstance,
            'messageDispatcher': messageDispatcherInstance    
        });
    }
}