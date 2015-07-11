$(function() {
	return $('.select').each(function() {
		var $trigger = $('span', this),
				$this = $(this);
		$(this).on('click', 'a', function() {
			var value = $(this).text(),
					$input = $('input', $trigger);
			$input.val(value);
			$this.removeClass('open');
			$this.trigger({
				type: 'select',
				value: value
			});
			return false;
		});
		$(this).on('keyup', 'input', function(e) {
			if(e.which === 13) {
				$this.removeClass('open');
				$(this).blur();
				$this.trigger({
					type: 'select',
					value: $(this).val()
				});
			}
		});
		$(this).on('change', 'input', function() {
			$this.trigger({
				type: 'select',
				value: $(this).val()
			});
		})
	});
});