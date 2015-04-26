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
	this.selectionList=new Set();
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

	//tag = {tag:'button', to:'#optionsNetwork', id: 'filterDataChart', text: "Apply", type: 'button', onclick: 'element.test();'};
	//this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'label', to:'#optionsNetwork', id: 'labelRadius', text: 'Radius'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'sliderRadius', type: 'range', value: this.resolution, min: '960', max: '4096', step: '8', onclick: 'element.changeResolution(value)'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelLabel', text: 'Circular Labels'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'enableCircularLabel', type: 'checkbox', checked: this.circularLabel, onclick: 'element.changeCircularLabel();'};
	this.loadHtmlTag(tag);

};

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


/**
 * Load graph on layout div html page
 */
phyloElement.prototype.load = function () {

	jQuery("#layout").css({	overflow: "auto", position:"absolute", margin:"2%", display: "visible", opacity: 0.25, left: "5%", width:"90%", height: "100%", top:"-90px"}).animate({opacity: 1}, 200);

	//jQuery("#layout").css({	overflow: "auto", display: "visible", opacity: 0.25,}).animate({opacity: 1}, 200);

	//element.data='(pedo:2.7,(hola:0.2,adios:0.3)xx:0.4)yy';
	element.data='(((C00013668:0.0200182,C00007015:0.0220409)NODE_190:0.00856891,(C00021950:0.0238916,((C00009163:0.0156627,(((C00013626:0.00259308,(C00013595:0.0015185,C00006931:0.00123818)NODE_137:0.000690636)NODE_140:0.0028012,((C00006969:0.00143007,C00009199:0.00087918)NODE_135:0.00126966,(C00009170:0.00196387,((C00014192:9.66646e-05,C00013583:9.85869e-05)NODE_131:0.000655322,C00013607:0.00056376)NODE_132:0.000150794)NODE_133:0.00283277)NODE_141:0.00279092)NODE_150:0.00919383,((C00013519:0.0135703,((C00022033:0.000926954,C00014047:0.00112213)NODE_124:0.0104627,((C00016224:0.00176877,(C00021968:1.34271e-05,C00022430:8.91532e-06)NODE_118:0.00183295)NODE_122:0.00950266,((C00016043:0.00299107,C00021957:0.000625594)NODE_116:0.0128256,(C00022045:0.00225069,C00006938:0.00074407)NODE_120:0.00880707)NODE_139:0.00135574)NODE_144:0.00136589)NODE_147:0.00135026)NODE_155:0.00138134,C00013524:0.0152565)NODE_163:0.00692784)NODE_181:0.00480618)NODE_184:0.005463,(((C00007008:0.0108292,(C00013683:0.0029895,C00007365:0.00500258)NODE_145:0.0106199)NODE_180:0.00357155,C00013577:0.018499)NODE_182:0.00247264,((((C00021951:0.00746714,C00009168:0.00814276)NODE_136:0.00372732,C00016269:0.00899772)NODE_148:0.00147605,C00009196:0.0134793)NODE_158:0.00181372,(C00009143:0.00564249,(C00016258:0.00808216,(C00006944:0.00384318,(C00013546:0.00262197,(C00007390:0.00262504,C00006992:6.94289e-05)NODE_104:0.0169365)NODE_126:0.000957401)NODE_129:0.00596412)NODE_146:0.00141686)NODE_152:0.00302828)NODE_167:0.0118485)NODE_185:0.0044989)NODE_187:0.00449335)NODE_192:0.00779634)NODE_195:0.0165403,((((((C00013558:0.00215076,C00006955:0.000487693)NODE_162:0.00265713,(C00009217:0.00170793,((C00021941:0.000373286,C00013705:0.00203895)NODE_143:0.00451925,C00007368:0.000200126)NODE_164:0.000489067)NODE_166:0.00145192)NODE_173:0.0174856,(C00013526:0.00368028,(C00006926:0.000438544,(C00016190:0.00277492,(C00013528:0.000148374,C00006951:0.000601414)NODE_157:0.000492247)NODE_159:0.000296605)NODE_161:0.00303159)NODE_174:0.0172411)NODE_188:0.00863795,(((C00013638:0.00193712,((((C00014012:0.000777901,((C00009209:2.34575e-06,C00009188:1.59517e-05)NODE_154:2.17399e-05,C00013538:2.52916e-05)NODE_156:0.000669994)NODE_160:0.00110059,C00007006:5.47711e-05)NODE_165:0.00170099,C00009138:0.00033151)NODE_171:0.00101079,(C00006960:7.70513e-05,C00006996:9.67693e-05)NODE_170:0.00106186)NODE_176:0.000522704)NODE_177:0.00781932,(C00021977:1.53881e-05,C00009223:2.05624e-05)NODE_169:0.00971551)NODE_183:0.00963861,(C00013575:0.0018964,(C00014000:0.00242115,C00016242:0.000947123)NODE_168:0.00116792)NODE_172:0.0189196)NODE_191:0.00725046)NODE_194:0.0037125,C00022032:0.0288006)NODE_196:0.0137329,((((C00007000:0.00755258,C00007014:0.00833354)NODE_117:0.00278846,(((C00006946:3.3965e-05,(C00013629:5.47988e-05,(C00007384:1.05535e-05,C00017491:2.16505e-05)NODE_107:1.84744e-05)NODE_108:9.89698e-05)NODE_110:0.000183617,C00006949:0.000426474)NODE_111:0.000149738,(C00021942:3.87261e-05,C00013518:3.36135e-05)NODE_106:0.000531516)NODE_112:0.0113067)NODE_121:0.0116621,(C00007007:0.0144542,(((C00006977:0.000866244,(C00013564:0.000346253,C00013628:0.000373244)NODE_105:0.00124826)NODE_114:0.0145454,(((C00014206:2.34575e-06,C00013649:2.34575e-06)NODE_101:2.651e-05,(C00013534:2.63791e-05,C00013541:4.13599e-05)NODE_102:2.34575e-06)NODE_103:0.015635,(C00014210:0.00427389,(C00014053:0.00299993,(C00013624:0.00143969,C00013527:0.000588223)NODE_109:0.000602857)NODE_113:0.00145988)NODE_115:0.0100177)NODE_123:0.00318915)NODE_128:0.00132984,((C00013520:0.0152359,C00013704:0.0108983)NODE_119:0.00434032,(C00013550:0.0108147,C00013566:0.0124793)NODE_125:0.00262977)NODE_127:0.00159667)NODE_130:0.00175214)NODE_134:0.00497345)NODE_151:0.0408193,((C00013648:8.55659e-05,C00014001:9.06567e-05)NODE_153:0.0255061,(((C00014212:0.00142568,(C00007388:0.00219735,C00011461:5.22634e-05)NODE_138:0.00058923)NODE_142:0.0204224,(C00013679:0.0110575,C00009142:0.0151766)NODE_179:0.008813)NODE_186:0.00469327,(C00022427:0.00647219,(C00013673:0.00462104,(C00006930:0.00149785,C00007387:0.00581852)NODE_149:0.00513806)NODE_175:0.0031115)NODE_178:0.0143091)NODE_189:0.00353713)NODE_193:0.0149798)NODE_197:0.00715202)NODE_198:0.000235764);'
	if(!jQuery.isEmptyObject(element.data)){
		element.initParams();
		element.setData(element.data);
		element.drawData();
//		element.refreshSelection();
	}

	//submit_download_form("png");
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

/*phyloElement.prototype.test = function (){
	//newick.normalize(element.data);
	var x = newick.parse(element.data);

	element.normalize(x.branchset,0,x.length);
}*/

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

	if(tree.length == undefined){
		tree.length = 0;
	}
	tree.length = (tree.length)*(element.maxrange/element.maxpath);

	//caso base
	if(tree.branchset == undefined){
		return 0;
	}

	//caso recursivo
	var treeBranch = tree.branchset;
	var size = treeBranch.length;
	for(var i = 0; i<size; i++){
		//tree[i].length = (tree[i].length-element.minpath)/(element.maxpath-element.minpath);
		//tree[i].length = (tree[i].length)/(element.maxpath); GOOD

		//treeBranch[i].length = (treeBranch[i].length)*(element.maxrange/element.maxpath);
		//treeBranch[i].length = (treeBranch[i].length)/(element.maxrange/element.maxpath);
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
