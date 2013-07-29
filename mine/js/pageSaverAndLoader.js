(function($) {
	
	var settings;
	
	$.initSaverAndLoader = function(options) {
		settings = $.extend({
			baseUrl: './',
			flowId: -1,
			JSON: "haha json",
			flowName: "hi",
		}, options||{} );
		
		settings.uri = settings.baseUrl+"flow";
		
		$(saveFlow).click(function() {
			saveThisFlow();
		});
	};
	

	function saveThisFlow() {
		var JSON = prepareJSON();
		alert(JSON);

/*
		var options = {
			type : "POST",
			url : settings.uri,
			data : {
				'id' : settings.flowId,
				'name' : settings.flowName,
				'JSON' : JSON,
			},
			success : function(data) {
				if (settings.flowId < 0) {
					settings.flowId = data.id;
				}
			}
		};
		$.ajax(options);
*/
	};
	
	function prepareJSON() {
		var pointJson = [];
		$(".window").each(function() {
			var opt;
			if ($(this).attr("type")=="trigger") {
				opt = $("#"+$(this).attr("formId")).find('form').find(".valid").serializeArray();
			}
			if ($(this).attr("type")=="event") {
				opt = $("#"+$(this).attr("formId")).find('form').serializeArray();
			}
			var point = {
				extid : $(this).attr('extid'),
				id : $(this).attr("id"),
				nodeType : $(this).attr("type"),
				description : "nothing",
				opt:opt,
			};
			pointJson.push(point);
		});
		return JSON.stringify(pointJson);
	}
	
})(jQuery);
