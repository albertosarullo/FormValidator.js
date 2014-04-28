/*

FormValidator by Alberto Sarullo - alberto.sarullo(at)gmail.com

*/

var FormValidator = (function FormValidator() {
	'use strict';

	var errors = [],

		doneFunction,
		failFunction,
		alwaysFunction;

	function isArray(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}

	function isFunction(obj) {
		return typeof obj === 'function';
	}

	function validateField(value, obj, field, successCallback, failCallback) {
		if (isFunction(obj.rule)) {
			// only 1 parameter: sync version
			if (obj.rule.length === 1) {
				if (obj.rule(value)) {
					successCallback(field, value);
				} else {
					failCallback(field, obj.message);
				}
			} else {
				// async version
				obj.rule(value, function successRule() {
					successCallback(field, value);
				}, function failRule() {
					failCallback(field, obj.message);
				});
			}
		} else {
			// regexp
			if (obj.rule.test(value)) {
				successCallback(field, value);
			} else {
				failCallback(field, obj.message);
			}
		}
	}

	function validateDataWithRules(data, rules, successCallback, failCallback) {
		var i,
			rule,
			field,
			value;
		errors = [];

		var queues = {};

		for (field in rules) {
			rule = rules[field];
			value = data[field];
			if (isArray(rule)) {
				for (i = 0; i < rule.length; i++) {
					createQueue(field, value, rule[i]);
				}
			} else {
				createQueue(field, value, rule);
			}
		}

		for (var queueId in queues) {
			processQueue(queueId);
		}

		function createQueue(field, value, rule) {
			if (queues[field] === undefined) {
				queues[field] = [];
			}
			queues[field].push({
				field: field,
				value: value,
				rule: rule
			});
		}

		function processQueue(queueId) {
			var queue = queues[queueId];
			var queueObj = queue.shift();
			if (queueObj) {
				validateField(queueObj.value, queueObj.rule, queueObj.field, function callbackOk(field, value) {
					fieldSuccess(field, value);
					if (queue.length > 0) {
						processQueue(queueId);
					} else {
						console.log('queue ' + queueId + ' ended');
						queue.empty = true;
						if (queuesAreEmpty()) {
							successCallback();
						}
					}
				}, function callbackKo(field, message) {
					errors.push({field: field, msg: message});
					// fieldFail(error);
					queue.empty = true;
					// todo: call failCallback only if all queu are close
					if (queuesAreEmpty()) {
						failCallback();
					}
				});
			} else {
				console.log('queue ' + queueId + ' ended');
			}
		}

		function queuesAreEmpty() {
			for (var queueId in queues) {
				if (queues[queueId].empty !== true) {
					return false;
				}
			}
			return true;
		}
			
	}

	return {
		validate: function(data, rules) {
			var that = this;
			setTimeout(function() {
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