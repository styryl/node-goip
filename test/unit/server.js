'use strict';

const expect = require('chai').expect;
const Server = require('../../lib/server');
const Request = require('../../lib/request');
const MessageDispatcher = require('../../lib/message-dispatcher');
const MessageFactory = require('../../lib/message-factory');
const Socket = require('dgram').Socket;
const Message = require('../../lib/messages/message');
const sinon = require('sinon');
const samples = require('../samples');

describe('ServerTest', () => {

    const messageDispatcherStub = sinon.createStubInstance(MessageDispatcher);
    const messageFactoryStub = sinon.createStubInstance(MessageFactory);
    let server;

    beforeEach(()=>{
        server = new Server({
            'port': 9000,
            'address': '0.0.0.0',
            'messageDispatcher': messageDispatcherStub,
            'messageFactory': messageFactoryStub
        });
    });

    describe('#constructor()', () => {

        it('should be created with properties', () => {

            expect(server).to.have.property('_port');
            expect(server).to.have.property('_address');
            expect(server).to.have.property('_messageDispatcher');
            expect(server).to.have.property('_messageFactory');
            expect(server).to.have.property('_socket');
        });

        it('property _port should be number', () => {
            expect(server._port).to.be.an('number');
        });

        it('property _address should be string', () => {
            expect(server._address).to.be.an('string');
        });

        it('property _messageDispatcher should be instance of MessageDispatcher', () => {
            expect(server._messageDispatcher).to.be.instanceOf(MessageDispatcher);
        });

        it('property _messageFactory should be instance of MessageFactory', () => {
            expect(server._messageFactory).to.be.instanceOf(MessageFactory);
        });

        it('property _socket should be instance of Socket', () => {
            expect(server._socket).to.be.instanceOf(Socket);
        });

    });

    describe('#_makeGoipRequest()', () => {
        it('should create request instance', () => {
            expect(server._makeGoipRequest( samples.buffers.req, {
                'port': 9000,
                'address': '0.0.0.0'  
            })).to.be.instanceOf(Request);  
        });
    });

    describe('#_messageHandler()', () => {

        const server = new Server({
            'port': 9000,
            'address': '0.0.0.0',
            'messageDispatcher': messageDispatcherStub,
            'messageFactory': messageFactoryStub
        });
                
        const messageStub = sinon.createStubInstance(Message);

        messageFactoryStub.make.returns( messageStub );
        messageStub.ack.returns('ack message');

        const spy = sinon.spy(server, "_send");

        server._messageHandler( samples.buffers.req, {
            'port': 9000,
            'address': '0.0.0.0'
        });

        server.close();

        it('should make message from MessageFactory', () => {
            expect( messageFactoryStub.make.calledOnce ).to.be.true;
        });

        it('should send ack message from Message class', () => {
            expect( spy.withArgs('ack message', '0.0.0.0', 9000).calledOnce ).to.be.true;
        });

        it('should dispatch message by MessageDispatcher', () => {
            expect( messageDispatcherStub.dispatch.withArgs('message', messageStub).calledTwice ).to.be.true;
        });

    });

    describe('#_errorHandler()', () => {

        it('should close socket connection', () => {
            server.run();
            const spyServer = sinon.spy(server, "close");
            const spySocket = sinon.spy(server._socket, "close");
            server._errorHandler('error message');
            expect( spyServer.calledOnce ).to.be.true;
            expect( spySocket.calledOnce ).to.be.true;
        });

    });

    describe('#close()', () => {

        it('should close socket connection', () => {
            server.run();
            const spySocket = sinon.spy(server._socket, "close");
            server.close();
            expect( spySocket.calledOnce ).to.be.true;
        });

    });

    describe('#onMessage()', () => {

        it('should register message linstener in MessageDispatcher', () => {
            
            const callback = sinon.spy();
            server.onMessage('delivery', callback); 
            expect( messageDispatcherStub.listen.withArgs('delivery',callback).calledOnce ).to.be.true;
  
        });

    });

    describe('#onAll()', () => {

        it('should register message linstener for all messages', () => {
            
            const callback = sinon.spy();

            const spyOnMessage = sinon.spy(server, 'onMessage');

            server.onAll(callback); 

            expect( spyOnMessage.withArgs('message',callback).calledOnce ).to.be.true;
            expect( messageDispatcherStub.listen.withArgs('message',callback).calledOnce ).to.be.true;
        });

    });

    describe('#onRequest()', () => {

        it('should register message linstener for request messages', () => {

            const callback = sinon.spy();

            const spyOnMessage = sinon.spy(server, 'onMessage');

            server.onRequest(callback); 

            expect( spyOnMessage.withArgs('request',callback).calledOnce ).to.be.true;
            expect( messageDispatcherStub.listen.withArgs('request',callback).calledOnce ).to.be.true;
        });

    });

    describe('#onNotSupported()', () => {

        it('should register message linstener for not supported messages', () => {

            const callback = sinon.spy();

            const spyOnMessage = sinon.spy(server, 'onMessage');

            server.onNotSupported(callback); 

            expect( spyOnMessage.withArgs('notsupported',callback).calledOnce ).to.be.true;
            expect( messageDispatcherStub.listen.withArgs('notsupported',callback).calledOnce ).to.be.true;
        });

    });

    describe('#onReceive()', () => {

        it('should register message linstener for receive messages', () => {

            const callback = sinon.spy();

            const spyOnMessage = sinon.spy(server, 'onMessage');

            server.onReceive(callback); 

            expect( spyOnMessage.withArgs('receive',callback).calledOnce ).to.be.true;;
            expect( messageDispatcherStub.listen.withArgs('receive',callback).calledOnce ).to.be.true;
        });

    });

    describe('#onDeliver()', () => {

        it('should register message linstener for deliver messages', () => {

            const callback = sinon.spy();

            const spyOnMessage = sinon.spy(server, 'onMessage');

            server.onDeliver(callback); 

            expect( spyOnMessage.withArgs('deliver',callback).calledOnce ).to.be.true;
            expect( messageDispatcherStub.listen.withArgs('deliver',callback).calledOnce ).to.be.true;
        });

    });

    describe('#onHangup()', () => {

        it('should register message linstener for hangup messages', () => {

            const callback = sinon.spy();

            const spyOnMessage = sinon.spy(server, 'onMessage');

            server.onHangup(callback); 

            expect( spyOnMessage.withArgs('hangup',callback).calledOnce ).to.be.true;
            expect( messageDispatcherStub.listen.withArgs('hangup',callback).calledOnce ).to.be.true;
        });

    });

    describe('#onRecord()', () => {

        it('should register message linstener for record messages', () => {

            const callback = sinon.spy();

            const spyOnMessage = sinon.spy(server, 'onMessage');

            server.onRecord(callback); 

            expect( spyOnMessage.withArgs('record',callback).calledOnce ).to.be.true;
            expect( messageDispatcherStub.listen.withArgs('record',callback).calledOnce ).to.be.true;
        });

    });

    describe('#onState()', () => {

        it('should register message linstener for state messages', () => {

            const callback = sinon.spy();

            const spyOnMessage = sinon.spy(server, 'onMessage');

            server.onState(callback); 

            expect( spyOnMessage.withArgs('state',callback).calledOnce ).to.be.true;
            expect( messageDispatcherStub.listen.withArgs('state',callback).calledOnce ).to.be.true;

        });

    });

    describe('#onServerError()', () => {

        it('should register linstener for server error event', () => {

            const spySocketOn = sinon.spy(server._socket, 'on');
            const callback = sinon.spy();

            server.onServerError(callback);

            expect( spySocketOn.withArgs('error',callback).calledOnce ).to.be.true;
            
        });

    });

    describe('#onServerListening()', () => {

        it('should register linstener for server listening event', () => {

            const spySocketOn = sinon.spy(server._socket, 'on');
            const callback = sinon.spy();

            server.onServerListening(callback);

            expect( spySocketOn.withArgs('listening',callback).calledOnce ).to.be.true;
            
        });

    });

});