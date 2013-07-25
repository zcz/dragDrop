(function($) {
	
	var _initiated = false;
	
	function initJsPlumb() {
		// chrome fix.
		document.onselectstart = function () { return false; };				

	    // render mode
		var resetRenderMode = function(desiredMode) {
			var newMode = jsPlumb.setRenderMode(desiredMode);
			$(".rmode").removeClass("selected");
			$(".rmode[mode='" + newMode + "']").addClass("selected");		

			$(".rmode[mode='canvas']").attr("disabled", !jsPlumb.isCanvasAvailable());
			$(".rmode[mode='svg']").attr("disabled", !jsPlumb.isSVGAvailable());
			$(".rmode[mode='vml']").attr("disabled", !jsPlumb.isVMLAvailable());
						
			initJsPlumbConnector();
		};
	     
		$(".rmode").bind("click", function() {
			var desiredMode = $(this).attr("mode");
			if (jsPlumbDemo.reset) jsPlumbDemo.reset();
			jsPlumb.reset();
			resetRenderMode(desiredMode);					
		});	

		resetRenderMode(jsPlumb.SVG);
	}
	
	function initJsPlumbConnector() {

		// setup jsPlumb defaults.
		jsPlumb.importDefaults({
			DragOptions : {
				cursor : 'pointer',
				zIndex : 2000
			},
			PaintStyle : {
				strokeStyle : '#666'
			},
			EndpointStyle : {
				width : 20,
				height : 16,
				strokeStyle : '#666'
			},
			Endpoint : "Rectangle",
			Anchors : [ "TopCenter", "TopCenter" ]
		});

		// bind to connection/connectionDetached events, and update the list
		// of connections on screen.
		jsPlumb.bind("connection", function(info, originalEvent) {
			updateConnections(info.connection);
		});
		jsPlumb.bind("connectionDetached", function(info, originalEvent) {
			updateConnections(info.connection, true);
		});
	}
	
	var showConnectionInfo = function(s) {
		$("#list").html(s);
		$("#list").fadeIn({
			complete : function() {
				jsPlumb.repaintEverything();
			}
		});
	};
	var hideConnectionInfo = function() {
		$("#list").fadeOut({
			complete : function() {
				jsPlumb.repaintEverything();
			}
		});
	};
	var connections = [];
	var updateConnections = function(conn, remove) {
		if (!remove)
			connections.push(conn);
		else {
			var idx = -1;
			for ( var i = 0; i < connections.length; i++) {
				if (connections[i] == conn) {
					idx = i;
					break;
				}
			}
			/* remove items */
			if (idx != -1) connections.splice(idx, 1);
		};
		if (connections.length > 0) {
			var s = "<span><strong>Connections</strong></span><br/><br/><table><tr><th>Source</th><th>Target</th></tr>";
			for ( var j = 0; j < connections.length; j++) {
				s = s + "<tr><td>"
						+ connections[j].sourceId + "</td><td>"
						+ connections[j].targetId + "</td></tr>";
			}
			showConnectionInfo(s);
		} else
			hideConnectionInfo();
	};

	// configure some drop options for use by all endpoints.
	var exampleDropOptions = {
		tolerance : "touch",
		hoverClass : "dropHover",
		activeClass : "dragActive"
	};
	
	/*
	 * receive data
	 */
	var exampleColor = "#00f";
	var dataIn_Endpoint = {
		isSource : false,
		isTarget : true,
		anchor : "TopCenter",
		endpoint : [ "Dot", {
			radius : 11
		} ],
		paintStyle : {
			fillStyle : exampleColor,
		},
		//connector or the line connect two points
		connectorStyle : {
			strokeStyle : exampleColor,
			lineWidth : 3
		},
		maxConnections : -1,
		dropOptions : exampleDropOptions
	};

	/*
	 * for default out or "yes" or "true"
	 */
	var color2 = "#316b31";
	var dataOut_True_Endpoint = {
		isSource : true,
		isTarget : false,
		endpoint : [ "Dot", {
			radius : 11
		} ],
		anchor : "BottomCenter",
		paintStyle : {
			fillStyle : color2
		},
		//connector or the line connect two points
		connectorStyle : {
			strokeStyle : exampleColor,
			lineWidth : 3
		},
		maxConnections : -1,
		dropOptions : exampleDropOptions
	};

	/*
	 * for data out error, false or "no"
	 */
	var color3 = "#D00000";
	var dataOut_False_Endpoint = {
		isSource : true,
		isTarget : false,
		endpoint : [ "Dot", {
			radius : 11
		} ],
		anchor : "Right",
		paintStyle : {
			fillStyle : color3
		},
		//connector or the line connect two points
		connectorStyle : {
			strokeStyle : exampleColor,
			lineWidth : 3
		},
		maxConnections : -1,
		dropOptions : exampleDropOptions
	};

	var idCounter = 0;
	
	$.initPoint = function(point, parent) {
		if (_initiated==false) {
			initJsPlumb();
			_initiated = true;
		}	
		
		var thisId = $(parent).attr("id")+"_"+idCounter++;
		var thisType = $(parent).attr("id");
		var type = $(parent).attr("type");
		var formId = $(parent).attr("formId");
				
		var Div = $('<div>', {id : thisId})
					.attr("type", thisType)
					.attr("formId", formId)
					.addClass('window')
					.offset($(point).position())
					.appendTo($(point).parent())
					.html(thisId+'<br/><br/><a href="#" class="cmdLink edit" rel="'
						  +thisId+'">edit</a><br/><a href="#" class="cmdLink remove" rel="'
						  +thisId+'">remove</a>');
					
		//build connectors
		if (type!="trigger") jsPlumb.addEndpoint($(Div), dataIn_Endpoint);
		if (type=="event" || type=="filter") jsPlumb.addEndpoint($(Div), dataOut_False_Endpoint);
		jsPlumb.addEndpoint($(Div), dataOut_True_Endpoint);
		
		// make .window divs draggable
		jsPlumb.draggable($(Div), {
			containment : "parent",
			cursor : "move",
			stack : ".draggable",
		});
		
//		jsPlumb.repaintEverything();

		$(Div).find(".remove").click(function() {
			jsPlumb.detachAllConnections($(this).attr("rel"));
			jsPlumb.removeAllEndpoints($(this).attr("rel"));
			$(this).parent().remove();
		});
		
		$(Div).find(".edit").click( function() {
			$.handleEdit( $(this).parent() );
		}).click();
	};	
}) (jQuery);
