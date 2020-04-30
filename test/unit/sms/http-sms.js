const expect = require('chai').expect;
const HttpSms = require('../../../lib/sms/http-sms')
const sinon = require('sinon');
const nock = require('nock');
const samples = require('../../samples');

describe('HttpSmsTest', () => {

    const sendPath = nock('http://192.168.0.12')
        .get('/default/en_US/send.html')
        .query({
            u:'admin',
            p:'admin',
            l:1,
            n:'999999999',
            m:'test message' 
        })

    const statusPath = nock('http://192.168.0.12')
        .get('/default/en_US/send_status.xml')
        .query({
            u:'admin',
            p:'admin',
        })

    const httpSms = new HttpSms('http://192.168.0.12', 1, 'admin', 'admin');

    describe('#constructor()', () => {

        it('should be create with properties', () => {
            expect(httpSms).to.have.property('_url');
            expect(httpSms).to.have.property('_line');
            expect(httpSms).to.have.property('_login');
            expect(httpSms).to.have.property('_password');
            expect(httpSms).to.have.property('_options');
        });

        it('_options property should have default values', () => {
            expect(httpSms._options).to.be.deep.equal({
                'sendDir': '/default/en_US/send.html',
                'statusDir': '/default/en_US/send_status.xml',
                'waitForStatus': false,
                'waitTries': 10,
                'waitTime': 1000,
            });
        });

        it('_options property can be overridden', () => {
            
            const httpSms = new HttpSms('http://192.168.0.11', 1, 'admin', 'admin', {
                'sendDir': 'testSendDir',
                'statusDir': 'testStatusDir',
                'waitForStatus': true,
                'waitTries': 1,
                'waitTime': 1,
            });
            
            expect(httpSms._options).to.be.deep.equal({
                'sendDir': 'testSendDir',
                'statusDir': 'testStatusDir',
                'waitForStatus': true,
                'waitTries': 1,
                'waitTime': 1,
            });
        });

    });

    describe('#_prepareUrl()', () => {
        it('should remove last slash from url', () => {
            expect(httpSms._prepareUrl('http://192.168.0.11/')).to.be.equal('http://192.168.0.11');
        });
    });

    describe('#_parse()', () => {

        it('should throw error when response have error', () => {
            expect(() => httpSms._parse('ERROR,user or password error')).to.throw(Error,'ERROR,user or password error');
        });

        it('should throw error when response dont have id', () => {
            expect(() => httpSms._parse('Sending,L1 Send SMS to:999999999;')).to.throw(Error,'Sms id not found in respons');  
        });

        it('should return object response with id, raw response and status', () => {
            expect(httpSms._parse('Sending,L1 Send SMS to:999999999; ID:0000006d')).to.be.deep.equal({
                'id': '0000006d',
                'raw': 'Sending,L1 Send SMS to:999999999; ID:0000006d',
                'status': 'sending'
            });
        });

    });

    describe('#isSend()', () => {

        it('should throw error when status list not found', async () => {
      
            statusPath.reply(200, '');

            let err = null;
            try {
                await httpSms.isSend('0000006d');  
            } catch (error) {
                err = error;
            }

            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.be.equal('Sms send status not found!');

        });

        it('should throw error when status have error', async () => {
            statusPath.reply(200, samples.xmlError);

            let err = null;
            try {
                await httpSms.isSend('0000006d');  
            } catch (error) {
                err = error;
            }

            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.be.equal('error message');
        });

        it('should return false if status is different than done', async () => {
            statusPath.reply(200, samples.xmlStartingStatus);

            const response = await httpSms.isSend('0000006d');
            
            expect(response).to.be.false;   
        });

        it('should return false id not found', async () => {
            statusPath.reply(200, samples.xmlDone);

            const response = await httpSms.isSend('0000006d2');
            
            expect(response).to.be.false;   
        });

        it('should return true if status is done', async () => {
            statusPath.reply(200, samples.xmlDone);

            const response = await httpSms.isSend('0000006d');
            
            expect(response).to.be.true;
        });

    });

    describe('#_waitForStatus()', () => {

        it('should call isSend with id', async () => {

            statusPath.reply(200, samples.xmlDone);

            const httpSms = new HttpSms('http://192.168.0.12',1,'admin','admin', {
                'waitForStatus': true,
                'waitTries': 1,
                'waitTime': 1
            });

            const spyIsSend = sinon.spy(httpSms,'isSend');

            await httpSms._waitForStatus('0000006d')

            expect( spyIsSend.withArgs('0000006d').calledOnce ).to.be.true;
        });

    });

    describe('#send()', () => {


        it('should throw Error when response have error message', async () => {
            sendPath.reply(200, 'ERROR,user or password error');
            
            let err = null;
            try {
                const res = await httpSms.send('999999999', 'test message');
            } catch (error) {
                err = error;
            }

            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.be.equal('ERROR,user or password error');
        });

        it('should return object response with id, raw response and status', async () => {

            sendPath.reply(200, 'Sending,L1 Send SMS to:999999999; ID:0000006d');

            const res = await httpSms.send('999999999', 'test message');
            
            expect(res).to.be.deep.equal({
                'id': '0000006d',
                'raw': 'Sending,L1 Send SMS to:999999999; ID:0000006d',
                'status': 'sending'
            });

        });   

        it('should return object response with id, raw response and status send when waitForStatus is set to true if sms was sent', async () => {

            sendPath.reply(200, 'Sending,L1 Send SMS to:999999999; ID:0000006d');
            statusPath.reply(200, samples.xmlDone);

            const httpSms = new HttpSms('http://192.168.0.12',1,'admin','admin', {
                'waitForStatus': true,
                'waitTries': 1,
                'waitTime': 1
            });

            const res = await httpSms.send('999999999', 'test message');
            
            expect(res).to.be.deep.equal({
                'id': '0000006d',
                'raw': 'Sending,L1 Send SMS to:999999999; ID:0000006d',
                'status': 'send'
            });

        }); 

        it('should return object response with id, raw response, status error and error message when waitForStatus is set to true if sms was not sent', async () => {

            sendPath.reply(200, 'Sending,L1 Send SMS to:999999999; ID:0000006d');
            statusPath.reply(200, samples.xmlError);

            const httpSms = new HttpSms('http://192.168.0.12',1,'admin','admin', {
                'waitForStatus': true,
                'waitTries': 1,
                'waitTime': 1
            });

            const res = await httpSms.send('999999999', 'test message');
            
            expect(res).to.be.deep.equal({
                'id': '0000006d',
                'raw': 'Sending,L1 Send SMS to:999999999; ID:0000006d',
                'status': 'error',
                'error': 'error message'
            });

        });

        it('should return object response with id, raw response and status sending when waitForStatus is set to true if sms was not sent', async () => {

            sendPath.reply(200, 'Sending,L1 Send SMS to:999999999; ID:0000006d');
            statusPath.reply(200, samples.xmlStartingStatus);

            const httpSms = new HttpSms('http://192.168.0.12',1,'admin','admin', {
                'waitForStatus': true,
                'waitTries': 1,
                'waitTime': 1
            });

            const res = await httpSms.send('999999999', 'test message');
            
            expect(res).to.be.deep.equal({
                'id': '0000006d',
                'raw': 'Sending,L1 Send SMS to:999999999; ID:0000006d',
                'status': 'sending'
            });

        });

        it('should call isSend() 10 times when waitTries i set to 10', async () => {

            sendPath.reply(200, 'Sending,L1 Send SMS to:999999999; ID:0000006d');
            statusPath.times(10).reply(200, samples.xmlStartingStatus);

            const httpSms = new HttpSms('http://192.168.0.12',1,'admin','admin', {
                'waitForStatus': true,
                'waitTries': 10,
                'waitTime': 1
            });

            const spyIsSend = sinon.spy(httpSms,'isSend');

            const res = await httpSms.send('999999999', 'test message');

            expect( spyIsSend.callCount ).to.be.equal(10);

            expect(res).to.be.deep.equal({
                'id': '0000006d',
                'raw': 'Sending,L1 Send SMS to:999999999; ID:0000006d',
                'status': 'sending'
            });

        });


    });

});