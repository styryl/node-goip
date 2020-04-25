const Message = require('./message');

module.exports = class Deliver extends Message {
    
    ack() {
        return 'DELIVER ' + this.deliver() + ' OK';
    }

    deliver() {
        return this.request().get('deliver');
    }

    smsNo() {
        return this.request().get('sms_no');
    }

    state() {
        return this.request().get('state');
    }

    num() {
        return this.request().get('num');
    }
    
}