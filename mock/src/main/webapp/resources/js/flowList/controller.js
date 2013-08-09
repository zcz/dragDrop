/*
 * this is used to initiate the whole page
 */
$(function() {
	
	refreshAndLoadAllFlow();
	
	$("#addFlow").click( function() {
		window.location.href = "oneFlow.html";
	});
	
	function refreshAndLoadAllFlow() {
		$.get(	"../flow/all", showFlows );		
	};

	function showFlows( data ) {
		if (!$.isEmptyObject(data)) {
			// fill the table with data
			var a = buildTableColumns( data );
			$(".dataDisplay").remove();
			$(".forDataDisplay").after(a);
			
			// add event handler for edit and delete link
			// may need to add launch link
			eventsBinding();
		}
	};	
	
	function buildTableColumns( data ) {
		var a = "";
		for ( var i = 0; i < data.length; ++i) {
			if (data[i]===null) continue;
			var edit ='<a href="#" class="edit" rel='+data[i].id+'>edit<a>';
			var remove = '<a href="#" class="remove" rel='+data[i].id+'>remove<a>';
			var s = "<tr class='dataDisplay' > "
					+ "<td>" + data[i].id + "</td> " 
					+ "<td>" + data[i].name	+ "</td> " 
					+ "<td>" + edit + "</td> "
					+ "<td>" + remove + "</td> "
					+ "</tr>";
			a = a + s;
		}
		return a;
	};
	
	function eventsBinding() {
		$(".dataDisplay").find(".edit").click( function() {
			window.location.href = "oneFlow.html?flowId="+$(this).attr("rel");
		});
		$(".dataDisplay").find(".remove").click( function() {
			var id = $(this).attr("rel");
			var options = {
				type : "GET",
				url : "../flow/delete",
				data : { 'flowid' : id },
				success : function() {
					refreshAndLoadAllFlow();
				},
			};
			$.ajax(options);
		});
	};
});

var showObject = function(name, object ) {
	if (name === undefined) return;
	if (object === undefined) {
		object = name;
		name = "";
	};
	alert(name + " : " + JSON.stringify(object));
};