function formValidator(config) {
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
			} else {
				// async version
				returnValue = obj.rule(data[field], function success() {
					console.log('async success');
				}, function fail() {
					console.log('async fail');
				});
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
			console.log('validate', this);
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
		}
	};
}