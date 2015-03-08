function mapElement() {
	this.markers = [];
	this.lines = [];
};

mapElement.prototype = new element();
mapElement.prototype.constructor = mapElement;


/**
 * 
 */
/*mapElement.prototype.nameFunction = function (){


};*/

mapElement.prototype.test = function () {

	UIC.addNode("1", "", "", "", "", "red", 5, "", 51.5, -0.09);
	UIC.addNode("2", "", "", "", "", "red", 5, "", 51.8, -0.09);

	//var edge1 = {id: "1", id1: "1", id2:"2", color:"red"};
	//UIC.addEdge(edge1);

	//console.log(this.markers);
	//this.removeNode(node1);
	//this.removeEdge(edge1);
}

/**
 * Load graph on layout div html page
 */
mapElement.prototype.load = function () {

	//create a layout

	var maplink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	var mmm = '<a href=https://github.com/coelias/Pynteractive>Pynteractive</a>'

	var osm = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    	attribution: ' &copy; '+maplink+" | "+mmm,
	});

	this.layout = L.map('layout', {
	    center: [ 51.7504163, -1.2475879 ],
	    zoom: 12,
	    maxZoom: 18,
	    minZoom: 3,
	    zoomControl: false,
	    layers: [osm]
	});

	this.test();

	//add events listener
	//this.layout.on('select', this.selectElement);
	//this.layout.on('doubleClick', this.doubleClickElement);
};

/**
 * Load html page
 */
mapElement.prototype.loadHtml = function () {
	
	//create tools
	var tag = {};

	tag = {tag:'div', to:'#sidebar', id:'containerNetwork'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'div', to:'#containerNetwork', id:'optionsNetwork'};
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
 * Get lat and lng given the id of a node
 */
mapElement.prototype.getLatLngNode = function (node){
	return this.markers[node]._latlng;
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////////////    UIC WRAPPER    ///////////////////////
////////////////////////////////////////////////////////////

/**
 * add Node
 */
mapElement.prototype.addNode = function (node){
	var markerAux = new L.CircleMarker(new L.LatLng(node.location.lat,  node.location.lng), {
		    radius: node.radius,
		    fillColor: node.color,
		    color: 'black',
		    weight: 1,
		    opacity: 1,
		    fillOpacity: 0.7,
		});

	markerAux.options.id = node.id;
	markerAux.on('click', this.clickNode);

	this.markers[node.id] = markerAux;
	this.layout.addLayer(this.markers[node.id]);
}

/**
 * add Edge
 */
mapElement.prototype.addEdge = function (edge){
	//id, id1, id2, label, title, threshold, style, length

	p1 = this.getLatLngNode(edge.from);
	p2 = this.getLatLngNode(edge.to);

	var pointA = new L.LatLng(p1.lat, p1.lng);
	var pointB = new L.LatLng(p2.lat, p2.lng);
	var pointList = [pointA, pointB];

	// create a red polyline from an array of LatLng points
	var polyline = L.polyline(pointList, {color: edge.color});

	polyline.options.id = edge.id;
	polyline.on('click', this.clickEdge);

	this.lines[edge.id] = polyline;
	this.layout.addLayer(this.lines[edge.id]);

	// zoom the map to the polyline
	//this.layout.fitBounds(polyline.getBounds());
}

/**
 * remove Node
 */
mapElement.prototype.removeNode = function (node){
	this.layout.removeLayer(this.markers[node.id]);
	delete this.markers[node.id]; 
}


/**
 * remove Edge
 */
mapElement.prototype.removeEdge = function (edge){
	this.layout.removeLayer(this.lines[edge.id]);
	delete this.lines[edge.id]; 
}

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////////////////////    EVENTS   //////////////////////////
////////////////////////////////////////////////////////////

/**
 * click node
 */
mapElement.prototype.clickNode = function (node){
	console.log(node.target.options.id);
}

/**
 * click Edge
 */
mapElement.prototype.clickEdge = function (edge){
	console.log(edge.target.options.id);
}
