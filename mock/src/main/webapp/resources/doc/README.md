###User Interface of Campaign Designer

####How to deploy

- Source code is available at "mode" folder of `git@git.xgate.com:dms-yii/campaign-designer.git`.
- This project can be deployed in a web server like TomCat or GlassFish. 
- Home page can be find at `http://localhost:8888/mock/resources/flowList.html`.
- Corresponding HTML file location : `campaign-designer/mock/src/main/webapp/resources/`.


####Implementation

1. JavaScript + JQuery
2. Java (mock on server side)


####Work Flow

1. user drag a button from the left panel and drop it on the main panel 
2. a new div element is created at the position, code in `dragDropHelper.prepareUiNode`
3. the JSPlumb property (for graph connectors) are added, code in `jsPlumbHelper.addJSPlumbProperty`
4. a input form is initiated and displayed, code in `dialogHelper.handleEditWithDialog`
5. form related functions are called when event happened, code in `campaign_designer`
	- createForm
	- loadForm
	- submitForm
6. if the save button (last button in the left panel) is clicked, the graph is posted to web server, code in `pageSaverAndLoader.ajaxSaveThisFlow` 


####How to add one campaign node type

For example, we want to add the node type "WAIT\_FOR" (action). A WAIT_FOR blocks the flow for a certain time.

Steps:

1. add element in the static web page, `oneFlow.html`
	- for the panel button, add into `<div class = "buttom_column">`
	
			<div id="wait" class="clonable draggable_clonable"><p>wait</p></div>
	
	- for the form, add into `<div id="dialogContainer" style="display: none;">`
	
			<div id="waitDialog" title="WAIT">
				<form>
					<LABEL for="content">Wait for: </LABEL>
					<br><INPUT type="text" name="hour"> Hours 
					<br><INPUT type="text" name="day"> Days
				</form>
			</div>

2. add typeInfo into the `campaign_designer.nodeInfo`, code in `campaign_designer.js`,
	
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

3. it's done.
			
####About the graph JSON 

The following is an example of JSON used to represent a graph:

		{
		  "id": 12,
		  "name": "sample graph",
		  "graph": {
		    "nodes": [
		      {
		        "id": "08dac58a-b5ca-46f6-a25f-4a5f3d1215aa",
		        "type": "trigger",
		        "position": {
		          "top": 24,
		          "left": 135
		        },
		        "data": {
		          "extId": -1,
		          "schedulerType": "CRON",
		          "cronScheduler": "0 30 8 ? * 2",
		          "simpleScheduler": "20130808170900"
		        }
		      },
		      {
		        "id": "9d96c606-20c5-4c9e-9581-1745890e6e60",
		        "type": "dataSource",
		        "position": {
		          "top": 70,
		          "left": 295
		        },
		        "data": {
		          "extId": 9
		        }
		      },
		    ],
		    "edges": [
		      {
		        "src": "08dac58a-b5ca-46f6-a25f-4a5f3d1215aa",
		        "dst": "9d96c606-20c5-4c9e-9581-1745890e6e60",
		        "satisfied": true
		      },
		    ]
		  }
		}

The codes related to the JSON generation are as follows:

- `pageSaverAndLoader.js` 
	- `prepareJSON()`
	- `restoreTheGraph()`
- `campaign_designer.js` 
	- `Node.prepareJson()`
- `jsPlumbHelper.js` 
	- `getAllConnections()`
	- `jsPlumpConnect()`
 
 
####Connection validation
The connection validation rules are defined in object: `campaign_designer.nodeInfo.connectionFollowRules`.  
The related function to validate connection are: 
	
- `initJsPlumbConnector()` in `jsPlumbHelper.js`
- `validateConnection()` in `campaign_designer.js`
 
 