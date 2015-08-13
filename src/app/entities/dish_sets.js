(function(angular) {
  'use strict';

  angular
    .module('sfba.entities')
    .service('dishSets', function() {

      var map = {
        none:           {id: 'none',           title: '',                   price: 0},
        big:            {id: 'big',            title: 'Big',                price: 70},
        big_no_meat:    {id: 'big_no_meat',    title: 'Big, no meat',       price: 45},
        big_no_salad:   {id: 'big_no_salad',   title: 'Big, no salad',      price: 55},
        big_no_garnish: {id: 'big_no_garnish', title: 'Big, no garnish',    price: 55},
        mid:            {id: 'mid',            title: 'Medium',             price: 45},
        mid_no_meat:    {id: 'mid_no_meat',    title: 'Medium, no meat',    price: 35},
        mid_no_salad:   {id: 'mid_no_salad',   title: 'Medium, no salad',   price: 40},
        mid_no_garnish: {id: 'mid_no_garnish', title: 'Medium, no garnish', price: 40},
        salad:          {id: 'salad',          title: 'Only salad',         price: 25},
        meat:           {id: 'meat',           title: 'Only meat',          price: 35},
        garnish:        {id: 'garnish',        title: 'Only garnish',       price: 3}
      };

      this.displayNameFor = function(dishSetId) {
        dishSetId = (!this.isValid(dishSetId)) ? 'none' : dishSetId;

        var dishSet = map[dishSetId];
        return dishSet.title;
      };

      this.list = function() {
        return map;
      };

      this.isValid = function(dishSetId) {
        return typeof dishSetId === 'string' && map[dishSetId];
      };
  });
})(angular);