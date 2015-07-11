$(function() {
	
	calcTotal();
	var price = +$('.total .pr').text();

	$('.product-description').on('select', '.select', function(e) {
		var $total = $(this).closest('.quantity').find('.total');
		var priceField = $total.find('.pr');
		var quantity = +e.value.slice(9);
		priceField.text((price*quantity).toFixed(2));
	});

	function calcTotal() {
		var total = $('.content').find('.total-order .pr');
		var subtotals = $('.content').find('.subtotal');
		var sum = 0;
		subtotals.each(function() {
			 var val = +$(this).find('.pr').text();
			 sum += val;
		})
		total.text(sum.toFixed(2));
	}

	$('.cart').on('select', '.select', function(e) {
		var $parent = $(this).closest('.quantity');
		var price = +$parent.siblings('.unit-price')
				.find('.pr').text();
		var quantity = +e.value;	
		var subtotal = $parent.siblings('.subtotal').find('.pr');
		subtotal.text((price*quantity).toFixed(2));	
		calcTotal();
	});
});