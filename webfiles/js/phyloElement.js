function phyloElement() {
	this.r;
	this.cluster;
	this.data;
	this.wrap;
	this.start;
	this.rotate;
	this.div;
};

phyloElement.prototype = new element();
phyloElement.prototype.constructor = phyloElement;

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////    FUNCTIONS    ///////////////////////
////////////////////////////////////////////////////////////

/**
 * Load html page
 */
phyloElement.prototype.loadHtml = function () {
	
	//create tools
	var tag = {};

	tag = {tag:'div', to:'#sidebar', id:'containerNetwork'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'div', to:'#containerNetwork', id:'optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelLog', text: 'Enable/Disable Log'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'enableLog', type: 'checkbox', checked: this.enabledLog, onclick: 'element.changeEnabledLog();'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

};


/**
 * Load graph on layout div html page
 */
phyloElement.prototype.load = function () {

	jQuery("#layout").css({	overflow: "auto", position:"absolute", margin:"2%", display: "visible", opacity: 0.25, left: "10%", width:"90%", height: "100%"}).animate({opacity: 1}, 200);

	this.initParams();

	polla='(pedo:0.1,(hola:0.2,adios:0.3):0.4):0.5';
	element.setData(polla);

	element.initParams();
	polla='(pedos:0.3,(hola:0.2,adiss:0.3):0.4):0.5';
	element.setData(polla);

	submit_download_form("png");
};


/**
 * Add mouse event
 */
phyloElement.prototype.initParams = function () {

	jQuery("#layout").empty();

	this.r = 960 / 2;

	this.wrap = d3.select("#layout")
			.append("svg")
			.attr("width", element.r * 2)
			.attr("height", element.r * 2)
			.style("-webkit-backface-visibility", "hidden");

	this.cluster = d3.layout.cluster()
		.size([360, 1])
	    	.sort(null)
	    	.value(function(d) 	{ 
						return d.length; 
					})
	    	.children(function(d) 	{ 
						return d.branchset; 
					})
	    	.separation(function(a, b) 	{ 
						return 1; 
					});

	// Catch mouse events in Safari.
	this.wrap.append("rect")
		.attr("width", element.r * 2)
		.attr("height", element.r * 2)
		.attr("fill", "none")

	this.layout = this.wrap.append("g")
		.attr("transform", "translate(" + element.r + "," + element.r + ")");

	this.start = null,
	this.rotate = 0,
	this.div = document.getElementById("layout");

	this.wrap.on("mousedown", function() {
		element.wrap.style("cursor", "move");
		element.start = mouse(d3.event);
		d3.event.preventDefault();

		d3.select(window)
			.on("mouseup", function() {
				if (element.start) {
					element.wrap.style("cursor", "auto");
					var m = mouse(d3.event);
					var delta = Math.atan2(cross(element.start, m), dot(element.start, m)) * 180 / Math.PI;
					element.rotate += delta;
					if (element.rotate > 360) {
						element.rotate %= 360;
					}
					else if (element.rotate < 0) {
						element.rotate = (360 + element.rotate) % 360;
					}
					element.start = null;
					element.wrap.style("-webkit-transform", null);
					element.layout	.attr("transform", "translate(" + element.r + "," + element.r + ")rotate(" + element.rotate + ")")
							.selectAll("text")
							.attr("text-anchor", 	function(d) { 
											return (d.x + element.rotate) % 360 < 180 ? "start" : "end"; 
										})
							.attr("transform", 	function(d) {
											return "rotate(" + (d.x - 90) + ")translate(" + (element.r - 170 + 8) + ")rotate(" + ((d.x + element.rotate) % 360 < 180 ? 0 : 180) + ")";
										});
				}
			})
			.on("mousemove", function() {
				if (element.start) {
					var m = mouse(d3.event);
					var delta = Math.atan2(cross(element.start, m), dot(element.start, m)) * 180 / Math.PI;
					element.wrap.style("-webkit-transform", "rotateZ(" + delta + "deg)");
				}
			});

		/*d3.select(window).on("click", function(){
			  var html = d3.select("#layout svg")
				.attr("version", 1.1)
				.attr("xmlns", "http://www.w3.org/2000/svg")
				.node().parentNode.innerHTML;
			 
			  //console.log(html);
			  var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
			  var img = '<img src="'+imgsrc+'">'; 
			  d3.select("#svgdataurl").html(img);
			 
			 
			  var canvas = document.querySelector("canvas"),
				  context = canvas.getContext("2d");
			 
			  var image = new Image;
			  image.src = imgsrc;
			  image.onload = function() {
				  context.drawImage(image, 0, 0);
			 
				  var canvasdata = canvas.toDataURL("image/png");
			 
				  var pngimg = '<img src="'+canvasdata+'">'; 
			  	  d3.select("#pngdataurl").html(pngimg);
			 
				  var a = document.createElement("a");
				  a.download = "phylotree.png";
				  a.href = canvasdata;
				  a.click();
			  };
			 
			});*/

	});


}

/**
 * Change Data and Plot it
 */
phyloElement.prototype.setData = function (data) {

	element.data = data;
	var x = newick.parse(element.data);

	var nodes = element.cluster.nodes(x);
	phylo(nodes[0], 0);

	var link = element.layout.selectAll("path.link")
			.data(element.cluster.links(nodes))
			.enter().append("path")
			.attr("class", "link")
			.attr("d", step);

	var node = element.layout.selectAll("g.node")
			.data(nodes.filter(function(n) { return n.x !== undefined; }))
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

	node.append("circle")
			.attr("r", 2.5);

	var label = element.layout.selectAll("text")
			.data(nodes.filter(function(d) { return d.x !== undefined && !d.children; }))
			.enter().append("text")
			.attr("dy", ".31em")
			.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
			.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (element.r - 170 + 8) + ")rotate(" + (d.x < 180 ? 0 : 180) + ")"; })
			.text(function(d) { return d.name.replace(/_/g, ' '); });
}

/**
 * Layout position calculation
 */
function step(d) {
	var s = project(d.source);
	var m = project({x: d.target.x, y: d.source.y});
	var t = project(d.target);
	var r = d.source.y;
	var sweep = d.target.x > d.source.x ? 1 : 0;
	return (
	"M" + s[0] + "," + s[1] +
	"A" + r + "," + r + " 0 0," + sweep + " " + m[0] + "," + m[1] +
	"L" + t[0] + "," + t[1]);
}

/**
 * Process mouse event
 */
function mouse(e) {
	return [
		e.pageX - element.div.offsetLeft - element.r,
		e.pageY - element.div.offsetTop -  element.r
	];
}

/**
 * Process phylogenetic tree
 */
function phylo(n, offset) {
	if (n.length != null) offset += n.length * 115;
	n.y = offset;
	if (n.children)
		n.children.forEach(function(n) {
		phylo(n, offset);
	});
}

/**
 * Process mouse event
 */
function project(d) {
	var r = d.y, a = (d.x - 90) / 180 * Math.PI;
	return [r * Math.cos(a), r * Math.sin(a)];
}

/**
 * Cross calculation
 */
function cross(a, b) { 
	return a[0] * b[1] - a[1] * b[0]; 
}

/**
 * Dot calculation
 */
function dot(a, b) { 
	return a[0] * b[0] + a[1] * b[1]; 
}


/*
   Utility function: populates the <FORM> with the SVG data
   and the requested output format, and submits the form.
*/
function submit_download_form(output_format)
{


}

