(function($) {
	'use strict';

	var user = {

		init: function() {
			this.addListeners();
		},

		addListeners: function() {
			$('[data-action="cancel-account"]').on('click', this.cancelAccount);
			$('[data-action="generate-password"]').on('click', this.generatePassword);
			$('.user').on('submit', this.submitForm);
			$('.restrict').on('click', this.restrict);
		},

		submitForm: function() {
			var $this = $(this),
				url = $this.attr('action'),
				$helper = $('.helper'),
				$button = $(':submit');

		$helper.html('').removeClass('bg-danger bg-success');	

		$(this).on('keypress', 'input, textarea', function() {
				$(this).tooltip('destroy');
				$(this).closest('div').removeClass('has-error');
			});

			var $inputs = $this.find('input:not([type="checkbox"]), textarea'),
						i, 
						len = $inputs.length;
				for(i = 0; i < len; i++) { // с each некорректно проходили итерации, возвращалось true 
					var input = $inputs[i];
					if(!$.validate(input)) return false;
				}

			$.ajax({
	      url: url,
	      method: "POST",
	      data: $this.serialize(),
	      complete: function() {
	        $button.text('Submit');
	        $button.prop('disabled', false);
	      },
	      statusCode: {
	      	200: function(data) {
		        $helper.html(data).addClass('bg-success');
		        if($this.attr('id') === 'login') {
		        	window.location.href = '/';
		        }
		      },
		      404: function() {
		      	$helper.html('User Not Found').addClass('bg-danger');
		      },
		      403: function(jqXHR) {
		      	var error = JSON.parse(jqXHR.responseText);
		      	$('.helper').html(error.message).addClass('bg-danger');
		      }
	      }
	    });

	    $button.text('Please, wait');
	    $button.prop('disabled', true);
	    return false;
		},

		generatePassword: function() {
			var url = $(this).attr('href'),
				$modal = $(this).parents('.container').find('.modal'),
				$modalHeader = $('.modal-header', $modal);

			$.ajax({
				url: url,
				method: 'GET',
				success: function(response){
					var $password = $('<div class="modal-body"><p>' + response + '</p><p>Please, save this password!</p></div>');
					$password.insertAfter($modalHeader);
					$modalHeader.html('<h4>Your Password</h4>');
					$modal.modal('show');
					$modal.on('hide.bs.modal', function() {
						$('.modal-body').remove();
						$modal.off('hide.bs.modal');
					});
				}
			});	
			return false
		},

		cancelAccount: function() {
			var url = $(this).attr('href');
		
			$.ajax({
				url: url,
				method: 'GET',
				statusCode: {
					401: function() {
						var title = $('.modal .modal-title').text('You should be authorized');
						$('.modal').modal('show');
					}
				},
				success: function(response) {
					$(response).appendTo('.content').modal('show');
				}
			});
			return false;
		},

		restrict: function() {
			var url = $(this).attr('href');

			$.ajax({
				url: url,
				method: 'GET',
				statusCode: {
					401: function() {
						var title = $('.modal .modal-title').text('You should be authorized');
						$('.modal').modal('show');
					}
				},
				success: function() {
					window.location.href = url;
				}
			});
			return false;
		}
	};

	user.init();
})(jQuery);