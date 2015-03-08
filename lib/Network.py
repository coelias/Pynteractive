from lib.datastruct import *

class Network(DataStruct):
	def __init__(self,name=None,directed=False):
		'''Creates a graph, It can be directed or not, if a name is not given it is created randomly'''
		DataStruct.__init__(self,name)

		self.vertices={}
		self.edges={}
		self.directed=directed

	def addNode(self,node_id=None,label=None,**kwargs):
		if node_id==None:
			i=1
			while True:
				if str(i) not in self.vertices:
					node_id=i
					break
				i+=1
		node_id=str(node_id)
		if not label: label=node_id
		else: label=str(label)

		data={"_id":node_id,"_label":label}
		data.update(dict([["_"+i,j] for i,j in kwargs.items()]))

		self.vertices[node_id]=data
		return node_id,label

	def addEdge(self,n1,n2,label,**kwargs):
		'''Adds an edge from node n1 to  node n2, if it is not directed the order does not matter'''
		n1,n2=str(n1),str(n2)
		assert n1 in self.vertices and n2 in self.vertices

		if not self.directed:
			if n1>n2:n1,n2=n2,n1

		_id="~".join([n1,n2,label])

		data={"_n1":n1,"_n2":n2,"_label":label}
		data.update(dict([["_"+i,j] for i,j in kwargs.items()]))
		self.edges[_id]=data
		return _id,label

	def delNode(self,node_id):
		node_id=str(node_id)
		assert node_id in self.vertices 
		edges=[name for name,i in self.edges.items() if node_id in [i['_n1'],i['_n2']]]
		for i in edges:
			del self.edges[i]
		del self.vertices[node_id]
		return [node_id,edges]

	def delEdge(self,_id):
		assert _id in self.edges
		del self.edges[_id]
		return _id

	def getEdgesAndNodes(self):
		n,e=self.vertices.keys(),self.edges.keys()
		return n,e
