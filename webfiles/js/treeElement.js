function treeElement() {
	this.enabledLayout = 2;
	this.levelSeparation = 150;
      	this.nodeSpacing = 100;
};

treeElement.prototype = new element();
treeElement.prototype.constructor = treeElement;


/**
 * Redraw widgets
 */
treeElement.prototype.browserResizeEnd = function (){
	element.layout.redraw();
};


/**
 * Load graph on layout div html page
 */
treeElement.prototype.load = function () {
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
}

/**
 * Load html page
 */
treeElement.prototype.loadHtml = function () {
	
	//create tools
	var tag = {};

	tag = {tag:'div', to:'#sidebar', id:'containerNetwork'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'div', to:'#containerNetwork', id:'optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id:'labelBarnesHut', text:'BarnesHut'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'input', to:'#optionsNetwork', id: 'labelRepulsionRadio', name: 'groupOptionsNetwork', type: 'radio', value: '0', onclick: 'element.changeLayoutType(id);', checked: false};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelHierarchicalRepulsion', text: 'Hierarchical'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'input', to:'#optionsNetwork', id: 'labelHierarchicalRepulsionRadio', name: 'groupOptionsNetwork', type: 'radio', value: '0', onclick: 'element.changeLayoutType(id);', checked: true};
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

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelLevelSeparation', text: 'Level Separation'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'sliderLevelSeparation', type: 'range', min: '0', max: '300', step: '10', value: this.levelSeparation, onclick: 'element.changeLayoutLevelSeparation(value)'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelNodeSpacing', text: 'Node Spacing'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'sliderNodeSpacing', type: 'range', min: '0', max: '300', step: '10', value: this.nodeSpacing, onclick: 'element.changeLayoutNodeSpacing(value)'};
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
	tag = {tag:'button', to:'#optionsNetwork', id: 'buttonSearchById', type: 'button', onclick: ' var id = jQuery(\'#textSearchNodeById\').val(); element.searchById(id);'};
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

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelAction1', text: 'Action 1'};
	this.loadHtmlTag(tag);
	tag = {tag:'button', to:'#optionsNetwork', id: 'Action1', type: 'button', idAction: "1", onclick: 'element.action(this);'};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelAction2', text: 'Action 2'};
	this.loadHtmlTag(tag);
	tag = {tag:'button', to:'#optionsNetwork', id: 'Action2', type: 'button', idAction: "2", onclick: 'element.action(this);'};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelAction3', text: 'Action 3'};
	this.loadHtmlTag(tag);
	tag = {tag:'button', to:'#optionsNetwork', id: 'Action3', type: 'button', idAction: "3", onclick: 'element.action(this);'};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'hr', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

};

/**
 * Re paint all the layout taking into account three physics options {barnesHut, barnesHut disabled and hierarchical}
 */
treeElement.prototype.reDrawLayout = function (){

	this.destroy();

	switch(this.enabledLayout) {
		case 1: //smoothCurves: {dynamic:false, type: "continuous"}
			this.options = {stabilize: false, smoothCurves: {dynamic:this.smoothCurves.dynamic, type: this.smoothCurves.type, roundness: this.smoothCurves.roundness}, physics: {barnesHut: {enabled: false}, repulsion: {damping:0.09, nodeDistance: this.nodeDistanceValue, centralGravity: this.centralGravityValue}},hideEdgesOnDrag: this.hideEdgesOnDragLayout};
			this.layout = new vis.Network(this.container, this.data, this.options);
			break;
		case 2:

			this.options = {stabilize: false, hierarchicalLayout: {layout: "directional", levelSeparation: this.levelSeparation, nodeSpacing: this.nodeSpacing}, smoothCurves:false, physics: {hierarchicalRepulsion: {nodeDistance: this.nodeDistanceValue}}, hideEdgesOnDrag: this.hideEdgesOnDragLayout};

			this.layout = new vis.Network(this.container, this.data, this.options);
			break;
	}

	this.reDrawTreeToolLayout();
	this.reDrawToolLayout();

	this.layout.freezeSimulation(this.freezeLayout);


};

/**
 * Destroy layout layout
 */
treeElement.prototype.destroy = function () {
	if (this.layout != null) {
		this.layout.destroy();
	    	this.layout = null;
	}
};


/**
 * Change level separation of the tree
 * @param {Number} value 
 */
treeElement.prototype.changeLayoutLevelSeparation = function (value){
	this.levelSeparation = value;
	this.reDrawLayout();
};


/**
 * Change node spacing of the tree
 * @param {Number} value 
 */
treeElement.prototype.changeLayoutNodeSpacing = function (value){
	this.nodeSpacing = value;
	this.reDrawLayout();
};

/**
 * Re paint tool layout taking into account the method selected for layout visualization
 */
treeElement.prototype.reDrawTreeToolLayout = function () {

	switch(this.enabledLayout) {
		case 1:
			jQuery('#labelLevelSeparation').prop( "disabled", true ).addClass('disabled');
			jQuery("#sliderLevelSeparation").prop( "disabled", true ).addClass('disabled');
			jQuery('#labelNodeSpacing').prop( "disabled", true).addClass('disabled');
			jQuery("#sliderNodeSpacing").prop( "disabled", true ).addClass('disabled');
			break;
		case 2:
			jQuery('#labelLevelSeparation').prop( "disabled", false ).removeClass('disabled');
			jQuery("#sliderLevelSeparation").prop( "disabled", false ).removeClass('disabled');
			jQuery('#labelNodeSpacing').prop( "disabled", false).removeClass('disabled');
			jQuery("#sliderNodeSpacing").prop( "disabled", false ).removeClass('disabled');
			break;
	}

};

/**
 * search by id
 */
treeElement.prototype.searchNodeById = function (id){
	var options = {animation: true, duration: 200};
	this.layout.focusOnNode(id, options);
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////////////    UIC WRAPPER    ///////////////////////
////////////////////////////////////////////////////////////

/**
 * add Node
 */
treeElement.prototype.addNode = function (node){
	element.nodesMap.add(node);
}


/**
 * add Edge
 */
treeElement.prototype.addEdge = function (edge){
	element.edgesMap.add(edge);

	/*rom = element.nodesMap.get(id2);
	if (from.radius == undefined) from.radius = 10;
	from.radius = from.radius + 1;
	element.nodesMap.update(from);*/
}

/**
 * update Node
 */
treeElement.prototype.updateNode = function (node){
	nodeAux = element.nodesMap.get(node.id);
	if (nodeAux != undefined) {
		if(node.label == undefined) nodeAux.label= node.label;
		if(node.radius == undefined) nodeAux.radius = node.radius;
		if(node.shape == undefined) nodeAux.shape = node.shape;
		if(node.title == undefined) nodeAux.title = node.title;
		if(node.group == undefined) nodeAux.group = node.group;
		if(node.color == undefined) nodeAux.color = node.color;
		if(node.image == undefined) nodeAux.image = node.image;
		if(node.location == undefined) nodeAux.location = node.location;
		element.nodesMap.update(nodeAux);
	}
};


/**
 * update Edge
 */
treeElement.prototype.updateEdge = function (edge){
	edgeAux = element.edgesMap.get(edge.id);
	if (edgeAux != undefined) {
		if(edge.from == undefined) edgeAux.from = edge.from;
		if(edge.to == undefined) edgeAux.to = edge.to;
		if(edge.style == undefined) edgeAux.style = edge.style;
		if(edge.label == undefined) edgeAux.label = edge.label;
		if(edge.title == undefined) edgeAux.title = edge.title;
		if(edge.threshold == undefined) edgeAux.threshold = edge.threshold;
		if(edge.length == undefined) edgeAux.length = edge.length;
		if(edge.color == undefined) nodeAux.color = edge.color;

	}
	element.nodesMap.update(edgeAux);
};

/**
 * remove Node
 */
treeElement.prototype.removeNode = function (node){
	element.nodesMap.remove(node.id);
}


/**
 * remove Edge
 */
treeElement.prototype.removeEdge = function (edge){
	element.edgesMap.remove(edge.id);
}
