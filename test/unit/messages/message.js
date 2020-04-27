const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const Message = require('../../../lib/messages/message');
const Request = require('../../../lib/request');
const samples = require('../../samples');

describe('Message class test', function() {

    describe('#attributes()', function() {
  
        it('should return all attributes from request all method', function() {
            
            const request = sinon.createStubInstance(Request);
            request.all.returns({req:1});

            const message = new Message( request );
            assert.deepEqual({req:1}, message.attributes());

        });
  
    });

    describe('#request()', function() {
  
        it('should return request', function() {
            
            const request = sinon.createStubInstance(Request);
            const message = new Message( request );

            assert.equal(message.request(), request);
            
        });
  
    });

    describe('#id()', function() {
  
        it('should return id from request get method', function() {
            
            const request = sinon.createStubInstance(Request);
            request.get.withArgs('id').returns(1);

            const message = new Message( request );

            assert.equal(message.id(), 1);
            
        });
  
    });

    describe('#password()', function() {
  
        it('should return password from request get method', function() {
            
            const request = sinon.createStubInstance(Request);
            request.get.withArgs('password').returns('pass');

            const message = new Message( request );

            assert.equal(message.password(), 'pass');
            
        });
  
    });

    describe('#ack()', function() {
  
        it('should return null', function() {
            const message = new Message();
            assert.isNull(message.ack());
        });
  
    });

});