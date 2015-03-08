function mapElement() {

};

mapElement.prototype = new element();
mapElement.prototype.constructor = mapElement;


/**
 * Variables for Leaflet 
 */


/**
 * 
 */
/*mapElement.prototype.nameFunction = function (){


};*/

/**
 * Load graph on layout div html page
 */
mapElement.prototype.load = function () {

	//create a layout

	var maplink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	var mmm = '<a href=https://github.com/coelias/Pynteractive>Pynteractive</a>'

	osm = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
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

	osm.addTo(this.layout);

	//add events listener
	this.layout.on('select', this.selectElement);
	this.layout.on('doubleClick', this.doubleClickElement);

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
