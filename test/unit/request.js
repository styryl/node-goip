const assert = require('chai').assert;
const Request = require('../../lib/request');
const samples = require('../samples');

describe('Request', () => {

  let requestClass = new Request( samples.buffers.req, '0.0.0.0', 3000 );

  describe('#address()', () => {

    it('should return address', () => {
      assert.equal( '0.0.0.0', requestClass.address() );
    });

  });

  describe('#port()', () => {

    it('should return port', () => {
      assert.equal( 3000, requestClass.port() );
    });

  });

  describe('#buffer()', () => {

    it('should return raw buffer', () => {
      assert.equal( samples.buffers.req, requestClass.buffer() );
    });

  });

  describe('#_parse()', () => {

    it('should parse from raw buffer to object', () => {
      assert.deepEqual( {
        key1:'val1',
        key2:'val2',
        key3:'val3'
      }, requestClass._parse('key1:val1;key2:val2;key3:val3') );
    });

  });

  describe('#has()', () => {

    it('should return true if key exists', () => {
      assert.isTrue( requestClass.has('req') );
    });

    it('should return false if key dont exists', () => {
      assert.isFalse( requestClass.has('req2') );
    });

  });

  describe('#get()', () => {

    it('should return value if key exist', () => {
      assert.equal( 27, requestClass.get('req') );
    });

    it('should return null if key dont exists', () => {
      assert.isNull( requestClass.get('req2') );
    });

  });

  describe('#all()', () => {

    const requestClass = new Request( samples.buffers.fake, '0.0.0.0', 3000 );

    it('should return all attributes', () => {
      assert.deepEqual({
        key1:'val1',
        key2:'val2',
        key3:'val3' 
      }, requestClass.all() );
    });

  });

});