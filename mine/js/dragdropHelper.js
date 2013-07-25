$(function() {
	$(".clonable").draggable(
			{
				appendTo : "body",
				cursor : "move",
				helper : 'clone',
				revert : "invalid",
				/*
				drag : function(event, ui) {
					console.log(this.id + " position:(" + ui.position.top + ","
							+ ui.position.left + ") offset:(" + ui.offset.top
							+ "," + ui.offset.left + ")");
				}*/
			});

	$(".droppable").droppable(
			{
				hoverClass : "drop-hover",
				drop : function(event, ui) {
					console.log(this.id + " got item " + $(ui.draggable).attr('id'));
					if ($(ui.draggable).hasClass("clonable")) {
						cloneItemTo(this, ui);
					}
				}
			});
	
	function cloneItemTo( parent, ui) {
		console.log($("#emailopen"));
		console.log(ui.helper);
		console.log(ui.draggable);
		var point = $(ui.helper)
					.clone(true, false)
					.removeClass('clonable ui-draggable ui-draggable-dragging')
					.appendTo(parent);
		
		console.log("element cloned " + $(ui.draggable).attr('id') );		
		$.initPoint(point, ui.draggable);
	}
});
