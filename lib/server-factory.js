const MessageDispatcher = require('./message-dispatcher');
const MessageFactory = require('./message-factory');
const Server = require('./server');

module.exports = class ServerFactory {
    static make( port, {address, customMessageFactory, customMessageDispatcher} = {}) {
        const messageFactory = ( customMessageFactory ) ? customMessageFactory : new MessageFactory();
        const messageDispatcher = ( customMessageDispatcher ) ? customMessageDispatcher : new MessageDispatcher();
        return new Server( port, {
            'address': address,
            'messageFactory': messageFactory,
            'messageDispatcher': messageDispatcher    
        });
    }
}