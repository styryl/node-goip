const expect = require('chai').expect;
const sinon = require('sinon');
const Message = require('../../../lib/messages/message');
const NotSupportedMessage = require('../../../lib/messages/not-supported');
const Request = require('../../../lib/request');

describe('NotSupportedTest', function() {

    const requestStub = sinon.createStubInstance(Request);
    let message;

    beforeEach(()=>{
        message = new NotSupportedMessage( requestStub );
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
        it('should return id from request get method', () => {
            requestStub.get.withArgs('id').returns(1);
            expect(message.id()).to.be.deep.equal(1);
        });
    });

});