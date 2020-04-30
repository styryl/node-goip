'use strict';
module.exports = class Request {

    constructor(buffer, address, port) {
        this._buffer = buffer;
        this._address = address;
        this._port = port;
        this._attributes = this._parse(buffer);
    }

    all() {
        return this._attributes;
    }

    buffer(){
        return this._buffer;
    }

    port() {
        return this._port;
    }

    address() {
        return this._address;
    }

    has( key ) {
        return this._attributes.hasOwnProperty(key);
    }

    get( key ) {
        return this.has( key ) ? this._attributes[ key ] : null;
    }

    _parse(buffer) {
        let attributes = {};
        let arr = buffer.toLowerCase().split(';');
        for( let i = 0; i < arr.length; i++ ) {
            let parts = arr[i].split(':');
            let key = parts.shift();
            let val = parts.join(':');

            if( !key.length ) {
                continue;
            }

            attributes[ key ] = val;
        }

        return attributes;
    }
}