(function($) {
	
	function findForm(point) {
				
		if (!$(point).attr("formId")) {
			var formCategory = $(point).attr("formType");
			var formId = formCategory + $(point).attr("id");
			$("#"+formCategory)
				.clone()
				.attr("id",formId)
				.attr("type",formCategory)
				.appendTo("#dialogContainer");
			$(point).attr("formId", formId);
		}
		return $("#"+$(point).attr("formId"));
	}
	
	function processData(data) {
		console.log(data.message);
	}
	
	function initTrigger(parent) {
		 $(parent).find('#selector').cron({
			 initial: "0 0 * * *",
			 onChange: function() {
				$($(this).parent().find("input[name=schedule]")).val($(this).cron("value"));
			 }
		 });
		 $(parent).find('input[name=time]').timeEntry({spinnerImage: 'external/timeEntry/spinnerDefault.png'});
	}

	$.handleEdit = function(point) {
		
		findForm(point)
			.dialog({
			create: function( event, ui ) {
				if ($(this).attr("type")=="triggerDialog") {
					initTrigger(this);
				}		
			},
			
			dialogClass : "no-close",
			buttons : [ {
				text : "OK",
				click : function() {
					console.log("submit form" + $(this).find("form").formSerialize());
					$(this).find("form").ajaxSubmit({ 
						type: "GET",
						url: "php/submit.php",
				    });

					$(this).dialog("close");
				}
			} ],
			closeOnEscape : false,
			draggable : false,
			modal : true,
			resizable : false,
			//width: 'auto',
			//height : "auto",
			minWidth: 750,
			minHeight: 400,
			show: "fade",
		});		
	};
})(jQuery);
