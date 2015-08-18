(function(angular, moment, Class, validate) {
  'use strict';

  angular
    .module('sfba.core')
    .constant('moment', moment)
    .constant('Class', Class)
    .constant('validate', validate);

})(angular, moment, Class, validate);
