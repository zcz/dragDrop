(function($) {
	
	// export function
	$.initJsPlumb = initJsPlumb;
	$.addJSPlumbProperty = addJSPlumbProperty;
	$.getAllConnections = getAllConnections;
	$.jsPlumpConnect = jsPlumpConnect;
	
	var connections = [];
	var basicEndPointOptions = {
		endpoint : [ "Dot", { radius : 11 }],
		connectorStyle : {				//connector or the line connect two points
			strokeStyle : "#00f",
			lineWidth : 3 ,
		},
		maxConnections : -1,
		dropOptions : {
			tolerance : "touch",
			hoverClass : "dropHover",
			activeClass : "dragActive" ,
		} ,
	};
	var dataIn_Endpoint = {				//data receiver end point
		isSource : false,
		isTarget : true,
		anchor : "TopCenter",
		paintStyle : { 
			fillStyle : "#00f",
		},
		parameters : {
			connectorDecision : null,
		}
	};
	var dataOut_True_Endpoint = {		//for default out or "yes" or "true"
		isSource : true,
		isTarget : false,
		anchor : "BottomCenter",
		paintStyle : {
			fillStyle : "#316b31"
		},
		parameters : {
			connectorDecision : true,
		}
	};
	var dataOut_False_Endpoint = {		//for data out error, false or "no"
		isSource : true,
		isTarget : false,
		anchor : "Right",
		paintStyle : {
			fillStyle : "#D00000",
		},
		parameters : {
			connectorDecision : false,
		}
	};
	$.extend(dataIn_Endpoint, basicEndPointOptions);
	$.extend(dataOut_True_Endpoint, basicEndPointOptions);
	$.extend(dataOut_False_Endpoint, basicEndPointOptions);

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
		
		$(window).scroll(function() {
			jsPlumb.repaintEverything();
		});
	};
	
	function initJsPlumbConnector() {
		// bind to connection/connectionDetached events, and update the list
		// of connections on screen.
		jsPlumb.bind("connection", function(info, originalEvent) {
			updateConnections(info.connection);
			// connection validator
			if (campaign_designer.validateConnection(info.sourceId, info.targetId) === false) {
				jsPlumb.detach(info.connection);
			}
		});
		jsPlumb.bind("connectionDetached", function(info, originalEvent) {
			updateConnections(info.connection, true);
		});
	}

	function updateConnections(conn, remove) {
		if (!remove){
			connections.push(conn);			
		}
		else {
			var idx = -1;
			for ( var i = 0; i < connections.length; i++) {
				if (connections[i] == conn) {
					idx = i;
					break;
				};
			}
			if (idx != -1) connections.splice(idx, 1);		// remove connection
		};
	};
	
	function addJSPlumbProperty( node, showDialog ) {
		var Div = node.getUiNode(); 
		var type = node.getInfo().nodeType;
		
		//build connectors, trigger has no input
		if (type !== "TRIGGER") jsPlumb.addEndpoint($(Div), dataIn_Endpoint);
		jsPlumb.addEndpoint($(Div), dataOut_True_Endpoint);
		
		//end point removed, for filter and event, to avoid confusion
		//if (type=="EVENT" || type=="FILTER") jsPlumb.addEndpoint($(Div), dataOut_False_Endpoint);
		
		// make div draggable
		jsPlumb.draggable($(Div), {
			containment : "#"+campaign_designer.settings.nodeContainerId,
			cursor : "move",
			stack : ".draggable",
		});

		$(Div).find(".remove").click(function() {				// remove handler
			jsPlumb.detachAllConnections($(this).attr("rel"));
			jsPlumb.removeAllEndpoints($(this).attr("rel"));
			$(this).parent().remove();
			node.remove(); // campaign_designer.js
		});
		var dialog = $(Div).find(".edit").click( function() {	// edit handler
			$.handleEditWithDialog( node ); //dialogHelper.js
		});
		if (showDialog === true) {
			dialog.click();
		}
	};	
	
	function getAllConnections() {
		var s = [];
		for ( var j = 0; j < connections.length; j++) {
			var type = null;
			var endPoints = connections[j].endpoints;
			for (var i=0; i<endPoints.length; ++i) {
				if (endPoints[i].getParameter("connectorDecision") !== null) {
					type = endPoints[i].getParameter("connectorDecision");
					break;
				}
			}
			s.push({
				src:connections[j].sourceId,
				dst:connections[j].targetId,
				satisfied : type,
			});
		}
		return s;
	};
	
	function jsPlumpConnect( conn ) {
		var src = getEndPointWithType( jsPlumb.getEndpoints(conn.src), conn.satisfied ); 
		var dst = getEndPointWithType( jsPlumb.getEndpoints(conn.dst), null );
		jsPlumb.connect({ 
			source: src,
		  	target: dst,
		});
	};
	
	// find the endPoint from two endPoints of each node, by type
	function getEndPointWithType( endPoints, type ) {
		for (var i=0; i<endPoints.length; ++i) {
			if (endPoints[i].getParameter("connectorDecision") === type) {
				return endPoints[i];
			}
		}
	}
}) (jQuery);

