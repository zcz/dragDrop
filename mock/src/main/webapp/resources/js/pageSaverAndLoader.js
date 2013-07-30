(function($) {
	
	var settings;
	
	var nodeList = {
		trigger: {
			nodeType : "TRIGGER",
		},
		data: {
			nodeType : "DATA_SOURCE",
		},
		filter: {
			nodeType : "FILTER",
		},
		email: {
			nodeType : "ACTION",
			action  : "EMAIL"
		},
		sms: {
			nodeType : "ACTION",
			action  : "SMS"
		},
		emailopen: {
			nodeType : "EVENT",
			event  : "EMAIL_OPENED"
		},
		emailclick: {
			nodeType : "EVENT",
			event  : "EMAIL_CLICKED"
		},
		smsreceive: {
			nodeType : "EVENT",
			event  : "SMS_RECEIVED"
		},
	};
	
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
		
		$("#showJson").html("json: "+JSON );
		
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
	};
	
	function prepareJSON() {
		var pointJson = [];
		var edgeJson = $.getAllConnections();
		var finalJson = [];		
		
		$(".window").each(function() {
			var opt_nameValue = [];
			var opt = [];
			if ($(this).attr("category")=="trigger") {
				opt_nameValue = $("#"+$(this).attr("formId")).find('form').find(".valid").serializeArray();
			}
			if ($(this).attr("category")=="event") {
				opt_nameValue = $("#"+$(this).attr("formId")).find('form').serializeArray();
			}
			$.each( opt_nameValue, function( key, value ) {
				var theKey;
				var theValue;
				$.each(value, function( key, value ) {
					if (key == "name") theKey = value;
					if (key == "value") theValue = value;
				});
				opt[theKey] = theValue;
			});
			var defaultValue = {
				extId : $("#"+$(this).attr("formId")).attr('extid'),
				id : $(this).attr("id"),
				description : "nothing",
			};
			var point = $.extend( defaultValue, nodeList[$(this).attr("type")], opt||{} );
			pointJson.push(point);
		});
		
		finalJson = {
				nodes : pointJson,
				edges : edgeJson,
		};
		return JSON.stringify(finalJson);
	}
	
	function typeMapper() {
		
	}
	
})(jQuery);
