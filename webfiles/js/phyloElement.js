function phyloElement() {
	this.r;
	this.cluster;
	this.data;
	this.wrap;
	this.start;
	this.rotate;
	this.div;
	this.radius = 115;
   	this.minrange = 0.01;  
   	this.maxrange = 2.7;
	this.maxpath = 0;
	this.minpath = 1000;
	this.tree;
	this.resolution = 960;
	this.circularLabel = false;
	this.treeNodes=[];
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

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'label', to:'#optionsNetwork', id: 'labelRadius', text: 'Radius'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'sliderRadius', type: 'range', value: this.resolution, min: '960', max: '8192', step: '8', onclick: 'element.changeResolution(value)'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelLabel', text: 'Circular Labels'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'enableCircularLabel', type: 'checkbox', checked: this.circularLabel, onclick: 'element.changeCircularLabel();'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'hr', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

};

/**
 * Load graph on layout div html page
 */
phyloElement.prototype.load = function () {
	jQuery("#layout").css({	overflow: "auto", position:"absolute", margin:"2%", display: "visible", opacity: 0.25, left: "5%", width:"90%", height: "100%", top:"-90px"}).animate({opacity: 1}, 200);

	if(!jQuery.isEmptyObject(element.data)){
		element.initParams();
		element.setData(element.data);
		element.repaint();
	}
};

/**
 * Repaint widgets
 */
treeD3Element.prototype.repaintEnd = function (){	
	element.drawData();
};

/**
 * Add mouse event
 */
phyloElement.prototype.initParams = function () {

	jQuery("#layout").empty();

	this.r = element.resolution / 2;

	var width = element.r * 2;
	var height = element.r * 2;

    var viewerWidth = $(document).width();
    var viewerHeight = $(document).height();

    /*var w = element.r * 2;
    var h = element.r * 2;*/
    var w = element.r * 2;
    var h = element.r * 2;

    var div = d3.select("#layout");//.insert("div", "h2")
    //.style("top", ((viewerHeight)/2)+"px")
    //.style("left", ((viewerWidth)/2)+"px")
    //.style("width", width)
    //.style("height", height)
    //.style("position", "absolute")
    //.style("-webkit-backface-visibility", "hidden");

	this.wrap = div
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.style("-webkit-backface-visibility", "hidden");

	/*this.wrap = d3.select("#layout")
			.append("svg")
			.attr("width", element.r * 2)
			.attr("height", element.r * 2)
			.style("-webkit-backface-visibility", "hidden");*/

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
		.attr("width", w)
		.attr("height", h)
		.attr("fill", "none")

	this.layout = this.wrap.append("g")
		.attr("transform", "translate(" + w/2 + "," + h/2 + ")");

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
											if(element.circularLabel == true){
												return "rotate(" + (d.x - 90) + ")translate(" + (element.r - 170 + 8) + ")rotate(" + ((d.x + element.rotate) % 360 < 180 ? 0 : 180) + ")";
											}else{
												return "rotate(" + (d.x - 90) + ")translate(" + (d.y+15) + ")rotate(" + ((d.x + element.rotate) % 360 < 180 ? 0 : 180) + ")";
											}
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
	});

}

function binaryblob(){
	var byteString = atob(document.querySelector("canvas").toDataURL().replace(/^data:image\/(png|jpg);base64,/, "")); //wtf is atob?? https://developer.mozilla.org/en-US/docs/Web/API/Window.atob
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var dataView = new DataView(ab);
	var blob = new Blob([dataView], {type: "image/png"});
	var DOMURL = self.URL || self.webkitURL || self;
	var newurl = DOMURL.createObjectURL(blob);

	var img = '<img src="'+newurl+'">'; 
  d3.select("#img").html(img);
}

/**
 * Change Data and Plot it
 */


phyloElement.prototype.setData = function (data) {

	//debugger;
	element.data = data;
	element.tree = newick.parse(element.data);
}


phyloElement.prototype.drawData = function () {
	if(element.tree.length == undefined){
		element.tree.length = 0;
	}

	this.maxpath = 0;
	element.normalize(element.tree.branchset,0,element.tree.length);

	element.parsenormalize(element.tree);

	element.treeNodes = element.cluster.nodes(element.tree);
	phylo(element.treeNodes[0], 0);

	var link = element.layout.selectAll("path.link")
			.data(element.cluster.links(element.treeNodes))
			.enter().append("path")
			.attr("class", "link")
			.attr("d", step);

	var node = element.layout.selectAll("g.node")
			.data(element.treeNodes.filter(function(n) { return n.x !== undefined; }))
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) { d.circle=this; return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
			.on("click",function(d){PYCON.send('treeNodeClick',{node:d.name}); if (!d3.event.shiftKey){element.clearSelection();}; element.selectNode(d);})

	node.append("circle")
			.attr("r", 2.5);

	if(element.circularLabel == true){
		var label = element.layout.selectAll("text")
				.data(element.treeNodes.filter(function(d) { return d.x !== undefined && !d.children; }))
				.enter().append("text")
				.attr("dy", ".31em")
				.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
				.attr("transform", function(d) { d.label=this; return "rotate(" + (d.x - 90) + ")translate(" + (element.r - 170 + 8) + ")rotate(" + (d.x < 180 ? 0 : 180) + ")"; })
				.on("click",function(d){PYCON.send('treeNodeClick',{node:d.name}); if (!d3.event.shiftKey){element.clearSelection();}; element.selectNode(d)})
				.text(function(d) { return d.name.replace(/_/g, ' '); });
	}else{
		var label = element.layout.selectAll("text")
			.data(element.treeNodes.filter(function(d) { return d.x !== undefined && !d.children; }))
			.enter().append("text")
			.attr("dy", ".31em")
			.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
			.attr("transform", function(d) { d.label=this; return "rotate(" + (d.x - 90) + ")translate(" + (d.y+15) + ")rotate(" + (d.x < 180 ? 0 : 180) + ")";})
			.on("click",function(d){PYCON.send('treeNodeClick',{node:d.name}); if (!d3.event.shiftKey){element.clearSelection();}; element.selectNode(d)})
			.text(function(d) { return d.name.replace(/_/g, ' '); });
	}
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
	//if (n.length != null) offset += n.length * 115;
	if (n.length != null) offset += n.length * element.radius;
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

/**
 * Newick format parser in JavaScript.
 *
 * Copyright (c) Jason Davies 2010.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Example tree (from http://en.wikipedia.org/wiki/Newick_format):
 *
 * +--0.1--A
 * F-----0.2-----B            +-------0.3----C
 * +------------------0.5-----E
 *                            +---------0.4------D
 *
 * Newick format:
 * (A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F;
 *
 * Converted to JSON:
 * {
 *   name: "F",
 *   branchset: [
 *     {name: "A", length: 0.1},
 *     {name: "B", length: 0.2},
 *     {
 *       name: "E",
 *       length: 0.5,
 *       branchset: [
 *         {name: "C", length: 0.3},
 *         {name: "D", length: 0.4}
 *       ]
 *     }
 *   ]
 * }
 *
 * Converted to JSON, but with no names or lengths:
 * {
 *   branchset: [
 *     {}, {}, {
 *       branchset: [{}, {}]
 *     }
 *   ]
 * }
 */
(function(exports) {
    var min = 1000000;
    var max = 0;

  exports.parse = function(s) {
    var ancestors = [];
    var tree = {};
    var tokens = s.split(/\s*(;|\(|\)|,|:)\s*/);
    for (var i=0; i<tokens.length; i++) {
      var token = tokens[i];
      switch (token) {
        case '(': // new branchset
          var subtree = {};
          tree.branchset = [subtree];
          ancestors.push(tree);
          tree = subtree;
          break;
        case ',': // another branch
          var subtree = {};
          ancestors[ancestors.length-1].branchset.push(subtree);
          tree = subtree;
          break;
        case ')': // optional name next
          tree = ancestors.pop();
          break;
        case ':': // optional length next
          break;
        default:
          var x = tokens[i-1];
          if (x == ')' || x == '(' || x == ',') {
            tree.name = token;
          } else if (x == ':') {
	    norm = token
            tree.origlength=tree.length = norm;
          }
      }
    }
    return tree;
  };

  exports.normalize = function(s) {
    min = 1000000;
    max = 0;
    var ancestors = [];
    var tree = {};
    var tokens = s.split(/\s*(;|\(|\)|,|:)\s*/);
    for (var i=0; i<tokens.length; i++) {
      var token = tokens[i];
      switch (token) {
        case '(': // new branchset
          break;
        case ',': // another branch
          break;
        case ')': // optional name next
          break;
        case ':': // optional length next
          break;
        default:
          var x = tokens[i-1];
          if (x == ':') {
	    if(Number(token)<min) min=Number(token);
	    if(Number(token)>max) max=Number(token);
          }
      }
    }
    normvalue = max-min;
  };


})(
  // exports will be set in any commonjs platform; use it if it's available
  typeof exports !== "undefined" ?
  exports :
  // otherwise construct a name space.  outside the anonymous function,
  // "this" will always be "window" in a browser, even in strict mode.
  this.newick = {}
);


/**
 * 
 */
phyloElement.prototype.normalize = function (tree,depth,length) {

	//caso base
	if(tree == undefined){
		if(Number(length) < element.minpath) element.minpath = Number(length);
		return 0;
	}
	if(tree.branchset == 'undefined'){
		if(Number(length) < element.minpath) element.minpath = Number(length);
		return 0;
	}

	//caso recursivo
	var size = tree.length;
	for(var i = 0; i<size; i++){
		var sum = Number(length)+Number(tree[i].origlength);
		if(sum > element.maxpath) element.maxpath = sum;
		element.normalize(tree[i].branchset,depth+1,sum);
	}
}

/**
 * 
 */
phyloElement.prototype.parsenormalize = function (tree) {

	if(tree.origlength == undefined){
		tree.origlength = 0;
	}
	tree.length = (tree.origlength)*(element.maxrange/element.maxpath);

	//caso base
	if(tree.branchset == undefined){
		return 0;
	}

	//caso recursivo
	var treeBranch = tree.branchset;
	var size = treeBranch.length;
	for(var i = 0; i<size; i++){
		element.parsenormalize(treeBranch[i]);
	}
}

/**
 * 
 */
phyloElement.prototype.changeCircularLabel = function () {
	element.circularLabel = !element.circularLabel;
	element.initParams();
	element.drawData();
	element.refreshSelection();
}

/**
 * 
 */
phyloElement.prototype.changeResolution = function (value) {
	element.resolution = value;
	element.maxrange = 2.7+((value-960)*0.0043);
	element.initParams();
	element.drawData();
	element.refreshSelection();
}

/**
 * execute action
 */
phyloElement.prototype.action = function (e){
	var id = jQuery(e).attr("idaction");
	selectednodes=[];
	element.selectionList.forEach(function(d){selectednodes.push(d.name)})
	PYCON.send('performAction',{n:id,selectedNodes:selectednodes});
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////    SELECTIONS    //////////////////////
////////////////////////////////////////////////////////////

phyloElement.prototype.clearSelection = function() {
	element.selectionList.forEach(function(v){element.clearNodeSelection(v)});
}

phyloElement.prototype.clearNodeSelection = function (n){
	d3.select(n.circle).attr("class","node").select('circle').attr('r',"2.5");
	d3.select(n.label).attr("class",null);
	element.selectionList.delete(n);
}


phyloElement.prototype.selectNodes = function (nl){
	nl=new Set(nl);
	for (var i in this.treeNodes)
	{
		if (nl.has(this.treeNodes[i].name)){element.selectNode(this.treeNodes[i])}
	}
}


phyloElement.prototype.selectNode = function(n) {
	if (n.branchset)
	{
		for (var i in n.branchset)
		{
			element.selectNode(n.branchset[i])
		}
	}
	else
	{
		if (element.selectionList.has(n))
		{
			element.clearNodeSelection(n);
			return;
		}
		element.clearNodeSelection(n)
		d3.select(n.circle).attr("class","selectednode").select('circle').attr('r',"3.2");
		d3.select(n.label).attr("class","selectednode");
		element.selectionList.add(n);
	}
}

phyloElement.prototype.refreshSelection = function() {
	element.selectionList.forEach(function(v){
		d3.select(v.circle).attr("class","selectednode").select('circle').attr('r',"3.2");
		d3.select(v.label).attr("class","selectednode");
	});
}
