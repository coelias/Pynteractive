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

addEdge: function (id, id1, id2, label, title, threshold, style, length, color, width){
			 var e = {"id":id,"from":id1,"to":id2, "style": style};
			 if (label) e.label=label;
			 if (title) e.title=title;
			 if (threshold) e.value=threshold;
			 if (length) e.length=length;
			 if (color) e.color=color;
			 if (width) e.width=width;

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

				element.updateNode(n);
			},

updateEdge: function (id, id1, id2, label, title, threshold, style, length, color, width){
				var e = {"id":id};
				if (id1) e.id1=id1;
				if (id2) e.id2=id2;
				if (label) e.label=label;
				if (title) e.title=title;
				if (threshold) e.value=threshold;
				if (style) e.style=style;
				if (length) e.length=length;
				if (color) e.color=color;
				if (width) e.width=width;

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

setData: function(data){
			 element.initParams();
			 element.setData(data);
			 element.repaint()
		 },

selectNewickNodes: function(data){
					   element.selectNodes(data);
				   },

clearNewickSelection: function(data){
						  element.clearSelection();
					  },

addPhyloFeat: function(fid,shape,color,desc){
				  element.addFeature(fid,shape,color,desc);
			  },

addPhyloTipFeat: function(tid,fid){
					 element.addSampleFeature(tid,fid);
				 },
delPhyloTipFeat: function(tid,fid){
					 element.delSampleFeature(tid,fid);
				 },

addTreeTrack: function() {
				  element.addTrack()
			  },
addTreeTrackFeature: function(trackn,tipname,color,title,gradient) {
						 element.addTrackFeature(trackn,tipname,color,title,gradient)
					 },
delTreeTrackFeature: function(trackn,tipname) {
						 element.delTrackFeature(trackn,tipname)
					 },

addTreeTrackBar: function(value,normValue,tipname,color,barn,totbar) {
					 element.addTrackBar(value,normValue,tipname,color,barn,totbar)
				 },
delTreeTrackBar: function(tipname,barn) {
					 element.delTrackBar(tipname,barn)
				 },
clearTracks: function() {
				 element.clearTracks()
			 },
deleteTracks: function() {
				  element.deleteTracks()
			  },
deleteBars: function() {
				element.deleteTrackBars()
			},

markClade: function(tipname,color)
		   {
			   element.markClade(tipname,color)
		   },

unMarkClade: function(tipname)
			 {
				 element.unMarkClade(tipname)
			 },

setCladeColor: function(tipname,color)
			   {
				   element.setCladeColor(tipname,color)
			   },
clearCladeColor: function(tipname)
				 {
					 element.clearCladeColor(tipname)
				 }


}
