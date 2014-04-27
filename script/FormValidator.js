/*

FormValidator by Alberto Sarullo - alberto.sarullo(at)gmail.com

*/

var FormValidator = (function FormValidator() {
	'use strict';

	var errors = [],
		tempError = null,

		rulesNumber = 0,
		asyncFunctionCounter = 0,
		successCounter = 0,
		failCounter = 0,

		doneFunction,
		failFunction,
		alwaysFunction;

	function isArray(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}

	function isFunction(obj) {
		return typeof obj === 'function';
	}

	function validateField(data, obj, field, successCallback, failCallback) {
		var returnValue;
		if (isFunction(obj.rule)) {

			// only 1 parameter: sync version
			if (obj.rule.length === 1) {
				// asyncFunctionCounter++;
				returnValue = obj.rule(data[field]);
				if (returnValue === false) {
					if (tempError === null) {
						tempError = {
							field: field,
							msg:obj.message || field
						};
						failCallback(tempError);
					}
				} else {
					successCallback();
				}
				// todo: async with promises return {done:f(){}, fail:f(){}}
			
			} else {
				// async version
				asyncFunctionCounter++;
				returnValue = obj.rule(data[field], function successRule() {
					successCallback();
				}, function failRule() {
					//if (tempError === null) {
						tempError = {
							field: field,
							msg:obj.message
						};
						failCallback(tempError);
					//}
				});
			}
		} else {
			// asyncFunctionCounter++;
			if (!obj.rule.test(data[field])) {
				if (tempError === null) {
					tempError = {
						field: field,
						msg:obj.message || field
					};
					failCallback(tempError);
				}
			} else {
				successCallback();
			}
		}
	}

	function countRules(rules) {
		rulesNumber = 0;
		asyncFunctionCounter = 0;
		failCounter = 0;
		successCounter = 0;
		var field,
			rule,
			i;
		for (field in rules) {
			rule = rules[field];
			if (isArray(rule)) {
				for (i = 0; i < rule.length; i++) {
					rulesNumber++;
				}
			} else {
				rulesNumber++;
			}
		}
	}

	function validateDataWithRules(data, rules, successCallback, failCallback) {
		var i,
			rule,
			field;
		errors = [];

		function success() {
			successCounter++;
			console.log(failCounter, successCounter, rulesNumber);
			if (successCounter === rulesNumber) {
				successCallback();
			}
		}

		function fail(error) {
			errors.push(error);
			console.log(error.msg);
			failCounter++;
			console.log(failCounter, successCounter, rulesNumber);
			if (failCounter + successCounter === rulesNumber) {
				failCallback();
			}
		}

		for (field in rules) {
			rule = rules[field];
			if (isArray(rule)) {
				tempError = null;
				for (i = 0; i < rule.length; i++) {
					validateField(data, rule[i], field, success, fail);
				}
			} else {
				tempError = null;
				validateField(data, rule, field, success, fail);
			}
		}
	}

	return {
		validate: function(data, rules) {
			var that = this;
			setTimeout(function() {
				countRules(rules);
				validateDataWithRules(data, rules, function success() {
					if (isFunction(doneFunction)) {
						doneFunction.call(that);
					}
				}, function fail() {
					if (isFunction(failFunction)) {
						failFunction.call(that, errors);
					}
				});
			}, 10);
			return this;
		},
		done: function done(f) {
			doneFunction = f;
			return this;
		},
		fail: function fail(f) {
			failFunction = f;
			return this;
		},
		always: function always(f) {
			alwaysFunction = f;
			// f.call(this);
			return this;
		},
		EMAIL: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
	};
})();