const Message = require('./message');

module.exports = class Hengup extends Message {
 
    ack() {
        return 'HANGUP ' + this.hangup() + ' OK';
    }

    hangup() {
        return this.request().get('hangup');
    }

    num() {
        return this.request().get('num');
    }

}