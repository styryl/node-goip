const fetch = require('node-fetch');
const xmlParser = require('fast-xml-parser');

module.exports = class HttpSms {

    constructor( url, line, login, password, options ) {
        
        this._url = this._prepareUrl(url);
        this._line = line;
        this._login = login;
        this._password = password;

        const defaults = {
            'sendDir': '/default/en_US/send.html',
            'statusDir': '/default/en_US/send_status.xml',
            'waitForStatus': false,
            'waitTime': 10
        };

        this._options = Object.assign(defaults, options);
    }

    async send(number, message) {

        const params = new URLSearchParams();
        params.append('u', this._login);
        params.append('p', this._password);
        params.append('l', this._line);
        params.append('n', number);
        params.append('m', message);

        const response = await fetch(this._url + this._options.sendDir + '?' + params);
        const data = await response.text();

        const parsedData = this._parse(data);

        if( this._options.waitForStatus ) {
            let isSendStatus = false;
            for( let i = 0; i <= this._options.waitTime; i++ ) 
            {
                isSendStatus = await this._waitForStatus( parsedData.id );
    
                if( isSendStatus ) {
                    parsedData.status = 'send';
                    break;
                }
            }
        }

        return parsedData;
    }

    _waitForStatus(id) {
        return new Promise( (resolve) => {
            setTimeout( () => {
                resolve( this.isSend( id ) );
            }, 1000)
        });
    }

    async isSend( id ) {

        const params = new URLSearchParams();
        params.append('u', this._login);
        params.append('p', this._password);

        const response = await fetch(this._url + this._options.statusDir + '?' + params);
        const data = await response.text();

        const xml = xmlParser.parse(data);
        const statusList = xml['send-sms-status'];

        if( ! statusList ) {
            throw new Error('Sms send status not found!');
        }

        const smsId = statusList['id'+this._line];
        const status = statusList['status'+this._line];
        const error = statusList['error'+this._line];

        if( !smsId || smsId !== id ) {
            return false;
        }

        if( error )
        {
            throw new Error(error);
        }

        if( status.toLowerCase() === 'done' ) {
            return true;
        }

        return false;

    }

    _parse( response ) {

        const res = response.trim().toLowerCase();

        if( res.includes('error') || !res.includes('sending') ) {
            throw new Error(response)
        }

        const arr = res.split(';');

        if( !arr[arr.length -1 ].includes('id') ) {
            throw new Error("Sms id not found in respons");
        }

        const id = arr[arr.length -1 ].split(':')[1];

        return {
            'id': id,
            'raw': response.trim(),
            'status': 'sending'
        }
    }

    _prepareUrl( url ) {
        return ( url.substring(-1) === '/' ) ? url.substring(0,-1) : url;
    }

}
