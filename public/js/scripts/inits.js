$(function() {
	// sort tables
		$('.cart').tablesorter({headers: {0:{sorter: false}, 5: {sorter: false}}});
		$('.history').tablesorter({headers: {5: {sorter: false}}});
		$('#reviews table, .edit').tablesorter({headers: {4: {sorter: false}}});
	
	 // tooltip for discount number
		$('[data-toggle="tooltip"]').tooltip({title: 'Click to check your discount'});
	
	// modals success
		$('.modal').modal({show:false});
			
	//hover lightbox thumbnails
		var $hover;
		$('.photo-mini .thumbnail').hover(function(){
			$hover = $('<div>').addClass('thumbnail-hover');
			$(this).append($hover);
		}, function(){
			$hover.remove();
		});
	
	//implements lightbox
		$('.photo-mini').on('click', '[data-toggle="lightbox"]', function(e) {
			e.preventDefault();
			$(this).ekkoLightbox();
		});

	//forbid key press
	$('.disabled').keydown(false);	
});

$(function() {
	//delete images
	var $target = $('.photo-list li');

	$target.hover(function(){
		$(this).find('.hover').slideDown('fast');;
	}, function(){
		$(this).find('.hover').slideUp('fast');
	});		 
});

$(function() {
// show new fields for adding data sheets
	$('.new-field').on('click', function() {
		var $this = $(this),
				$parent = $this.closest('.form-group'),
				$fields = $parent.find('.fields').eq(0).clone(),
				$disabled = $fields.find(':disabled');

		$fields.find('input, textarea').val('');
		if($disabled.length) $disabled.removeAttr('disabled');


		$fields.insertBefore($this);
	})	
});