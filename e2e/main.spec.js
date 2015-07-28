'use strict';

describe('The main view', function () {
  this.timeout(5000);
  var page;

  beforeEach(function () {
    browser.get('/index.html');
    page = require('./main.po');
  });

  it('should include jumbotron with correct data', function() {
    expect(page.h1El.getText()).to.eventually.equal('\'Allo, \'Allo!');
    expect(page.imgEl.getAttribute('src')).to.eventually.match(/assets\/images\/yeoman.png$/);
    expect(page.imgEl.getAttribute('alt')).to.eventually.equal('I\'m Yeoman');
  });

  it('should list more than 5 awesome things', function () {
    expect(page.thumbnailEls.count()).to.eventually.be.greaterThan(5);
  });

});
