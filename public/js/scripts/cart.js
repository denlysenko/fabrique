(function($) {
	'use strict';

	var cart = {
		init: function() {
			this.addListeners();
		},

		addListeners: function() {
			$('[data-action="checkout"]').on('click', this.checkout);
			$(document).on('submit', '.checkout form', this.onSubmit);
			$('[name=discount]').on('keyup', this.onKeyup);
			$('.update-basket').on('click', 'a', this.update);
		},

		checkout: function() {
			var url = $(this).attr('href');

			$.ajax({
				url: url,
				method: 'GET',
				success: function(response) {
					$(response).appendTo($('.content'));
				}
			});
			$('[data-action="checkout"]').addClass('disabled');
			return false;
		},

		onSubmit: function() {
			var $this = $(this),
					url = $this.attr('action'),
					$helper = $('.helper');

			$helper.html('').removeClass('bg-danger bg-success');	

			$this.on('keypress', 'input, textarea', function() {
					$(this).tooltip('destroy');
					$(this).closest('div').removeClass('has-error');
				});

			var $inputs = $this.find('input:not(:hidden), textarea'),
						i, 
						len = $inputs.length;
				for(i = 0; i < len; i++) { // с each некорректно проходили итерации, возвращалось true 
					var input = $inputs[i];
					if(!$.validate(input)) return false;
				}		

			$('.cart :input, [name=discount]').clone().appendTo($(this))
					.css({'display': 'none'});	

			$.ajax({
				url: url,
				method: 'POST',
				data: $this.serialize(),
				success: function() {
					location.reload();
				},
				statusCode: {
					404: function() {
						$helper.html('Card Not Found').addClass('bg-danger');
					},
					403: function(jqXHR) {
						$helper.html(error).addClass('bg-danger');
					}
				},
				complete: function() {
					$(':hidden', $this).remove();
				}
			});
			
			return false;
		},

		onKeyup: function() {
			$('.update-basket a').removeClass('disabled');
			if($(this).val() === '') $('.update-basket a').addClass('disabled');
		},

		update: function() {
			var number = $('[name=discount]').val(),
					$helper = $('.helper'),
					$this = $(this);

			$.ajax({
				url: '/cart/update',
				method: 'POST',
				data: {number: number},
				success: function(response) {
					var $total = $('.total-order .pr');
					var newTotal = $total.text() - $total.text()*response/100;
					$total.text(newTotal.toFixed(2));
				},
				statusCode: {
					404: function() {
						$helper.html('Card not found').addClass('bg-danger');
					}
				},
				complete: function() {
					$this.addClass('disabled');
				}
			});
			return false; 
		}
	};

	cart.init();
})(jQuery);