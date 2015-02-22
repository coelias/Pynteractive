
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////////    User Interface CONTROLLER (UIC)    ///////////
////////////////////////////////////////////////////////////
var UIC = {
addNode: function (id,label,title){
			 var n = {"id":id,"label":label, "title":title};
			 nodesMap.add(n);
		 },

addEdge: function (id1,id2, label, title){
			 var e = {"id":id1+":"+id2,"from":id1,"to":id2, "label": label, "title":title};
			 edgesMap.add(e);
		 },

removeNode: function (id){
				var n = {"id":id};
				nodesMap.remove(n);
			},

removeEdge: function (id1,id2){
				var e = {"id":id1+":"+id2};
				edgesMap.remove(e);
			},

close: function(){close();}
}
