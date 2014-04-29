(function( $ ) {
 
    $.fn.formValidator = function(rules, options) {
		var $form = $(this);

		var settings = $.extend({
			fieldClass: 'field-not-valid',
			errorDetailClass: 'error-detail',
            success: function(e) { },
            fail: function(errors, e) { }
        }, options );

		function getFormData() {
			var data = {};
			$.map($form.serializeArray(), function (obj) {
				data[obj.name] = obj.value;
			});
			return data;
		}

		function showErrors(errors) {
			$.each(errors, function(index, error) {
				var $field = $("[name='" + error.field + "']", $form);
				$field.addClass(settings.fieldClass);
				$field.parent().children('.' + settings.errorDetailClass).html(error.msg);
			});
		}

		function hideErrors() {
			$('.' + settings.errorDetailClass, $form).html('');
			$('.' + settings.fieldClass, $form).removeClass(settings.fieldClass);
		}
		
		$form.on('submit', function(e) {
			
			e.preventDefault();

			hideErrors();

			FormValidator
				.validate(getFormData(), rules)
				.done(function() {
					settings.success(e);
				})
				.fail(function(errors) {
					showErrors(errors);
					settings.fail(errors, e);
				});

        });
		
        return $form;
 
    };
 
}( jQuery ));