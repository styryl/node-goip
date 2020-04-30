const expect = require('chai').expect;
const sinon = require('sinon');
const Message = require('../../../lib/messages/message');
const ReceiveMessage = require('../../../lib/messages/receive');
const Request = require('../../../lib/request');

describe('ReceiveTest', function() {

    const requestStub = sinon.createStubInstance(Request);
    let message;

    beforeEach(()=>{
        message = new ReceiveMessage( requestStub );
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
            requestStub.get.withArgs('receive').returns('123');
            expect(message.ack()).to.be.equal('RECEIVE 123 OK');
        });
    });

    describe('#receive()', () => {
        it('should return receive count', () => {
            requestStub.get.withArgs('receive').returns('123');
            expect(message.receive()).to.be.equal('123');
        });
    });

    describe('#srcnum()', () => {
        it('should return phone number', () => {
            requestStub.get.withArgs('srcnum').returns('999999999');
            expect(message.srcnum()).to.be.equal('999999999');
        });
    });

    describe('#msg()', () => {
        it('should return text message', () => {
            requestStub.get.withArgs('msg').returns('test message');
            expect(message.msg()).to.be.equal('test message');
        });
    });

});