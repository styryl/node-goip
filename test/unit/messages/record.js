const expect = require('chai').expect;
const sinon = require('sinon');
const Message = require('../../../lib/messages/message');
const RecordMessage = require('../../../lib/messages/record');
const Request = require('../../../lib/request');

describe('RecordTest', function() {

    const requestStub = sinon.createStubInstance(Request);
    let message;

    beforeEach(()=>{
        message = new RecordMessage( requestStub );
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
            requestStub.get.withArgs('record').returns('123');
            expect(message.ack()).to.be.equal('RECORD 123 OK');
        });
    });

    describe('#record()', () => {
        it('should return record count', () => {
            requestStub.get.withArgs('record').returns('123');
            expect(message.record()).to.be.equal('123');
        });
    });

    describe('#dir()', () => {
        it('should return dir', () => {
            requestStub.get.withArgs('dir').returns('test dir');
            expect(message.dir()).to.be.equal('test dir');
        });
    });

    describe('#num()', () => {
        it('should return phone number', () => {
            requestStub.get.withArgs('num').returns('999999999');
            expect(message.num()).to.be.equal('999999999');
        });
    });

});