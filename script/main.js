$(function() {
	var $form = $('.form-to-validate');
	var rules = {
		name: {
			// function rule
			rule: function(value) {
				/*setTimeout(function() {
				//	errorCallback();
				}, 2000);
*/
				return value == 1;
			},
			message:"Devi indicare il tuo nome"
		},
		surname: {
			// regexp rule
			rule: /^[A-Za-z0-9 ]{3,20}$/,
			message:"Devi indicare il tuo cognome"
		},
		email: [{  // cascading rule
			rule: /^[A-Za-z0-9@ ]{6,7}$/,
			message:"La mail deve essere compresa tra 6 e 7 caratteri"
		}, {  // cascading rule
			rule: /^[A-Za-z0-9@ ]{7,7}$/,
			message:"La mail deve essere compresa tra 7 e 7 caratteri"
		}],
		
		comment: {
			// function rule
			rule: function(value, successCallback, errorCallback) {
				setTimeout(function() {
					if (value == 1) {
						successCallback();
					} else {
						errorCallback();
					}
				}, 1000);
			},
			message:"Devi scrivere un commento"
		},
		age: {
			// function rule
			rule: function(value) {
				return value > 1;
			},
			message:"Devi indicare la tua età"
		}
	};
	
	$form.on('submit', function(e) {
		e.preventDefault();

		var data = {};
		$.map($form.serializeArray(), function (obj) {
			data[obj.name] = obj.value;
		});

		$('.error-detail', $form).html('');
		$('.input-error', $form).removeClass('input-error');
		
		
		FormValidator
			.validate(data, rules)
			.done(function() {
				console.log('success');
			})
			.fail(function(errors) {
				console.log('fail');
				$.each(errors, function(index, error) {
					//console.log(error.field);
					var $field = $("[name='" + error.field + "']", $form);
					$field.addClass('input-error');
					$field.parent().children('.error-detail').html(error.msg);
				});
			})
			.always(function() {
				console.log('always');
			});
	});
});