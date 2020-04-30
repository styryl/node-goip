const expect = require('chai').expect;
const MessageFactory = require('../../lib/message-factory');
const Message = require('../../lib/messages/message');
const NotSupportedMessage = require('../../lib/messages/not-supported');
const ReqMessage = require('../../lib/messages/req');
const DeliverMessage = require('../../lib/messages/deliver');
const HangupMessage = require('../../lib/messages/hangup');
const ReceiveMessage = require('../../lib/messages/receive');
const RecordMessage = require('../../lib/messages/record');
const StateMessage = require('../../lib/messages/state');
const Request = require('../../lib/request');

const sinon = require('sinon');

describe('MessageFactoryTest', () => {

    const messageFactory = new MessageFactory();

    describe('#constructor()', () => {
        it('should be created with _messages property', () => {
            expect(messageFactory).to.have.property('_messages');
        });
    });

    describe('#make()', () => {

        it('can create NotSupported Message', () => {

            const requestStub = sinon.createStubInstance(Request);
            requestStub.all.returns({
                'test':'1'
            });

            const message = messageFactory.make(requestStub);
            expect(message).to.be.instanceOf(Message);
            expect(message).to.be.instanceOf(NotSupportedMessage);
            expect(requestStub.all.calledOnce).to.be.true;
        });

        it('can create Req Message', () => {

            const requestStub = sinon.createStubInstance(Request);
            requestStub.all.returns({
                'req':'1'
            });

            const message = messageFactory.make(requestStub);
            expect(message).to.be.instanceOf(Message);
            expect(message).to.be.instanceOf(ReqMessage);
            expect(requestStub.all.calledOnce).to.be.true;
        });

        it('can create Deliver Message', () => {

            const requestStub = sinon.createStubInstance(Request);
            requestStub.all.returns({
                'deliver':'1'
            });

            const message = messageFactory.make(requestStub);
            expect(message).to.be.instanceOf(Message);
            expect(message).to.be.instanceOf(DeliverMessage);
            expect(requestStub.all.calledOnce).to.be.true;
        });

        it('can create Hangup Message', () => {

            const requestStub = sinon.createStubInstance(Request);
            requestStub.all.returns({
                'hangup':'1'
            });

            const message = messageFactory.make(requestStub);
            expect(message).to.be.instanceOf(Message);
            expect(message).to.be.instanceOf(HangupMessage);
            expect(requestStub.all.calledOnce).to.be.true;
        });

        it('can create Receive Message', () => {

            const requestStub = sinon.createStubInstance(Request);
            requestStub.all.returns({
                'receive':'1'
            });

            const message = messageFactory.make(requestStub);
            expect(message).to.be.instanceOf(Message);
            expect(message).to.be.instanceOf(ReceiveMessage);
            expect(requestStub.all.calledOnce).to.be.true;
        });

        it('can create Record Message', () => {

            const requestStub = sinon.createStubInstance(Request);
            requestStub.all.returns({
                'record':'1'
            });

            const message = messageFactory.make(requestStub);
            expect(message).to.be.instanceOf(Message);
            expect(message).to.be.instanceOf(RecordMessage);
            expect(requestStub.all.calledOnce).to.be.true;
        });

        it('can create State Message', () => {

            const requestStub = sinon.createStubInstance(Request);
            requestStub.all.returns({
                'state':'1'
            });

            const message = messageFactory.make(requestStub);
            expect(message).to.be.instanceOf(Message);
            expect(message).to.be.instanceOf(StateMessage);
            expect(requestStub.all.calledOnce).to.be.true;
        });

    });


});