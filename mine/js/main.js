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

//
// first example endpoint. it's a 25x21 rectangle (the size is
// provided in the 'style' arg to the Endpoint),
// and it's both a source and target. the 'scope' of this Endpoint
// is 'exampleConnection', meaning any connection
// starting from this Endpoint is of type 'exampleConnection' and
// can only be dropped on an Endpoint target
// that declares 'exampleEndpoint' as its drop scope, and also that
// only 'exampleConnection' types can be dropped here.
//
// the connection style for this endpoint is a Bezier curve (we
// didn't provide one, so we use the default), with a lineWidth of
// 5 pixels, and a gradient.
//
// there is a 'beforeDrop' interceptor on this endpoint which is
// used to allow the user to decide whether
// or not to allow a particular connection to be established.
//
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


window.jsPlumbHelper = {
		
	init : function() {

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

	
/*
			// setup some empty endpoints. again note the use of the three-arg
			// method to reuse all the parameters except the location
			// of the anchor (purely because we want to move the anchor around
			// here; you could set it one time and forget about it though.)
			var e1 = jsPlumb.addEndpoint('window1', {anchor : [ 0.5, 1, 0, 1 ]}, exampleEndpoint2);

			// setup some DynamicAnchors for use with the blue endpoints
			// and a function to set as the maxConnections callback.
			var anchors = [ [ 1, 0.2, 1, 0 ], [ 0.8, 1, 0, 1 ],	[ 0, 0.8, -1, 0 ], [ 0.2, 0, 0, -1 ] ];
			var maxConnectionsCallback = function(info) {
				alert("Cannot drop connection " + info.connection.id
						+ " : maxConnections has been reached on Endpoint "
						+ info.endpoint.id);
			};
			e1 = jsPlumb.addEndpoint("window1", {anchor : anchors}, exampleEndpoint);
			
			// you can bind for a maxConnections callback using a standard bind
			// call, but you can also supply 'onMaxConnections' in an Endpoint
			// definition - see exampleEndpoint3 above.
			e1.bind("maxConnections", maxConnectionsCallback);

			var e2 = jsPlumb.addEndpoint('window2', { anchor : [ 0.5, 1, 0, 1 ] }, exampleEndpoint);
			
			// again we bind manually. it's starting to get tedious. but now
			// that i've done one of the blue endpoints this way, i have to do
			// them all...
			e2.bind("maxConnections", maxConnectionsCallback);
			jsPlumb.addEndpoint('window2', {anchor : "RightMiddle"}, exampleEndpoint2);

			var e3 = jsPlumb.addEndpoint("window3", { anchor : [ 0.25, 0, 0, -1 ] }, exampleEndpoint);
			e3.bind("maxConnections", maxConnectionsCallback);

			jsPlumb.addEndpoint("window3", {anchor : [ 0.75, 0, 0, -1 ]	}, exampleEndpoint2);

			var e4 = jsPlumb.addEndpoint("window4", {anchor : [ 1, 0.5, 1, 0 ]}, exampleEndpoint);
			e4.bind("maxConnections", maxConnectionsCallback);
			jsPlumb.addEndpoint("window4", {anchor : [ 0.25, 0, 0, -1 ]}, exampleEndpoint2);
*/	
	}	
};

var idCounter = 0;
function initPoint(point, type) {
/*
	$(Div).addClass('window');
	jsPlumb.addEndpoint($(point), exampleEndpoint);
	jsPlumb.draggable($(point));
*/
	
	var thisId = type+"_"+idCounter++;
	
	var left = $(point).position().left - $('#main').position().left;
	var top = $(point).position().top - $('#main').position().top;
	
	var Div = $('<div>', {id : thisId}, {class : 'window ui-draggable'})
				.offset({top:top, left:left})
				.appendTo($(point).parent());
	$(Div).html(
			thisId+'<br/><br/><a href="#" class="cmdLink edit" rel="'
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
	$(Div).addClass('window');

	
	$(".remove").click(function() {
		jsPlumb.detachAllConnections($(this).attr("rel"));
		jsPlumb.removeAllEndpoints($(this).attr("rel"));
		$(this).parent().remove();
	});
	
	$(point).replaceWith(Div);		
	jsPlumb.repaintEverything();	
}