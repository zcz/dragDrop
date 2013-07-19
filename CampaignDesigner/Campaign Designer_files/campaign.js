var total_count = 0;
var right_clicked_id = "";
var end_added = 0;
var current_flow = 0;
var blocks = new Array();

function Designer(obj) {
	var id = obj.id;
	var width = obj.width;
	var height = obj.height;

	var div = document.createElement('div');

	var div_html = "<button id='show_xml_btn' onclick='generateXML();'>Generate XML</button>"
			+ "<table style='border:5px solid #BBBBBB;' cellpadding='1' cellspacing='0'>"
			+ "<tbody>"
			+ "<tr>"
			+ "<td bgcolor='#FFFFFF' style='border-right: 3px solid #BBBBBB; padding: 5px;' valign='top' >"
			+ "<div id='control_Panel' style='width:200px;'>"
			+ "<div class='buttons'>"
			+ "<b>Activities</b>"
			+ "<div id='btn_act_1' >Send Email</div>"
			+ "<div id='btn_act_2' >Send SMS</div>"
			+ "<div id='btn_act_3' >Web Form</div>"
			+ "<div id='btn_act_4' >Set Customer Data</div>"
			+ "<div id='btn_act_5' >Custom Activity</div>"
			+ "<div id='btn_act_6' >Add to List</div>"
			+ "<div id='btn_act_7' >Convert Lead to Contact</div>"
			+ "</div><br/>"
			+ "<div class='buttons'>"
			+ "<b>Events</b>"
			+ "<div id='btn_ev_1' >Customer Joined</div>"
			+ "<div id='btn_ev_2' >Customer Deactivated</div>"
			+ "<div id='btn_ev_3' >Customer Rule Event</div>"
			+ "<div id='btn_ev_4' >Custom</div>"
			+ "<div id='btn_ev_5' >Elapse Timer</div>"
			+ "<div id='btn_ev_6' >Target Timer</div>"
			+ "<div id='btn_ev_7' >Recurrence</div>"
			+ "<div id='btn_ev_8' >End</div>"
			+ "</div><br/>"
			+ "<div class='buttons'>"
			+ "<b>Decision/Action Objects</b>"
			+ "<div id='btn_dec_1' >Decision</div>"
			+ "<div id='btn_dec_2' >Email Opened</div>"
			+ "<div id='btn_dec_3' >Trackerlink Clicked</div>"
			+ "<div id='btn_dec_4' >SMS Inactive</div>"
			+ "<div id='btn_dec_5' >Email Bounced</div>"
			+ "</div><br/>"
			+ "<div class='buttons'>"
			+ "<b>Switches Object</b>"
			+ "<div id='btn_swi_1' >Allocation Switch</div>"
			+ "</div><br/>"
			+ "</div>"
			+ "</td>"
			+ "<td id='main' style='positiom: relative; background: url(images/grid-bg.jpg) repeat;' bgcolor='#FFFFFF' valign='top' >"
			+ "<div id='xml_box' style='width: "
			+ width
			+ "px; height: "
			+ height
			+ "px; display: none;'><textarea id='xml_textarea' style='margin-left :3px; width: 99%; height: 99%;'></textarea></div>"
			+ "<div id='contentHolder' style='position: relative; border: 0px solid green; width: "
			+ width
			+ "px; height: "
			+ height
			+ "px; overflow: auto; float: left; display: block;'>"
			+ "<div id='lines'>"
			+ "</div>"
			+ "</div>"
			+ "</td>"
			+ "</tr>"
			+ "</tbody>"
			+ "</table>"
			+ "<div class='vs-context-menu'>"
			+ "<ul>"
			+ "<li class='delete'><a href='javascript:void(0);' id='menu_del' onclick='deleteActivity();'>Delete</a></li>"
			+ "</ul>" + "</div>";

	div.innerHTML = div_html;
	document.getElementById(id).appendChild(div);

	initButtons();
}

function initButtons() {
	var i;
	for (i = 1; i <= 7; i++) {
		$('#btn_act_' + i).draggable({
			cursor : 'move',
			snap : false,
			stack : '#btn_act_' + i,
			revert : false,
			helper : 'clone'
		});
	}
	for (i = 1; i <= 8; i++) {
		$('#btn_ev_' + i).draggable({
			cursor : 'move',
			snap : false,
			stack : '#btn_ev_' + i,
			revert : false,
			helper : 'clone'
		});
	}
	for (i = 1; i <= 5; i++) {
		$('#btn_dec_' + i).draggable({
			cursor : 'move',
			snap : false,
			stack : '#btn_dec_' + i,
			revert : false,
			helper : 'clone'
		});
	}
	for (i = 1; i <= 1; i++) {
		$('#btn_swi_' + i).draggable({
			cursor : 'move',
			snap : false,
			stack : '#btn_swi_' + i,
			revert : false,
			helper : 'clone'
		});
	}

	$('#contentHolder').droppable({ tolerance : 'fit', drop : dropped});

}

function addActivity(name, left, top) {
	total_count = total_count + 1;
	var id = "activity_" + total_count;
	var edit_div_id = id + "_edit";

	var sec_div = document.createElement("div");
	sec_div.id = id;
	sec_div.className = "activity";
	sec_div.style.width = "125px";
	sec_div.style.height = "75px";
	sec_div.style.border = "none";
	sec_div.style.position = "absolute";
	sec_div.style.left = left + "px";
	sec_div.style.top = top + "px";

	var sec_html = "<table cellpadding='1' cellspacing='0' >"
			+ "<tr class='header' style='cursor: move;'>" + "<td colspan='2'>"
			+ name + "</td>" + "</tr>" + "<tr>" + "<td>" + "<div id='"
			+ edit_div_id + "'>" + name + "<br>" + "This is sample text"
			+ "</div>" + "</td>" + "<td><img src='images/" + name
			+ ".png' width='40px' height='40px'></td>" + "</tr>" + "</table>";
	;

	sec_div.innerHTML = sec_html;

	var area = document.getElementById('contentHolder');
	area.appendChild(sec_div);

	bindDragEvents(id);

	$('#' + id).vscontext({
		menuBlock : 'vs-context-menu'
	});

	$('#' + id).click(change_flow);

	$('#' + edit_div_id).click(edit_clicked);

	$('#contentHolder').click(body_clicked);

	var percentages = new Array();

	document.getElementById(edit_div_id).contentEditable = true;

	blocks.push({
		id : id,
		out : 1,
		type : 'activity',
		name : name,
		time : 0,
		percentages : percentages,
		flow : current_flow
	});
}

function addEvent(name, left, top) {
	total_count = total_count + 1;
	var id = "event_" + total_count;

	var sec_div = document.createElement("div");
	sec_div.id = id;
	sec_div.className = "event";
	sec_div.style.width = "75px";
	sec_div.style.height = "45px";
	sec_div.style.border = "none";
	sec_div.style.position = "absolute";
	sec_div.style.left = left + "px";
	sec_div.style.top = top + "px";

	var data = name;
	var time;
	if (name == "Elapse Timer" || name == "Target Timer"
			|| name == "Recurrence") {
		time = parseInt(prompt("How many days?"));
		data = "Wait " + time + " Days";
	}

	var sec_html = "<table cellpadding='0' cellspacing='0' >"
			+ "<tr class='header' style='cursor: move;'>"
			+ "<td><img src='images/" + name
			+ ".png' width='40px' height='40px'>" + "</td>" + "</tr>" + "<tr>"
			+ "<td>" + data + "</td>" + "</tr>" + "</table>";
	;

	sec_div.innerHTML = sec_html;

	var area = document.getElementById('contentHolder');
	area.appendChild(sec_div);

	bindDragEvents(id);

	$('#' + id).click(change_flow);

	$('#' + id).vscontext({
		menuBlock : 'vs-context-menu'
	});

	var percentages = new Array();

	blocks.push({
		id : id,
		out : 1,
		type : 'event',
		name : name,
		time : time,
		percentages : percentages,
		flow : current_flow
	});

	if (name == "End") {
		end_added = 1;
	}

}

function addDecision(name, left, top) {
	total_count = total_count + 1;
	var id = "decision_" + total_count;

	var sec_div = document.createElement("div");
	sec_div.id = id;
	sec_div.className = "decision";
	sec_div.style.width = "75px";
	sec_div.style.height = "45px";
	sec_div.style.border = "none";
	sec_div.style.position = "absolute";
	sec_div.style.left = left + "px";
	sec_div.style.top = top + "px";

	var sec_html = "<table cellpadding='0' cellspacing='0' >"
			+ "<tr class='header' style='cursor: move;'>"
			+ "<td><img src='images/" + name
			+ ".png' width='40px' height='40px'>" + "</td>" + "</tr>" + "<tr>"
			+ "<td>" + name + "</td>" + "</tr>" + "</table>";
	;

	sec_div.innerHTML = sec_html;

	var area = document.getElementById('contentHolder');
	area.appendChild(sec_div);

	bindDragEvents(id);

	$('#' + id).click(change_flow);

	$('#' + id).vscontext({
		menuBlock : 'vs-context-menu'
	});

	var out = 1;
	var percentages = new Array();
	var p;
	if (name == "Decision") {
		out = 0;

		while (out < 1 || out > 3)
			out = parseInt(prompt("Number of Options(1,2 or 3): "));
		if (isNaN(out) || out == 0)
			out = 1;

		for ( var i = 0; i < out; i++) {
			p = prompt("Enter criteria for option " + (i + 1) + ": ");
			percentages.push(p);
		}
	}

	blocks.push({
		id : id,
		out : out,
		type : 'decision',
		name : name,
		time : 0,
		percentages : percentages,
		flow : current_flow
	});
}

function addSwitch(name, left, top) {
	total_count = total_count + 1;
	var id = "switch_" + total_count;

	var sec_div = document.createElement("div");
	sec_div.id = id;
	sec_div.className = "switch";
	sec_div.style.width = "40px";
	sec_div.style.height = "40px";
	sec_div.style.border = "none";
	sec_div.style.position = "absolute";
	sec_div.style.left = left + "px";
	sec_div.style.top = top + "px";

	var sec_html = "<table cellpadding='0' cellspacing='0' >"
			+ "<tr class='header' style='cursor: move;'>"
			+ "<td><img src='images/" + name
			+ ".png' width='40px' height='40px'>" + "</td>" + "</tr>"
			+ "</table>";

	sec_div.innerHTML = sec_html;

	var area = document.getElementById('contentHolder');
	area.appendChild(sec_div);

	bindDragEvents(id);

	$('#' + id).click(change_flow);

	$('#' + id).vscontext({
		menuBlock : 'vs-context-menu'
	});

	var out = 0;
	var percentages = new Array();
	var p;
	if (name == "Allocation Switch") {
		while (out < 1 || out > 3)
			out = parseInt(prompt("Number of Options(1,2 or 3): "));

		for ( var i = 0; i < out; i++) {
			p = prompt("Enter percentage for option " + (i + 1)
					+ " (with % sign): ");
			percentages.push(p);
		}
	}

	blocks.push({
		id : id,
		out : out,
		type : 'switch',
		name : name,
		time : 0,
		percentages : percentages,
		flow : current_flow
	});
}

function deleteActivity() {
	var activity = document.getElementById(right_clicked_id);

	if (activity.innerHTML.match(/images\/End.png/)) {
		end_added = 0;
	}

	var i, j, k;
	var rc_index;
	for (i = 0; i < blocks.length; i++) {
		if (blocks[i].id == right_clicked_id) {
			rc_index = i;
			break;
		}
	}

	if (rc_index > 0) {
		for (i = rc_index - 1; rc_index - i <= 3 && i >= 0; i--)
			if (document.getElementById(blocks[i].id).innerHTML
					.match(/Decision/))
				break;

		if (rc_index - i <= 3 && i >= 0) {
			//decision found
			if (rc_index - i <= blocks[i].out) {
				for (j = rc_index + 1; j < blocks.length; j++)
					if (blocks[j].flow == blocks[rc_index].flow)
						break;

				if (j < blocks.length) {
					//blocks[j] is the next block with same flow
					blocks.splice(rc_index + 1, 0, blocks[j]);//check
					blocks.splice(j + 1, 1);
				}
			}
		}
	}

	blocks.splice(rc_index, 1);
	activity.parentNode.removeChild(activity);

	drawAllConnection();
}

function change_flow() {
	//    alert(this.id);
	var i, j;
	for (i = 0; i < blocks.length; i++)
		if (blocks[i].id == this.id)
			break;

	current_flow = blocks[i].flow;
}

function edit_clicked(event) {
	event.stopPropagation();
	var childs = document.getElementById('contentHolder').getElementsByTagName(
			'div');
	for (i = 0; i < childs.length; i++)
		if (childs[i].id.match(/_/) && !childs[i].id.match(/_edit/))
			unbindDragEvents(childs[i].id);
}

function body_clicked() {
	var childs = document.getElementById('contentHolder').getElementsByTagName(
			'div');
	for (i = 0; i < childs.length; i++)
		if (childs[i].id.match(/_/) && !childs[i].id.match(/_edit/))
			bindDragEvents(childs[i].id);
}

function bindDragEvents(id) {
	$('#' + id).draggable({
		cursor : 'move',
		snap : false,
		stack : '#' + id,
		revert : false,
		drag : drag
	});
	$('#' + id).vscontext({
		menuBlock : 'vs-context-menu'
	});
}

function unbindDragEvents(id) {
	$('#' + id).draggable("destroy");
}

/////////////////////////
function drag(event, ui) {
	drawAllConnection();
}

function dropped(ev, ui) {
	var dragged_id = ui.helper.attr('id');
	var name, left, top;
	var new_block_added = 0;//indicates whether dropped div is a new block or not

	//    alert('dropped');
	var chLeft = 230; //contentHolder Left position
	var chTop = 50; //contentHolder Top Position

	if (end_added)
		return;

	if (dragged_id.match(/btn_act_/))//this is an activity button
	{
		name = ui.helper.attr('innerHTML');
		left = ui.position.left;
		top = ui.position.top;

		addActivity(name, left - chLeft, top - chTop);
		new_block_added = 1;
	} else if (dragged_id.match(/btn_ev_/))//this is an event button
	{
		name = ui.helper.attr('innerHTML');
		left = ui.position.left;
		top = ui.position.top;

		addEvent(name, left - chLeft, top - chTop);
		new_block_added = 1;
	} else if (dragged_id.match(/btn_dec_/))//this is a decision button
	{
		name = ui.helper.attr('innerHTML');
		left = ui.position.left;
		top = ui.position.top;

		addDecision(name, left - chLeft, top - chTop);
		new_block_added = 1;
	} else if (dragged_id.match(/btn_swi_/))//this is a switch button
	{
		name = ui.helper.attr('innerHTML');
		left = ui.position.left;
		top = ui.position.top;

		addSwitch(name, left - chLeft, top - chTop);
		new_block_added = 1;
	}

	/////////////////////////////////////////////////////////////////
	//first detect if new block overlaps any prevailing block
	//then reposition them

	var i, j, k;
	var x1, y1, x2, y2, x, y, tx, ty, lx, ly, hx, hy;
	var block;
	var new_block;

	if (new_block_added) {
		new_block = document.getElementById(blocks[blocks.length - 1].id);

		//        alert(new_block.style.left);

		x = parseInt(new_block.style.left.substring(0,
				new_block.style.left.length - 2));
		y = parseInt(new_block.style.top.substring(0,
				new_block.style.top.length - 2));

		for (i = 0; i < blocks.length - 2; i++) {
			block = document.getElementById(blocks[i].id);
			x1 = parseInt(block.style.left.substring(0,
					block.style.left.length - 2));
			y1 = parseInt(block.style.top.substring(0,
					block.style.top.length - 2));

			for (j = i + 1; j < blocks.length - 1; j++)
				if (blocks[j].flow == blocks[i].flow)
					break;

			if (j >= blocks.length - 1)
				continue;

			block = document.getElementById(blocks[j].id);
			x2 = parseInt(block.style.left.substring(0,
					block.style.left.length - 2));
			y2 = parseInt(block.style.top.substring(0,
					block.style.top.length - 2));

			if (x1 < x2)
				x2 += 125;
			else
				x1 += 125;

			if (y1 < y2)
				y2 += 40;
			else
				y1 += 40;

			lx = x1;
			ly = y1;
			hx = x2;
			hy = y2;

			if (lx > hx) {
				tx = lx;
				lx = hx;
				hx = tx;
			}
			if (ly > hy) {
				ty = ly;
				ly = hy;
				hy = ty;
			}

			if ((x >= lx && x <= hx) && (y >= ly && y <= hy)
					&& (x + 125 >= lx && x + 125 <= hx) && (y >= ly && y <= hy)
					&& (hx - lx <= 500 && hy - ly <= 120)) {
				//collision has been detected
				//                block = document.getElementById(blocks[i+1].id);
				block = document.getElementById(blocks[j].id);
				x2 = parseInt(block.style.left.substring(0,
						block.style.left.length - 2));
				y2 = parseInt(block.style.top.substring(0,
						block.style.top.length - 2));
				block.style.left = (x2 + 200) + "px";

				new_block.style.left = x2 + "px";
				new_block.style.top = y2 + "px";

				//                alert('collided');
				//                alert(i+"::"+j);
				blocks[blocks.length - 1].flow = blocks[i].flow;//change the flow number of dragged block so that it belongs to the new flow, where it is inserted

				blocks.splice(j, 0, blocks[blocks.length - 1]);//first insert the last block before i+1
				blocks.splice(blocks.length - 1, 1);//then delete last block

				break;
			}
		}
	} else {
		//        alert(dragged_id);
		var dragged_index;

		new_block = document.getElementById(dragged_id);

		x = parseInt(new_block.style.left.substring(0,
				new_block.style.left.length - 2));
		y = parseInt(new_block.style.top.substring(0,
				new_block.style.top.length - 2));

		for (i = 0; i < blocks.length; i++)
			if (blocks[i].id == dragged_id) {
				dragged_index = i;
				break;
			}

		for (i = 0; i < blocks.length; i++) {
			if (i == dragged_index)
				continue;

			block = document.getElementById(blocks[i].id);
			x1 = parseInt(block.style.left.substring(0,
					block.style.left.length - 2));
			y1 = parseInt(block.style.top.substring(0,
					block.style.top.length - 2));

			for (j = i + 1; j < blocks.length; j++)
				if (blocks[j].flow == blocks[i].flow)
					break;

			if (j >= blocks.length || j == dragged_index)
				continue;

			block = document.getElementById(blocks[j].id);
			x2 = parseInt(block.style.left.substring(0,
					block.style.left.length - 2));
			y2 = parseInt(block.style.top.substring(0,
					block.style.top.length - 2));

			if (x1 < x2)
				x2 += 125;
			else
				x1 += 125;

			if (y1 < y2)
				y2 += 40;
			else
				y1 += 40;

			lx = x1;
			ly = y1;
			hx = x2;
			hy = y2;

			if (lx > hx) {
				tx = lx;
				lx = hx;
				hx = tx;
			}
			if (ly > hy) {
				ty = ly;
				ly = hy;
				hy = ty;
			}

			if ((x >= lx && x <= hx) && (y >= ly && y <= hy)
					&& (x + 125 >= lx && x + 125 <= hx) && (y >= ly && y <= hy)
					&& (hx - lx <= 500 && hy - ly <= 120)) {
				//collision has been detected
				block = document.getElementById(blocks[j].id);
				x2 = parseInt(block.style.left.substring(0,
						block.style.left.length - 2));
				y2 = parseInt(block.style.top.substring(0,
						block.style.top.length - 2));
				block.style.left = (x2 + 200) + "px";

				new_block.style.left = x2 + "px";
				new_block.style.top = y2 + "px";

				////////////////////////////////////////////////////

				if (dragged_index > 0) {
					var l;

					for (k = dragged_index - 1; dragged_index - k <= 3
							&& k >= 0; k--)
						if (document.getElementById(blocks[k].id).innerHTML
								.match(/Decision/))
							break;

					if (dragged_index - k <= 3 && k >= 0) {
						//decision found
						if (dragged_index - k <= blocks[k].out) {
							for (l = dragged_index + 1; l < blocks.length; l++)
								if (blocks[l].flow == blocks[dragged_index].flow)
									break;

							if (l < blocks.length) {
								//blocks[j] is the next block with same flow
								blocks.splice(dragged_index + 1, 0, blocks[l]);//check
								blocks.splice(l + 1, 1);

								if (dragged_index < j && l > j)
									j++;
							}
						}
					}
				}

				///////////////////////////////////////////////////

				blocks[dragged_index].flow = blocks[j].flow;//change the flow number of dragged block so that it belongs to the new flow, where it is inserted

				blocks.splice(j, 0, blocks[dragged_index]);//first insert the dragged block before i+1

				if (dragged_index > j)
					dragged_index++;//one more block has been inserted before dragged block, so increase dragged_index by one

				blocks.splice(dragged_index, 1);//then delete earlier instance of dragged block

				break;
			}
		}

	}

	/////////////////////////////////////////////////////////////////

	drawAllConnection();
}

function drawAllConnection() {
	var i, j, k;
	var arrow_left;

	clearArrow();

	for (i = 0; i < blocks.length - 1; i++) {
		for (j = 1; j <= blocks[i].out && i + j < blocks.length; j++) {
			if (blocks[i].percentages.length > 0) {
				connectBlock(blocks[i].id, blocks[i + j].id,
						blocks[i].percentages[j - 1], 0);

				if (i + 1 + blocks[i].out < blocks.length
						&& blocks[i].id.match(/switch_/))
					connectBlock(blocks[i + j].id,
							blocks[i + 1 + blocks[i].out].id, '', 1);
				else if (document.getElementById(blocks[i].id).innerHTML
						.match(/Decision/)) {
					blocks[i + j].flow = blocks[i].flow + j;
					if (current_flow == blocks[i].flow)
						current_flow = blocks[i + j].flow;
				}
			} else {
				for (k = i + j; k < blocks.length; k++)
					if (blocks[i].flow == blocks[k].flow) {
						connectBlock(blocks[i].id, blocks[k].id, '', 0);
						break;
					}
			}
		}

		if (blocks[i].id.match(/switch_/)) {
			arrow_left = blocks[i].out - j + 1;
			drawSwitchArrows(blocks[i].id, arrow_left);
			//this is to stop drawing double array towards the block after allocation switch
			i = i + 1 + j - 2;
		} else if (document.getElementById(blocks[i].id).innerHTML
				.match(/Decision/)) {
			arrow_left = blocks[i].out - j + 1;
			drawSwitchArrows(blocks[i].id, arrow_left);
			//            i = i+j-2;
		} else
			i = i + j - 2;
	}

	if (i < blocks.length) {
		if (blocks[i].id.match(/switch_/)) {
			drawSwitchArrows(blocks[i].id, blocks[i].out);
		} else if (document.getElementById(blocks[i].id).innerHTML
				.match(/Decision/)) {
			drawSwitchArrows(blocks[i].id, blocks[i].out);
		}
	}

	if (end_added) {
		for (i = 1; i <= 3; i++)
			for (j = blocks.length - 2; j >= 0; j--) {
				if (blocks[j].flow == i) {
					connectBlock(blocks[j].id, blocks[blocks.length - 1].id,
							'', 0);
					break;
				}
			}
	}

}

function connectBlock(block1_id, block2_id, msg, special_flag) {
	if (block1_id && block2_id) {
		var block1 = document.getElementById(block1_id);
		var block2 = document.getElementById(block2_id);

		var w1 = parseInt(block1.style.width.substring(0,
				block1.style.width.length - 2));
		var h1 = parseInt(block1.style.height.substring(0,
				block1.style.height.length - 2));

		var w2 = parseInt(block2.style.width.substring(0,
				block2.style.width.length - 2));
		var h2 = parseInt(block2.style.height.substring(0,
				block2.style.height.length - 2));

		var x1 = parseInt(block1.style.left.substring(0,
				block1.style.left.length - 2));
		var y1 = parseInt(block1.style.top.substring(0,
				block1.style.top.length - 2));

		var x2 = parseInt(block2.style.left.substring(0,
				block2.style.left.length - 2));
		var y2 = parseInt(block2.style.top.substring(0,
				block2.style.top.length - 2));

		var msg_div = document.createElement("div");
		msg_div.style.border = "none";
		msg_div.style.fontSize = "90%";
		msg_div.style.position = "absolute";
		msg_div.style.left = (x2 - (msg.length * 6) - 30) + "px";
		msg_div.style.top = (y2 + 40) + "px";
		msg_div.innerHTML = msg;

		var area = document.getElementById('lines');
		area.appendChild(msg_div);

		drawArrow(x1, y1, x2, y2, w1, h1, w2, h2, special_flag);

	}

}

function drawSwitchArrows(as_id, arrow_left)//allocation switch id
{
	if (arrow_left > 0) {
		var as = document.getElementById(as_id);

		var w1 = parseInt(as.style.width
				.substring(0, as.style.width.length - 2));
		var h1 = parseInt(as.style.height.substring(0,
				as.style.height.length - 2));

		var x1 = parseInt(as.style.left.substring(0, as.style.left.length - 2));
		var y1 = parseInt(as.style.top.substring(0, as.style.top.length - 2));

		var jg = new jsGraphics("lines"); // Use the "Canvas" div for drawing
		jg.setStroke(2);
		jg.setColor("#34668c");

		if (arrow_left == 3) {
			jg.drawLine(x1 + (w1 / 2), y1, x1 + (w1 / 2), y1 - 50);
			jg.fillPolygon(new Array(x1 + (w1 / 2), x1 + (w1 / 2) - 5, x1
					+ (w1 / 2) + 5), new Array(y1 - 55, y1 - 50, y1 - 50));

			jg.drawLine(x1 + w1, y1 + (h1 / 2), x1 + w1 + 50, y1 + (h1 / 2));
			jg.fillPolygon(new Array(x1 + w1 + 50, x1 + w1 + 50, x1 + w1 + 55),
					new Array(y1 + (h1 / 2) - 5, y1 + (h1 / 2) + 5, y1
							+ (h1 / 2)));

			jg.drawLine(x1 + (w1 / 2), y1 + h1, x1 + (w1 / 2), y1 + h1 + 50);
			jg.fillPolygon(new Array(x1 + (w1 / 2), x1 + (w1 / 2) - 5, x1
					+ (w1 / 2) + 5), new Array(y1 + h1 + 55, y1 + h1 + 50, y1
					+ h1 + 50));

			jg.paint();

		} else if (arrow_left == 2) {
			jg.drawLine(x1 + w1, y1 + (h1 / 2), x1 + w1 + 50, y1 + (h1 / 2));
			jg.fillPolygon(new Array(x1 + w1 + 50, x1 + w1 + 50, x1 + w1 + 55),
					new Array(y1 + (h1 / 2) - 5, y1 + (h1 / 2) + 5, y1
							+ (h1 / 2)));

			jg.drawLine(x1 + (w1 / 2), y1 + h1, x1 + (w1 / 2), y1 + h1 + 50);
			jg.fillPolygon(new Array(x1 + (w1 / 2), x1 + (w1 / 2) - 5, x1
					+ (w1 / 2) + 5), new Array(y1 + h1 + 55, y1 + h1 + 50, y1
					+ h1 + 50));

			jg.paint();

		} else if (arrow_left == 1) {
			jg.drawLine(x1 + (w1 / 2), y1 + h1, x1 + (w1 / 2), y1 + h1 + 50);
			jg.fillPolygon(new Array(x1 + (w1 / 2), x1 + (w1 / 2) - 5, x1
					+ (w1 / 2) + 5), new Array(y1 + h1 + 55, y1 + h1 + 50, y1
					+ h1 + 50));

			jg.paint();

		}

	}

}

function drawArrow(x1, y1, x2, y2, w1, h1, w2, h2, special_flag) //special_flag is used for allocation switch block arrows, it indicates the arrow should extend to right first before joining to next block
{
	//    window.status = "Hello World";

	var midx, midy;
	var jg = new jsGraphics("lines"); // Use the "Canvas" div for drawing
	jg.setStroke(2);
	jg.setColor("#34668c");

	if (special_flag) {
		x1 += w1;
		y1 += (h1 / 2);

		var ext = x2 - x1 - 50;
		jg.drawLine(x1, y1, x1 + ext, y1);
		x1 += (ext - (w1 / 2));
	}

	if (y2 > y1 + (h1 - 5))//go below
	{
		x1 += (w1 / 2);
		y1 += (h1 - 2);
		y2 += (h2 / 2);

		if (special_flag) {
			y1 -= (h1 - 2);

		}

		if (x2 >= x1 + (h1 / 2) - 3) {
			jg.drawLine(x1, y1, x1, y2);
			jg.drawLine(x1, y2, x2, y2);
		} else {
			midy = y2 - (h2 / 2) - ((y2 - (h2 / 2) - y1) / 2);
			jg.drawLine(x1, y1, x1, midy);
			jg.drawLine(x1, midy, x2 - (h1 / 2), midy);
			jg.drawLine(x2 - (h1 / 2), midy, x2 - (h1 / 2), y2);
			jg.drawLine(x2 - (h1 / 2), y2, x2, y2);
		}

	} else if (y2 + (h2 / 2) < y1 - 10)//go up
	{
		x1 += (w1 / 2);
		y2 += (h2 / 2);

		if (x2 >= x1 + (h1 / 2) - 3) {
			jg.drawLine(x1, y1, x1, y2);
			jg.drawLine(x1, y2, x2, y2);
		} else {
			midy = y1 - (y1 - (y2 + (h2 / 2))) / 2;
			jg.drawLine(x1, y1, x1, midy);
			jg.drawLine(x1, midy, x2 - (h1 / 2), midy);
			jg.drawLine(x2 - (h1 / 2), midy, x2 - (h1 / 2), y2);
			jg.drawLine(x2 - (h1 / 2), y2, x2, y2);
		}
	} else if (x2 > x1 + w1)//go right
	{
		x1 += w1;
		y1 += (h1 / 2);
		y2 += (h2 / 2);

		if (special_flag) {
			x1 -= (w1 / 2);
			y1 -= (h1 / 2);
			jg.drawLine(x1, y1, x1, y2);
			jg.drawLine(x1, y2, x2, y2);
		} else {
			midx = x1 + ((x2 - x1) / 2);
			jg.drawLine(x1, y1, midx, y1);
			jg.drawLine(midx, y1, midx, y2);
			jg.drawLine(midx, y2, x2, y2);
		}
	} else {
		if (special_flag)
			x1 += (w1 / 2);
		y2 += (h2 / 2);

		jg.drawLine(x1, y1, x1, y2);
		jg.drawLine(x1, y2, x2, y2);
	}
	jg
			.fillPolygon(new Array(x2, x2 - 5, x2 - 5), new Array(y2, y2 - 5,
					y2 + 5));
	jg.paint();

	//    alert('ok');
	/////////////
	/////////////

}

function clearArrow() {
	document.getElementById('lines').innerHTML = "";
}

function generateXML() {
	var i, j, k;

	var xml = "<process-definition name='Campaign'>\n";
	xml += "<start-state name='Start'>\n";
	for (i = 0; i < blocks.length; i++) {
		if (blocks[i].type == 'activity') {
			xml += "<transition  name='start' to='" + blocks[i].name + "'/>'\n";
			break;
		}
	}
	xml += "</start-state>\n";

	//    alert('xml generation');

	//now add all the activities
	for (; i < blocks.length; i++) {
		if (blocks[i].type == 'activity') {
			xml += "<state name='" + blocks[i].name + "' type='"
					+ blocks[i].name + "'>\n";
			for (j = i; j < blocks.length; j++) {
				if (blocks[j].type == 'decision') {
					xml += "<transition  name='" + blocks[j].name + "' ";
					for (k = j; k < blocks.length; k++) {
						if (blocks[k].type == 'activity') {
							xml += "to='" + blocks[k].name + "'/>\n";
							break;
						}
					}
					break;
				}
			}
			xml += "</state>\n";
		}
	}
	xml += "</process-definition>\n";

	//now add all the events
	for (j = 0; j < blocks.length; j++) {
		if (blocks[j].type == 'event'
				&& (blocks[j].name == 'Elapse Timer' || blocks[j].name == 'Target Timer')) {
			xml += "<timer-definition>\n";
			for (k = j; k < blocks.length; k++) {
				if (blocks[k].type == 'activity') {
					xml += "<task='" + blocks[k].name + "'>\n";
					break;
				}
			}
			xml += "<time ='" + (parseInt(blocks[j].time) * 1440) + "'/>\n";
			xml += "</task>\n";
			xml += "</timer-definition>\n";
		} else if (blocks[j].type == 'event' && blocks[j].name == 'Recurrence') {
			xml += "<recurrence-definition>\n";
			for (k = j; k < blocks.length; k++) {
				if (blocks[k].type == 'activity') {
					xml += "<task='" + blocks[k].name + "'>\n";
					break;
				}
			}
			xml += "<time ='" + (parseInt(blocks[j].time) * 1440) + "'/>\n";
			xml += "</task>\n";
			xml += "</recurrence-definition>\n";
		}
	}

	var xml_box = document.getElementById('xml_box');
	var textarea = document.getElementById('xml_textarea');
	if (xml_box.style.display == "none") {
		xml_box.style.display = "block";
		document.getElementById('show_xml_btn').innerHTML = "View Design";
		document.getElementById('contentHolder').style.display = "none";
		textarea.innerText = xml;//for IE
		textarea.innerHTML = xml;//for FF
	} else {
		xml_box.style.display = "none";
		document.getElementById('show_xml_btn').innerHTML = "Generate XML";
		document.getElementById('contentHolder').style.display = "block";
	}

	//    alert(xml);

}
