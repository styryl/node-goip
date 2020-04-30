const expect = require('chai').expect;
const MessageDispatcher = require('../../lib/message-dispatcher');
const Message = require('../../lib/messages/message');

const sinon = require('sinon');

describe('MessageDispatcherTest', () => {

    const messageDispatcher = new MessageDispatcher();

    describe('#listen()', () => {

        it('should register message listener', () => {
            const spyListen = sinon.spy(messageDispatcher, 'listen');
            const callback = sinon.spy();

            messageDispatcher.listen('message',callback);

            expect( spyListen.withArgs('message',callback).calledOnce ).to.be.true;
        });

    });

    describe('#dispatch()', () => {

        it('should dispatch message by type', () => {
            
            const spyDispatch = sinon.spy(messageDispatcher, 'dispatch');
            const callback = sinon.spy();
            const messageStub = sinon.createStubInstance(Message);

            messageDispatcher.listen('message', callback)

            messageDispatcher.dispatch('message', messageStub);

            expect( spyDispatch.withArgs('message',messageStub).calledOnce ).to.be.true;
            expect( callback.withArgs(messageStub).calledOnce ).to.be.true;
        });

    });



});