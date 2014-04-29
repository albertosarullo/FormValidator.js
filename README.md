FormValidator.js
================

Javascript data validation library, useful for complex form handling.

The library abstract from user interface aspect, but I write a jquery plugin wrapper to speed up common task. 

## Features

* Single or multiple rules per field
* Rules as regexp, function or async functions with callback
* No dependency from other framework
* Lightweight  (< 2k minified)
* Fully tested (100% code coverage)

## How works

The library validate *data* using *rules*. 

```javascript
var data = {
    name: "Alberto",
    age: "34"
}
var rules = {
    name: {
        rule: /^[a-zA-Z0-9 ,]+$/,
        message: "Name must be alphanumeric"
    },
    age: {
        rule: function(value) {
            return value > 18;
        },
        message: "Age must be 18+"
    }
}

FormValidator
  .validate(data, rules)
  .done(function() {
    // success
  })
  .fail(function(errors) {
    // fail
  })

```



## Examples 

Basic, wrapped as jquery plugin - /examples/basic.html

```javascript
$('.form-to-validate').formValidator({
    email: {
        rule: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
        message: "Mail must be valid"
    },
    age: {
      rule: function(value) {
        return value >= 18;
      },
      message: "Age must be 18+"
  }
}, {
    success: function(e) {
        alert('ok!')
    }
});
```

## Browser Compatibility

IE8+, Chrome, Firefox, Safari

## History

* 28/04/2014 - Added tests, isolated and fixed bug
* 27/04/2014 - Rewrite library core to support cascade async validation funcions
* 26/04/2014 - Start project, regexp and sync validation supported

## License 

MIT
