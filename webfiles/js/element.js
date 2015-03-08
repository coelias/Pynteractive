////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////////    CLASS FEINITION AND VARIABLES    //////////////
////////////////////////////////////////////////////////////

function element() {
	//logic container layout
	this.network;
	//physic container layout
	this.container = document.getElementById('network');

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
	//create network visualization
	this.load();
	//create connection between GUI and Business model
	PYCON.connect("ws://localhost:8000/")
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
///////////////    NETWORK MANAGEMENT    ///////////////////
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
	
	//create tools
	var tag = {};

	tag = {tag:'div', to:'#sidebar', id:'containerNetwork'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'div', to:'#containerNetwork', id:'optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id:'labelBarnesHut', text:'BarnesHut'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'input', to:'#optionsNetwork', id: 'labelRepulsionRadio', name: 'groupOptionsNetwork', type: 'radio', value: '0', onclick: 'element.changeLayoutType(id);', checked: true};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelHierarchicalRepulsion', text: 'Hierarchical'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'input', to:'#optionsNetwork', id: 'labelHierarchicalRepulsionRadio', name: 'groupOptionsNetwork', type: 'radio', value: '0', onclick: 'element.changeLayoutType(id);', checked: false};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'hr', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelNodeDistance', text: 'Node Distance'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'sliderNodeDistance', type: 'range', min: '0', max: '300', step: '10', value: this.nodeDistanceValue, onclick: 'element.changeLayoutNodeDistance(value)'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	jQuery('<hr/>', {}).appendTo('#optionsNetwork');

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelGraphFocus', text: 'Focus'};
	this.loadHtmlTag(tag);
	tag = {tag:'button', to:'#optionsNetwork', id: 'GraphFocus', type: 'button', onclick: 'element.changeGraphFocus();'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelFreezeLayout', text: 'Freeze Animation'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'FreezeLayout', type: 'checkbox', onclick: 'element.changeFreezeLayout();'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelHideEdgesOnDragLayout', text: 'Hide edges on drag'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'HideEdgesOnDragLayout', type: 'checkbox', onclick: 'element.changeHideEdgesOnDragLayout();'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'hr', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelSmoothCurves', text: 'Smooth Curves'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelSmoothCurvesDynamic', text: 'Dynamic'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'SmoothCurvesDynamic', type: 'checkbox', checked: !this.smoothCurves.dynamic, onclick: 'element.changeSmoothCurvesDynamic();'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelSmoothCurvesType', text: 'Type'};
	this.loadHtmlTag(tag);

	tag = {tag:'select', to:'#optionsNetwork', id: 'SmoothCurvesType', type: 'checkbox', onchange: 'element.changeSmoothCurvesType(value);'};
	this.loadHtmlTag(tag);
	tag = {tag:'option', to:'#SmoothCurvesType', value: "continuous", text: "continuous"};
	this.loadHtmlTag(tag);
	tag = {tag:'option', to:'#SmoothCurvesType', value: "discrete", text: "discrete"};
	this.loadHtmlTag(tag);
	tag = {tag:'option', to:'#SmoothCurvesType', value: "diagonalCross", text: "diagonalCross"};
	this.loadHtmlTag(tag);
	tag = {tag:'option', to:'#SmoothCurvesType', value: "straightCross", text: "straightCross"};
	this.loadHtmlTag(tag);
	this.loadHtmlTag(tag);
	tag = {tag:'option', to:'#SmoothCurvesType', value: "horizontal", text: "horizontal"};
	this.loadHtmlTag(tag);
	this.loadHtmlTag(tag);
	tag = {tag:'option', to:'#SmoothCurvesType', value: "vertical", text: "vertical", onclick: 'element.changeSmoothCurvesType(value);'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelSmoothCurvesRoundness', text: 'Roundness'};
	this.loadHtmlTag(tag);
	tag = {tag:'input', to:'#optionsNetwork', id: 'sliderSmoothCurvesRoundness', type: 'range', min: '0', max: '1', step: '0.1', value: '0.5', onchange: 'element.changeSmoothCurvesRoundness(value)'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'hr', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);


	tag = {tag:'label', to:'#optionsNetwork', id: 'labelAction1', text: 'Action 1'};
	this.loadHtmlTag(tag);
	tag = {tag:'button', to:'#optionsNetwork', id: 'Action1', type: 'button', onclick: 'element.action(id);'};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelAction2', text: 'Action 2'};
	this.loadHtmlTag(tag);
	tag = {tag:'button', to:'#optionsNetwork', id: 'Action2', type: 'button', onclick: 'element.action(id);'};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelAction3', text: 'Action 3'};
	this.loadHtmlTag(tag);
	tag = {tag:'button', to:'#optionsNetwork', id: 'Action3', type: 'button', onclick: 'element.action(id);'};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'hr', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

};

/**
 * Load graph on network div html page
 */
element.prototype.load = function () {

	//create a network
	this.container = document.getElementById('network');

	this.data = {
		nodes: this.nodesMap,
		edges: this.edgesMap
	};

	this.reDrawLayout();

	//add events listener
	this.network.on('select', this.selectElement);
	this.network.on('doubleClick', this.doubleClickElement);
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
			enabledLayout = 1;
			break;
		case "labelHierarchicalRepulsionRadio":
			enabledLayout = 2;
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

	this.destroy();

	switch(this.enabledLayout) {
		case 1: //smoothCurves: {dynamic:false, type: "continuous"}
			this.options = {stabilize: false, smoothCurves: {dynamic:this.smoothCurves.dynamic, type: this.smoothCurves.type, roundness: this.smoothCurves.roundness}, physics: {barnesHut: {enabled: false}, repulsion: {damping:0.09, nodeDistance: this.nodeDistanceValue, centralGravity: this.centralGravityValue}},hideEdgesOnDrag: this.hideEdgesOnDragLayout};
			this.network = new vis.Network(this.container, this.data, this.options);
			break;
		case 2:
			this.options = {stabilize: false, hierarchicalLayout: {layout: "directional"}, smoothCurves: {dynamic:this.smoothCurves.dynamic, type: this.smoothCurves.type, roundness: this.smoothCurves.roundness}, physics: {hierarchicalRepulsion: {nodeDistance: this.nodeDistanceValue}}, hideEdgesOnDrag: this.hideEdgesOnDragLayout};
			this.network = new vis.Network(this.container, this.data, this.options);
			break;
	}

	this.reDrawToolLayout();

	this.network.freezeSimulation(this.freezeLayout);
};

/**
 * Re paint tool layout taking into account the method selected for network visualization
 */
element.prototype.reDrawToolLayout = function () {

	switch(this.smoothCurves.dynamic) {
		case false:
			$('#labelSmoothCurvesType').prop( "disabled", false ).removeClass('disabled');
			$("#SmoothCurvesType").prop( "disabled", false ).removeClass('disabled');
			$('#labelSmoothCurvesRoundness').prop( "disabled", false ).removeClass('disabled');
			$("#sliderSmoothCurvesRoundness").prop( "disabled", false ).removeClass('disabled');
			break;
		case true:
			$('#labelSmoothCurvesType').prop( "disabled", true ).addClass('disabled');
			$("#SmoothCurvesType").prop( "disabled", true ).addClass('disabled');
			$('#labelSmoothCurvesRoundness').prop( "disabled", true ).addClass('disabled');
			$("#sliderSmoothCurvesRoundness").prop( "disabled", true ).addClass('disabled');
			break;
	}

};

/**
 * Destroy network layout
 */
element.prototype.destroy = function () {
	if (this.network != null) {
	    this.network = null;
	}
};

/**
 * Set focus on random node
 */
element.prototype.changeGraphFocus = function (){
	coord = this.network.getCenterCoordinates();
	scale = this.network.getScale();
	var options = {position:{x:coord.x+coord.x*-1, y:coord.y+coord.y*-1}, scale:scale, animation: {duration: 1000}};
	this.network.moveTo(options);
};

/**
 * Enable/Disable animation layout
 */
element.prototype.changeFreezeLayout = function (){
	this.freezeLayout = !this.freezeLayout;
	this.network.freezeSimulation(this.freezeLayout);
};


/**
 * Enable/Disable animation layout
 */
element.prototype.changeHideEdgesOnDragLayout = function (){
	this.hideEdgesOnDragLayout = !this.hideEdgesOnDragLayout;
	this.options.hideEdgesOnDrag = this.hideEdgesOnDragLayout;
	this.network.setOptions(this.options);
};

/**
 * Enable/Disable smooth curves
 */
element.prototype.changeSmoothCurvesDynamic = function (){
	this.smoothCurves.dynamic = !this.smoothCurves.dynamic;
	this.options.smoothCurves = {dynamic:this.smoothCurves.dynamic, type: this.smoothCurves.type, roundness:this.smoothCurves.roundness};
	this.network.setOptions(this.options);

	this.reDrawToolLayout();
};

/**
 * change type of smooth curves
 */
element.prototype.changeSmoothCurvesType = function (value){
	this.smoothCurves.type = value;
	this.options.smoothCurves = {dynamic:this.smoothCurves.dynamic, type: this.smoothCurves.type, roundness:this.smoothCurves.roundness};
	this.network.setOptions(this.options);
};

/**
 * change type of smooth curves roundness
 */
element.prototype.changeSmoothCurvesRoundness = function (value){

	this.smoothCurves.roundness = value;
	this.options.smoothCurves = {dynamic:this.smoothCurves.dynamic, type: this.smoothCurves.type, roundness:this.smoothCurves.roundness};
	this.network.setOptions(this.options);
};

/**
 * execute action
 */
element.prototype.action = function (id){
	switch(id) {
		case 'Action1':
			PYCON.send('graphAction',{n:1,selectedNodes:this.network.getSelection().nodes});
			break;
		case 'Action2':
			PYCON.send('graphAction',{n:2,selectedNodes:this.network.getSelection().nodes});
			break;
		case 'Action3':
			PYCON.send('graphAction',{n:3,selectedNodes:this.network.getSelection().nodes});
			break;
	}
};
