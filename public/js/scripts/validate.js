(function($) {

	validator.extend('isNonEmpty', function(str) {
		return str !== '';
	});

	$.validate = function (input) {
		var $input = $(input),
			 type = $input.attr('name'),
			 $parent = $input.closest('form');
			
		if(type === 'name' || type === 'last-name' || type === 'category') {
			var msg = $input.attr('placeholder');
			$input.tooltip({title: msg + ' should contain letters', placement: 'right', trigger: 'manual'});	
			if(!validator.isAlpha($input.val())) {
				$input.closest('div').addClass('has-error');
				$input.tooltip('show');
				return false;
			}
		}

		if(type === 'title'|| type === 'description' || type === 'info' || type === 'feature' || type === 'characteristic' || type === 'slogan' || type === 'address') {
			var msg = $input.attr('placeholder');
			$input.tooltip({title: msg + ' should contain letters', placement: 'right', trigger: 'manual'});	
			if(!validator.isNonEmpty($input.val())) {
				$input.closest('div').addClass('has-error');
				$input.tooltip('show');
				return false;
			}
		}

		if(type === 'code') {
			var msg = $input.attr('placeholder');
			$input.tooltip({title: msg + ' should contain letters or numbers', placement: 'right', trigger: 'manual'});	
			if(!validator.isAlphanumeric($input.val())) {
				$input.closest('div').addClass('has-error');
				$input.tooltip('show');
				return false;
			}
		}

		if(type === 'login') {
			var msg = $input.attr('placeholder');
			$input.tooltip({title: msg + ' should contain letters or numbers', placement: 'right', trigger: 'manual'});	
			if(!validator.isAlphanumeric($input.val())) {
				$input.closest('div').addClass('has-error');
				$input.tooltip('show');
				return false;
			}
		}

		if(type === 'email') {
			var msg = 'Type correct e-mail';
			$input.tooltip({title: msg, placement: 'right', trigger: 'manual'});	
			if(!validator.isEmail($input.val())) {
				$input.closest('div').addClass('has-error');
				$input.tooltip('show');
				return false;
			}
		}

		if(type === 'tel-num') {
			var msg = 'Type phone number as (xxx) xxx xxxx';
			$input.tooltip({title: msg, placement: 'right', trigger: 'manual'});	
			if(!validator.matches($input.val(), /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)) {
				$input.closest('div').addClass('has-error');
				$input.tooltip('show');
				return false;
			}
		}

		if((type === 'acc-number' && $('[name="acc-number"]').val()) || type === 'discount-num') {
			var msg = 'Type acc number as xxxxxxxx';
			$input.tooltip({title: msg, placement: 'right', trigger: 'manual'});	
			if(!validator.matches($input.val(), /\d{8}/)) {
				$input.closest('div').addClass('has-error');
				$input.tooltip('show');
				return false;
			}
		}

		if(type === 'discount') {
			var msg = 'Discount should be in the range 1 - 99';
			$input.tooltip({title: msg, placement: 'right', trigger: 'manual'});	
			if(!validator.isInt($input.val(), {min: 1, max: 99})) {
				$input.closest('div').addClass('has-error');
				$input.tooltip('show');
				return false;
			}
		}

		if(type === 'passwd') {
			var msg = 'Enter password';
			$input.tooltip({title: msg, placement: 'right', trigger: 'manual'});	
			if(!validator.matches($input.val(), /\S+/)) {
				$input.closest('div').addClass('has-error');
				$input.tooltip('show');
				return false;
			}
		}

		if(type === 'confirm') {
			var msg = "This field doesn't match password";
			$input.tooltip({title: msg, placement: 'right', trigger: 'manual'});	
			if(!validator.equals($input.val(), $('[name="passwd"]').val())) {
				$input.closest('div').addClass('has-error');
				$input.tooltip('show');
				return false;
			}
		}

		if(type === 'pound-to-euro' || type === 'pound-to-dollar') {
			var msg = "Type Exchange Rate as x.xx";
			$input.tooltip({title: msg, placement: 'top', trigger: 'manual'});	
			if(!validator.isFloat($input.val())) {
				$input.closest('div').addClass('has-error');
				$input.tooltip('show');
				return false;
			}
		}

		if(type === 'price') {
			var msg = "Type Price as x.xx";
			$input.tooltip({title: msg, placement: 'right', trigger: 'manual'});	
			if(!validator.isFloat($input.val())) {
				$input.closest('div').addClass('has-error');
				$input.tooltip('show');
				return false;
			}
		}
		return true;
	}
})(jQuery);