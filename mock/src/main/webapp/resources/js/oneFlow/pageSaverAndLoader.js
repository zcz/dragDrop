(function($) {
	
	// export function
	$.initSaverAndLoader = initSaverAndLoader;
	$.resolveFlowId = resolveFlowId;
	
	function initSaverAndLoader() {
		$("#saveFlow").click(function() {
			ajaxSaveThisFlow();
		});
	};
	
	function ajaxSaveThisFlow() {
		var JSON = prepareJSON();
		
		var options = {
			type : "POST",
			url : campaign_designer.settings.graphFlowUrl,
			data : { 'JSON' : JSON, },
			success : function( data ) {
				if (campaign_designer.flow.flowId < 0) {
					campaign_designer.flow.flowId = data.id;
				}
				window.location.replace("flowList.html");
			},
		};
		$.ajax(options);
	};
	
	function prepareJSON() {
		var pointJson = [];
		var edgeJson = $.getAllConnections();
		var finalJson = {};
		
		for( var nodeId in campaign_designer.nodes){
			var node = campaign_designer.nodes[nodeId];
			pointJson.push( node.prepareJson() );  			//campaign_designer.js
		}
		
		var graph = {
				nodes : pointJson,
				edges : edgeJson,	
			};
		
		//encode graph
		//var graphS = JSON.stringify(graph);
		//graphS = $.base64.encode(graphS);
		//var encodedGraph = $.base64.encode(graphS);

		finalJson = { 
				id : campaign_designer.flow.flowId,
				name : campaign_designer.flow.flowName,
				graph : graph,
			};
		
		return JSON.stringify(finalJson);
	};	
	
	function ajaxLoadFlowGraph(flowId) {
		if (flowId >= 0) {
			var options = {
				type : "GET",
				url : campaign_designer.settings.graphFlowUrl,
				data : { "flowid" : flowId },
				success : restoreTheGraph,
			};
			$.ajax(options);		
		}
	};	
	
	function restoreTheGraph( data ) {
		campaign_designer.flow.flowId = data.id;
		campaign_designer.flow.flowName = data.name;
		// restore nodes
		for (var index in data.graph.nodes) {
			var nodeJson = data.graph.nodes[index];
			var node = campaign_designer.createNodeFromJson( nodeJson );
			$.prepareUiNode( node, nodeJson.position );						// dragDropHelper.js
			$.addJSPlumbProperty( node, false );							// jsPlumbHelper.js
		};
		// restore edges
		for (var index in data.graph.edges) {
			var conn = data.graph.edges[index];
			$.jsPlumpConnect( conn );										// jsPlumbHelper.js
		};
	}
	
	function resolveFlowId() {
		var flowId = parseInt(getURLParameter('flowId'), 10);
		if ( isNaN(flowId) ) {
			$.loadPageInfoDialog(); 		// no flowId find, new flow : dialogHelper.js
		} else {
			ajaxLoadFlowGraph( flowId );  	// flowId find, load flow : pageSaverAndLoader.js
		}
	};
	
	// helper function, get paramethers in the url
	// e.g., url = http://index.html?flowId=2
	// then it will return "2"
	function getURLParameter(name) {
	    return decodeURI(
	        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
	    );
	}
})(jQuery);
