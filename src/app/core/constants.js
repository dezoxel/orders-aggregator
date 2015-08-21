(function(angular, moment, Class, validate, _, s) {
  'use strict';

  angular
    .module('sfba.core')
    .constant('moment', moment)
    .constant('Class', Class)
    .constant('validate', validate)
    .constant('_', _)
    .constant('s', s);

})(angular, moment, Class, validate, _, s);
