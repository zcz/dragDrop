(function($) {
	
	var settings;
	
	$.initDialogHelper = function(options) {
		settings = $.extend({
			baseUrl: './'
		}, options||{} );
	};
	
	function findForm(point) {
				
		if (!$(point).attr("formId")) {
			var formCategory = $(point).attr("formType");
			var formId = formCategory + $(point).attr("id");
			var uri = settings.baseUrl+$(point).attr("uri");
			$("#"+formCategory)
				.clone()
				.attr("id",formId)
				.attr("extid", -1)
				.attr("type",formCategory)
				.attr("uri", uri)
				.appendTo("#dialogContainer");
			$(point).attr("formId", formId);
		}
		return $("#"+$(point).attr("formId"));
	}
		
	function initTrigger(parent) {
		 $(parent).find('#cronscheduler').cron({
			 initial: "0 0 * * *",
			 onChange: function() {
				$($(this).parent().find("input[name=cronScheduler]")).val($(this).cron("value"));
			 }
		 });
		 $(parent).find('input[name=simpleScheduler]').datetimepicker();
		 $(parent).find("#simplescheduler").hide();
		 $(parent).find("input[name='schedulerType']").change(function() {
			radioValue = $(this).val();
			if ($(this).is(":checked") && radioValue == "CRON") {
				$(this).parent().find('#cronscheduler').show();
				$(this).parent().find('#simplescheduler').hide();
			} else {
				$(this).parent().find('#cronscheduler').hide();
				$(this).parent().find('#simplescheduler').show();
			} 
		 });
	}
	
	function initDataSource(parent) {
		$(parent).find('#addContact').attr("formid", $(parent).attr("id"));
		$(parent).find('#addContact').click( function() {
			var parent = $("#"+$(this).attr("formid"));
			
			var options = {
				type: "POST",
				url: $(parent).attr('uri'),
				data: { 'extid': $(parent).attr("extid") },
				success : function (data) {
					console.log(data);
					console.log("parent extid is:"+$(parent).attr('extid') + " but server extid: " + data.extid);
					if ($(parent).attr('extid') < 0) {
						$(parent).attr('extid', data.extid);
					}
					loadDataSourceList(parent);
					$(parent).find('form').clearForm();
				}					
			};			
			$(parent).find('form').ajaxSubmit( options );			
		});

	}
	
	function loadDataSourceList(parent) {	
		$(parent).find(".forDataDisplay").hide();
		$.get( 
			$(parent).attr('uri'), 
			{ 'extid' : $(parent).attr("extid") },
			function( data ) {
				if (!$.isEmptyObject(data)){
					var a = "";
					var list = data.contactList;
					for (var i =0; i<list.length;++i) {
						var s = "<tr class='dataDisplay' > " +
								"<td>" + list[i].name + "</td> " +
								"<td>" + list[i].email + "</td> " +
								"<td>" + list[i].mobile + "</td> " +
								"</tr>";
						a = a + s;
					}
					$(parent).find(".dataDisplay").remove();
					$(parent).find(".forDataDisplay").after(a);					
				}
			});
	}
	
	function loadFilter( parent ) {
		$.get( 
			$(parent).attr('uri'), 
			{ 'extid' : $(parent).attr("extid") },
			function( data ) {
				if (!$.isEmptyObject(data)){
					$(parent).find("select").val(data.attribute);
					$(parent).find("input").val(data.regex);
				}
			});
	}
	
	function loadAction( parent ) {
		$.get( 
			$(parent).attr('uri'), 
			{ 'extid' : $(parent).attr("extid") },
			function( data ) {
				console.log("load action", data);
				if (!$.isEmptyObject(data)){
					$(parent).find("input[name='content']").val(data.content);
				}
			});
	}
	
	function saveIt( parent ) {
		var options = {
			type: "POST",
			url: $(parent).attr('uri'),
			data: { 'extid': $(parent).attr("extid") },
			success: function(data) {
				if ($(parent).attr('extid') < 0) {
					$(parent).attr('extid', data.extid);
				}
				$(parent).find('form').clearForm();
			}
		};	
		$(parent).find("form").ajaxSubmit(options);
	}
		
	$.handleEdit = function(point) {
				
		findForm(point)
			.dialog({
			create: function( event, ui ) {
				if ($(this).attr("type")=="triggerDialog") {
					initTrigger(this);
				}
				if ($(this).attr("type")=="dataDialog") {
					initDataSource(this);
				}
			},
			open: function( event, ui ) {
				if ($(this).attr("type")=="dataDialog") {
					loadDataSourceList(this);
				}
				if ($(this).attr("type")=="filterDialog") {
					loadFilter(this);
				}
				if ($(this).attr("type")=="emailDialog" || $(this).attr("type")=="smsDialog"){
					loadAction(this);
				}
			},
			dialogClass : "no-close",
			buttons : [ {
				text : "OK",
				click : function() {
					/*
					 * shared between filter, action
					 */
					if ($(this).attr("type")=="filterDialog" || 
						$(this).attr("type")=="emailDialog" || 
						$(this).attr("type")=="smsDialog") {
						saveIt(this);
					}
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

		/*
		 * disable enter key
		 */
		findForm(point).find('form').submit(function() {
			  return false;
		});
	};
})(jQuery);
