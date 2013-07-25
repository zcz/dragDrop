(function($) {

	$.handleEdit = function(point) {
		
		$("#emailOpenDialog").dialog({
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
