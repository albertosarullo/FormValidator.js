if (typeof process !== 'undefined' && process.title === 'node') {
  // We are in node. Require modules.
  expect = require('chai').expect;
  //sinon = require('sinon');
  //num = require('..');

  //require("blanket")({ /* optional options */ });
  FormValidator = require("../src/FormValidator.js").formValidator;

  isBrowser = false;
} else {
  // We are in the browser. Set up variables like above using served js files.
  expect = chai.expect;
  // num and sinon already exported globally in the browser.
  isBrowser = true;
}


var trueFunction = function(value) {
  return true;
};

var falseFunction = function(value) {
  return false;
};

var trueFunctionAsync = function(value, success, fail) {
  setTimeout(function() {
    success();
  }, 200);
};

var falseFunctionAsync = function(value, success, fail) {
  setTimeout(function() {
    fail();
  }, 200);
};

describe("One rule per field", function() {
  
  describe("Single field", function() {
    describe("Regexp", function() {
      it("should pass if the rule passes", function(done) {

        var data = { age: 'ciao123' };
        var rules = {
          age: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp alphabetical with alphabetical value"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });

      it("should pass if the rule passes and call always callback", function(done) {

        var data = { age: 'ciao123' };
        var rules = {
          age: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp alphabetical with alphabetical value"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            
          })
          .always(function() {
            done();
          });
      });

      it("should fail if the rule fails", function(done) {

        var data = { age: 'ciao123' };
        var rules = { age: {
          rule: /^[0-9 ,]+$/,
          message: "regexp numeric with alphabetical value"
        }};

        FormValidator
          .validate(data, rules)
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("regexp numeric with alphabetical value");
            done();
          });
      });

      it("should fail if the rule fails and call always callback", function(done) {

        var data = { age: 'ciao123' };
        var rules = { age: {
          rule: /^[0-9 ,]+$/,
          message: "regexp numeric with alphabetical value"
        }};

        FormValidator
          .validate(data, rules)
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("regexp numeric with alphabetical value");
            
          }).
          always(function(){
            done();
          });
      });
    });

    
    describe("Function Sync", function() {
      it("should pass if the rule passes", function(done) {

        var data = { age: '1' };
        var rules = {
          age: {
            rule: trueFunction,
            message: "test error"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });
    
      it("should fail if rule fails", function(done) {

        var data = { age: '1' };
        var rules = {
          age: {
            rule: falseFunction,
            message: "function always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function always return false");
            done();
          });
      });
    });

    describe("Function Async", function() {
      it("should pass if the rule passes", function(done) {

        var data = { age: '1' };
        var rules = {
          age: {
            rule: trueFunctionAsync,
            message: "test error"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });
    
      it("should fail if rule fails", function(done) {

        var data = { age: '1' };
        var rules = {
          age: {
            rule: falseFunctionAsync,
            message: "function always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function always return false");
            done();
          });
      });
    });
  });

  


  describe("2 fields", function() {
    describe("Regexp", function() {
      it("should pass if 2 of 2 rules pass", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp alphabetical with alphabetical value"
          },
          name: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp numeric with alphabetical value"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          })
          .fail(function(errors) {
            
          });
      });

      


      it("should fail if 1 (first) of 2 rules fails (reverse)", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: /^[a-zA-Z]+$/,
            message: "regexp alphabetical with numerical value"
          },
          name: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp numeric with alphabetical value"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {

          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("regexp alphabetical with numerical value");
            done();
          });
      });

      it("should fail if 1 (second) of 2 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp alphabetical with alphabetical value"
          },
          name: {
            rule: /^[0-9]+$/,
            message: "regexp numeric with alphabetical value"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {

          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("name");
            expect(errors[0].msg).to.equal("regexp numeric with alphabetical value");
            done();
          });
      });

      it("should fail if 2 of 2 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: /^[a-zA-Z]+$/,
            message: "regexp alphabetical with numeric value"
          },
          name: {
            rule: /^[0-9]+$/,
            message: "regexp numeric with alphabetical value"
          }
          
        };

        FormValidator
          .validate(data, rules)
          .done(function() {

          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(2);
            
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("regexp alphabetical with numeric value");
            expect(errors[1].field).to.equal("name");
            expect(errors[1].msg).to.equal("regexp numeric with alphabetical value");
            
            done();
          });
      });

    });

    describe("Function Sync", function() {
      it("should pass if 2 of 2 rules pass", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: trueFunction,
            message: "test error"
          },
          name: {
            rule: trueFunction,
            message: "test error"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });
    

      it("should fail if 1 (first) of 2 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: falseFunction,
            message: "function 1 always return false"
          },
          name: {
            rule: trueFunction,
            message: "function 2 always return true"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            expect(false).to.qeual(true);
            done();
          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function 1 always return false");
            done();
          });
      });

      it("should fail if 1 (second) of 2 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: trueFunction,
            message: "function 1 always return true"
          },
          name: {
            rule: falseFunction,
            message: "function 2 always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            expect(false).to.qeual(true);
            done();
          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("name");
            expect(errors[0].msg).to.equal("function 2 always return false");
            done();
          });
      });

    


      it("should fail if 2 of 2 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: falseFunction,
            message: "function 1 always return false"
          },
          name: {
            rule: falseFunction,
            message: "function 2 always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(2);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function 1 always return false");
            expect(errors[1].field).to.equal("name");
            expect(errors[1].msg).to.equal("function 2 always return false");
            done();
          });
      });


    });




    describe("Function Async", function() {
      it("should pass if 2 of 2 rules pass", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: trueFunctionAsync,
            message: "test error"
          },
          name: {
            rule: trueFunctionAsync,
            message: "test error"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });
    

      it("should fail if 1 (first) of 2 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: falseFunctionAsync,
            message: "function 1 always return false"
          },
          name: {
            rule: trueFunctionAsync,
            message: "function 2 always return true"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            expect(false).to.qeual(true);
            done();
          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function 1 always return false");
            done();
          });
      });

      it("should fail if 1 (second) of 2 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: trueFunctionAsync,
            message: "function 1 always return true"
          },
          name: {
            rule: falseFunctionAsync,
            message: "function 2 always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            expect(false).to.qeual(true);
            done();
          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("name");
            expect(errors[0].msg).to.equal("function 2 always return false");
            done();
          });
      });

    


      it("should fail if 2 of 2 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: falseFunctionAsync,
            message: "function 1 always return false"
          },
          name: {
            rule: falseFunctionAsync,
            message: "function 2 always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(2);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function 1 always return false");
            expect(errors[1].field).to.equal("name");
            expect(errors[1].msg).to.equal("function 2 always return false");
            done();
          });
      });


    });
  });

  describe("3 fields", function() {
    describe("Regexp", function() {
      it("should pass if 3 of 3 rules pass", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp alphabetical with alphabetical value"
          },
          name: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp numeric with alphabetical value"
          },
          surname: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp alphabetical with alphabetical value"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          })
          .fail(function(errors) {
            
          });
      });

      it("should fail if 1 (first) of 3 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: /^[a-zA-Z]+$/,
            message: "regexp alphabetical with numerical value"
          },
          name: {
            rule: /^[a-zA-Z]+$/,
            message: "regexp numeric with alphabetical value"
          },
          surname: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp alphabetical with alphabetical value"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {

          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("regexp alphabetical with numerical value");
            done();
          });
      });
      
      it("should fail if 1 (second) of 3 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp alphabetical with alphabetical value"
          },
          name: {
            rule: /^[0-9]+$/,
            message: "regexp numeric with alphabetical value"
          },
          surname: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp alphabetical with alphabetical value"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {

          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("name");
            expect(errors[0].msg).to.equal("regexp numeric with alphabetical value");
            done();
          });
      });

      it("should fail if 1 (third) of 3 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp alphabetical with alphabetical value"
          },
          name: {
            rule: /^[a-zA-Z]+$/,
            message: "regexp numeric with alphabetical value"
          },
          surname: {
            rule: /^[0-9]+$/,
            message: "regexp numerical with alphabetical value"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {

          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("surname");
            expect(errors[0].msg).to.equal("regexp numerical with alphabetical value");
            done();
          });
      });

      it("should fail if 2 (first, second) of 3 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: /^[a-zA-Z]+$/,
            message: "regexp alphabetical with numerical value"
          },
          name: {
            rule: /^[0-9]+$/,
            message: "regexp numeric with alphabetical value"
          },
          surname: {
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "regexp alphabetical with alphabetical value"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {

          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(2);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("regexp alphabetical with numerical value");
            expect(errors[1].field).to.equal("name");
            expect(errors[1].msg).to.equal("regexp numeric with alphabetical value");
            done();
          });
      });

      it("should fail if 2 (first, third) of 3 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: /^[a-zA-Z]+$/,
            message: "regexp alphabetical with numerical value"
          },
          name: {
            rule: /^[a-zA-Z]+$/,
            message: "regexp numeric with alphabetical value"
          },
          surname: {
            rule: /^[0-9]+$/,
            message: "regexp numeric with alphabetical value"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {

          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(2);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("regexp alphabetical with numerical value");
            expect(errors[1].field).to.equal("surname");
            expect(errors[1].msg).to.equal("regexp numeric with alphabetical value");
            done();
          });
      });

      it("should fail if 2 (second, third) of 3 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: /^[0-9]+$/,
            message: "regexp numeric with numerical value"
          },
          name: {
            rule: /^[0-9]+$/,
            message: "regexp numeric with alphabetical value"
          },
          surname: {
            rule: /^[0-9]+$/,
            message: "regexp numeric with alphabetical value"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {

          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(2);
            expect(errors[0].field).to.equal("name");
            expect(errors[0].msg).to.equal("regexp numeric with alphabetical value");
            expect(errors[1].field).to.equal("surname");
            expect(errors[1].msg).to.equal("regexp numeric with alphabetical value");
            done();
          });
      });

      it("should fail if 3 of 3 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: /^[a-zA-Z]+$/,
            message: "regexp alphabetical with numeric value"
          },
          name: {
            rule: /^[0-9]+$/,
            message: "regexp numeric with alphabetical value"
          },
          surname: {
            rule: /^[0-9]+$/,
            message: "regexp numeric with alphabetical value"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {

          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(3);
            
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("regexp alphabetical with numeric value");
            expect(errors[1].field).to.equal("name");
            expect(errors[1].msg).to.equal("regexp numeric with alphabetical value");
            expect(errors[2].field).to.equal("surname");
            expect(errors[2].msg).to.equal("regexp numeric with alphabetical value");
            
            done();
          });
      });


    });

    describe("Function Sync", function() {
      it("should pass if 3 of 3 rules pass", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: trueFunction,
            message: "test error"
          },
          name: {
            rule: trueFunction,
            message: "test error"
          },
          surname: {
            rule: trueFunction,
            message: "test error"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });
    
      it("should fail if 1 (first) of 3 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: falseFunction,
            message: "function 1 always return false"
          },
          name: {
            rule: trueFunction,
            message: "function 2 always return false"
          },
          surname: {
            rule: trueFunction,
            message: "function 3 always return true"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            expect(false).to.qeual(true);
            done();
          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function 1 always return false");
            done();
          });
      });

      it("should fail if 1 (second) of 3 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: trueFunction,
            message: "function 1 always return true"
          },
          name: {
            rule: falseFunction,
            message: "function 2 always return false"
          },
          surname: {
            rule: trueFunction,
            message: "function 3 always return true"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            expect(false).to.qeual(true);
            done();
          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("name");
            expect(errors[0].msg).to.equal("function 2 always return false");
            done();
          });
      });

      it("should fail if 1 (third) of 3 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: trueFunction,
            message: "function 1 always return true"
          },
          name: {
            rule: trueFunction,
            message: "function 2 always return false"
          },
          surname: {
            rule: falseFunction,
            message: "function 3 always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            expect(false).to.qeual(true);
            done();
          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("surname");
            expect(errors[0].msg).to.equal("function 3 always return false");
            done();
          });
      });

      it("should fail if 2 (first, second) of 3 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: falseFunction,
            message: "function 1 always return false"
          },
          name: {
            rule: falseFunction,
            message: "function 2 always return false"
          },
          surname: {
            rule: trueFunction,
            message: "function 3 always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(2);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function 1 always return false");
            expect(errors[1].field).to.equal("name");
            expect(errors[1].msg).to.equal("function 2 always return false");
            done();
          });
      });

      it("should fail if 2 (first, third) of 3 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: falseFunction,
            message: "function 1 always return false"
          },
          name: {
            rule: trueFunction,
            message: "function 2 always return true"
          },
          surname: {
            rule: falseFunction,
            message: "function 3 always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(2);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function 1 always return false");
            expect(errors[1].field).to.equal("surname");
            expect(errors[1].msg).to.equal("function 3 always return false");
            done();
          });
      });


      it("should fail if 3 of 3 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: falseFunction,
            message: "function 1 always return false"
          },
          name: {
            rule: falseFunction,
            message: "function 2 always return false"
          },
          surname: {
            rule: falseFunction,
            message: "function 3 always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(3);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function 1 always return false");
            expect(errors[1].field).to.equal("name");
            expect(errors[1].msg).to.equal("function 2 always return false");
            expect(errors[2].field).to.equal("surname");
            expect(errors[2].msg).to.equal("function 3 always return false");
            done();
          });
      });

    });

    describe("Function Async", function() {
      it("should pass if 3 of 3 rules pass", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: trueFunctionAsync,
            message: "test error"
          },
          name: {
            rule: trueFunctionAsync,
            message: "test error"
          },
          surname: {
            rule: trueFunctionAsync,
            message: "test error"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });
    
      it("should fail if 1 (first) of 3 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: falseFunctionAsync,
            message: "function 1 always return false"
          },
          name: {
            rule: trueFunctionAsync,
            message: "function 2 always return false"
          },
          surname: {
            rule: trueFunctionAsync,
            message: "function 3 always return true"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            expect(false).to.qeual(true);
            done();
          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function 1 always return false");
            done();
          });
      });

      it("should fail if 1 (second) of 3 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: trueFunctionAsync,
            message: "function 1 always return true"
          },
          name: {
            rule: falseFunctionAsync,
            message: "function 2 always return false"
          },
          surname: {
            rule: trueFunctionAsync,
            message: "function 3 always return true"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            expect(false).to.qeual(true);
            done();
          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("name");
            expect(errors[0].msg).to.equal("function 2 always return false");
            done();
          });
      });

      it("should fail if 1 (third) of 3 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: trueFunctionAsync,
            message: "function 1 always return true"
          },
          name: {
            rule: trueFunctionAsync,
            message: "function 2 always return false"
          },
          surname: {
            rule: falseFunctionAsync,
            message: "function 3 always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            expect(false).to.qeual(true);
            done();
          })
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(1);
            expect(errors[0].field).to.equal("surname");
            expect(errors[0].msg).to.equal("function 3 always return false");
            done();
          });
      });

      it("should fail if 2 (first, second) of 3 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: falseFunctionAsync,
            message: "function 1 always return false"
          },
          name: {
            rule: falseFunctionAsync,
            message: "function 2 always return false"
          },
          surname: {
            rule: trueFunctionAsync,
            message: "function 3 always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(2);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function 1 always return false");
            expect(errors[1].field).to.equal("name");
            expect(errors[1].msg).to.equal("function 2 always return false");
            done();
          });
      });

      it("should fail if 2 (first, third) of 3 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: falseFunctionAsync,
            message: "function 1 always return false"
          },
          name: {
            rule: trueFunctionAsync,
            message: "function 2 always return true"
          },
          surname: {
            rule: falseFunctionAsync,
            message: "function 3 always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(2);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function 1 always return false");
            expect(errors[1].field).to.equal("surname");
            expect(errors[1].msg).to.equal("function 3 always return false");
            done();
          });
      });


      it("should fail if 3 of 3 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: falseFunctionAsync,
            message: "function 1 always return false"
          },
          name: {
            rule: falseFunctionAsync,
            message: "function 2 always return false"
          },
          surname: {
            rule: falseFunctionAsync,
            message: "function 3 always return false"
          }
        };

        FormValidator
          .validate(data, rules)
          .fail(function(errors) {
            expect(errors).to.be.an.instanceof(Array);
            expect(errors.length).to.equal(3);
            expect(errors[0].field).to.equal("age");
            expect(errors[0].msg).to.equal("function 1 always return false");
            expect(errors[1].field).to.equal("name");
            expect(errors[1].msg).to.equal("function 2 always return false");
            expect(errors[2].field).to.equal("surname");
            expect(errors[2].msg).to.equal("function 3 always return false");
            done();
          });
      });

    });

  });
});

describe("Multiple rules per field", function() {

  describe("Single field", function() {
    describe("Regexp", function() {
      it("should pass if 2 of 2 cascading rules pass", function(done) {

        var data = { age: '1' };
        var rules = {
          age: [{
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "test error"
          },{
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "test error"
          }]
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });

      it("should pass if 3 of 3 cascading rules pass", function(done) {

        var data = { age: '1' };
        var rules = {
          age: [{
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "test error"
          },{
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "test error"
          },{
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "test error"
          }]
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });

      it("should fail if 1 of 3 cascading rules fails", function(done) {

        var data = { age: '1' };
        var rules = {
          age: [{
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "test error"
          },{
            rule: /^[a-zA-Z]+$/,
            message: "test error"
          },{
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "test error"
          }]
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            
          })
          .fail(function() {
            done();
          });
      });

     it("should fail if 2 of 3 cascading rules fail", function(done) {

        var data = { age: '1' };
        var rules = {
          age: [{
            rule: /^[a-zA-Z0-9 ,]+$/,
            message: "test error"
          },{
            rule: /^[a-zA-Z]+$/,
            message: "test error"
          },{
            rule: /^[a-zA-Z]+$/,
            message: "test error"
          }]
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            
          })
          .fail(function(errors) {
            done();
          });
      });



    });



    describe("Functions Sync", function() {
      it("should pass if 2 of 2 cascading rules pass", function(done) {

        var data = { age: '1' };
        var rules = {
          age: [{
            rule: trueFunction,
            message: "test error"
          },{
            rule: trueFunction,
            message: "test error"
          }]
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });

      it("should pass if 3 of 3 cascading rules pass", function(done) {

        var data = { age: '1' };
        var rules = {
          age: [{
            rule: trueFunction,
            message: "test error"
          },{
            rule: trueFunction,
            message: "test error"
          },{
            rule: trueFunction,
            message: "test error"
          }]
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });

      it("should fail if 1 of 3 cascading rules fails", function(done) {

        var data = { age: '1' };
        var rules = {
          age: [{
            rule: trueFunction,
            message: "test error"
          },{
            rule: falseFunction,
            message: "test error"
          },{
            rule: trueFunction,
            message: "test error"
          }]
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            
          })
          .fail(function() {
            done();
          });
      });

      it("should fail if 2 of 3 cascading rules fail", function(done) {

        var data = { age: '1' };
        var rules = {
          age: [{
            rule: trueFunction,
            message: "test error"
          },{
            rule: falseFunction,
            message: "test error"
          },{
            rule: falseFunction,
            message: "test error"
          }]
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            
          })
          .fail(function() {
            done();
          });
      });


    });


    describe("Functions Async", function() {
      it("should pass if 2 of 2 cascading rules pass", function(done) {

        var data = { age: '1' };
        var rules = {
          age: [{
            rule: trueFunctionAsync,
            message: "test error"
          },{
            rule: trueFunctionAsync,
            message: "test error"
          }]
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });

      it("should pass if 3 of 3 cascading rules pass", function(done) {

        var data = { age: '1' };
        var rules = {
          age: [{
            rule: trueFunctionAsync,
            message: "test error"
          },{
            rule: trueFunctionAsync,
            message: "test error"
          },{
            rule: trueFunctionAsync,
            message: "test error"
          }]
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });

      it("should fail if 1 of 3 cascading rules fails", function(done) {

        var data = { age: '1' };
        var rules = {
          age: [{
            rule: trueFunctionAsync,
            message: "test error"
          },{
            rule: falseFunctionAsync,
            message: "test error"
          },{
            rule: trueFunctionAsync,
            message: "test error"
          }]
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            
          })
          .fail(function() {
            done();
          });
      });

      it("should fail if 2 of 3 cascading rules fail", function(done) {

        var data = { age: '1' };
        var rules = {
          age: [{
            rule: trueFunctionAsync,
            message: "test error"
          },{
            rule: falseFunctionAsync,
            message: "test error"
          },{
            rule: falseFunctionAsync,
            message: "test error"
          }]
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            
          })
          .fail(function() {
            done();
          });
      });


    });
  });


  

});


describe("Mix", function() {
  it("Name, Surname, Email", function(done) {

    var data = {
      name: 'testname',
      surname: 'testsurname',
      email: 'aaaaa@aaaaa.aaa'
    };
    var rules = {
      name: {
        rule: trueFunction,
        message: "test error"
      },
      surname: [{
        rule: trueFunctionAsync,
        message: "test error"
      }],
      mail: [{
        rule: trueFunctionAsync,
        message: "test error"
      },{
        rule: trueFunction,
        message: "test error"
      },{
        rule: trueFunctionAsync,
        message: "test error"
      }]
    };

    FormValidator
      .validate(data, rules)
      .done(function() {
        done();
      })
      .fail(function() {
        
      });
  });
  
});