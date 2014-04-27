var FormValidator = (function FormValidator() {
	var errors = [];
	var tempError = null;

	function validateField(data, obj, field) {
		var returnValue;
		if (typeof obj.rule === 'function') {
			// only 1 parameter: sync version
			if (obj.rule.length === 1 ) {
				returnValue = obj.rule(data[field]);
				if (returnValue === false) {
					if (tempError === null) {
						tempError = {
							field: field,
							msg:obj.message || field
						};
						errors.push(tempError);
					}
				}
			}
		} else {
			if (!obj.rule.test(data[field])) {
				if (tempError === null) {
					tempError = {
						field: field,
						msg:obj.message || field
					};
					errors.push(tempError);
				}
			}
		}
	}

	function validateDataWithRules(data, rules) {
		var i,
			rule,
			field;
		errors = [];
		for (field in rules) {
			rule = rules[field];
			if (Object.prototype.toString.call(rule) === '[object Array]') {
				tempError = null;
				for (i = 0; i < rule.length; i++) {
					validateField(data, rule[i], field);
				}
			} else {
				tempError = null;
				validateField(data, rule, field);
			}
		}
	}

	return {
		validate: function(data, rules) {
			validateDataWithRules(data, rules);
			return this;
		},
		done: function done(f) {
			if (errors.length === 0) {
				f.call(this);
			}
			return this;
		},
		fail: function fail(f) {
			if (errors.length > 0) {
				f.call(this, errors);
			}
			return this;
		},
		always: function always(f) {
			f.call(this);
			return this;
		},
		EMAIL: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
	};
})();