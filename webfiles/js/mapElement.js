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

	var node1 = {id: "1", location:{lat:51.5, lng:-0.09}, color:"red", radius:5};
	var node2 = {id: "2", location:{lat:51.8, lng:-0.09}, color:"red", radius:5};
	this.addNode(node1);
	this.addNode(node2);


	var edge1 = {id: "1", from: "1", to:"2", color:"red", width:1};
	this.addEdge(edge1);
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

	element.layout = L.map('layout', {
		center: [ 51.7504163, -1.2475879 ],
		zoom: 12,
		maxZoom: 18,
		minZoom: 3,
		zoomControl: false,	
		maxBounds: false,
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
	controls.addTo(element.layout);

	//MAP LEGEND SELECTOR
	var baseLayers = {
		"OSM Stamen": osmstamen,
		"OSM Forest": osmforest,
		"OSM ": osm,
	};

	var layers = new L.control.layers(baseLayers, null, {collapsed: true, position: 'topright'});
	layers.addTo(element.layout);

	//disable zoom i select area
	this.layout.doubleClickZoom.disable();
	//this.layout.boxZoom.disable();

	this.layout.on("boxzoomend", function(e) {element.rectangleSelection(e);});
	this.layout.on("click", function(e) {element.clearSelection();});
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

	tag = {tag:'label', to:'#optionsNetwork', id: 'ExportSVG2', text: 'Export PNG'};
	this.loadHtmlTag(tag);
	tag = {tag:'button', to:'#optionsNetwork', id: 'exportSVGButton', type: 'button', onclick: 'element.exportSVG();'};
	this.loadHtmlTag(tag);

};

/**
 * Get lat and lng given the id of a node
 */
mapElement.prototype.getLatLngNode = function (node){
	if(element.markers.hasOwnProperty(node)) return element.markers[node]._latlng;
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
	markerAux.options.radius = node.radius;
	markerAux.options.fillcolor = node.color;
	markerAux.options.color = 'black';
	markerAux.on('click', element.clickNode);
	markerAux.on('dblclick', element.dblClickNode);

	element.markers[node.id] = markerAux;
	element.layout.addLayer(element.markers[node.id]);
}

/**
 * add Edge
 */
mapElement.prototype.addEdge = function (edge){
	//id, id1, id2, label, title, threshold, style, length

	p1 = element.getLatLngNode(edge.from);
	p2 = element.getLatLngNode(edge.to);

	var pointA = new L.LatLng(p1.lat, p1.lng);
	var pointB = new L.LatLng(p2.lat, p2.lng);
	var pointList = [pointA, pointB];

	// create a red polyline from an array of LatLng points
	var polyline = L.polyline(pointList, {color: edge.color, weight: edge.width});

	polyline.options.id = edge.id;

	element.lines[edge.id] = polyline;
	element.layout.addLayer(element.lines[edge.id]);
}

/**
 * remove Node
 */
mapElement.prototype.removeNode = function (node){
	element.clearNodeSelection(node.id);
	element.layout.removeLayer(element.markers[node.id]);
	delete element.markers[node.id]; 
}


/**
 * remove Edge
 */
mapElement.prototype.removeEdge = function (edge){
	element.layout.removeLayer(element.lines[edge.id]);
	delete element.lines[edge.id]; 
}

/**
 * search by id
 */
mapElement.prototype.searchNodeById = function (id){
	points = element.getLatLngNode(id);
	if(points != null) element.layout.setView(points,element.zoom);
};
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////////////////////    EVENTS   //////////////////////////
////////////////////////////////////////////////////////////

/**
 * click node
 */
mapElement.prototype.clickNode = function (node){
	if(!element.shiftpress){
		element.clearSelection();	
	}

	mapElement.prototype.selectNode(node.target.options.id);

	var keys = [];
	element.selectionList.forEach(function(v){keys.push(v)});
	PYCON.send("selectionSet",{"nodes":keys});
}

/**
 * double click node
 */
mapElement.prototype.dblClickNode = function (node){

}

/**
 * click Edge
 */
mapElement.prototype.clickEdge = function (edge){
	console.log(edge.target.options.id,false);
}

/**
 * execute action
 */
mapElement.prototype.action = function (e){
	var id = jQuery(e).attr("idaction");

	var keys = [];
	element.selectionList.forEach(
		function(v){keys.push(v)}
	);
	PYCON.send('performAction',{n:id,selectedNodes:keys});
};


////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////    SELECTIONS    //////////////////////
////////////////////////////////////////////////////////////

mapElement.prototype.clearSelection = function() {
	element.selectionList.forEach(
		function(v){element.clearNodeSelection(v)}
	);
	var keys = [];
	element.selectionList.forEach(function(v){keys.push(v)});
	PYCON.send("selectionSet",{"nodes":keys});
}

mapElement.prototype.clearNodeSelection = function (id){

	element.selectNode(id,false);
}

mapElement.prototype.selectNodes = function (nl){

}

mapElement.prototype.selectNode = function(id,refresh,rectangle) {

	var paint = element.selectionList.has(id);
	if(refresh){
		paint = !paint;
	}

	if(paint){
		//get nodemark and change radius 
		element.markers[id].setStyle({radius:(element.markers[id].options.radius*0.5),fillOpacity:0.7});
		element.selectionList.delete(id);
	}else{
		//get nodemark and change radius 30% bigger
		element.markers[id].setStyle({radius:(element.markers[id].options.radius*2),fillOpacity:0.85});
		element.selectionList.add(id);

	}
}

mapElement.prototype.refreshSelection = function() {
	element.selectionList.forEach(function(v){
		element.selectNode(v,true);
	});
}

mapElement.prototype.rectangleSelection = function(e){
	
	element.clearSelection();

	for(var node in element.markers) {
		if (e.boxZoomBounds.contains(element.markers[node]._latlng)) {
			element.selectNode(node,false,true);
		}
	}
	var keys = [];
	element.selectionList.forEach(function(v){keys.push(v)});
	PYCON.send("selectionSet",{"nodes":keys});
}

mapElement.prototype.exportSVG = function (err, canvas) {	
	window.print(element.layout);
}

mapElement.prototype.updateNode = function (node) {	
	var id = node.id;
	var markerAux = new L.CircleMarker(new L.LatLng(element.markers[id]._latlng.lat,  element.markers[id]._latlng.lng), {
			    radius: element.markers[id].options.radius,
			    fillColor: node.color,
			    color: element.markers[id].options.color,
			    weight: 1,
			    opacity: 1,
			    fillOpacity: element.markers[id].options.fillOpacity,
			});

	markerAux.options.id = id;
	markerAux.options.radius = element.markers[id].options.radius;
	markerAux.options.fillcolor = node.color;
	markerAux.options.color = element.markers[id].options.color;
	markerAux.on('click', element.clickNode);
	markerAux.on('dblclick', element.dblClickNode);

	element.layout.removeLayer(element.markers[id]);
	element.markers[id] = markerAux;
	element.layout.addLayer(element.markers[id]);
}
