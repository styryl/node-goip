module.exports = class Message {

    constructor( request ) {
        this._request = request;
    }

    attributes() 
    {
        return this._request.all();
    }

    request() {
        return this._request;
    }

    id() {
        return this._request.get('id');
    }

    password() {
        return this._request.get('password');
    }

    ack() {
        return null;
    }
}