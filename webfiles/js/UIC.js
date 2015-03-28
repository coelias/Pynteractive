////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////    User Interface CONTROLLER (UIC)    ///////////
////////////////////////////////////////////////////////////
var UIC = {
addNode: function (id, label, title, group, shape, color, radius, image, lng, lat){
			var n = {"id":id, "label":label, "shape":shape};
			if (shape) n.shape=shape;
			if (title) n.title=title;
			if (group) n.group=group;
			if (color) n.color=color;
			if (radius) n.radius=radius;
			if (image) n.image=image;
			if (location) n.location={"lng":lng,"lat":lat};
			element.addNode(n);
		},

addEdge: function (id, id1, id2, label, title, threshold, style, length, color){
			var e = {"id":id,"from":id1,"to":id2, "style": style};
			if (label) e.label=label;
			if (title) e.title=title;
			if (threshold) e.value=threshold;
			if (length) e.length=length;
			if (color) e.color=color;
			element.addEdge(e);
		},

updateNode: function (id, label, title, group, shape, color, radius, image, lng, lat){

			var n = {"id":id};
			if (label) n.label=label;
			if (title) n.title=title;
			if (shape) n.shape=shape;
			if (group) n.group=group;
			if (color) n.color=color;
			if (radius) n.radius=radius;
			if (image) n.image=image;
			if (lng && lat) n.location={"lng":lng,"lat":lat};

			console.log(n);

			element.updateNode(n);
		},

updateEdge: function (id, id1, id2, label, title, threshold, style, length, color){
			var e = {"id":id};
			if (id1) e.id1=id1;
			if (id2) e.id2=id2;
			if (label) e.label=label;
			if (title) e.title=title;
			if (threshold) e.value=threshold;
			if (style) e.style=style;
			if (length) e.length=length;
			if (color) e.color=color;
			element.updateEdge(e);
		},


removeNode: function (id){
			var n = {"id":id};
			element.removeNode(n);
		},

removeEdge: function (id){
			var e = {"id":id};
			element.removeEdge(e);
		},

close: function(){
			close();
		},

searchNode: function(id){
			element.searchNodeById(id);
		},

clearLog: function(){
			element.clearLog();
		},

addLog: function(text){
			element.addLog(text);
		},

addAction: function(id,name){
			element.addAction(id,name);
		},

addChartData: function(data){
			console.log(data);
			element.addChartData(data);
		},

removeChartData: function(idSerie){
			element.removeChartData(idSerie);
		},

addSeriesData: function(idSerie,data){
			element.addSerieData(idSerie,data);
		},

removeSeriesData: function(idSerie,index){
			element.removeSerieData(idSerie,index);
		},

setChartType: function(type){
			element.changeLayoutType(type);
		},

setNetwick: function(data){
			element.setData(data);
		},

}




