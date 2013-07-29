/*
 * this is used to initiate the whole page
 */
$(function() {
	var baseUrl = "../";
	
	$.initDialogHelper({baseUrl:baseUrl});
	$.initJsPlumb();
	$.initDragDrop();
	$.initSaverAndLoader({baseUrl:baseUrl});
});
