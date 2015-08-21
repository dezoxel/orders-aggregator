(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('ActiveRecordBase', function(Class, validate, $injector, _, s) {

      var ActiveRecordBase = Class.create({
        abstractClass: true,

        inheritedStatics: {

          onClassCreated : function(NewClass) {
            if (NewClass.prototype.attrs) {
              this.createAccessorsFor(NewClass);
            }
          },

          createAccessorsFor: function(NewClass) {
            _.chain(NewClass.prototype.attrs).forEach(function(attrName) {

              // GET
              NewClass.prototype[attrName] = function() {
                return this.get(attrName);
              };

              // SET
              var setterName = 'set' + s(attrName).capitalize().value();
              NewClass.prototype[setterName] = function(value) {
                return this.set(attrName, value);
              };
            });
          },
        },

        constructor: function(params) {
          this._attrs = {};

          for(var field in params) {
            this._attrs[field] = params[field];
          }
        },

        set: function(name, value) {
          var errors = validate.single(name, {inclusion: this.attrs});

          if (errors) {
            throw new Error('ActiveRecordBase: set: No such attribute "' + name + '"');
          }

          this._attrs[name] = value;

          return this;
        },

        get: function(name) {
          var errors = validate.single(name, {inclusion: this.attrs});

          if (errors) {
            throw new Error('ActiveRecordBase: get: No such attribute "' + name + '"');
          }

          return this._attrs[name];
        }
      });

      return ActiveRecordBase;
    });
})(angular);