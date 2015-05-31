function graphD3Element() {
	this.tension = 0.50;
	this.data;
};

graphD3Element.prototype = new element();
graphD3Element.prototype.constructor = graphD3Element;

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////    FUNCTIONS    ///////////////////////
////////////////////////////////////////////////////////////

/**
 * Load html page
 */
graphD3Element.prototype.loadHtml = function () {
	
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

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelTension', text: 'Tension'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'sliderTension', type:"range", min:"0", max:"100", value:"85"};
	this.loadHtmlTag(tag);

};


/**
 * Load graph on layout div html page
 */
graphD3Element.prototype.load = function () {
	
	//element.setData();

	if(!jQuery.isEmptyObject(element.data)){
		element.initParams();
		element.setData(element.data);
		element.repaint();
	}
};

/**
 * Repaint widgets
 */
graphD3Element.prototype.repaintEnd = function (){	
	element.drawData();
};

/**
 * Change Data and Plot it
 */
graphD3Element.prototype.setData = function (data) {
	element.data = data;

	//element.data = JSON.parse('[{"name":"father.Carlos del Ojo","imports":["father.Gay","mother.Huevos"]},{"name":"father.Gay","imports":["mother.Huevos"]},{"name":"mother.Huevos","imports":["father.Carlos del Ojo"]}]');
	element.data = JSON.parse('[{"imports": ["bioinf.Hang_Phang", "bioinf.Nicholas_Sanderson"], "name": "boss.Sarah_Walker"}, {"imports": ["boss.Sarah_Walker"], "name": "boss.Tim_Peto"}, {"imports": ["doc.Ana_Gibertoni"], "name": "boss.Derrick_Crook"}, {"imports": ["boss.Sarah_Walker", "bioinf.Anna_Sheppard", "boss.Derrick_Crook", "evol.Jane_CharlesWorth"], "name": "boss.Helen_Barker"}, {"imports": ["IT.Laura_Madrid", "bioinf.Hang_Phang", "IT.William_Sayers", "doc.Kyle_Knox", "bioinf.Dilrini_De_Silva", "bioinf.Hang_Phang", "doc.Kyle_Knox", "IT.William_Sayers"], "name": "evol.Danny_Wilson"}, {"imports": ["bioinf.Carlos_del_Ojo", "IT.Milind_Acharya", "bioinf.Vasiliki_Kostiou", "evol.Jane_CharlesWorth", "bioinf.Dilrini_De_Silva", "IT.John_Finney"], "name": "evol.Nicola_Di_Maio"}, {"imports": ["evol.Jane_CharlesWorth", "evol.Jane_CharlesWorth", "stat.Amy_Mason", "IT.William_Sayers", "doc.Bernardette_Young"], "name": "evol.Jess_Hedge"}, {"imports": ["doc.Nicola_Fawcett", "boss.Tim_Peto", "evol.Nicola_Di_Maio", "evol.Jess_Hedge", "boss.Tim_Peto", "doc.Tim_Walker"], "name": "evol.Sarah_Earle"}, {"imports": ["bioinf.Anna_Sheppard"], "name": "evol.Jane_CharlesWorth"}, {"imports": ["boss.Sarah_Walker", "stat.Phuong_Quan"], "name": "IT.Milind_Acharya"}, {"imports": ["stat.Phuong_Quan"], "name": "IT.Oriol_Mazariegos"}, {"imports": ["evol.Danny_Wilson", "boss.Sarah_Walker"], "name": "IT.John_Finney"}, {"imports": ["doc.Nicole_Stoesser", "stat.Phuong_Quan", "bioinf.Carlos_del_Ojo", "stat.Amy_Mason", "lab.Luke_Anson", "IT.Milind_Acharya", "bioinf.Nicholas_Sanderson", "bioinf.Vasiliki_Kostiou"], "name": "IT.William_Sayers"}, {"imports": ["doc.Nicole_Stoesser", "doc.Kyle_Knox", "stat.Tjibbe_Donker", "IT.Laura_Madrid", "bioinf.Tanya_Golubchik", "boss.Helen_Barker", "stat.Tjibbe_Donker", "evol.Jess_Hedge"], "name": "IT.Peter_Welch"}, {"imports": ["evol.Jane_CharlesWorth", "doc.Bernardette_Young", "boss.Sarah_Walker", "boss.Tim_Peto", "bioinf.Dilrini_De_Silva", "lab.Luke_Anson", "IT.Oriol_Mazariegos", "lab.Louise_Pankhurst"], "name": "IT.Laura_Madrid"}, {"imports": ["res.Rosalind_Harding", "bioinf.Carlos_del_Ojo", "doc.Nicola_Gordon", "lab.Luke_Anson", "doc.Nicole_Stoesser", "stat.Amy_Mason", "bioinf.Carlos_del_Ojo", "doc.Bernardette_Young"], "name": "bioinf.Dilrini_De_Silva"}, {"imports": ["IT.Milind_Acharya"], "name": "bioinf.Vasiliki_Kostiou"}, {"imports": ["IT.William_Sayers", "lab.Louise_Pankhurst", "lab.Tonya_Votintseva", "doc.Nicole_Stoesser", "evol.Sarah_Earle"], "name": "bioinf.Nicholas_Sanderson"}, {"imports": ["bioinf.Dilrini_De_Silva", "res.Jessie_Wu", "doc.Ana_Gibertoni", "stat.Phuong_Quan", "evol.Sarah_Earle", "evol.Jane_CharlesWorth", "doc.Bernardette_Young"], "name": "bioinf.Tanya_Golubchik"}, {"imports": ["bioinf.Nicholas_Sanderson", "bioinf.Hang_Phang", "bioinf.Tanya_Golubchik", "lab.Ali_Vaunghan"], "name": "bioinf.Carlos_del_Ojo"}, {"imports": ["doc.Nicola_Fawcett", "boss.Derrick_Crook", "doc.Bernardette_Young", "res.Jessie_Wu", "doc.John_Wrightson", "boss.Helen_Barker", "stat.Amy_Mason", "lab.Tonya_Votintseva"], "name": "bioinf.Hang_Phang"}, {"imports": ["evol.Danny_Wilson", "doc.Nicole_Stoesser"], "name": "bioinf.Anna_Sheppard"}, {"imports": ["res.Rosalind_Harding", "bioinf.Tanya_Golubchik", "doc.Nicola_Gordon"], "name": "doc.Nicole_Stoesser"}, {"imports": ["doc.Tim_Walker", "res.Teresa_Street", "IT.John_Finney", "IT.Oriol_Mazariegos", "stat.Tjibbe_Donker", "evol.Jane_CharlesWorth"], "name": "doc.Nicola_Fawcett"}, {"imports": ["boss.Tim_Peto", "IT.Milind_Acharya", "stat.Phuong_Quan", "bioinf.Hang_Phang"], "name": "doc.Tim_Walker"}, {"imports": ["doc.Tim_Walker", "doc.Bernardette_Young", "doc.Nicola_Fawcett"], "name": "doc.Nicola_Gordon"}, {"imports": ["doc.Tim_Walker", "stat.Tjibbe_Donker", "doc.John_Wrightson", "IT.Milind_Acharya"], "name": "doc.Ana_Gibertoni"}, {"imports": ["evol.Danny_Wilson", "boss.Sarah_Walker", "stat.Amy_Mason"], "name": "doc.John_Wrightson"}, {"imports": ["boss.Helen_Barker", "IT.Peter_Welch", "lab.Ali_Vaunghan", "bioinf.Tanya_Golubchik"], "name": "doc.Bernardette_Young"}, {"imports": ["IT.Laura_Madrid", "IT.Milind_Acharya", "IT.Laura_Madrid", "res.Jessie_Wu", "IT.Peter_Welch", "bioinf.Tanya_Golubchik", "IT.William_Sayers"], "name": "doc.Kyle_Knox"}, {"imports": ["bioinf.Tanya_Golubchik", "IT.Peter_Welch", "lab.Louise_Pankhurst", "IT.Peter_Welch"], "name": "stat.Phuong_Quan"}, {"imports": ["doc.Nicole_Stoesser", "lab.Tonya_Votintseva", "bioinf.Dilrini_De_Silva", "bioinf.Nicholas_Sanderson"], "name": "stat.Amy_Mason"}, {"imports": ["evol.Jess_Hedge", "doc.Tim_Walker", "boss.Derrick_Crook"], "name": "stat.Tjibbe_Donker"}, {"imports": ["doc.Nicola_Gordon", "doc.Tim_Walker", "IT.Laura_Madrid", "IT.Oriol_Mazariegos", "boss.Derrick_Crook", "IT.William_Sayers", "IT.Laura_Madrid", "bioinf.Anna_Sheppard"], "name": "lab.Tonya_Votintseva"}, {"imports": ["boss.Sarah_Walker", "IT.Peter_Welch", "res.Rosalind_Harding", "res.Rosalind_Harding", "evol.Nicola_Di_Maio", "boss.Helen_Barker", "bioinf.Anna_Sheppard"], "name": "lab.Louise_Pankhurst"}, {"imports": ["doc.Nicola_Fawcett", "bioinf.Tanya_Golubchik", "res.Rosalind_Harding", "doc.Tim_Walker", "lab.Luke_Anson", "doc.Nicola_Fawcett"], "name": "lab.Ali_Vaunghan"}, {"imports": ["IT.Laura_Madrid", "bioinf.Vasiliki_Kostiou", "stat.Tjibbe_Donker", "doc.Nicola_Fawcett"], "name": "lab.Luke_Anson"}, {"imports": ["evol.Sarah_Earle", "lab.Ali_Vaunghan", "evol.Jess_Hedge", "evol.Danny_Wilson", "doc.Nicole_Stoesser", "lab.Louise_Pankhurst", "doc.Kyle_Knox"], "name": "res.Rosalind_Harding"}, {"imports": ["bioinf.Dilrini_De_Silva", "bioinf.Tanya_Golubchik", "bioinf.Nicholas_Sanderson"], "name": "res.Teresa_Street"}, {"imports": ["stat.Phuong_Quan", "res.Teresa_Street", "stat.Phuong_Quan", "bioinf.Dilrini_De_Silva", "bioinf.Tanya_Golubchik", "lab.Luke_Anson", "doc.Tim_Walker", "IT.Milind_Acharya"], "name": "res.Jessie_Wu"}]');
}

/**
 * 
 */
graphD3Element.prototype.initParams = function () {

}

graphD3Element.prototype.drawData = function () {

jQuery("#layout").empty();

var w = 1280,
    h = 800,
    rx = w / 2,
    ry = h / 2,
    m0,
    rotate = 0;

var splines = [];

var cluster = d3.layout.cluster()
    .size([360, ry - 120])
    .sort(function(a, b) { return d3.ascending(a.key, b.key); });

var bundle = d3.layout.bundle();

var line = d3.svg.line.radial()
    .interpolate("bundle")
    .tension(element.tension)
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

// Chrome 15 bug: <http://code.google.com/p/chromium/issues/detail?id=98951>
var div = d3.select("#layout").insert("div", "h2")
    .style("top", "50px")
    .style("left", "160px")
    .style("width", w + "px")
    .style("height", w + "px")
    .style("position", "absolute")
    .style("-webkit-backface-visibility", "hidden");

var svg = div.append("svg:svg")
    .attr("width", w)
    .attr("height", w)
  .append("svg:g")
    .attr("transform", "translate(" + rx + "," + ry + ")");

svg.append("svg:path")
    .attr("class", "arc")
    .attr("d", d3.svg.arc().outerRadius(ry - 120).innerRadius(0).startAngle(0).endAngle(2 * Math.PI))
    .on("mousedown", mousedown);


  classes = element.data;

  var nodes = cluster.nodes(packages.root(classes)),
      links = packages.imports(nodes),
      splines = bundle(links);

  var path = svg.selectAll("path.link")
      .data(links)
      .enter().append("svg:path")
      .attr("class", function(d) { return "link source-" + d.source.key + " target-" + d.target.key; })
      .attr("d", function(d, i) { return line(splines[i]); });

  svg.selectAll("g.node")
      .data(nodes.filter(function(n) { return !n.children; }))
    .enter().append("svg:g")
      .attr("class", "node")
      .attr("id", function(d) { return "node-" + d.key; })
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
    .append("svg:text")
      .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
      .text(function(d) { return d.key.replace(/_/g,' '); })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

  //d3.select("input[type=range]").on("change", function() {
  d3.select("#sliderTension").on("change", function() {
    line.tension(this.value / 100);
    path.attr("d", function(d, i) { return line(splines[i]); });
  });

d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);

function mouse(e) {
  return [e.pageX - rx, e.pageY - ry];
}

function mousedown() {
  m0 = mouse(d3.event);
  d3.event.preventDefault();
}

function mousemove() {
  if (m0) {
    var m1 = mouse(d3.event),
        dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;
    div.style("-webkit-transform", "translateY(" + (ry - rx) + "px)rotateZ(" + dm + "deg)translateY(" + (rx - ry) + "px)");
  }
}

function mouseup() {
  if (m0) {
    var m1 = mouse(d3.event),
        dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;

    rotate += dm;
    if (rotate > 360) rotate -= 360;
    else if (rotate < 0) rotate += 360;
    m0 = null;

    div.style("-webkit-transform", null);

    svg
        .attr("transform", "translate(" + rx + "," + ry + ")rotate(" + rotate + ")")
      .selectAll("g.node text")
        .attr("dx", function(d) { return (d.x + rotate) % 360 < 180 ? 8 : -8; })
        .attr("text-anchor", function(d) { return (d.x + rotate) % 360 < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return (d.x + rotate) % 360 < 180 ? null : "rotate(180)"; });
  }
}

function mouseover(d) {
  svg.selectAll("path.link.target-" + d.key)
      .classed("target", true)
      .each(updateNodes("source", true));

  svg.selectAll("path.link.source-" + d.key)
      .classed("source", true)
      .each(updateNodes("target", true));
}

function mouseout(d) {
  svg.selectAll("path.link.source-" + d.key)
      .classed("source", false)
      .each(updateNodes("target", false));

  svg.selectAll("path.link.target-" + d.key)
      .classed("target", false)
      .each(updateNodes("source", false));
}

function updateNodes(name, value) {
  return function(d) {
    if (value) this.parentNode.appendChild(this);
    svg.select("#node-" + d[name].key).classed(name, value);
  };
}

function cross(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

};
