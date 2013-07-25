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
						cloneItemTo(ui);
					}
				}
			});
	
	function cloneItemTo(ui) {		
		console.log("element cloned " + $(ui.draggable).attr('id') );		
		$.initPoint(ui.helper, ui.draggable);
	}
});
