var sinon = require('sinon');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');
chai.use(chaiAsPromised);

chai.use(sinonChai);

chai.config.includeStack = true;

global.expect = chai.expect;
global.sinon = sinon;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
global.factory = require('factory-girl');

require('./factories');
