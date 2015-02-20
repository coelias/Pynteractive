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
	for (i=0;i<obj.length;i++)
	{
		fname=obj[i][0];
			args=[].slice.call(obj[i]).splice(1);
		window["UIC"][fname].apply(this,args);
	}
}

function loadDataTest(){
	//nodes
	UIC.addNode("1");
	UIC.addNode("2");
	UIC.addNode("3");
	UIC.addNode("4");

	//edges
	UIC.addEdge("1","1");
	UIC.addEdge("1","2");
	UIC.addEdge("1","3");
	UIC.addEdge("1","4");
	UIC.addEdge("2","3");
	UIC.addEdge("2","4");
	UIC.addEdge("3","4");
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


//EVENTS
function selectElement(properties){
	var idsNodes = properties.nodes;
	var idsEdges = properties.edges;


	//get keyboard pressed
	//if(ctrl){
		console.log("selectElement");
		console.log(idsNodes);
		console.log(idsEdges);
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
			enabledLayout = 0;
			break;
		case "labelRepulsionRadio":
			enabledLayout = 1;
			break;
		case "labelHierarchicalRepulsionRadio":
			enabledLayout = 2;
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
	switch(enabledLayout) {
		case 0:
			var options = {physics: {barnesHut: {enabled: true, centralGravity:centralGravityValue}}};
			network = new vis.Network(container, data, options);
			break;
		case 1:
			var options = {physics: {barnesHut: {enabled: false}, repulsion: {nodeDistance: nodeDistanceValue, centralGravity: centralGravityValue}}};
			network = new vis.Network(container, data, options);
			break;
		case 2:
			var options = {physics: {hierarchicalRepulsion: {nodeDistance: nodeDistanceValue}}};
			network = new vis.Network(container, data, options);
			break;
	}
}
