////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////////    CLASS FEINITION AND VARIABLES    //////////////
////////////////////////////////////////////////////////////

function element() {
	//logic container layout
	this.layout;
	//physic container layout
	this.container = document.getElementById('layout');

	//data
	this.nodesMap = new vis.DataSet();
	this.edgesMap = new vis.DataSet();
	this.groups = new vis.DataSet();
	this.nodes, this.edges;
	this.data = {};

	//layout config
	this.enabledLayout = 1;
	this.centralGravityValue = 0.5;
	this.nodeDistanceValue = 200;

	//layout freeze
	this.freezeLayout = false;
	this.hideEdgesOnDragLayout = false;

	//options layout
	this.options;

	//smoothCurves
	this.smoothCurves = {};
	this.smoothCurves.dynamic = false;
	this.smoothCurves.type = "continuous";
	this.smoothCurves.roundness = 0.5; //[0,1]
};


element.prototype.loadInstance = function () {
	//create own html page
	this.loadHtml();
	//create layout visualization
	this.load();
	//create connection between GUI and Business model
	PYCON.connect("ws://localhost:8000/")
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
///////////////    layout MANAGEMENT    ///////////////////
////////////////////////////////////////////////////////////
element.prototype.loadHtmlTag = function (tag) {
	var type = tag.tag;
	var to = tag.to;
	delete tag.tag;
	delete tag.to;
	jQuery('<'+type+'/>', tag).appendTo(to);
};

/**
 * Load html page
 */
element.prototype.loadHtml = function () {

};

/**
 * Load graph on layout div html page
 */
element.prototype.load = function () {

};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////////////////////    EVENS    //////////////////////////
////////////////////////////////////////////////////////////

/**
 * Select a list of elements from the graph given an ID's [nodes and edges] with select event on graph
 * @param {propesties} properties 
 */
element.prototype.selectElement = function (properties){
	//var idsNodes = properties.nodes;
	//var idsEdges = properties.edges;
};

/**
 * Select a list of elements from the graph given an ID's [nodes and edges] with doubleclick event on graph
 */
element.prototype.doubleClickElement = function (properties){
	var idsNodes = properties.nodes;
	//var idsEdges = properties.edges;
	PYCON.send('graphDblClick',{nodes:idsNodes});
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////    FUNCTIONS    ///////////////////////
////////////////////////////////////////////////////////////

/**
 * Change layout type
 * @param {Number} id 
 */
element.prototype.changeLayoutType = function (id){

	switch(id) {
		case "labelRepulsionRadio":
			this.enabledLayout = 1;
			break;
		case "labelHierarchicalRepulsionRadio":
			this.enabledLayout = 2;
			break;
	}
	this.reDrawLayout();
};

/**
 * Change central gravity of graph
 * @param {Number} value 
 */
element.prototype.changeLayoutCentralGravity = function (value){
	this.centralGravityValue  = value;
	this.reDrawLayout();
};

/**
 * Change node distance of graph
 * @param {Number} value 
 */
element.prototype.changeLayoutNodeDistance = function (value){
	this.nodeDistanceValue = value;
	this.reDrawLayout();
};

/**
 * Re paint all the layout taking into account three physics options {barnesHut, barnesHut disabled and hierarchical}
 */
element.prototype.reDrawLayout = function (){

};

/**
 * Re paint tool layout taking into account the method selected for layout visualization
 */
element.prototype.reDrawToolLayout = function () {

	switch(this.smoothCurves.dynamic) {
		case false:
			console.log($('#labelSmoothCurvesType'))
			$('#labelSmoothCurvesType').prop( "disabled", false ).removeClass('disabled');
			$("#SmoothCurvesType").prop( "disabled", false ).removeClass('disabled');
			$('#labelSmoothCurvesRoundness').prop( "disabled", false ).removeClass('disabled');
			$("#sliderSmoothCurvesRoundness").prop( "disabled", false ).removeClass('disabled');
			break;
		case true:
			console.log($('#labelSmoothCurvesType'))
			$('#labelSmoothCurvesType').prop( "disabled", true ).addClass('disabled');
			$("#SmoothCurvesType").prop( "disabled", true ).addClass('disabled');
			$('#labelSmoothCurvesRoundness').prop( "disabled", true ).addClass('disabled');
			$("#sliderSmoothCurvesRoundness").prop( "disabled", true ).addClass('disabled');
			break;
	}

};

/**
 * Destroy layout layout
 */
element.prototype.destroy = function () {

};

/**
 * Set focus on random node
 */
element.prototype.changeGraphFocus = function (){
	coord = this.layout.getCenterCoordinates();
	scale = this.layout.getScale();
	var options = {position:{x:coord.x+coord.x*-1, y:coord.y+coord.y*-1}, scale:scale, animation: {duration: 1000}};
	this.layout.moveTo(options);
};

/**
 * Enable/Disable animation layout
 */
element.prototype.changeFreezeLayout = function (){
	this.freezeLayout = !this.freezeLayout;
	this.layout.freezeSimulation(this.freezeLayout);
};


/**
 * Enable/Disable animation layout
 */
element.prototype.changeHideEdgesOnDragLayout = function (){
	this.hideEdgesOnDragLayout = !this.hideEdgesOnDragLayout;
	this.options.hideEdgesOnDrag = this.hideEdgesOnDragLayout;
	this.layout.setOptions(this.options);
};

/**
 * Enable/Disable smooth curves
 */
element.prototype.changeSmoothCurvesDynamic = function (){
	this.smoothCurves.dynamic = !this.smoothCurves.dynamic;
	this.options.smoothCurves = {dynamic:this.smoothCurves.dynamic, type: this.smoothCurves.type, roundness:this.smoothCurves.roundness};
	this.layout.setOptions(this.options);
	
	this.reDrawToolLayout();
};

/**
 * change type of smooth curves
 */
element.prototype.changeSmoothCurvesType = function (value){
	this.smoothCurves.type = value;
	this.options.smoothCurves = {dynamic:this.smoothCurves.dynamic, type: this.smoothCurves.type, roundness:this.smoothCurves.roundness};
	this.layout.setOptions(this.options);
};

/**
 * change type of smooth curves roundness
 */
element.prototype.changeSmoothCurvesRoundness = function (value){
	this.smoothCurves.roundness = value;
	this.options.smoothCurves = {dynamic:this.smoothCurves.dynamic, type: this.smoothCurves.type, roundness:this.smoothCurves.roundness};
	this.layout.setOptions(this.options);
};

/**
 * execute action
 */
element.prototype.action = function (id){
	switch(id) {
		case 'Action1':
			PYCON.send('graphAction',{n:1,selectedNodes:this.layout.getSelection().nodes});
			break;
		case 'Action2':
			PYCON.send('graphAction',{n:2,selectedNodes:this.layout.getSelection().nodes});
			break;
		case 'Action3':
			PYCON.send('graphAction',{n:3,selectedNodes:this.layout.getSelection().nodes});
			break;
	}
};

/**
 * search by id
 */
element.prototype.searchNodeById = function (id){
	
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////////////    UIC WRAPPER    ///////////////////////
////////////////////////////////////////////////////////////

/**
 * add Node
 */
element.prototype.addNode = function (node){

}


/**
 * add Edge
 */
element.prototype.addEdge = function (node){

}


/**
 * remove Node
 */
element.prototype.removeNode = function (node){

}


/**
 * remove Edge
 */
element.prototype.removeEdge = function (node){

}

