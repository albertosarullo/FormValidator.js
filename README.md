FormValidator.js
================

Micro javascript library (< 2K minified) for data validation, useful for complex form handling.

The core library abstract entirely from user interface aspect, but i realize a jquery plugin wrapped version to speed up common task. 

## Features

Validation based on:

* single regexp per field
* single synchronous/asynchronous function per field
* multiple cascade regexps per field
* multiple cascade functions per field

Dependencies:

* no dependency from other framework, but I create a wrapper for use as jquery plugin (see below)

## How works

The library receive *data*, *rules*, and apply the rules to the data to valitadate them.

The *data* object must be like this:

```javascript
{
    name: "Albertoooo",
    age: "34"
}
```

The *rules* object must be like this:

```javascript
{
    name: {
        rule: function(value) {
            return value === "Alberto";
        },
        message: "Name must be 'Alberto'"
    },
    age: {
        rule: function(value) {
            return value > 18;
        },
        message: "Age must be 18+"
    }
}
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
