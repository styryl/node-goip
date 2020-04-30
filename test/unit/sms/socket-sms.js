const expect = require('chai').expect;
const sinon = require('sinon');
const nock = require('nock');
const samples = require('../../samples');
const Socket = require('dgram').Socket;
const FakeSocketServer = require('../fake-socket-server');
const proxyquire = require('proxyquire').noCallThru();
const dgram = require('dgram');
const SocketSms = proxyquire('../../../lib/sms/socket-sms', {
    'dgram': {
        'createSocket': (type) => {
            return new FakeSocketServer(type);
        }
    }
});

describe('SocketSmsTest', () => {

    let socketSms;

    beforeEach(()=>{
        socketSms = new SocketSms('192.168.0.11', 9991, 'password', 10);
    });

    describe('#constructor()', () => {

        it('should be create with properties', () => {
            expect(socketSms).to.have.property('_address');
            expect(socketSms).to.have.property('_port');
            expect(socketSms).to.have.property('_id');
            expect(socketSms).to.have.property('_password');
            expect(socketSms).to.have.property('_socket');
            expect(socketSms).to.have.property('_pendingRequest');
            expect(socketSms).to.have.property('_expectedResponse');
            expect(socketSms).to.have.property('_timeoutHandler');
            expect(socketSms).to.have.property('_timeout');
            expect(socketSms).to.have.property('_requestStatus');
        });

        it('_address property should be string', () => {
            expect(socketSms._address).to.be.string;
        });

        it('_port property should be number', () => {
            expect(socketSms._port).to.be.an('number');
        });

        it('_port property should be null', () => {
            expect(socketSms._id).to.be.null;
        });

        it('_password property should be string', () => {
            expect(socketSms._password).to.be.an('string');
        });

        it('_socket property should be instance of Socket', () => {
            expect(socketSms._socket).to.be.instanceOf(Socket);
        });

        it('_pendingRequest property should be null', () => {
            expect(socketSms._pendingRequest).to.be.null;
        });

        it('_expectedResponse property should be null', () => {
            expect(socketSms._expectedResponse).to.be.null;
        });

        it('_timeoutHandler property should be null', () => {
            expect(socketSms._timeoutHandler).to.be.null;
        });

        it('_timeout property should be 10', () => {
            expect(socketSms._timeout).to.be.equal(10);
        });

        it('_requestStatus property should be object with error and success flags', () => {
            expect(socketSms._requestStatus).to.be.deep.equal({
                error: 0,
                success: 2,
            });
        });
    });

    describe('#_isTimeout()', () => {
        it('should reject promise with error after timeout and close socket connection', async () => {

            const spyClose = sinon.spy(socketSms,'close');

            let err;
            try {
                await new Promise((resolve, reject)=> {
                    socketSms._isTimeout(reject);
                });
            } catch (error) {
                err = error;
            }

            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.be.equal('Timeout in null');
            expect(spyClose.calledOnce).to.be.true;

        });
    });

    describe('#_checkResponse()', () => {

        it('should return true if response is expected', () => {
            const msg = 'DONE 1\n';
            const expected = 'DONE';
            const id = 1;
            expect( socketSms._checkResponse(msg,expected,id) ).to.be.true
        });

        it('should return false if response is not expected', () => {
            const msg = 'PASSWORD 1\n';
            const expected = 'DONE';
            const id = 1;
            expect( socketSms._checkResponse(msg,expected,id) ).to.be.false
        });

    });

    describe('#close()', () => {
        it('should close socket connection', () => {
            const spyClose = sinon.spy(socketSms,'close');
            const spyCloseSocket = sinon.spy(socketSms._socket,'close');

            socketSms.close();

            expect(spyClose.calledOnce).to.be.true;
            expect(spyCloseSocket.calledOnce).to.be.true;
        });
    });

    describe('#_sendRequest()', () => {

        it('should return message if server reponse as expected', async () => {
            const message = await socketSms._sendRequest('test message', 'test-message', 'test-request');
            expect(message).to.be.equal('test message ok');
        });

        it('should throw error if server reponse with error', async () => {
            let err;
            try {
                await socketSms._sendRequest('test error', 'test-error', 'test-request');
            } catch (error) {
                err = error;
            }

            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.be.equal('test error');
        });

        it('should throw timeout error if server not response as expected', async () => {
            let err;
            try {
                await socketSms._sendRequest('test timeout', 'test-timeout', 'test-timeout');
            } catch (error) {
                err = error;
            }

            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.be.equal('Timeout in test-timeout');
        });
    });

    describe('#_sendBulkSmsRequest()', () => {

        it('should send command with message and wait for response', async () => {
            const spySendRequest = sinon.spy(socketSms, '_sendRequest');
            const response = await socketSms._sendBulkSmsRequest('sms message', 123);
            expect(response).to.be.equal('PASSWORD 123');
            expect(spySendRequest.withArgs('MSG 123 11 sms message', 'PASSWORD', 'sendBulkSmsRequest').calledOnce).to.be.true;
        });

    });

    describe('#_sendAuthRequest()', () => {

        it('should send command with message and wait for response', async () => {
            const spySendRequest = sinon.spy(socketSms, '_sendRequest');
            const response = await socketSms._sendAuthRequest('pass',123);
            expect(response).to.be.equal('SEND 123');
            expect(spySendRequest.withArgs('PASSWORD 123 pass', 'SEND', 'sendAuthRequest').calledOnce).to.be.true;
        });

    });

    describe('#_sendNumberRequest()', () => {

        it('should send command with message and wait for response', async () => {
            const spySendRequest = sinon.spy(socketSms, '_sendRequest');
            const response = await socketSms._sendNumberRequest(999999999, 123);
            expect(response).to.be.equal('OK 123 1 11');
            expect(spySendRequest.withArgs('SEND 123 1 999999999', 'OK', 'sendNumberRequest').calledOnce).to.be.true;
        });

    });

    describe('#_sendEndRequest()', () => {

        it('should send command with message and wait for response', async () => {
            const spySendRequest = sinon.spy(socketSms, '_sendRequest');
            const response = await socketSms._sendEndRequest(123);
            expect(response).to.be.equal('DONE 123');
            expect(spySendRequest.withArgs('DONE 123', 'DONE', 'sendEndRequest').calledOnce).to.be.true;
        });

    });

    describe('#send()', () => {

        it('should return object response when send with id', async () => {
            const spySendRequest = sinon.spy(socketSms, '_sendRequest');
            const response = await socketSms.send('999999999', 'test', 123);

            expect(response).to.be.deep.equal({
                'sendid': '123',
                'telid': '1',
                'sms_no': '11',
                'raw': 'OK 123 1 11'
            });

            expect(spySendRequest.callCount).to.be.equal(4);
        });

        it('should return object response when send without id', async () => {
            const spySendRequest = sinon.spy(socketSms, '_sendRequest');
            const response = await socketSms.send('999999999', 'test');

            expect(response).to.be.deep.equal({
                'sendid': socketSms._id.toString(),
                'telid': '1',
                'sms_no': '11',
                'raw': 'OK ' + socketSms._id + ' 1 11'
            });

            expect(spySendRequest.callCount).to.be.equal(4);
        });

        it('should send multiple times with the same connection', async () => {
            const spySendRequest = sinon.spy(socketSms, '_sendRequest');
            const response1 = await socketSms.send('999999999', 'test');

            expect(response1).to.be.deep.equal({
                'sendid': socketSms._id.toString(),
                'telid': '1',
                'sms_no': '11',
                'raw': 'OK ' + socketSms._id + ' 1 11'
            });

            const response2 = await socketSms.send('999999999', 'test');

            expect(response2).to.be.deep.equal({
                'sendid': socketSms._id.toString(),
                'telid': '1',
                'sms_no': '11',
                'raw': 'OK ' + socketSms._id + ' 1 11'
            });

            expect(spySendRequest.callCount).to.be.equal(8);
        });
    });

    describe('#sendOne()', () => {

        it('should return object response and close socket when send with id', async () => {
            const spySendRequest = sinon.spy(socketSms, '_sendRequest');
            const spyClose = sinon.spy(socketSms,'close');

            const response = await socketSms.sendOne('999999999', 'test', 123);

            expect(response).to.be.deep.equal({
                'sendid': '123',
                'telid': '1',
                'sms_no': '11',
                'raw': 'OK 123 1 11'
            });

            expect(spyClose.calledOnce).to.be.true;
            expect(spySendRequest.callCount).to.be.equal(4);
        });

        it('should return object response and close socket when send without id', async () => {
            const spySendRequest = sinon.spy(socketSms, '_sendRequest');
            const response = await socketSms.sendOne('999999999', 'test');

            expect(response).to.be.deep.equal({
                'sendid': socketSms._id.toString(),
                'telid': '1',
                'sms_no': '11',
                'raw': 'OK ' + socketSms._id + ' 1 11'
            });

            expect(spySendRequest.callCount).to.be.equal(4);
        });
    });

});