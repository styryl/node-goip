const assert = require('chai').assert;
const util = require('../../lib/util');

describe('utilTest', () => {

  describe('#randomInt()', () => {

    it('should return random number between min max', () => {
      let number = util.randomInt(1,10);
      assert.isNumber( number );
      assert.isTrue( number >= 1 && number <= 10 );

      number = util.randomInt(10000,99999);

      assert.isNumber( number );
      assert.isTrue( number >= 10000 && number <= 99999 );
    });

  });

});