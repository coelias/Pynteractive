function graphElement() {

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
