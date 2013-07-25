(function($) {

	$.handleEdit = function(point) {
		
		$("#emailDialog").dialog({
			dialogClass : "no-close",
			buttons : [ {
				text : "OK",
				click : function() {
					$(this).dialog("close");
				}
			} ],
			closeOnEscape : false,
			draggable : false,
			modal : true,
			resizable : false,
			show: "fade",
		});
		
	};
})(jQuery);
