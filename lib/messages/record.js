const Message = require('./message');

module.exports = class Record extends Message {
 
    ack() {
        return 'RECORD ' + this.record() + ' OK';
    }

    record() {
        this.request().get('record');
    }

    dir() {
        return this.request().get('dir');
    }


    num() {
        return this.request().get('num');
    }


}