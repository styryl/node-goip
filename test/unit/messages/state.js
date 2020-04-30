const expect = require('chai').expect;
const sinon = require('sinon');
const Message = require('../../../lib/messages/message');
const StateMessage = require('../../../lib/messages/state');
const Request = require('../../../lib/request');

describe('StateTest', function() {

    const requestStub = sinon.createStubInstance(Request);
    let message;

    beforeEach(()=>{
        message = new StateMessage( requestStub );
    });

    describe('#constructor()', () => {

        it('should be instance of Message', () => {
            expect(message).to.be.instanceOf(Message);
        });

        it('should be create with properties', () => {
            expect(message).to.have.property('_request');
        });

        it('_request property should be instance of Request', () => {
            expect(message._request).to.be.instanceOf(Request);
        });

    });

    describe('#attributes()', function() {
  
        it('should return all attributes from request all method', () => {  
            requestStub.all.returns({req:1});
            expect(message.attributes()).to.be.deep.equal({req:1});
        });
  
    });

    describe('#request()', () => {
  
        it('should return request', () => {
            expect(message.request()).to.be.instanceOf(Request);  
        });
  
    });

    describe('#id()', () => {
  
        it('should return id from request get method', () => {
            requestStub.get.withArgs('id').returns(1);
            expect(message.id()).to.be.deep.equal(1);
        });
  
    });

    describe('#password()', () => {
  
        it('should return password from request get method', () => {
            requestStub.get.withArgs('password').returns('pass');
            expect(message.password()).to.be.equal('pass'); 
        });
  
    });

    describe('#ack()', () => {
        it('should return ack message', () => {
            requestStub.get.withArgs('state').returns('123');
            expect(message.ack()).to.be.equal('STATE 123 OK');
        });
    });

    describe('#state()', () => {
        it('should return state count', () => {
            requestStub.get.withArgs('state').returns('123');
            expect(message.state()).to.be.equal('123');
        });
    });

    describe('#gsmRemainState()', () => {
        it('should return gsm state', () => {
            requestStub.get.withArgs('gsm_remain_state').returns('test state');
            expect(message.gsmRemainState()).to.be.equal('test state');
        });
    });


});