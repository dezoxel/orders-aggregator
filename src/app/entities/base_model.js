(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('BaseModel', function(Class, validate) {

      var BaseModel = Class.create({
        abstractClass: true,

        constructor: function(params) {
          params = params || {};
          this._attrsHash = {};

          if (!this._attrs) {
            throw new Error('BaseModel: attrs array must be specified!');
          }

          this._callSetterForEachAttrIn(params);
        },

        _callSetterForEachAttrIn: function(params) {
          this._attrs.forEach(function(attr) {
            this.set(attr, params[attr]);
          }, this);
        },

        set: function(name, value) {
          var errors = validate.single(name, {inclusion: this._attrs});

          if (errors) {
            throw new Error('BaseModel: set: No such attribute "' + name + '"');
          }

          errors = validate.single(value, this._validators[name]);

          if (errors) {
            throw new Error('BaseModel: set "' + name + '": ' + errors.join(';'));
          }

          this._attrsHash[name] = value;

          return this;
        },

        get: function(name) {
          var errors = validate.single(name, {inclusion: this._attrs});

          if (errors) {
            throw new Error('BaseModel: get: No such attribute "' + name + '"');
          }

          return this._attrsHash[name];
        }
      });

      return BaseModel;
    });
})(angular);