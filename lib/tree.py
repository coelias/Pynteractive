from lib.visNetwork import *
import os
import re

class Tree(VisNetwork):
	releaf=re.compile("([^:]+)?(:[0-9.]+)?")
	def __init__(self,name=None,directed=None):
		self.nodenames=set()
		VisNetwork.__init__(self,name,True)
		self.root=None

	def getName(self,name):
		if not name in self.nodenames:
			self.nodenames.add(name)
			return name
		k=1
		newname=name+"#{0}".format(k)
		while newname in self.nodenames:
			k+=1
			newname=name+"#{0}".format(k)
		self.nodenames.add(newname)
		return newname


	class Node:
		def __init__(self,name=None,lgth=None):
			self.name=name
			self.length=lgth
			self.children=[]
	
		def append(self,x):
			self.children.append(x)

	def readNewick(self,newick):
		try:
			if os.path.isfile(newick):
				self.root,pos=self.parseTree(open(newick).read(),0)
			else:
				self.root,pos=self.parseTree(newick,0)
		except:
			raise Exception('Invalid format for Newick')

	def refresh(self):
		if self.root:
			top=[self.root]
			self.addNode("_root")
			if self.root.children:
				topname=self.addNode(self.root.name,label=' ',shape='dot',radius=0.01)
			else:
				topname=self.addNode(self.root.name,shape='dot')
			self.root.name=topname
			self.addEdge("_root",topname)
			while top:
				rt=top.pop(0)
				for i in rt.children:
					top.append(i)
					if i.children:
						newnodename=self.addNode(i.name,shape='dot',radius=0.01,label=' ')
					else:
						newnodename=self.addNode(i.name,shape='dot')
					i.name=newnodename
					self.addEdge(rt.name,newnodename,length=50)


	def parseTree(self,cad,pos):
		n=Tree.Node()
		assert cad[pos]=='('
		
		while True:
			if cad[pos]==')':
				if pos==len(cad)-1: break
				if cad[pos+1]==';': break
				if cad[pos+1] not in "),":
					name,lgth,pos=self.parseLeaf(cad,pos+1)
					n.name=name
					n.length=lgth
					return n,pos
				else: break
			elif cad[pos]==';': 
				break
	
			if cad[pos+1]!='(': 
				name,lgth,pos=self.parseLeaf(cad,pos+1)
				n.append(Tree.Node(name,lgth))
			else:
				nn,pos=self.parseTree(cad,pos+1)
				n.append(nn)
		return n,pos+1
	
	def parseLeaf(self,cad,pos):
		length=None
		name=None
		i=pos
		while i<=len(cad) and cad[i] not in ",);":
			i+=1
		items=Tree.releaf.findall(cad[pos:i])
		if not items: raise Exception("Tree wrongly constructed")
		if items[0][0]: name=self.getName(items[0][0])
		if items[0][1]: length=float(items[0][1][1:])
	
		return name,length,i


if __name__=='__main__':
	print "1"
	parseTree("(,,(,));",0)
	print "3"
	parseTree("(A,B,(C,D));",0)
	print "4"
	parseTree("(A,B,(C,D)E)F;",0)
	print "5"
	parseTree("(:0.1,:0.2,(:0.3,:0.4):0.5);",0)
	print "6"
	parseTree("(:0.1,:0.2,(:0.3,:0.4):0.5):0.0;",0)
	print "7"
	parseTree("(A:0.1,B:0.2,(C:0.3,D:0.4):0.5);",0)
	print "8"
	parseTree("(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F;",0)
	print "9"
	parseTree("((B:0.2,(C:0.3,D:0.4)E:0.5)F:0.1)A;",0)

