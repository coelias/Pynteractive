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

//layout freeze
var freezeLayout = false;

$(function () {
	load();
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
///////////////    NETWORK MANAGEMENT    ///////////////////
////////////////////////////////////////////////////////////

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

/**
 * Test data
 */
function loadDataTest(){

/*
from random import choice
nodes=xrange(100,400)
map(nw.addNode,nodes)
for i in range(1000):
    nw.addEdge(choice(nodes),choice(nodes))
*/

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

/**
 * Load graph on network div html page
 */
function load() {

	//loas data
	loadDataTest();

	//create a network
	container = document.getElementById('network');

	data = {
		nodes: nodesMap,
		edges: edgesMap
	};

	//var options = {physics: {barnesHut: {enabled: true, centralGravity:centralGravityValue}}};
	//var options = {scale:0.2, stabilize: true};
	//network = new vis.Network(container, data, options);

	reDrawLayout();

	//add events listener
	network.on('select', selectElement);
	network.on('doubleClick', doubleClickElement);
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////////////////////    EVENS    //////////////////////////
////////////////////////////////////////////////////////////

/**
 * Select a list of elements from the graph given an ID's [nodes and edges] with select event on graph
 * @param {propesties} properties 
 */
function selectElement(properties){
	var idsNodes = properties.nodes;
	var idsEdges = properties.edges;
	console.log("selectElement");
	console.log(idsNodes);
	console.log(idsEdges);
}

/**
 * Select a list of elements from the graph given an ID's [nodes and edges] with doubleclick event on graph
 * @param {propesties} properties 
 */
function doubleClickElement(properties){
	var idsNodes = properties.nodes;
	var idsEdges = properties.edges;
	console.log("doubleClickElement");
	console.log(idsNodes);
	console.log(idsEdges);
}

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////    FUNCTIONS    ///////////////////////
////////////////////////////////////////////////////////////

/**
 * Change layout type
 * @param {Number} id 
 */
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

/**
 * Change central gravity of graph
 * @param {Number} value 
 */
function changeLayoutCentralGravity(value){
	centralGravityValue  = value;
	reDrawLayout();
}

/**
 * Change node distance of graph
 * @param {Number} value 
 */
function changeLayoutNodeDistance(value){
	nodeDistanceValue = value;
	reDrawLayout();
}

/**
 * Re paint all the layout taking into account three physics options {barnesHut, barnesHut disabled and hierarchical}
 */
function reDrawLayout(){

	destroy();

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
			//"hubsize","directional"
			var options = {hierarchicalLayout: {layout: "hubsize"}, physics: {hierarchicalRepulsion: {nodeDistance: nodeDistanceValue}}};
			network = new vis.Network(container, data, options);
			break;
	}

	reDrawToolLayout();

	network.freezeSimulation(freezeLayout);
}

/**
 * Re paint tool layout taking into account the method selected for network visualization
 */
function reDrawToolLayout() {

	switch(enabledLayout) {
		case 0:
			$('#labelCentralGravity').removeClass('disabled');
			$("#sliderCentralGravity").removeClass('disabled');
			$("#labelNodeDistance").addClass('disabled');
			$("#sliderNodeDistance").addClass('disabled');
			break;
		case 1: case 2:

			$('#labelCentralGravity').addClass('disabled');
			$("#sliderCentralGravity").addClass('disabled');
			$("#labelNodeDistance").removeClass('disabled');
			$("#sliderNodeDistance").removeClass('disabled');
			break;
	}

}

/**
 * Destroy network layout
 */
function destroy() {
	if (network != null) {
	    network.destroy();
	    network = null;
	}
}

/**
 * Set focus on random node
 */
function changeGraphFocus(){
	var options = {position:{x:0, y:0}, scale:0.3, animation: {duration: 1000}};
	network.moveTo(options);
}

/**
 * Enable/Disable animation layout
 */
function changeFreezeLayout(){
	freezeLayout = !freezeLayout;
	network.freezeSimulation(freezeLayout);
}
