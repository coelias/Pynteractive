
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////    User Interface CONTROLLER (UIC)    ///////////
////////////////////////////////////////////////////////////
var UIC = {
addNode: function (id, label, title, group, shape, color, radius,image){
			var n = {"id":id, "label":label};
			if (shape) n.shape=shape;
			if (title) n.title=title;
			if (group) n.group=group;
			if (color) n.color=color;
			if (radius) n.radius=radius;
			if (image) n.image=image;
			nodesMap.add(n);
		},

addEdge: function (id, id1, id2, label, title, threshold, style){
			var e = {"id":id,"from":id1,"to":id2, "style": style};
			if (label) e.label=label;
			if (title) e.title=title;
			if (threshold) e.value=threshold;
			edgesMap.add(e);
		},

removeNode: function (id){
			var n = {"id":id};
			nodesMap.remove(n);
		},

removeEdge: function (id){
			var e = {"id":id};
			edgesMap.remove(e);
		},

close: function(){
			close();
		}
}
