function phyloElement() {
	this.r;
	this.cluster;
	this.data;
	this.wrap;
	this.start;
	this.rotate;
	this.div;
	this.radius = 100;
   	this.minrange = 0.007;  
   	this.maxrange = 1;
	this.maxpath = 0;
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

	tag = {tag:'button', to:'#optionsNetwork', id: 'filterDataChart', text: "Apply", type: 'button', onclick: 'element.test();'};
	this.loadHtmlTag(tag);

};


/**
 * Load graph on layout div html page
 */
phyloElement.prototype.load = function () {

	jQuery("#layout").css({	overflow: "auto", position:"absolute", margin:"2%", display: "visible", opacity: 0.25, left: "10%", width:"90%", height: "100%"}).animate({opacity: 1}, 200);

	polla='(pedo:0.1,(hola:0.2,adios:0.3)xx:0.4)yy:0.5';
	//this.initParams();
	//element.setData(polla);*/

	//polla='(((C00005743:4.55552e-06,C00008301:2.65737e-06)NODE_194:0.00435055,((C00001508:1.09357e-05,(C00004405:7.21354e-06,(C00005012:1.13898e-05,(C00007805:2.65754e-06,(C00004992:5.31512e-06,C00004984:4.55582e-06)NODE_190:1e-07)NODE_191:1.13897e-06)NODE_192:1e-07)NODE_193:9.79498e-07)NODE_195:0.00236006,((C00005792:7.59293e-07,((C00005868:2.27778e-06,(C00005765:1.13894e-06,C00004811:1.51858e-06)NODE_172:7.59292e-07)NODE_173:3.79645e-07,((C00005840:1e-07,C00005831:1e-07)NODE_170:7.59295e-07,((C00005766:1e-07,C00000052:1e-07)NODE_161:3.79645e-07,(C00000154:1e-07,(C00005801:1e-07,(C00005805:1e-07,(C00005782:3.79638e-07,(C00005763:7.59291e-07,(C00005816:1e-07,(C00005865:1e-07,(C00004876:1e-07,C00006372:1e-07)NODE_162:1e-07)NODE_163:1e-07)NODE_164:1e-07)NODE_165:1e-07)NODE_166:1e-07)NODE_167:1e-07)NODE_168:1e-07)NODE_169:1e-07)NODE_171:1.13894e-06)NODE_174:3.79642e-07)NODE_175:1e-07)NODE_176:0.00229934,(C00005739:0.00110922,((((((C00005934:7.97285e-06,C00005965:4.55581e-06)NODE_123:1e-07,(C00005993:1.13897e-06,(C00001462:1.51862e-06,(C00004888:7.59314e-07,C00009925:1e-07)NODE_120:1e-07)NODE_121:1e-07)NODE_122:7.21353e-06)NODE_124:0.00052385,(C00002888:1.21492e-05,(C00008097:7.21356e-06,((C00001464:3.79653e-06,C00002886:2.27785e-06)NODE_141:4.17618e-06,(C00002826:1.17695e-05,(C00002509:2.65755e-06,C00008284:2.65755e-06)NODE_140:7.59322e-06)NODE_142:1e-07)NODE_143:1e-07)NODE_144:1e-07)NODE_145:0.000683383)NODE_178:8.92519e-05,((C00002881:7.59304e-07,(C00002818:1e-07,(C00000498:3.79651e-07,C00000504:1e-07)NODE_115:1e-07)NODE_116:1.13897e-06)NODE_117:0.000838029,(C00008104:3.79652e-06,C00004352:5.31512e-06)NODE_127:0.00076656)NODE_181:0.000151713)NODE_183:5.13889e-05,(((C00004354:2.65754e-06,C00004359:3.41686e-06)NODE_155:2.65754e-06,(C00004330:3.79655e-07,(C00008047:6.07442e-06,C00004207:3.03722e-06)NODE_154:1e-07)NODE_156:1e-07)NODE_157:8.41747e-06,((C00005725:4.17618e-06,(C00005736:8.73223e-06,(C00004181:2.65756e-06,C00000564:1.13898e-06)NODE_119:9.17618e-06)NODE_133:1e-07)NODE_134:1.06235e-05,((C00000217:1.89829e-06,C00008299:3.03724e-06)NODE_150:4.55584e-06,((C00010630:2.65755e-06,((C00005970:3.41687e-06,(C00006409:3.79655e-07,C00006414:1e-07)NODE_135:1e-07)NODE_136:3.41687e-06,(C00006412:1.8983e-06,C00006306:1.8983e-06)NODE_137:3.03722e-06)NODE_138:7.59315e-07)NODE_139:2.38306e-06,(C00006255:1.89828e-06,(C00008320:1e-07,C00005964:3.79656e-07)NODE_148:1.8983e-06)NODE_149:7.59324e-06)NODE_151:1e-07)NODE_152:3.68995e-06)NODE_153:1.48527e-06)NODE_158:0.000788024)NODE_186:8.38653e-05,(((C00008287:0.000982518,(C00000521:0.000438605,C00004392:0.000539553)NODE_159:0.000245243)NODE_180:0.000152472,((C00004346:1.3401e-05,(C00008308:3.7965e-06,(C00004322:6.0744e-06,C00004324:3.41685e-06)NODE_113:1e-07)NODE_114:4.7646e-05)NODE_147:0.000850367,((C00008279:1.02506e-05,C00006419:6.4541e-06)NODE_126:0.000956074,(C00002475:1e-07,C00002474:1e-07)NODE_128:0.000799849)NODE_179:0.00011546)NODE_182:4.29127e-05)NODE_185:4.40792e-05,((C00008143:9.26462e-05,(C00008001:1.51864e-05,(C00005005:1.36678e-05,(C00004385:4.93547e-06,(C00004370:1.51862e-06,C00008136:2.27785e-06)NODE_129:5.69478e-06)NODE_130:1.36678e-05)NODE_131:1.51863e-06)NODE_132:0.000111917)NODE_177:0.000152659,(C00004172:0.000757308,(C00002877:2.7446e-05,((C00008290:5.69484e-06,(C00001558:3.79657e-06,(C00001567:1.8983e-06,(C00008258:1.51864e-06,(C00002876:1.8983e-06,C00008142:3.03726e-06)NODE_108:1.13899e-06)NODE_109:3.79661e-07)NODE_110:1e-07)NODE_111:3.03726e-06)NODE_112:0.000101975,(C00004138:3.14339e-05,(C00000041:9.49153e-06,((C00002745:2.27785e-06,C00008121:1.51864e-06)NODE_104:1e-07,(C00002758:1.51863e-06,(C00002771:2.27785e-06,C00006233:2.27785e-06)NODE_103:1.51862e-06)NODE_105:1e-07)NODE_106:6.45424e-06)NODE_107:1.42856e-05)NODE_118:6.30206e-07)NODE_125:1.16126e-05)NODE_146:0.000277109)NODE_160:0.000307995)NODE_184:5.81746e-05)NODE_187:6.31626e-05)NODE_188:0.000146871)NODE_189:0.000738761)NODE_196:0.00164399)NODE_197:0.000774253)NODE_198:1e-07,(C00003949:3.7967e-07,(C00003942:3.79669e-07,C00001518:3.79672e-07)NODE_101:1e-07)NODE_102:0.0210353)NODE_199:0.0';

	//polla='(B:0.1,(C:0.2,D:0.3)E:0.4)F:0.5';
	//polla='(:0.1,:0.2,(:0.3,:0.4):0.5):0.0;';
	//polla='(((Taxon 1:0.112641, (Taxon 5:0.051682, Taxon 6:0.051682)noname4:0.060959)noname3:0.013183, Taxon 3:0.125824)noname2:0.008005, (Taxon 2:0.119994, Taxon 4:0.119994)noname1:0.013835)';

	element.initParams();
	element.setData(polla);

	submit_download_form("png");
};


/**
 * Add mouse event
 */
phyloElement.prototype.initParams = function () {

	jQuery("#layout").empty();

	this.r = 660 / 2;

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

		//d3.select("#save").on("click", function(){
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

				  //save and serve it as an actual filename
			    	  binaryblob();

				  var a = document.createElement("a");
				  a.download = "sample.png";
				  a.href = canvas.toDataURL("image/png");

				   var pngimg = '<img src="'+a.href+'">'; 
			  	   d3.select("#pngdataurl").html(pngimg);

				  a.click();
				};

			});*/



		/*d3.select(window).on("click", function(){
			var html = d3.select("#layout svg")
				.attr("title", "test")
				.attr("version", 1.1)
				.attr("xmlns", "http://www.w3.org/2000/svg")

				/*"<style type=\"text/css\" >
				      <![CDATA[

					.node circle {
					  fill: #fff;
					  stroke: steelblue;
					  stroke-width: 1.5px;
					}

					.node, text {
					  font: 10px sans-serif;
					}

					.link {
					  fill: none;
					  stroke: #ccc;
					  stroke-width: 1.5px;
					}

					text {
					  fill: #000;
					}

				      ]]>
				</style>"*/
				/*svg = jQuery(html)[0][0];
				jQuery(svg).append("<style></style>")

				.node().parentNode.innerHTML;



			d3.select("body").append("div")
				.attr("id", "download")
				.append("img")
				.attr("src", "data:image/svg+xml;base64,"+ btoa(html));
			});*/

	});

}

phyloElement.prototype.test = function (){
	//newick.normalize(element.data);
	var x = newick.parse(element.data);

	element.normalize(x.branchset,0,x.length);
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

	element.data = data;
	//newick.normalize(element.data);
	var x = newick.parse(element.data);
	console.log(x)
	element.normalize(x.branchset,0,x.length);
	element.parsenormalize(x.branchset);

	console.log(x)

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
/*console.log("hio")
var html = d3.select("#layout svg")
        .attr("title", "test")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

d3.select("body").append("div")
        .attr("id", "download")
        .append("img")
        .attr("src", "data:image/svg+xml;base64,"+ btoa(html));*/

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
	    //normalize with value
	    //norm = (element.maxrange-element.minrange)/(max-min)*(Number(token)-max)+element.maxrange
	    //norm = (element.maxrange-element.minrange)/(element.maxpath)*(Number(token)-element.maxpath)+element.maxrange
	    norm = token
            tree.length = norm;
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
		return 0;
	}
	if(tree.branchset == 'undefined'){
		return 0;
	}

	//caso recursivo

	var size = tree.length;
	for(var i = 0; i<size; i++){
		var sum = Number(length)+Number(tree[i].length);
		if(sum > element.maxpath) element.maxpath = sum;

		//element.normalize(tree[i].branchset,sum);
		element.normalize(tree[i].branchset,depth+1,sum);
	}
}

/**
 * 
 */
phyloElement.prototype.parsenormalize = function (tree) {

	//caso base
	if(tree == undefined){
		return 0;
	}
	if(tree.branchset == 'undefined'){
		return 0;
	}

	//caso recursivo
	var size = tree.length;
	for(var i = 0; i<size; i++){

		tree[i].length = (tree[i].length-element.minrange)/(element.maxpath-element.minrange);

		element.normalize(tree[i].branchset);
	}
}

