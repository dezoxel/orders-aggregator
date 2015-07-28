(function() {
  'use strict';

  angular
    .module('sfba')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
