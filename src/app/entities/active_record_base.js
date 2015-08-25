(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .factory('ActiveRecordBase', function(Class, backend, validate, $injector, _, s) {

      function pluralAssociationToClassName(name) {
        var capitalized = s(name).capitalize().value();
        if (s(capitalized).endsWith('ies')) {
          capitalized = capitalized.replace('ies', 'ys');
        }

        var singular = capitalized.substring(0, capitalized.length - 1);

        return singular;
      }

      var ActiveRecordBase = Class.create({
        abstractClass: true,

        inheritedStatics: {

          onClassCreated : function(NewClass) {
            NewClass.identityMap = {
              instances: {},
              list: []
            };

            if (NewClass.prototype.hasMany) {
              this.createHasManyAssociationMethods(NewClass);
            }

            if (NewClass.prototype.belongsTo) {
              this.createBelongsToAssociationMethods(NewClass);
            }

            if (NewClass.prototype.hasOne) {
              this.createHasOneAssociationMethods(NewClass);
            }

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

          createHasManyAssociationMethods: function(NewClass) {
            var associationName = NewClass.prototype.hasMany;
            var associationKey = NewClass.prototype.associationKey;
            var DependentClassName = pluralAssociationToClassName(associationName);

            var association = function() {
              var DependentClass = $injector.get(DependentClassName);
              var attrs = {};
              attrs[associationKey] = this._attrs.id;
              return DependentClass.where(attrs);
            };

            NewClass.prototype[associationName] = association;
          },

          createBelongsToAssociationMethods: function(NewClass) {
            var associationName = NewClass.prototype.belongsTo;
            var associationKey = associationName + 'Id';
            var DependentClassName = s(associationName).capitalize().value();

            var association = function() {
              var DependentClass = $injector.get(DependentClassName);
              return DependentClass.find(this._attrs[associationKey]);
            };

            NewClass.prototype[associationName] = association;
          },

          createHasOneAssociationMethods: function(NewClass) {
            var associationName = NewClass.prototype.hasOne;
            var associationKey = NewClass.prototype.associationKey;
            var DependentClassName = s(associationName).capitalize().value();

            var association = function() {
              var DependentClass = $injector.get(DependentClassName);
              return DependentClass.findBy({associationKey: this._attrs[associationKey]});
            };

            NewClass.prototype[associationName] = association;
          },

          addOne: function(data) {
            var instance =  new this(data);

            this.identityMap.instances[data.id] = instance;
            this.identityMap.list.push(instance);

            return this;
          },

          addMany: function(list) {
            list.forEach(function(item) {
              this.addOne(item);
            }, this);

            return this;
          },

          find: function(id) {
            return this.identityMap.instances[id];
          },

          // TODO: Make support of working with multiple attr pairs
          where: function(attrs) {
            var field = Object.keys(attrs)[0];

            return _.chain(this.identityMap.list).where(function(item) {
              return item.get(field) === attrs[field];
            }).value();
          },

          // TODO: Make support of working with multiple attr pairs
          findBy: function(attrs) {
            var field = Object.keys(attrs)[0];

            return _.chain(this.identityMap.list).find(function(item) {
              return item.get(field) === attrs[field];
            }).value();
          },

          all: function() {
            return this.identityMap.list;
          },

          first: function() {
            return this.identityMap.list[0];
          },

          last: function() {
            var lastIndex = this.identityMap.list.length - 1;

            return this.identityMap.list[lastIndex];
          },

          findOrCreateBy: function(attrs) {
            var entity = this.findBy(attrs);

            if(entity) {
              return $q.resolve(entity);
            }

            var Entity = this;

            var restUrl = Entity.prototype.persistence;
            return backend.findBy(restUrl, attrs)
              .then(function(entity) {
                return new Entity(entity);
              })
              .catch(function() {
                return backend.create(restUrl, attrs);
              })
              .then(function(entity) {
                return new Entity(entity);
              })
              .catch(function(msg) {
                $log.error(msg);
                return $q.reject(msg);
              });
          }
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

          errors = validate.single(value, this._validates[name]);

          if (errors) {
            throw new Error('ActiveRecordBase: set "' + name + '": ' + errors.join(';'));
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
        },

        save: function() {
          var promise = this.isNew() ? backend.create(restUrl, this._attrs) : backend.save(restUrl, this._attrs);

          return promise
            .then(function(entity) {
              return new NewClass(entity);
            })
            .catch(function() {
              var msg = 'ActiveRecordBase: Unable to save entity';
              $log.error(msg);

              return $q.reject(msg);
            });
        },

        isNew: function() {
          return Boolean(this._attrs.id);
        }

      });

      return ActiveRecordBase;
    });
})(angular);