$(function() {
	var $form = $('.form-to-validate');
	var rules = {
		name: {
			// function rule
			rule: function(value) {
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
			rule: /^[A-Za-z0-9 ]{10,20}$/,
			message:"La mail deve essere compresa tra 10 e 20 caratteri"
		}, {
			rule: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
			message:"Devi indicare un indirizzo e-mail valido"
		}],
		
		comment: {
			// function rule
			rule: function(value) {
				return value == 1;
			},
			message:"Devi scrivere un commento"
		},
		age: {
			// function rule
			rule: function(value) {
				return value > 18;
			},
			message:"Devi indicare la tua età"
		}
	};


	/* ASYNC
			comment: {
			// function rule
			rule: function(value, successCallback, errorCallback) {
				setTimeout(function() {
					successCallback();
				}, 1000);
				return value == 1;
			},
			message:"Devi scrivere un commento"
		},
*/
	
	$form.on('submit', function(e) {
		e.preventDefault();

		var data = {};
		$.map($form.serializeArray(), function (obj) {
			data[obj.name] = obj.value;
		});

		$('.error-detail', $form).html('');
		$('.input-error', $form).removeClass('input-error');
		
		
		formValidator()
			.validate(data, rules)
			.done(function() {
				console.log('success');
			})
			.fail(function(errors) {
				console.log('fail');
				$.each(errors, function(index, error) {
					// console.log(error.field);
					var $field = $('#' + error.field, $form);
					$field.addClass('input-error');
					$field.parent().children('.error-detail').html(error.msg);
				});
			})
			.always(function() {
				console.log('always');
			});
	});
});