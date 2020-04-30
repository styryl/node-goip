const expect = require('chai').expect;
const sinon = require('sinon');
const Message = require('../../../lib/messages/message');
const ReqMessage = require('../../../lib/messages/req');
const Request = require('../../../lib/request');

describe('ReqTest', function() {

    const requestStub = sinon.createStubInstance(Request);
    let message;

    beforeEach(()=>{
        message = new ReqMessage( requestStub );
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
            requestStub.get.withArgs('pass').returns('pass');
            expect(message.password()).to.be.equal('pass'); 
        });
  
    });

    describe('#ack()', () => {
        it('should return ack message', () => {
            requestStub.get.withArgs('req').returns('123');
            expect(message.ack()).to.be.equal('req:123;status:200;');
        });
    });

    describe('#req()', () => {
        it('should return req count', () => {
            requestStub.get.withArgs('req').returns('123');
            expect(message.req()).to.be.equal('123');
        });
    });

    describe('#num()', () => {
        it('should return num', () => {
            requestStub.get.withArgs('num').returns('999999999');
            expect(message.num()).to.be.equal('999999999');
        });
    });

    describe('#signal()', () => {
        it('should return signal', () => {
            requestStub.get.withArgs('signal').returns('29');
            expect(message.signal()).to.be.equal('29');
        });
    });

    describe('#gsmStatus()', () => {
        it('should return gsmStatus', () => {
            requestStub.get.withArgs('gsm_status').returns('test status');
            expect(message.gsmStatus()).to.be.equal('test status');
        });
    });

    describe('#voipStatus()', () => {
        it('should return voipStatus', () => {
            requestStub.get.withArgs('voip_status').returns('test status');
            expect(message.voipStatus()).to.be.equal('test status');
        });
    });

    describe('#voipState()', () => {
        it('should return voipState', () => {
            requestStub.get.withArgs('voip_state').returns('test state');
            expect(message.voipState()).to.be.equal('test state');
        });
    });

    describe('#remainTime()', () => {
        it('should return remainTime', () => {
            requestStub.get.withArgs('remain_time').returns('10');
            expect(message.remainTime()).to.be.equal('10');
        });
    });

    describe('#imei()', () => {
        it('should return imei', () => {
            requestStub.get.withArgs('imei').returns('101231241212312');
            expect(message.imei()).to.be.equal('101231241212312');
        });
    });

    describe('#pro()', () => {
        it('should return pro', () => {
            requestStub.get.withArgs('pro').returns('test');
            expect(message.pro()).to.be.equal('test');
        });
    });

    describe('#idle()', () => {
        it('should return idle', () => {
            requestStub.get.withArgs('idle').returns('1');
            expect(message.idle()).to.be.equal('1');
        });
    });

    describe('#disableStatus()', () => {
        it('should return disableStatus', () => {
            requestStub.get.withArgs('disable_status').returns('1');
            expect(message.disableStatus()).to.be.equal('1');
        });
    });

    describe('#smsLogin()', () => {
        it('should return smsLogin', () => {
            requestStub.get.withArgs('sms_login').returns('1');
            expect(message.smsLogin()).to.be.equal('1');
        });
    });

    describe('#smbLogin()', () => {
        it('should return smbLogin', () => {
            requestStub.get.withArgs('smb_login').returns('1');
            expect(message.smbLogin()).to.be.equal('1');
        });
    });

    describe('#cellinfo()', () => {
        it('should return cellinfo', () => {
            requestStub.get.withArgs('cellinfo').returns('1');
            expect(message.cellinfo()).to.be.equal('1');
        });
    });

    describe('#cgatt()', () => {
        it('should return cgatt', () => {
            requestStub.get.withArgs('cgatt').returns('1');
            expect(message.cgatt()).to.be.equal('1');
        });
    });

});