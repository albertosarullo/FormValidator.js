FormValidator.js
================

Micro javascript library (> 2K minified) for data validation, useful for complex form handling. 
The core library abstract entirely from user interface aspect, but i realize a jquery plugin wrapped version to speed up common task. 

## Features

Validation based on:

* single regexp per field
* single synchronous/asynchronous function per field
* multiple cascade regexps per field
* multiple cascade functions per field

Dependencies:

* no dependency from other framework, but I create a wrapper for use as jquery plugin (see below)

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

26/04/2014 - start project, regexp and sync validation supported
27/04/2014 - rewrite library core to support cascade async validation funcions

## License 

MIT
