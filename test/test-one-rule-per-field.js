var expect = chai.expect;



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
    });

    
    describe("Function Sync", function() {
      it("should pass if the rule passes", function(done) {

        var data = { age: '1' };
        var rules = {
          age: {
            rule: function(value) {
              return true;
            },
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
            rule: function(value) {
              return false;
            },
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
            rule: function(value) {
              return true;
            },
            message: "test error"
          },
          name: {
            rule: function(value) {
              return true;
            },
            message: "test error"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });
    


      it("should fail if 1 of 2 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: function(value) {
              return true;
            },
            message: "function 1 always return true"
          },
          name: {
            rule: function(value) {
              return false;
            },
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
            rule: function(value) {
              return false;
            },
            message: "function 1 always return false"
          },
          name: {
            rule: function(value) {
              return false;
            },
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

      
      it("should fail if 1 of 3 rules fails", function(done) {

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

      it("should fail if 2 of 3 rules fail", function(done) {

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
            rule: function(value) {
              return true;
            },
            message: "test error"
          },
          name: {
            rule: function(value) {
              return true;
            },
            message: "test error"
          },
          surname: {
            rule: function(value) {
              return true;
            },
            message: "test error"
          }
        };

        FormValidator
          .validate(data, rules)
          .done(function() {
            done();
          });
      });
    


      it("should fail if 1 of 3 rules fails", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: function(value) {
              return true;
            },
            message: "function 1 always return true"
          },
          name: {
            rule: function(value) {
              return false;
            },
            message: "function 2 always return false"
          },
          surname: {
            rule: function(value) {
              return true;
            },
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

      it("should fail if 2 of 3 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: function(value) {
              return false;
            },
            message: "function 1 always return false"
          },
          name: {
            rule: function(value) {
              return false;
            },
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
      it("should fail if 3 of 3 rules fail", function(done) {

        var data = {
          age: '1',
          name: 'alberto',
          surname: 'sarullo'
        };

        var rules = {
          age: {
            rule: function(value) {
              return false;
            },
            message: "function 1 always return false"
          },
          name: {
            rule: function(value) {
              return false;
            },
            message: "function 2 always return false"
          },
          surname: {
            rule: function(value) {
              return false;
            },
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
