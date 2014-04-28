var expect = chai.expect;
 

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
          .fail(function() {
            done();
          });
      });

    });



    describe("Functions Sync", function() {
      it("should pass if 2 of 2 cascading rules pass", function(done) {

        var data = { age: '1' };
        var rules = {
          age: [{
            rule: function(value) {
              return true;
            },
            message: "test error"
          },{
            rule: function(value) {
              return true;
            },
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
            rule: function(value) {
              return true;
            },
            message: "test error"
          },{
            rule: function(value) {
              return true;
            },
            message: "test error"
          },{
            rule: function(value) {
              return true;
            },
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
            rule: function(value) {
              return true;
            },
            message: "test error"
          },{
            rule: function(value) {
              return false;
            },
            message: "test error"
          },{
            rule: function(value) {
              return true;
            },
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
            rule: function(value) {
              return true;
            },
            message: "test error"
          },{
            rule: function(value) {
              return false;
            },
            message: "test error"
          },{
            rule: function(value) {
              return false;
            },
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


  describe("2 field", function() {

    
  });

  describe("Mix", function() {

    
  });

});
