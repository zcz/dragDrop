(function($) {
	
	// export function
	$.disableFormEnterKey = disableFormEnterKey;
	$.handleEditWithDialog = handleEditWithDialog;
	$.loadPageInfoDialog = loadPageInfoDialog;
	
	function disableFormEnterKey() {
		$('form').submit(function() { 		// for all the form, disable enter key action
			return false;
		});
	};

	function findForm(node) {
		if (node.getUiForm() === null) {
			var formCategory = node.getInfo().formType;
			var formId = formCategory + node.getId();
			// clone from the form prototype and append to the container
			var uiForm = $("#" + formCategory).clone().attr("id", formId).appendTo("#dialogContainer");
			disableFormEnterKey();
			node.setUiForm(uiForm);
		}
		return node.getUiForm();
	}
	
	function handleEditWithDialog( node ) {
		findForm(node).dialog({
			// defined in node constructor, perform different depends on the node type : campaign_designer.js
			create : node.onCreateForm,			
			open : node.onLoadForm,
			buttons : [ {
				text : "SAVE",
				click : function() {
					node.onSubmitForm();
					$(this).dialog("close");
				}
			} ],
			closeOnEscape : false,
			draggable : false,
			modal : true,
			resizable : false,
			minWidth : 750,
			minHeight : 400,
			show : "fade",
		});
	};
	
	function loadPageInfoDialog() {
		$("#flowDialog").dialog({
			create : function(event, ui) {
				$(this).find("input[name='flowname']").val(campaign_designer.flow.flowName);
			},
			buttons : [ {
				text : "OK",
				click : function() {
					campaign_designer.flow.flowName = $(this).find("input[name='flowname']").val();
					$(this).dialog("close");
				}
			} ],
			closeOnEscape : false,
			draggable : false,
			modal : true,
			resizable : false,
			width: 'auto',
			height : "auto",
			show : "fade",
		});
	};
})(jQuery);
