
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////    User Interface CONTROLLER (UIC)    ///////////
////////////////////////////////////////////////////////////
var UIC = {
addNode: function (id, label, title, group){
			var n = {"id":id,"label":label};
			if (title) n.title=title;
			if (group) n.group=group;
			nodesMap.add(n);
		},

addEdge: function (id, id1, id2, label, title, threshold){
			if(id == null || id == undefined) id = id1+":"+id2;
			var e = {"id":id,"from":id1,"to":id2, "label": label};
			if (title) e.title=title;
			if (threshold) e.value=threshold;
			edgesMap.add(e);
		},

removeNode: function (id){
			var n = {"id":id};
			nodesMap.remove(n);
		},

removeEdge: function (id, id1, id2){
			if(id == null || id == undefined) id = id1+":"+id2;
			var e = {"id":id1+":"+id2};
			edgesMap.remove(e);
		},

close: function(){
			close();
		}
}
