const expect = require('chai').expect;
const Server = require('../../lib/server');
const ServerFactory = require('../../lib/server-factory');
const MessageDispatcher = require('../../lib/message-dispatcher');
const MessageFactory = require('../../lib/message-factory');
const sinon = require('sinon');

describe('ServerFactoryTest', () => {

    const messageDispatcherStub = sinon.createStubInstance(MessageDispatcher);
    const messageFactoryStub = sinon.createStubInstance(MessageFactory);

    describe('#make()', () => {

        it('should be created with port', () => {
            const server = ServerFactory.make(9000);
            expect(server).to.be.instanceOf(Server);
            expect(server._port).to.be.equal(9000);
        });

        it('should be created with port and address', () => {
            const server = ServerFactory.make(9000, {
                'address': '192.168.0.2'
            });

            expect(server).to.be.instanceOf(Server);
            expect(server._address).to.be.equal('192.168.0.2');
        });

        it('should be created with port and custom MessageFactory', () => {
            const server = ServerFactory.make(9000, {
                'messageFactory': messageFactoryStub
            });

            expect(server).to.be.instanceOf(Server);
            expect(server._messageFactory).to.be.equal(messageFactoryStub);
        });

        it('should be created with port and custom MessageDispatcher', () => {
            const server = ServerFactory.make(9000, {
                'messageDispatcher': messageDispatcherStub
            });

            expect(server).to.be.instanceOf(Server);
            expect(server._messageDispatcher).to.be.equal(messageDispatcherStub);
        });


    });

});