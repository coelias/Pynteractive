from pynteractive.visNetwork import *
import random

class Graph(VisNetwork):
	def __init__(self,name=None,directed=False):
		'''Creates a graph, It can be directed or not, if a name is not given it is created randomly'''
		VisNetwork.__init__(self,name,directed)

	def refresh(self):
		'''DO NOT USE, is used for graphic representation, everytime a new window is opened'''
		for i in self.vertices.values():
			self.update("addNode",i["_id"],i["_label"],i["_title"],i["_group"],i["_color"],i["_radius"],i["_image"])
		for i,j in self.edges.items():
			self.update("addEdge",i,j["_n1"],j["_n2"],j["_label"],j["_title"],j["_width"],j["_style"])

	def random(self,nn,ne):
		map(self.addNode,xrange(nn))
		for i in xrange(ne):
			self.addEdge(random.choice(xrange(nn)),random.choice(xrange(nn)))

	def fromCsv(self,fil,matrix=False,distances=False):
		csv=self.readCsv(fil)
		if not matrix:
			for i in csv:
				for j in i:
					if j not in self.vertices: self.addNode(j)
				for j in i[1:]:
					if not (i[0],j) in self.edges:
						self.addEdge(i[0],j)
		else:
			cols=csv[0][1:]
			rows=[i[0] for i in csv[1:]]
			if cols!=rows: raise Exception("Rows andColumns do not match")
			for i in rows:
				if i not in self.vertices: self.addNode(i)
			csv=[i[1:] for i in csv][1:]
			for i in range(len(rows)):
				for j in range(len(rows)):
					if csv[i][j]!='0':
						self.addEdge(rows[i],rows[j])

	def doubleClick(self,node):
		pass
	def action1(self,node):
		pass
	def action2(self,node):
		pass
	def action3(self,node):
		pass
