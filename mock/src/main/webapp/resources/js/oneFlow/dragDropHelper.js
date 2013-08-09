(function($) {
	// export function
	$.initDragDrop = initDragDrop;
	$.prepareUiNode = prepareUiNode;
	
	// register the draggable button and the accepting panel  
	function initDragDrop() {
		$(".clonable").draggable({      // the item prototype can be dragged to the panel
			appendTo : "body",
			cursor : "move",
			helper : 'clone',
			revert : "invalid",
		});

		$(".droppable").droppable({    	// the main panel hold the dropped objects
			hoverClass : "drop-hover",
			drop : function(event, ui) {
				if ($(ui.draggable).hasClass("clonable")) {
					cloneItem(ui); 
				}
			},
		});
		function fixDiv() {
			  var $cache = $('.buttom_column'); 
			  //if ($(window).scrollTop() > 100) 
			  $cache.css({'position': 'fixed', 'top': '10px'}); 
			  //else
			  //$cache.css({'position': 'relative', 'top': 'auto'});
			  //alert("hi there");
			}
		//$(window).scroll(fixDiv);
		//fixDiv();
	};
	
	function cloneItem(ui) {		
		// create node in campaign_designer, inherit the button type
		var node = campaign_designer.createNewNode( $(ui.draggable).attr('id') );
		
		prepareUiNode( node, preparePosition($(ui.helper).position()) );
		$.addJSPlumbProperty( node, true ); 		// set JsPlumb property : jsPlumbHelper.js
	};
	
	function preparePosition( position ) {
		var root = $(campaign_designer.settings.nodePositionRoot);
		var pp = root.position();
		position.top = position.top - pp.top - parseInt(root.css('margin-top'));
		position.left = position.left - pp.left - parseInt(root.css('margin-left'));
		return position;
	}
	
	// do preparation
	// 1. clone the node from prototype
	// 2. prepare jsPlumb
	// 3. initiate associated dialogs
	function prepareUiNode( node, position ) {
		
		var id = node.getId();
		var type = node.getInfo().nodeType;
		var name = node.getInfo().typeName;
		
		var div = $('<div>', {id : id})
					.addClass(campaign_designer.settings.nodeClass)
					.offset(position)
					.appendTo(campaign_designer.settings.nodePositionRoot)
					.html(	name+'<br/><br/>' + 
							'<a href="#" class="cmdLink edit" rel="'+id+'">edit</a><br/>'+
							'<a href="#" class="cmdLink remove" rel="'+id+'">remove</a>');
		node.setUiNode( div );
		return div;
	};
})(jQuery);
