const expect = require('chai').expect;
const Request = require('../../lib/request');
const samples = require('../samples');

describe('RequestTest', () => {

    const requestClass = new Request( samples.buffers.req, '0.0.0.0', 3000 );

    describe('#constructor()', () => {

        it('should be created with properties', () => {

            expect(requestClass).to.have.property('_buffer');
            expect(requestClass).to.have.property('_address');
            expect(requestClass).to.have.property('_port');
            expect(requestClass).to.have.property('_attributes');

        });

        it('property _port should be an number', () => {
            expect(requestClass._port).to.be.an('number');
        });

        it('property _address should be an buffer', () => {
            expect(requestClass._buffer).to.be.an('string');
        });

        it('property _address should be an string', () => {
            expect(requestClass._address).to.be.an('string');
        });

        it('property _attributes should be an object', () => {
            expect(requestClass._attributes).to.be.an('object');
        });

    });

    describe('#address()', () => {

        it('should return address', () => {
            expect(  requestClass.address() ).to.be.equal( '0.0.0.0' );
        });

    });

    describe('#port()', () => {

        it('should return port', () => {
            expect(requestClass.port() ).to.be.equal(3000);
        });

    });

    describe('#buffer()', () => {

        it('should return raw buffer', () => {
            expect( requestClass.buffer() ).to.be.equal(samples.buffers.req);
        });

    });

    describe('#_parse()', () => {

        it('should parse from raw buffer to object', () => {
            expect( requestClass._parse('key1:val1;key2:val2;key3:val3') ).to.be.deep.equal(requestClass._parse('key1:val1;key2:val2;key3:val3'));
        });

    });

    describe('#has()', () => {

        it('should return true if key exists', () => {
            expect( requestClass.has('req') ).to.be.true;
        });

        it('should return false if key dont exists', () => {
            expect( requestClass.has('req2') ).to.be.false;
        });

    });

    describe('#get()', () => {

        it('should return value if key exist', () => {
            expect( requestClass.get('req') ).to.be.equal('27');
        });

        it('should return null if key dont exists', () => {
            expect( requestClass.get('req2') ).to.be.null;
        });

    });

    describe('#all()', () => {

        const requestClass = new Request( samples.buffers.fake, '0.0.0.0', 3000 );

        it('should return all attributes', () => {
            expect(requestClass.all() ).to.be.deep.equal({
              key1:'val1',
              key2:'val2',
              key3:'val3' 
            });
        });

    });

});