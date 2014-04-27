/*

FormValidator by Alberto Sarullo - alberto.sarullo(at)gmail.com

*/

var FormValidator = (function FormValidator() {
	'use strict';

	var errors = [],

		rulesNumber = 0,
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
				if (obj.rule(data[field])) {
					successCallback(field, data[field]);
				} else {
					failCallback({
						field: field,
						msg: obj.message || field
					});
				}
			} else {
				// async version
				obj.rule(data[field], function successRule() {
					successCallback(field, data[field]);
				}, function failRule() {
					failCallback({
						field: field,
						msg: obj.message
					});
				});
			}
		} else {
			// regexp
			if (obj.rule.test(data[field])) {
				successCallback(field, data[field]);
			} else {
				failCallback({
					field: field,
					msg: obj.message || field
				});
			}
		}
	}

	function countRules(rules) {
		rulesNumber = 0;
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

		var queues = {};

		for (field in rules) {
			rule = rules[field];
			if (isArray(rule)) {
				for (i = 0; i < rule.length; i++) {
					createQueue(field, data, rule[i]);
				}
			} else {
				createQueue(field, data, rule);
			}
		}

		function createQueue(field, data, rule) {
			// validateField(data, rule[i], field, fieldSuccess, fieldFail);
			if (queues[field] === undefined) {
				queues[field] = [];
			}
			queues[field].push({
				field: field,
				data: data,
				rule: rule,
				f:function(data, rule, field, callbackOk, callbackKo) {
					validateField(data, rule, field, function(field, value) {
						fieldSuccess(field, value);
						callbackOk();
					}, function(error) {
						fieldFail(error) ;
						callbackKo();
					});
				}
			});
		}

		function processQueue(queueId) {
			var queue = queues[queueId];
			var queueObj = queue.shift();
			if (queueObj) {
				// queueObj.f(queueObj.data, queueObj.rule, queueObj.field, function callbackOk() {
				validateField(queueObj.data, queueObj.rule, queueObj.field, function callbackOk(field, value) {
					fieldSuccess(field, value);
					if (queue.length > 0) {
						processQueue(queueId);
					} else {
						successCallback();
					}
				}, function callbackKo(errors) {
					fieldFail(errors) ;
					failCallback();
				});
			} else {
				console.log('queue ended');
			}
		}

		for (var queueId in queues) {
			processQueue(queueId);
		}

		function fieldSuccess(field, value) {
			successCounter++;
			console.log('ok', field, value);

			console.log(failCounter, successCounter, rulesNumber);
			if (successCounter === rulesNumber) {
			// 	successCallback();
			}
		}

		function fieldFail(error) {
			errors.push(error);
			console.log(error.msg);
			failCounter++;
			console.log(failCounter, successCounter, rulesNumber);
			if (failCounter + successCounter === rulesNumber) {
			// 	failCallback();
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