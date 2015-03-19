function chartElement() {
	this.data;
	this.ex;
};

chartElement.prototype = new element();
chartElement.prototype.constructor = chartElement;

/**
 * Redraw widgets
 */
chartElement.prototype.browserResizeEnd = function (){

};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////    FUNCTIONS    ///////////////////////
////////////////////////////////////////////////////////////

/**
 * Load html page
 */
chartElement.prototype.loadHtml = function () {
	
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

	//create Layouts
	tag = {tag:'hr', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id:'labelChart1', text:'Stacked/Grouped Multi-Bar Chart'};
	this.loadHtmlTag(tag);
	tag = {tag:'input', to:'#optionsNetwork', id: 'labelChartRadio1', name: 'charts', type: 'radio', value: '0', onclick: 'element.changeLayoutType(id);', checked: false};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id:'labelChart2', text:'Scatter / Bubble Chart'};
	this.loadHtmlTag(tag);
	tag = {tag:'input', to:'#optionsNetwork', id: 'labelChartRadio2', name: 'charts', type: 'radio', value: '0', onclick: 'element.changeLayoutType(id);', checked: false};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id:'labelChart3', text:'Line Chart with View Finder'};
	this.loadHtmlTag(tag);
	tag = {tag:'input', to:'#optionsNetwork', id: 'labelChartRadio3', name: 'charts', type: 'radio', value: '0', onclick: 'element.changeLayoutType(id);', checked: false};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id:'labelChart4', text:'Stacked Area Chart'};
	this.loadHtmlTag(tag);
	tag = {tag:'input', to:'#optionsNetwork', id: 'labelChartRadio4', name: 'charts', type: 'radio', value: '0', onclick: 'element.changeLayoutType(id);', checked: false};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id:'labelChart5', text:'Pie Chart'};
	this.loadHtmlTag(tag);
	tag = {tag:'input', to:'#optionsNetwork', id: 'labelChartRadio5', name: 'charts', type: 'radio', value: '0', onclick: 'element.changeLayoutType(id);', checked: false};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id:'labelChartAll', text:'All Charts'};
	this.loadHtmlTag(tag);
	tag = {tag:'input', to:'#optionsNetwork', id: 'labelChartRadioAll', name: 'charts', type: 'radio', value: '0', onclick: 'element.changeLayoutType(id);', checked: true};
	this.loadHtmlTag(tag);

};

/**
 * Change layout type
 * @param {Number} id 
 */
chartElement.prototype.changeLayoutType = function (id){

	if(id=='labelChartRadioAll'){

		//jQuery("#charts").attr("style", "display:visible");
		jQuery("#charts").css({opacity: 0.25, display: "visible"}).animate({opacity: 1}, 200);

		jQuery("#chartlayout1").css({opacity: 0.25, display: "visible", margin: "0%", width:"33%", height: "50%"}).animate({opacity: 1}, 200);
		jQuery("#chartlayout2").css({opacity: 0.25, display: "visible", margin: "0%", width:"33%", height: "50%"}).animate({opacity: 1}, 200);
		jQuery("#chartlayout3").css({opacity: 0.25, display: "visible", margin: "0%", width:"33%", height: "50%"}).animate({opacity: 1}, 200);
		jQuery("#chartlayout4").css({opacity: 0.25, display: "visible", margin: "0%", width:"33%", height: "50%"}).animate({opacity: 1}, 200);
		jQuery("#chartlayout5").css({opacity: 0.25, display: "visible", margin: "0%", width:"33%", height: "50%"}).animate({opacity: 1}, 200);

		/*jQuery("#layout1").css({opacity: 0.25,top: "0%", width:"100%", height: "100%"}).animate({opacity: 1}, 200);
		jQuery("#layout2").css({opacity: 0.25,top: "0%", width:"100%", height: "100%"}).animate({opacity: 1}, 200);
		jQuery("#layout3").css({opacity: 0.25,top: "0%", width:"100%", height: "100%"}).animate({opacity: 1}, 200);
		jQuery("#layout4").css({opacity: 0.25,top: "50%", width:"100%", height: "100%"}).animate({opacity: 1}, 200);
		jQuery("#layout5").css({opacity: 0.25,top: "50%", width:"100%", height: "100%"}).animate({opacity: 1}, 200);*/

		this.loadCharts();
	}else{
		jQuery("#chartlayout1").css({opacity: 0.25, display: "none"}).animate({opacity: 0}, 200);
		jQuery("#chartlayout2").css({opacity: 0.25, display: "none"}).animate({opacity: 0}, 200);
		jQuery("#chartlayout3").css({opacity: 0.25, display: "none"}).animate({opacity: 0}, 200);
		jQuery("#chartlayout4").css({opacity: 0.25, display: "none"}).animate({opacity: 0}, 200);
		jQuery("#chartlayout5").css({opacity: 0.25, display: "none"}).animate({opacity: 0}, 200);

		/*jQuery("#layout1").css({opacity: 0.25,width:"0%", height: "0%"});
		jQuery("#layout2").css({opacity: 0.25,width:"0%", height: "0%"});
		jQuery("#layout3").css({opacity: 0.25,width:"0%", height: "0%"});
		jQuery("#layout4").css({opacity: 0.25,width:"0%", height: "0%"});
		jQuery("#layout5").css({opacity: 0.25,width:"0%", height: "0%"});*/
		jQuery("#layout"+id.slice(-1)).css({opacity: 0.25,top: "0%", left: "0%", width:"100%", height: "100%"}).animate({opacity: 1}, 200);

		jQuery("#chartlayout"+id.slice(-1)).css({display: "visible", opacity: 0.25, margin: "5%", width:"75%", height: "75%"}).animate({opacity: 1}, 200);
		
		this.loadChart(id.slice(-1));
	}
};

/**
 * Load graph on layout div html page
 */
chartElement.prototype.loadChart = function (id) {

	switch(id) {
		case "1":
			var char = element.data1(id,this.data);
			break;
		case "2":
			var char = element.data2(id,this.data);
			break;
		case "3":
			var char = element.data3(id,this.data);
			break;
		case "4":
			var char = element.data4(id,this.data);
			break;
		case "5":
			var char = element.data5(id,this.data);
			break;
	}

};

/**
 * Load graph on layout div html page
 */
chartElement.prototype.load = function () {

	//Get data
    	//data = [{"key": "key1", "values": [{"x": '1', "y": '2', "shape": "circle", "size":"0.5"}, {"x": '2', "y": '1', "shape": "circle", "size":"0.5"},{"x": '3', "y": '1', "shape": "circle", "size":"0.5"}]},{"key": "key2", "values": [{"x": '1', "y": '2', "shape": "circle", "size":"0.5"}, {"x": '2', "y": '2', "shape": "circle", "size":"0.5"}, {"x": '3', "y": '2', "shape": "circle", "size":"0.5"}]}]; 
    	this.data = []; 

	var serie1 = {"key": "key1", "values": [{"x": '1', "y": '2', "shape": "circle", "size":"0.5"}, {"x": '2', "y": '1', "shape": "circle", "size":"0.5"},{"x": '3', "y": '1', "shape": "circle", "size":"0.5"}]};
	this.addChartData(serie1);
	//var serie2 = {"key": "key2", "values": [{"x": '1', "y": '2', "shape": "circle", "size":"0.5"}, {"x": '2', "y": '2', "shape": "circle", "size":"0.5"}, {"x": '3', "y": '2', "shape": "circle", "size":"0.5"}]};
	var serie2 = {"key": "key2", "values": [{"x": '1', "y": '2', "shape": "circle", "size":"0.5"}, {"x": '2', "y": '2', "shape": "circle", "size":"0.5"}]};
	serie2Data = {"x": '3', "y": '2', "shape": "circle", "size":"0.5"};

	this.addChartData(serie2);
	this.addSerieData("key2",serie2Data);
	this.addSerieData("key2",serie2Data);

	this.removeSerieData("key2",4);

	//this.removeData("key2");
	this.loadCharts();

};

/**
 * Load graph on layout div html page
 */
chartElement.prototype.loadCharts = function () {

	jQuery("#charts").css({opacity: 0.25, display: "visible"}).animate({opacity: 1}, 200);

	var char1 = element.data1(1,this.data);
	var char2 = element.data2(2,this.data);
	var char3 = element.data3(3,this.data);
	var char4 = element.data4(4,this.data);
	var char5 = element.data5(5,this.data);

};

/**
 * Set layout Stacked Area Chart
 */
chartElement.prototype.data1 = function(id,data) {
	var chart = nv.models.multiBarChart()
		//.transitionDuration(350)
		.reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
		.rotateLabels(0)      //Angle to rotate x-axis labels.
		.showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
		.groupSpacing(0.1);    //Distance between each group of bars.

	chart.xAxis
		.tickFormat(d3.format(',f'));

	chart.yAxis
		.tickFormat(d3.format(',.1f'));

	d3.select("#layout"+id)
		//.append("svg:svg")
		.datum(data)
		.transition()
		.duration(500)
		.call(chart);

	nv.utils.windowResize(chart.update);

	return chart;
};

/**
 * Set layout Scatter / Bubble Chart
 */
chartElement.prototype.data2 = function(id,data) {
	var chart = nv.models.scatterChart()
		.showDistX(true)    //showDist, when true, will display those little distribution lines on the axis.
		.showDistY(true)
		//.transitionDuration(350)
                //.width("25%")
                //.height("35%")
		.color(d3.scale.category10().range());

	//Configure how the tooltip looks.
	chart.tooltipContent(function(key) {
		return '<h3>' + key + '</h3>';
	});

	//Axis settings
	chart.xAxis.tickFormat(d3.format('.02f'));
	chart.yAxis.tickFormat(d3.format('.02f'));

	//var svg = d3.select("#chartlayout"+id+" svg")
	var svg = d3.select("#layout"+id)
		//.append("svg:svg")
		.datum(data)
		//.transition()
		//.duration(500)
		//.attr("width", "500px")
      		//.attr("height", "500px")
		.call(chart);

	nv.utils.windowResize(chart.update);

	return chart;
};


/**
 * Set layout Line Chart with View Finder 
 */
chartElement.prototype.data3 = function(id, data) {
	var chart = nv.models.lineWithFocusChart();

	chart.xAxis
		.tickFormat(d3.format(',f'));

	chart.yAxis
		.tickFormat(d3.format(',.2f'));

	chart.y2Axis
		.tickFormat(d3.format(',.2f'));

	d3.select("#layout"+id)
		//.append("svg:svg")
		.datum(data)
		.transition()
		.duration(500)
		.call(chart);

	nv.utils.windowResize(chart.update);

	return chart;
};

/**
 * Set layout Stacked/Grouped Multi-Bar Chart
 */
chartElement.prototype.data4 = function(id,data) {
	var chart = nv.models.stackedAreaChart()
		.margin({right: 100})
		//.x(function(d) { return d[0] })   //We can modify the data accessor functions...
		//.y(function(d) { return d[1] })   //...in case your data is formatted differently.
		.useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
		.rightAlignYAxis(true)      //Let's move the y-axis to the right side.
		.showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
		.clipEdge(true);

	//Format x-axis labels with custom function.
	//chart.xAxis
	//     .tickFormat(function(d) { 
	//      return d3.time.format('%x')(new Date(d)) 
	// });

	chart.yAxis.tickFormat(d3.format(',.2f'));

	var svg = d3.select("#layout"+id)
		//.append("svg:svg")
		.datum(data)
		.call(chart);

	nv.utils.windowResize(chart.update);

	return chart;
};

/**
 * Set layout Pie Chart
 */
chartElement.prototype.data5 = function(id,data) {

	var chart = nv.models.pieChart()
		//.x(function(d) { return d.label })
		//.y(function(d) { return d.value })
		.showLabels(true);

	var dataAux = [];
	//extract series
	for (var i in data) {
		for (var j in data) {

			dataAux.push(data[i].values[j]);
		}
	}

	d3.select("#layout"+id)
		//.append("svg:svg")
		.datum(dataAux)
		.transition()
		.duration(350)
		.call(chart);

	nv.utils.windowResize(chart.update);

	return chart;
};

/**
 * add data for chart
 */
chartElement.prototype.addChartData = function (data){
	this.data.push(data);
}

/**
 * remove data for chart
 */
chartElement.prototype.removeChartData = function (id){
	var data = this.data;
	jQuery.each(data, function(i, val) {
		if(val.key == id)
		{
			delete data[i];
			data.length = data.length-1;
		}
	});

}

/**
 * add data in a serie for chart
 */
chartElement.prototype.addSerieData = function (id,dataSerie){
	var data = this.data;
	jQuery.each(data, function(i, val) {
		if(val.key == id)
		{
			data[i].values.push(dataSerie);
		}
	});
}

/**
 * remove data in a serie for chart
 */
chartElement.prototype.removeSerieData = function (id,indexData){
	var data = this.data;
	jQuery.each(data, function(i, val) {
		if(val.key == id)
		{
			delete data[i].values[indexData-1];
			data[i].values.length = data[i].values.length-1;
		}
	});

}

