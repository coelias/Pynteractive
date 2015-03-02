////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////    User Interface CONTROLLER (UIC)    ///////////
////////////////////////////////////////////////////////////
var UIC = {
addNode: function (id, label, title, group, shape, color, radius, image){
			var n = {"id":id, "label":label, "shape":shape};
			if (shape) n.shape=shape;
			if (title) n.title=title;
			if (group) n.group=group;
			if (color) n.color=color;
			if (radius) n.radius=radius;
			if (image) n.image=image;
			graphicElement.nodesMap.add(n);
		},

addEdge: function (id, id1, id2, label, title, threshold, style, length){
			var e = {"id":id,"from":id1,"to":id2, "style": style};
			if (label) e.label=label;
			if (title) e.title=title;
			if (threshold) e.value=threshold;
			if (length) e.length=length;
			graphicElement.edgesMap.add(e);

			from = graphicElement.nodesMap.get(id2);
			if (from.radius == undefined) from.radius = 10;
			from.radius = from.radius + 1;
			graphicElement.nodesMap.update(from);
		},

removeNode: function (id){
			var n = {"id":id};
			graphicElement.nodesMap.remove(n);
		},

removeEdge: function (id){
			var e = {"id":id};
			graphicElement.edgesMap.remove(e);
		},

close: function(){
			close();
		}
}
