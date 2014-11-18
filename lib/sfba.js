function TestClass(greeting) {
  this.greeting = greeting || 'Hello';
}

TestClass.prototype.sayHello = function(name) {
  return this.greeting + ', ' + name;
};

module.exports = TestClass;