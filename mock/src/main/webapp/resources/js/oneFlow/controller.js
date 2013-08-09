/*
 * this is used to initiate the whole page
 */
$(function() {
	// add event handers to each component
	$.initDragDrop();
	$.initJsPlumb();
	$.disableFormEnterKey();
	$.initSaverAndLoader();
	
	$.resolveFlowId(); // load graph if id existed : pageSaverAndLoader.js
});

// utility function, used for debug
var showObject = function(name, object ) {
	if (name === undefined) return;
	if (object === undefined) {
		object = name;
		name = "";
	};
	alert(name + " : " + JSON.stringify(object));
};
