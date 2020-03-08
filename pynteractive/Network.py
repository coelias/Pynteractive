from pynteractive.datastruct import *

class Network(DataStruct):
	'''This class implements basic methods and datastructures to represent a Newtork. IT is used for either 
	Graphs or trees'''

	def __init__(self,name=None,directed=False):
		'''Creates a graph, It can be directed or not, if a name is not given it is created randomly'''
		DataStruct.__init__(self,name)

		self.vertices={}
		self.edges={}
		self.directed=directed

	def addNode(self,node_id=None,label=None,**kwargs):
		'''Ads a node into the network, you can specify a cwnode_id and a label, if no node_id is specified, it will be randomly generated (autoincremental id)
		and if label is None it will get the same value as the node_id

		Random parameters can be assigned to the node via \\*\\*kargs.

		It returns the tuple *node_id,label*.
		'''

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
		data.update(dict([["_"+i,j] for i,j in list(kwargs.items())]))

		self.vertices[node_id]=data
		return node_id,label

	def updateNode(self,node_id,**kwargs):
		'''Updates parameters related to node *node_id* updating those parameters specified via \\*\\*kwargs'''
		assert node_id in self.vertices
		data=self.vertices[node_id]
		data.update(dict([["_"+i,j] for i,j in list(kwargs.items()) if j]))


	def addEdge(self,n1,n2,label,**kwargs):
		'''Adds an edge from node n1 to  node n2, if it is not directed the order does not matter. The edge id will be a combination of n1,n2 and label (eg: addEdge('node1','node2','connection_node1_node2') --> edge_id = 'node1~node2~connection_node1_node2')'''
		n1,n2=str(n1),str(n2)
		assert n1 in self.vertices and n2 in self.vertices

		if not self.directed:
			if n1>n2:n1,n2=n2,n1

		_id="~".join([n1,n2,label])

		data={"_n1":n1,"_n2":n2,"_label":label}
		data.update(dict([["_"+i,j] for i,j in list(kwargs.items())]))
		self.edges[_id]=data
		return _id,label

	def delNode(self,node_id):
		'''Deletes a node from the network as well as the edges'''
		node_id=str(node_id)
		assert node_id in self.vertices 
		edges=[name for name,i in list(self.edges.items()) if node_id in [i['_n1'],i['_n2']]]
		for i in edges:
			del self.edges[i]
		del self.vertices[node_id]
		return [node_id,edges]

	def delEdge(self,_id):
		'''Deletes a connection between two given nodes'''
		assert _id in self.edges
		del self.edges[_id]
		return _id

	def getEdges(self):
		'''Returns the edges of the Network --> ([edge_ids])'''
		return list(self.edges.keys())

	def getNodes(self):
		'''Returns the nodes of the Network --> ([node_ids])'''
		return list(self.vertices.keys())
