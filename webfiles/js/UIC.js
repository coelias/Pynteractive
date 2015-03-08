////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////    User Interface CONTROLLER (UIC)    ///////////
////////////////////////////////////////////////////////////
var UIC = {
addNode: function (id, label, title, group, shape, color, radius, image, level){
			var n = {"id":id, "label":label, "shape":shape};
			if (shape) n.shape=shape;
			if (title) n.title=title;
			if (group) n.group=group;
			if (color) n.color=color;
			if (radius) n.radius=radius;
			if (image) n.image=image;
			if (level) n.level=level;
			element.nodesMap.add(n);
		},

addEdge: function (id, id1, id2, label, title, threshold, style, length){
			var e = {"id":id,"from":id1,"to":id2, "style": style};
			if (label) e.label=label;
			if (title) e.title=title;
			if (threshold) e.value=threshold;
			if (length) e.length=length;
			element.edgesMap.add(e);

			from = element.nodesMap.get(id2);
			if (from.radius == undefined) from.radius = 10;
			from.radius = from.radius + 1;
			element.nodesMap.update(from);
		},

removeNode: function (id){
			var n = {"id":id};
			element.nodesMap.remove(n);
		},

removeEdge: function (id){
			var e = {"id":id};
			element.edgesMap.remove(e);
		},

close: function(){
			close();
		}
}
