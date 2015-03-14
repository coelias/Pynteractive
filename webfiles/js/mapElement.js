function mapElement() {
	this.markers = [];
	this.lines = [];
};

mapElement.prototype = new element();
mapElement.prototype.constructor = mapElement;


/**
 * Redraw widgets
 */
mapElement.prototype.browserResizeEnd = function (){

};

/**
 * 
 */
/*mapElement.prototype.nameFunction = function (){


};*/

mapElement.prototype.test = function () {

	var node1 = {id: "1", lat:51.5, lng:-0.09, color:"red", radius:5};
	var node2 = {id: "2", lat:51.8, lng:-0.09, color:"red", radius:5};
	UIC.addNode(node1);
	UIC.addNode(node2);


	var edge1 = {id: "1", from: "1", to:"2", color:"red"};
	UIC.addEdge(edge1);

	//console.log(this.markers);
	//this.removeNode(node1);
	//this.removeEdge(edge1);
}

/**
 * Load graph on layout div html page
 */
mapElement.prototype.load = function () {

	//create a layout

	//MAPS
	var maplink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	var mmm = '<a href=https://github.com/coelias/Pynteractive>Pynteractive</a>'

	var osmstamen = new L.tileLayer('http://{s}.tile.stamen.com/toner-lite//{z}/{x}/{y}.png', {
	    attribution: ' &copy; '+maplink+" | "+mmm,
	});

	var osmforest = new L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
	    attribution: ' &copy; '+maplink+" | "+mmm,
	});

	var osm = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: ' &copy; '+maplink+" | "+mmm,
	});

	this.layout = L.map('layout', {
		center: [ 51.7504163, -1.2475879 ],
		zoom: 12,
		maxZoom: 18,
		minZoom: 3,
		zoomControl: false,
		layers: [osmforest]
	});

	//SEARCH
	var geosearch = new L.Control.GeoSearch({
		provider: new L.GeoSearch.Provider.OpenStreetMap(),
		position: 'topcenter',
		showMarker: false,
		zoomLevel: 12
	})

	geosearch.addTo(this.layout);

	//MAP ZOOM SELECTOR
	var controls = new L.Control.Zoom({ position: 'bottomright'});
	controls.addTo(this.layout);

	//MAP LEGEND SELECTOR
	var baseLayers = {
		"OSM Stamen": osmstamen,
		"OSM Forest": osmforest,
		"OSM ": osm,
	};

	var layers = new L.control.layers(baseLayers, null, {collapsed: true, position: 'topright'});
	layers.addTo(this.layout);

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


	tag = {tag:'hr', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);


};

/**
 * Get lat and lng given the id of a node
 */
mapElement.prototype.getLatLngNode = function (node){
	if(this.markers.hasOwnProperty(node)) return this.markers[node]._latlng;
	return null;
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

/**
 * search by id
 */
mapElement.prototype.searchNodeById = function (id){
	points = this.getLatLngNode(id);
	if(points != null) this.layout.setView(points,this.zoom);
};
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
