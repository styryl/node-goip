const Message = require('./message');

module.exports = class State extends Message {
    
    ack() {
        return 'STATE ' + this.state() + ' OK';
    }

    state() {
        this.request().get('state');
    }

    gsmRemainState()
    {
        return this.request().get('gsm_remain_state');
    }

}