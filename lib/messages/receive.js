const Message = require('./message');

module.exports = class Receive extends Message {
    
    ack() {
        return 'RECEIVE ' + this.receive() + ' OK';
    }

    receive() {
        this.request().get('receive');
    }

    srcnum()
    {
        return this.request().get('srcnum');
    }

    msg()
    {
        return this.request().get('msg');
    }
}