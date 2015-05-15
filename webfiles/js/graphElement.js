function graphElement() {
	//data
	this.nodesMap = new vis.DataSet();
	this.edgesMap = new vis.DataSet();
	this.groups = new vis.DataSet();
};

graphElement.prototype = new element();
graphElement.prototype.constructor = graphElement;

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////////////////////    EVENS    //////////////////////////
////////////////////////////////////////////////////////////

/**
 * Select a list of elements from the graph given an ID's [nodes and edges] with select event on graph
 * @param {propesties} properties 
 */
graphElement.prototype.selectElement = function (properties){
	//var idsNodes = properties.nodes;
	//var idsEdges = properties.edges;
};

/**
 * Select a list of elements from the graph given an ID's [nodes and edges] with doubleclick event on graph
 */
graphElement.prototype.doubleClickElement = function (properties){
	var idsNodes = properties.nodes;
	//var idsEdges = properties.edges;
	PYCON.send('graphDblClick',{nodes:idsNodes});
};

/**
 * Redraw widgets
 */
graphElement.prototype.browserResizeEnd = function (){
	element.layout.redraw();
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////    FUNCTIONS    ///////////////////////
////////////////////////////////////////////////////////////


/**
 * Load graph on layout div html page
 */
graphElement.prototype.load = function () {

	//create a layout
	this.container = document.getElementById('layout');

	this.data = {
		nodes: this.nodesMap,
		edges: this.edgesMap
	};

	this.reDrawLayout();

	//add events listener
	this.layout.on('select', this.selectElement);
	this.layout.on('doubleClick', this.doubleClickElement);
};

/**
 * Load html page
 */
graphElement.prototype.loadHtml = function () {
	
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

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelSearchById', text: 'Search by ID'};
	this.loadHtmlTag(tag);
	tag = {tag:'input', to:'#optionsNetwork', id: 'textSearchById', type: 'text', name:""};
	this.loadHtmlTag(tag);
	tag = {tag:'button', to:'#optionsNetwork', id: 'buttonSearchById', type: 'button', onclick: ' var id = jQuery(\'#textSearchById\').val(); element.searchNodeById(id);'};
	this.loadHtmlTag(tag);

	tag = {tag:'hr', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelLog', text: 'Enable/Disable Log'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'enableLog', type: 'checkbox', checked: this.enabledLog, onclick: 'element.changeEnabledLog();'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'hr', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);


	//tag = {tag:'hr', to:'#optionsNetwork'};
	//this.loadHtmlTag(tag);


};

/**
 * Re paint all the layout taking into account three physics options {barnesHut, barnesHut disabled and hierarchical}
 */
graphElement.prototype.reDrawLayout = function (){

	this.destroy();

	switch(this.enabledLayout) {
		case 1: //smoothCurves: {dynamic:false, type: "continuous"}
			this.options = {stabilize: false, smoothCurves: {dynamic:this.smoothCurves.dynamic, type: this.smoothCurves.type, roundness: this.smoothCurves.roundness}, physics: {barnesHut: {enabled: false}, repulsion: {damping:0.09, nodeDistance: this.nodeDistanceValue, centralGravity: this.centralGravityValue}},hideEdgesOnDrag: this.hideEdgesOnDragLayout};

			this.layout = new vis.Network(this.container, this.data, this.options);
			break;
		case 2:
			this.options = {stabilize: false, hierarchicalLayout: {layout: "directional"}, smoothCurves: {dynamic:this.smoothCurves.dynamic, type: this.smoothCurves.type, roundness: this.smoothCurves.roundness}, physics: {hierarchicalRepulsion: {nodeDistance: this.nodeDistanceValue}}, hideEdgesOnDrag: this.hideEdgesOnDragLayout};
			this.layout = new vis.Network(this.container, this.data, this.options);

			break;
	}

	this.reDrawToolLayout();

	this.layout.freezeSimulation(this.freezeLayout);
};

/**
 * Destroy layout layout
 */
graphElement.prototype.destroy = function () {
	if (this.layout != null) {
		this.layout.destroy();
	    	this.layout = null;
	}
};

/**
 * search by id
 */
graphElement.prototype.searchNodeById = function (id){
	var options = {animation: true, duration: 200, scale:3};
	this.layout.focusOnNode(id, options);
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////////////    UIC WRAPPER    ///////////////////////
////////////////////////////////////////////////////////////

/**
 * add Node
 */
graphElement.prototype.addNode = function (node){
	element.nodesMap.add(node);
};


/**
 * add Edge
 */
graphElement.prototype.addEdge = function (edge){
	element.edgesMap.add(edge);

	from = element.nodesMap.get(edge.to);
	if (from.radius == undefined) from.radius = 10;
	element.nodesMap.update(from);
};

/**
 * update Node
 */
graphElement.prototype.updateNode = function (node){
	
	nodeAux = element.nodesMap.get(node.id);

	if (nodeAux != undefined) {
		if(node.label != undefined) nodeAux.label= node.label;
		if(node.radius != undefined) nodeAux.radius = node.radius;
		if(node.shape != undefined) nodeAux.shape = node.shape;
		if(node.title != undefined) nodeAux.title = node.title;
		if(node.group != undefined) nodeAux.group = node.group;
		if(node.color != undefined) nodeAux.color = node.color;
		if(node.image != undefined) nodeAux.image = node.image;
		if(node.location != undefined) nodeAux.location = node.location;
		element.nodesMap.update(nodeAux);
		element.layout.redraw();
	}

};


/**
 * update Edge
 */
graphElement.prototype.updateEdge = function (edge){
	edgeAux = element.edgesMap.get(edge.id);
	if (edgeAux != undefined) {
		if(edge.from != undefined) edgeAux.from = edge.from;
		if(edge.to != undefined) edgeAux.to = edge.to;
		if(edge.style != undefined) edgeAux.style = edge.style;
		if(edge.label != undefined) edgeAux.label = edge.label;
		if(edge.title != undefined) edgeAux.title = edge.title;
		if(edge.threshold != undefined) edgeAux.threshold = edge.threshold;
		if(edge.length != undefined) edgeAux.length = edge.length;
		if(edge.color != undefined) nodeAux.color = edge.color;
		element.nodesMap.update(edgeAux);
	}
};

/**
 * remove Node
 */
graphElement.prototype.removeNode = function (node){
	element.nodesMap.remove(node.id);
};


/**
 * remove Edge
 */
graphElement.prototype.removeEdge = function (edge){
	element.edgesMap.remove(edge.id);
};

/**
 * execute action
 */
graphElement.prototype.action = function (e){
	var id = jQuery(e).attr("idaction");
	PYCON.send('performAction',{n:id,selectedNodes:this.layout.getSelection().nodes});
};
