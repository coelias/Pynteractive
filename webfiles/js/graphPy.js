var ajaxRequest;
var data;
var network;
var timeline;

var nodesMap = new vis.DataSet();
var edgesMap = new vis.DataSet();
var groups = new vis.DataSet();
var nodes, edges;

var container = document.getElementById('network');
var data = {};

//layout config
var enabledLayout = 0;
var centralGravityValue = 1.5;
var nodeDistanceValue = 100;

//var ctrl = false;

$(function () {
	load();
});

setInterval(
	function(){
		SC.send("getGraphUpdates",{},paintUpdates)
  	},2000);

function paintUpdates(obj)
{
	for (index = 0; index < obj.length; index++)
	{
		switch(obj[index][0]) {
			case 'addNode':
				addNode(obj[index][1]);
				break;
			case 'addEdge':
				addEdge(obj[index][1],obj[index][2]);
				break;
			case 'removeEdge':
				removeNode(obj[index][1]);
				break;
			case 'removeEdge':
				removeEdge(obj[index][1],obj[index][2]);
				break;
		}
	}
}

function loadDataTest(){
	//nodes
	addNode("1");
	addNode("2");
	addNode("3");
	addNode("4");

	//edges
	addEdge("1","1");
	addEdge("1","2");
	addEdge("1","3");
	addEdge("1","4");
	addEdge("2","3");
	addEdge("2","4");
	addEdge("3","4");
}


function load() {

	//loas data
	loadDataTest();

	//create a network
	container = document.getElementById('network');

	data = {
		nodes: nodesMap,
		edges: edgesMap
	};

	var options = {physics: {barnesHut: {enabled: true, centralGravity:centralGravityValue}}};
	network = new vis.Network(container, data, options);

	//add events listener
	network.on('select', selectElement);
	network.on('doubleClick', doubleClickElement);

	//add event keyboard listener
	//document.onkeydown = checkKey;
	//document.onkeyup = checkKey;
};

//NETWORK
function addNode(id,label,title){
	var n = {"id":id,"label":label, "title":title};
	nodesMap.add(n);
}

function addEdge(id1,id2, label, title){
	var e = {"id":id1+":"+id2,"from":id1,"to":id2, "label": label, "title":title};
	edgesMap.add(e);
}

function removeNode(id){
	var n = {"id":id};
	nodesMap.remove(n);
}

function removeEdge(id1,id2){
	var e = {"id":id1+":"+id2};
	edgesMap.remove(e);
}

//EVENTS
function selectElement(properties){
	var idsNodes = properties.nodes;
	var idsEdges = properties.edges;


	//get keyboard pressed
	//if(ctrl){
		console.log("selectElement");
		console.log(idsNodes);
		console.log(idsEdges);
	
		changeLayout('2');

	//}
}

function doubleClickElement(properties){
	var idsNodes = properties.nodes;
	var idsEdges = properties.edges;
	console.log("doubleClickElement");
	console.log(idsNodes);
	console.log(idsEdges);
}

/*function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '17') {
        ctrl = !ctrl;
    }
}*/

//FUNCTIONS
function changeLayoutType(id){

	switch(id) {
		case "labelBarnesHutRadio":
			enabledValue = 0;
			break;
		case "labelRepulsionRadio":
			enabledValue = 1;
			break;
		case "labelHierarchicalRepulsionRadio":
			enabledValue = 2;
			break;
	}
	reDrawLayout();
}

function changeLayoutCentralGravity(value){
	centralGravityValue  = value;
	reDrawLayout();
}

function changeLayoutNodeDistance(value){
	nodeDistanceValue = value;
	reDrawLayout();
}

function reDrawLayout(){
	console.log(enabledValue);
	switch(enabledValue) {
		case 0:
			console.log(enabledValue);
			var options = {physics: {barnesHut: {enabled: true, centralGravity:centralGravityValue}}};
			network = new vis.Network(container, data, options);
			break;
		case 1:
			console.log(enabledValue+":"+nodeDistanceValue);
			var options = {physics: {barnesHut: {enabled: false}, repulsion: {nodeDistance: nodeDistanceValue, centralGravity: centralGravityValue}}};
			network = new vis.Network(container, data, options);
			break;
		case 2:
			console.log(enabledValue+":"+nodeDistanceValue);
			var options = {physics: {hierarchicalRepulsion: {nodeDistance: nodeDistanceValue}}};
			network = new vis.Network(container, data, options);
			break;
	}
}
