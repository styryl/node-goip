const Message = require('./message');

module.exports = class Req extends Message {
    
    ack() {
        return 'req:' + this.req() + ';status:200;';
    }
    
    req() {
        this.request().get('req');
    }

    password() {
        this.request().get('pass');
    }

    num()
    {
        return this.request().get('num');
    }

    signal() {
        return this.request().get('signal');
    }

    gsmStatus() {
        return this.request().get('gsm_status');
    }

    voipStatus() {
        return this.request().get('voip_status');
    }

    voipState() {
        return this.request().get('voip_state');
    }

    remainTime() {
        return this.request().get('remain_time');
    }

    imei() {
        return this.request().get('imei');
    }


    pro() {
        return this.request().get('pro');
    }

    idle() {
        return this.request().get('idle');
    }

    disableStatus() {
        return this.request().get('disable_status');
    }

    smsLogin() {
        return this.request().get('sms_login');
    }

    smbLogin() {
        return this.request().get('smb_login');
    }

    cellinfo() {
        return this.request().get('cellinfo');
    }

    cgatt() {
        return this.request().get('cgatt');
    }
}