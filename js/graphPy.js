var ajaxRequest;
var data;
var network;
var timeline;

//crear mapa de edges bidireccionals i no repetir !!!
var edgesBidirectional = {};
//var nodesMap = [];
var nodesMap = new vis.DataSet();
var edgesMap = new vis.DataSet();
var items = new vis.DataSet();
var groups = new vis.DataSet();
var nodes, edges;

var container = document.getElementById('network');

$(function () {
	load(data);
});

function load(data) {

	//load node
	addNode("1");
	addNode("2");
	addLink("1","2");

	// create a network
	container = document.getElementById('network');

	var data = {
		nodes: nodesMap,
		edges: edgesMap
	};

	//var options = {stabilize: false};
	var options = {configurePhysics:false, physics: {barnesHut: {springConstant: 0.018}}};
	network = new vis.Network(container, data, options);

	//network.on('select', genericAddNode);
	//network.on('doubleClick', genericAddLink);

};

/*function genericAddNode(id){
	addNode("5");
}

function genericAddLink(){
	 addLink("5","1");
}*/

function addNode(id){
	group = 2;
	var n = {"id":id,"label":id, "value":5};
	nodesMap.add(n);
}

function addLink(id1,id2){
	var style = "line";
	var e = {"from":id1,"to":id2, "label": "", "style": style};
	edgesMap.add(e);
}
