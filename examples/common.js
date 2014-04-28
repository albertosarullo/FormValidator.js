var $form = $('.form-to-validate');

$form.on('submit', function(e) {
    e.preventDefault();

    var data = {};
    $.map($form.serializeArray(), function (obj) {
        data[obj.name] = obj.value;
    });

    $('.error-detail', $form).html('');
    $('.field-not-valid', $form).removeClass('field-not-valid');
    
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
                $field.addClass('field-not-valid');
                $field.parent().children('.error-detail').html(error.msg);
            });
        })
        .always(function() {
            console.log('always');
        });
});