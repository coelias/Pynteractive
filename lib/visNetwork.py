from lib.datastruct import *
import random

class VisNetwork(DataStruct):
	def __init__(self,name=None,directed=False):
		'''Creates a graph, It can be directed or not, if a name is not given it is created randomly'''
		DataStruct.__init__(self,name)

		self.vertices={}
		self.edges={}
		self.directed=directed

	def addNode(self,node_id=None,label=None,title=None,group=None,shape=None,color=None,radius=None,image=None):
		'''Adds a node to the graph:
		node_id: identification of the node, if not specified it will be randomly generated
		label: Text that will be shown within the node
		title: Tooltip shown when hovering the node
		group: color group (numeric, eg: 1,2,3,4) used for clusterings
		shape: any of ellipse,circle,box,database,image,circularImage,label,dot,star,triangle,triangleDown,square
		color: color name or html code (eg: red, #FF0000)
		radius: radius of the shape
		image: Image in case the shape is image or circularImage'''

		assert not shape or shape in ['ellipse','circle','box','database','image','circularImage','label','dot','star','triangle','triangleDown','square']
		if shape in ['image','circularImage']: assert image!=None

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
		self.vertices[node_id]={"_id":node_id,"_label":label,"_title":title,"_group":group,"_color":color,"_radius":radius,"_image":image}

		self.update("addNode",node_id,label,title,group,shape,color,radius,image)
		return node_id

	def addEdge(self,n1,n2,label=None,title=None,width=None,style=None,length=None):
		'''Adds an edge to a node, if it is not directed the order does not matter
		label: label on the edge
		title: text shown when hovering the edge
		width: width in pixeld of the edge
		style: line style -> line,arrow,arrow-center,dash-line
		length: length of the edge'''

		assert not style or style in ['line','arrow','arrow-center','dash-line']
		if not self.directed: assert style not in ['arrow','arrow-center']
		n1,n2=str(n1),str(n2)
		assert n1 in self.vertices and n2 in self.vertices

		if not label: label=''

		if self.directed:
			style='arrow'
		else:
			style='line'
			if n1>n2:n1,n2=n2,n1

		_id="~".join([n1,n2,label])
		self.edges[_id]={"_n1":n1,"_n2":n2,"_label":label,"_title":title,"_threshold":width,"_style":style,"_length":length}
		self.update("addEdge",_id,n1,n2,label,title,width,style,length)
		return _id
