const EventEmiiter = require('events').EventEmitter;

module.exports = class MessageDispatcher extends EventEmiiter {
    
    dispatch(type, message) {
        this.emit('message', message);
        this.emit(type, message);
    }

    listen(message, callback) {
        this.on(message, callback);
    }

};