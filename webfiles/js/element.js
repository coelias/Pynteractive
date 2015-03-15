////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////////    CLASS FUNCTIONS AND VARIABLES    //////////////
////////////////////////////////////////////////////////////

function element() {
	//logic container layout
	this.layout;
	//physic container layout
	this.container = document.getElementById('layout');

	//data
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

	//log
	this.enabledLog = false;
};


element.prototype.loadInstance = function () {
	//create own html page
	this.loadHtml();
	//create layout visualization
	this.load();
	//create connection between GUI and Business model
	PYCON.connect("ws://localhost:8000/");

	//browser events
	$(window).on("resize", this.browserResize);
	//$(window).bind('resizeEnd', this.browserResizeEnd);
	$(element).bind('resizeEnd', this.browserResizeEnd);
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

/**
 * Delect window resize and redraw widgets
 */
element.prototype.browserResize = function (){
	if(this.resizeTO) clearTimeout(this.resizeTO);
	this.resizeTO = setTimeout(function() {
		var layout = document.getElementById("layout");
		$(element).trigger('resizeEnd');
	}, 500);
};

/**
 * Redraw widgets
 */
element.prototype.browserResizeEnd = function (){

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
			jQuery('#labelSmoothCurvesType').prop( "disabled", false ).removeClass('disabled');
			jQuery("#SmoothCurvesType").prop( "disabled", false ).removeClass('disabled');
			jQuery('#labelSmoothCurvesRoundness').prop( "disabled", false ).removeClass('disabled');
			jQuery("#sliderSmoothCurvesRoundness").prop( "disabled", false ).removeClass('disabled');
			break;
		case true:
			jQuery('#labelSmoothCurvesType').prop( "disabled", true ).addClass('disabled');
			jQuery("#SmoothCurvesType").prop( "disabled", true ).addClass('disabled');
			jQuery('#labelSmoothCurvesRoundness').prop( "disabled", true ).addClass('disabled');
			jQuery("#sliderSmoothCurvesRoundness").prop( "disabled", true ).addClass('disabled');
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
 * change enabled log
 */
element.prototype.changeEnabledLog = function (){
	this.enabledLog = !this.enabledLog;

        if (this.enabledLog){
		jQuery("#logcontainer").css({opacity: 0.25, visibility: "visible", "z-index":2}).animate({opacity: 1}, 200);
        }
        else
        {
		jQuery("#logcontainer").css({opacity: 0.25, visibility: "visible", "z-index":-1}).animate({opacity: 0}, 200);
        }

};

/**
 * execute action
 */
element.prototype.action = function (e){
	var id = jQuery(e).attr("idaction");
	PYCON.send('performAction',{n:id,selectedNodes:this.layout.getSelection().nodes});
};

/**
 * search by id
 */
element.prototype.searchNodeById = function (id){
	
};

/**
 * search by id
 */
element.prototype.addAction  = function (id, name){
	tag = {tag:'label', to:'#optionsNetwork', id: 'labelAction'+id, text: name};
	this.loadHtmlTag(tag);
	tag = {tag:'button', to:'#optionsNetwork', id: 'Action'+id, type: 'button', idAction: id, onclick: 'element.action(this);'};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
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
 * update Node
 */
element.prototype.updateNode = function (node){

}


/**
 * update Edge
 */
element.prototype.updateEdge = function (node){

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

/**
 * clear text Log
 */
element.prototype.clearLog = function(){
	jQuery("#log").html('')
}

/**
 * add text Log
 */
element.prototype.addLog = function(text){
	var previousText = jQuery("#log").html();
	if(previousText == ''){
		jQuery("#log").html(text)
	}else{
		jQuery("#log").html(previousText+"<br>"+text)

	}
}

/**
 * add data for chart
 */
element.prototype.addData = function (data){

}

