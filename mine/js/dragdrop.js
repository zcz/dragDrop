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
		var id = $(ui.draggable).attr('id') + "0";
		$(ui.helper).clone(true).removeClass('clonable ui-draggable ui-draggable-dragging')
		.attr("id",id)
		.addClass('draggable').appendTo(parent)
		.draggable({
			containment : "parent",
			cursor : "move",
			stack : ".draggable",
		});
				
		//alert("hi");
		//jsPlumb.addEndpoint($(id), exampleEndpoint);
		//jsPlumb.addEndpoint("window0", exampleEndpoint);
		console.log("element cloned");
	}
	

	
	var exampleEndpoint = {
		endpoint : "Rectangle",
		paintStyle : {
			width : 25,
			height : 21,
			fillStyle : "red"
		},
		isSource : true,
		reattach : true,
		isTarget : true,
	};

});