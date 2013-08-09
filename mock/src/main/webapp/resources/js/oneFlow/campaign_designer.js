var campaign_designer = {
	
		settings : {
//			nodePositionRoot : "body",
			nodePositionRoot : "#main",
			nodeContainerId : "main",
			nodeClass : "window",
			baseFormUrl : "../",
			graphFlowUrl : "../flow",
		},
		
		// the nodes container, in the form of (key : node) pair
		nodes : {},

		// contains the data about flow
		flow : {
			flowId: -1,
			flowName: "new flow",
		},
		
		// node class constructor
		Node : function( id, info ) {
			var that = {};
			that.id = id,
			that.info = info;
			that.ui_node = null;
			that.ui_form = null;
			that.data = { extId : -1, };
			
			that.getId = function() {
				return that.id;
			};
			that.getInfo = function() {
				return that.info;
			};
			that.setExtId = function( extId ) {
				that.data.extId = extId;
			};
			that.getExtId = function() {
				return that.data.extId;
			};
			that.setUiNode = function( div ) {
				that.ui_node = div;
			};
			that.getUiNode = function() {
				return that.ui_node;
			};
			that.setUiForm = function( form ) {
				that.ui_form = form;
			};
			that.getUiForm = function() {
				return that.ui_form;
			};
			
			// build the uri for data storage and retrieval
			that.getFormUri = function() {
				return campaign_designer.settings.baseFormUrl + that.info.uri;
			};
			
			// use JQuery to find elements in the node form, used in dialogHelper.js
			that.findInForm = function( string ) {
				if (typeof string !== "string") {
					return null;
				} else {
					return $(that.getUiForm()).find(string);
				};
			};
			
			// remove node element from campaign_designer
			that.remove = function() {
				delete campaign_designer.nodes[that.id];
			};
			
			// functions called by dialogHelper, in response to form(dialog) events
			// 1. createForm
			// 2. submitForm
			// 3. loadForm
			// two different kinds of response depends on node data storage
			// 1. data stored in some remote database and managed by some agent, accessed through extId
			// 2. data stored in the web form (also in node.data)
			that.onCreateForm = function () {
				that.loadAndRun("onCreateForm");
			};
			that.onSubmitForm = function() {
				if (that.info.loadMethod === "ajax") {
					var options = {
						type : "POST",
						url : that.getFormUri(),
						data : { 'extid' : that.getExtId() },
						success : function(data) {
							if (that.getExtId() < 0) {
								that.setExtId( data.extid );
							}
							that.findInForm('form').trigger("reset");
						},
					};
					that.findInForm('form').ajaxSubmit(options);
				};
				if (that.info.loadMethod === "form") {
					that.loadAndRun("onSubmitForm");
				};
			};
			that.onLoadForm = function( data ) {
				if (that.info.loadMethod === "ajax") {
					if (that.getExtId() >= 0){
						$.get(	that.getFormUri(), 
								{ 'extid' : that.getExtId() }, 
								function( data ) {
									that.loadAndRun( "onLoadForm", data );
								});						
					}
				};
				if (that.info.loadMethod === "form") {
					that.loadAndRun("onLoadForm");
				};
			};
			// action safe loader to run the function for each type of node
			that.loadAndRun = function( name, data ) {
				var action = that.getInfo()[name];
				if (action != undefined) {
					return action( that, data );
				}
			};
			
			// to prepare JSON string with node data 
			that.prepareJson = function() {
				var json = {
					id : that.id,
					type : that.getInfo().typeName,
					position : $(that.getUiNode()).position(),
					data : that.data,
					
					// things not essential for graph reconstruction, omit at this stage
					//description : "nothing",
					//nodeType : that.getInfo().nodeType,
					//action : that.getInfo().action,
					//event : that.getInfo().event,
				};
				return json;
			};
			
			return that;
		},
		
		// utility functions hard to be included in other realms
		util : {
			//generate version-4 UUID
			getUUID : function() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { 
					var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); 
				});
			},
			
			// turn the json generated from form into more compact json
			// from: { {"name":"text", "value":"123"} }
			// to : { "text":"123" }
			compressFormJson : function( json ) {
				var opt = {};
				$.each( json, function( key, value ) {
					var theKey = null;
					var theValue = null;
					$.each(value, function( key, value ) {
						if (key == "name") theKey = value;
						if (key == "value") theValue = value;
					});
					opt[theKey] = theValue;
				});	
				return opt;
			},
			
			// encode the date time format for the quartz scheduler
			// from	: "07/31/2013 15:17"	"mm/dd/yy HH:mm"
			// to	: "20130731151700"		"yymmddHHmmss"
			encodeTimeDateForScheduler : function( uiDateTime ) {
				var valid = /^(\d{2}\/){2}\d{4} \d{2}:\d{2}$/;
				if (valid.test(uiDateTime)) {
					var dateTime = $.datepicker.parseDateTime("mm/dd/yy", "HH:mm", uiDateTime, {}, {});
					var timeS = $.datepicker.formatTime( "HHmmss", {hour:dateTime.getHours(), minute:dateTime.getMinutes(), second:dateTime.getSeconds()} );
					var dateS = $.datepicker.formatDate( "yymmdd", dateTime );
					var s = dateS + timeS;
					return s;					
				} else {
					throw "encodeTimeDateForScheduler data form error: uiDateTime=" + uiDateTime;
				}
			},

			// decode the date time format for the quartz scheduler
			// from	: "20130731151700"		"yymmddHHmmss"
			// to	: "07/31/2013 15:17"	"mm/dd/yy HH:mm"
			decodeTimeDateForScheduler : function( rawDateTime ) {
				var valid = /^\d{14}$/;
				if (valid.test(rawDateTime)) {
					var date = $.datepicker.parseDate("yymmdd", rawDateTime.substr(0,8));
					var time = $.datepicker.parseTime("HHmmss", rawDateTime.substr(8));
					var timeS = $.datepicker.formatTime( "HH:mm", time );
					var dateS = $.datepicker.formatDate( "mm/dd/yy", date );
					var s = dateS + " " + timeS;
					return s;					
				} else {
					throw "decodeTimeDateForScheduler data form error: rawDateTime=" + rawDateTime;
				}
			},
			
			// convert the cron string used between two systems, unix and quartz
			// diff:	1. day-of-month and day-of-week should be exactly one question mark 
			// 			2. there is one more field second in quartz cron but not in unix cron.
			// 			3. for the day of week, unix starts with 0, quartz starts with 1
			// 
			// unix		:	"2 * * * 0" 	(trigger every hour at 2nd minute) 
			// quartz	:	"0 2 * ? * 1"	(trigger every hour at 2nd minute)
			convertUnixCronToQuartzCron : function ( unixCron ) {
				var valid_cron = /^((\d{1,2}|\*)\s){4}(\d{1}|\*)$/;
				if (!valid_cron.test(unixCron)) {
					$.error("unix cron: invalid initial value");
			        return undefined;
				}
				var n = unixCron.split(" ");
				// convert * to ? 
				if (n[4]=="*") n[4]="?";
				else if (n[2]=="*") n[2]="?";
				//convert the day of week
				if (/^\d$/.test(n[4])) n[4]++;
				// add the ending "0", stands for second, and return
				return ("0 " + n.join(" "));
			},

			// reverse function convertUnixCronToQuartzCron
			convertQuartzCronToUnixCron : function( quartzCron ) {
				var valid_cron = /^((\d{1,2}|\*)\s){3}((\d{1,2}|\*|\?)\s)((\d{1,2}|\*)\s)(\d{1,2}|\*|\?)$/;
				if (!valid_cron.test(quartzCron)) {
					$.error("quartz cron: invalid initial value");
			        return undefined;
				}
				// convert ? to *
				var n = quartzCron.replace(/\?/, '*').split(" ");
				// convert day of week
				if (/^\d$/.test(n[5])) n[5]--;
				//remove the first element
				n.shift();
				return(n.join(" "));
			},
		},
		
		tests :  {	// just for fun
			testEncodeDecodeTimeDate : function () {
				var u = campaign_designer.util;
				var ui = "07/31/2013 15:17";
				var raw = u.encodeTimeDateForScheduler( ui );
				var ui_again = u.decodeTimeDateForScheduler( raw );
				console.log("ui ", ui);
				console.log("raw ", raw);
				console.log("ui_again ", ui_again);	
			},
			testConvertQuartzCronToUnixCron : function() {
				var u = campaign_designer.util;
				console.log(u.convertUnixCronToQuartzCron("2 * * * 0"));
				console.log(u.convertQuartzCronToUnixCron("0 2 * ? * 1"));
			},
		},
	
		// create new node object, add them into nodes variable
		// input : the type of the node, used to find object from nodeInfo list
		createNewNode : function( type, id ) {
			// two cases about id : 
			//   1. create from user interface, create new id
			//   2. create from existing element, use existing id
			if (id === undefined) {
				id = this.util.getUUID();
			}
			if (this.nodeInfo[type] !== undefined) {
				var node = new this.Node(id, this.nodeInfo[type]);
				this.nodes[id] = node;	// add to nodes list
				return node;
			} else {
				throw "node type " + type + " not find";
			}
		},
		
		createNodeFromJson : function ( nodeJson ) {
			var node = campaign_designer.createNewNode(nodeJson.type, nodeJson.id);
			node.data = nodeJson.data;
			return node;
		},
		
		validateConnection : function( fromId, toId ) {
			var from = campaign_designer.nodes[fromId];
			var to = campaign_designer.nodes[toId];
			if (from === undefined || to === undefined) {
				return false;
			}
			var fromType = from.getInfo().typeName;
			var toType = to.getInfo().typeName;
			if (campaign_designer.nodeInfo.connectionFollowRules[fromType][toType] === false) {
				alert( fromType + " cannot connect to " + toType );
				return false;
			} else {
				return true;
			}
		},
};

campaign_designer._sharedFunctions = {
		onSubmitForm_Type_Event : function( node ) {
			var json = node.findInForm('form').serializeArray();
			var opt = campaign_designer.util.compressFormJson(json);
			$.extend( node.data, opt );	// add the optional data into node's data
		},
		onLoadForm_Type_Event : function ( node ) {
			if (node.data.occurrence === undefined) {
				node.data.occurrence = "1";
			}
			node.findInForm('select[name=occurrence]').val(node.data.occurrence);
		},
};

campaign_designer.nodeInfo = {
		// constants help nodes with specific functions, may contain: 
		// 0. typeName : exactly equals to the object name;
		// 1. loadMethod : can be "form" or "ajax", depends on node data storage
		// 		A. data stored in some remote database and managed by some agent, accessed through extId
		// 		B. data stored in the web form (also in node.data)
		// 2. formType : the id used to find the form dialog for UI
		// 3. uri : combined with baseFormUrl in function that.getFormUri, used to get form submission url
		// 4. nodeType, action, event : can be removed if not used other code in the server side
		// 5. onCreateForm, onSubmitForm, onLoadForm : functions control form behavior in different stages 
		trigger : {
			typeName : "trigger",
			loadMethod : "form",
			formType : "triggerDialog",
			nodeType : "TRIGGER",
			uri : "trigger",
			onCreateForm : function (node) {
				// init cron scheduler
				node.findInForm('#cronscheduler').cron({ onChange : function() {
					node.findInForm("input[name=cronScheduler]").val($(this).cron("value")); }});
				
				// init timepicker
				node.findInForm('input[name=simpleScheduler]').datetimepicker();
				
				// init the radio selection
				//node.findInForm("#simplescheduler").hide();
				node.findInForm("input[name='schedulerType']").change(function() {
					radioValue = $(this).val();
					if (radioValue === "CRON") {
						node.findInForm('#cronscheduler').show();
						node.findInForm('#simplescheduler').hide();
					};
					if (radioValue === "SIMPLE") {
						node.findInForm('#cronscheduler').hide();
						node.findInForm('#simplescheduler').show();
					}
				}).change();
			},
			onSubmitForm : function( node ) {
				var u = campaign_designer.util;
				var json = node.findInForm('form').find(".valid").serializeArray();
				var opt = campaign_designer.util.compressFormJson(json);
	
				// convert the dateTime type and cron schedule type if there is any
				if (opt.cronScheduler !== undefined) {
					opt.cronScheduler = u.convertUnixCronToQuartzCron(opt.cronScheduler);
				}
				if (opt.simpleScheduler !== undefined) {
					opt.simpleScheduler = u.encodeTimeDateForScheduler(opt.simpleScheduler);
				}
				$.extend( node.data, opt );
			},
			onLoadForm : function( node ) {
				var u = campaign_designer.util;
							
				var cronScheduler = null;
				if (node.data.cronScheduler !== undefined) {
					cronScheduler = u.convertQuartzCronToUnixCron(node.data.cronScheduler);				
				} else {
					cronScheduler = "0 0 * * *";
				}
				node.findInForm('#cronscheduler').cron("value", cronScheduler);
				
				var simpleScheduler = null;
				if (node.data.simpleScheduler !== undefined ) {
					simpleScheduler = u.decodeTimeDateForScheduler(node.data.simpleScheduler);				
				} else {
					simpleScheduler = $.format.date(new Date(), "MM/dd/yyyy HH:mm");
				}
				node.findInForm('input[name=simpleScheduler]').val( simpleScheduler );
				
				// set the radio, select between cronScheduler and simpleScheduler (default)
				if (node.data.schedulerType === undefined) {
					node.data.schedulerType = "SIMPLE";
				}
				node.findInForm("input[name='schedulerType'][value="+node.data.schedulerType+"]").click();
			},
		},
		dataSource : {
			typeName : "dataSource",
			loadMethod : "ajax",
			formType : "dataDialog", 
			nodeType : "DATA_SOURCE",
			uri : "contact",
			onCreateForm : function ( node ) {
				node.findInForm('#addContact').click( node.onSubmitForm );
				node.findInForm("form").bind("reset", node.onLoadForm );
			},
			onLoadForm : function( node, data ) {			
				if (!$.isEmptyObject(data)) {
					var a = "";
					var list = data.contactList;
					for ( var i = 0; i < list.length; ++i) {
						var s = "<tr class='dataDisplay' > " + "<td>"
								+ list[i].name + "</td> " + "<td>" + list[i].email
								+ "</td> " + "<td>" + list[i].mobile + "</td> "
								+ "</tr>";
						a = a + s;
					}
					node.findInForm(".dataDisplay").remove();
					node.findInForm(".forDataDisplay").after(a);
				}
			},
		},
		filter : {
			typeName : "filter",
			loadMethod : "ajax",
			formType : "filterDialog",
			nodeType : "FILTER",
			uri : "filter",
			onLoadForm : function(node, data) {
				if (!$.isEmptyObject(data)) {
					node.findInForm("select").val(data.attribute);
					node.findInForm("input").val(data.regex);
				}
			},
		},
		email : {
			typeName : "email",
			loadMethod : "ajax",
			formType : "emailDialog",
			nodeType : "ACTION",
			action : "EMAIL",
			uri : "action/email",
			onLoadForm : function(node, data) {
				if (!$.isEmptyObject(data)) {
					node.findInForm("input[name='content']").val(data.content);
				}
			},
		},
		sms : {
			typeName : "sms",
			loadMethod : "ajax",
			formType : "smsDialog",
			nodeType : "ACTION",
			action : "SMS",
			uri : "action/sms",
			onLoadForm : function(node, data) {
				if (!$.isEmptyObject(data)) {
					node.findInForm("input[name='content']").val(data.content);
				}
			},
		},
		wait : {
			typeName : "wait",
			loadMethod : "form",
			formType : "waitDialog",
			nodeType : "ACTION",
			action : "SMS",
			uri : "action/wait",
			onCreateForm : function (node) {
				if (node.data.hour === undefined) node.data.hour = 1;
				if (node.data.day === undefined) node.data.day = 0;
				node.findInForm("input").numeric();
			},
			onSubmitForm : function( node ) {
				var json = node.findInForm('form').serializeArray();
				var opt = campaign_designer.util.compressFormJson(json);
				$.extend( node.data, opt );	// add the optional data into node's data
			},
			onLoadForm : function( node ) {
				node.findInForm('INPUT[name=hour]').val(node.data.hour);
				node.findInForm('INPUT[name=day]').val(node.data.day);
			},
		},
		emailopen : {
			typeName : "emailopen",
			loadMethod : "form",
			formType : "emailOpenDialog",
			nodeType : "EVENT",
			event : "EMAIL_OPENED",
			onSubmitForm : campaign_designer._sharedFunctions.onSubmitForm_Type_Event,
			onLoadForm : campaign_designer._sharedFunctions.onLoadForm_Type_Event,
		},
		emailclick : {
			typeName : "emailclick",
			loadMethod : "form",
			formType : "emailClickDialog",
			nodeType : "EVENT",
			event : "EMAIL_CLICKED",
			onSubmitForm : campaign_designer._sharedFunctions.onSubmitForm_Type_Event,
			onLoadForm : campaign_designer._sharedFunctions.onLoadForm_Type_Event,
		},
		smsreceive : {
			typeName : "smsreceive",
			loadMethod : "form",
			formType : "smsReceiveDialog",
			nodeType : "EVENT",
			event : "SMS_RECEIVED",
			onSubmitForm : campaign_designer._sharedFunctions.onSubmitForm_Type_Event,
			onLoadForm : campaign_designer._sharedFunctions.onLoadForm_Type_Event,
		},
		connectionFollowRules : {
			all : {
				trigger 	: true,
				dataSource	: true,
				filter 		: true,
				email		: true,
				sms 		: true,
				wait		: true,
				emailopen 	: true,
				emailclick	: true,
				smsreceive 	: true,				
			},
			trigger : {
				trigger 	: false,
				dataSource	: true,
				filter 		: false,
				email		: false,
				sms 		: false,
				wait		: false,
				emailopen 	: false,
				emailclick	: false,
				smsreceive 	: false,	
			},
			dataSource : {
				trigger 	: false,
				dataSource	: false,
				filter 		: true,
				email		: true,
				sms 		: true,
				wait		: true,
				emailopen 	: false,
				emailclick	: false,
				smsreceive 	: false,	
			},
			filter : {
				trigger 	: false,
				dataSource	: false,
				filter 		: true,
				email		: true,
				sms 		: true,
				wait		: true,
				emailopen 	: false,
				emailclick	: false,
				smsreceive 	: false,	
			},
			email : {
				trigger 	: false,
				dataSource	: false,
				filter 		: true,
				email		: true,
				sms 		: true,
				wait		: true,
				emailopen 	: true,
				emailclick	: true,
				smsreceive 	: false,	
			},
			sms : {
				trigger 	: false,
				dataSource	: false,
				filter 		: true,
				email		: true,
				sms 		: true,
				wait		: true,
				emailopen 	: false,
				emailclick	: false,
				smsreceive 	: true,	
			},
			wait : {
				trigger 	: false,
				dataSource	: false,
				filter 		: true,
				email		: true,
				sms 		: true,
				wait		: true,
				emailopen 	: false,
				emailclick	: false,
				smsreceive 	: false,	
			},
			emailopen : {
				trigger 	: false,
				dataSource	: false,
				filter 		: true,
				email		: true,
				sms 		: true,
				wait		: true,
				emailopen 	: false,
				emailclick	: false,
				smsreceive 	: false,	
			},
			emailclick : {
				trigger 	: false,
				dataSource	: false,
				filter 		: true,
				email		: true,
				sms 		: true,
				wait		: true,
				emailopen 	: false,
				emailclick	: false,
				smsreceive 	: false,	
			},
			smsreceive : {
				trigger 	: false,
				dataSource	: false,
				filter 		: true,
				email		: true,
				sms 		: true,
				wait		: true,
				emailopen 	: false,
				emailclick	: false,
				smsreceive 	: false,	
			},
		},
};

