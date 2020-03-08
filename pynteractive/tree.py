from pynteractive.Network import *
import os
import re

class Tree(Network):
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




	def _refresh(self):
		if self.root:
			top=[self.root]
			self.addNode("_root")
			if self.root.children:
				topname,toplabel=self.addNode(self.root.name,label=' ',shape='dot',radius=0.01)
			else:
				topname,toplabel=self.addNode(self.root.name,shape='dot')
			self.root.name=topname
			self.addEdge("_root",topname)
			while top:
				rt=top.pop(0)
				for i in rt.children:
					top.append(i)
					if i.children:
						newnodename,newlabel=self.addNode(i.name,shape='dot',radius=0.01,label=' ')
					else:
						newnodename,newlabel=self.addNode(i.name,shape='dot')
					i.name=newnodename
					self.addEdge(rt.name,newnodename,length=50)

	def readNewick(self,newick):
		try:
			if os.path.isfile(newick):
				self.root,pos=self._parseTree(open(newick).read(),0)
			else:
				self.root,pos=self._parseTree(newick,0)
		except:
			raise Exception('Invalid format for Newick')

	def _parseTree(self,cad,pos):
		n=Tree.Node()
		assert cad[pos]=='('
		
		while True:
			if cad[pos]==')':
				if pos==len(cad)-1: break
				if cad[pos+1]==';': break
				if cad[pos+1] not in "),":
					name,lgth,pos=self._parseLeaf(cad,pos+1)
					n.name=name
					n.length=lgth
					return n,pos
				else: break
			elif cad[pos]==';': 
				break
	
			if cad[pos+1]!='(': 
				name,lgth,pos=self._parseLeaf(cad,pos+1)
				n.append(Tree.Node(name,lgth))
			else:
				nn,pos=self._parseTree(cad,pos+1)
				n.append(nn)
		return n,pos+1
	
	def _parseLeaf(self,cad,pos):
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
	print("1")
	_parseTree("(,,(,));",0)
	print("3")
	_parseTree("(A,B,(C,D));",0)
	print("4")
	_parseTree("(A,B,(C,D)E)F;",0)
	print("5")
	_parseTree("(:0.1,:0.2,(:0.3,:0.4):0.5);",0)
	print("6")
	_parseTree("(:0.1,:0.2,(:0.3,:0.4):0.5):0.0;",0)
	print("7")
	_parseTree("(A:0.1,B:0.2,(C:0.3,D:0.4):0.5);",0)
	print("8")
	_parseTree("(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F;",0)
	print("9")
	_parseTree("((B:0.2,(C:0.3,D:0.4)E:0.5)F:0.1)A;",0)

