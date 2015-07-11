(function($) {
	'use strict';

	var product = {

		init: function() {
			this.addListeners();
		},

		addListeners: function() {
			$(document).on('click', 'a[data-action="delete"]', this.remove);
			$('[data-action="add-to-wishlist"]').on('click', this.addToWishlist);
			$('[data-action="add-to-basket"]').on('click', this.addToBasket);
			$('.currency-switcher').on('click', 'a', this.switchCurrency);
		},

		remove: function() {
			var	url = $(this).attr('href');

			$.ajax({
				method: 'DELETE',
				url: url,
				success: function(res) {
					if(res) {
						location.replace(res);
					} else {
						location.reload();
					}
				},
				statusCode: { 
					404: function(jqXHR) {
						var error = JSON.parse(jqXHR.responseText);
						var title = $('.modal .modal-title').text(error.message);
						$('.modal').modal('show');
					}
				},
				complete: function() {
					$(this).removeClass('disabled');
				}
			});	
			$(this).addClass('disabled');
			return false;
		},

		addToWishlist: function() {
			var url = $(this).attr('href');

			$.ajax({
				url: url,
				method: 'POST',
				success: function(response) {
					var title = $('.modal .modal-title').text(response);
					$('.modal').modal('show');
				},
				statusCode: {
					401: function() {
						var title = $('.modal .modal-title').text('You should be authorized');
						$('.modal').modal('show');
					},
					403: function() {
						var title = $('.modal .modal-title').text('This Item is already in Your wishlist');
						$('.modal').modal('show');
					}
				},
				complete: function() {
					$(this).removeClass('disabled');
				}
			});
			$(this).addClass('disabled');
			return false;
		},

		switchCurrency: function() {
			var url = $(this).attr('href');

			$.ajax({
				method: 'GET',
				url: url,
				success: function() {
					location.reload();
				}
			});
			return false;
		},

		addToBasket: function() {
			var url = $(this).attr('href'),
					inputValue = $(this).closest('div').find(':input').val(),
					qty,
					$this = $(this);

			qty = inputValue ? inputValue.slice(9) : 1;

			$.ajax({
				url: url,
				method: 'POST',
				data: {qty: qty},
				success: function(response) {
					var title = $('.modal .modal-title').text(response),
							items = $('.items a i');
					$('.modal').modal('show');
					items.text(+items.text() + +qty); //updating qty at the cart-menu
				},
				statusCode: {
					401: function() {
						var title = $('.modal .modal-title').text('You should be authorized');
						$('.modal').modal('show');
					}
				},
				complete: function() {
					$this.removeClass('disabled');
				}
			});
			$this.addClass('disabled');
			return false;
		}
	};

	product.init();

})(jQuery);