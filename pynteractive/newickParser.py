import os
import re
import random

class Newick:
	releaf=re.compile("([^:]+)?(:[0-9.]+)?")

	class Node:
		RANDOMNAMES=set()
		def __init__(self,name=None,lgth=None):
			self.name=name
			self.length=lgth
			self.children=[]
			if not self.name:
				self.name=Newick.Node.randomName()
	
		def append(self,x):
			self.children.append(x)

		def __str__(self):
			cad=""
			if self.children:
				cad+="({0})".format(",".join([str(i) for i in self.children]))
			if self.name:
				cad+=self.name
			if self.length: cad+=":{0}".format(self.length)
			return cad

		@staticmethod
		def randomName():
			while True:
				name="clade-"+str(random.randint(1,99999))
				if name not in Newick.Node.RANDOMNAMES:
					Newick.Node.RANDOMNAMES.add(name)
					return name
			

	def __init__(self):
		self.root=None
		self.nodenames=set()
		self.internalNodes=set()

	def readNewick(self,newick):
		self.nodenames=set()
		try:
			if os.path.isfile(newick):
				self.root,pos=self._parseTree(open(newick).read(),0)
			else:
				self.root,pos=self._parseTree(newick,0)
		except:
			raise Exception('Invalid format for Newick')

		self.internalNodes=self.getInternalNodes(self.root)
		print self.internalNodes

	def getInternalNodes(self,root):
		res=set()
		if not root.children: return res

		for i in root.children:
			res.update(self.getInternalNodes(i))

		res.add(root.name)
		
		return res
	
	def _parseTree(self,cad,pos):
		n=Newick.Node()
		assert cad[pos]=='('
		
		while True:
			if cad[pos]==')':
				if pos==len(cad)-1: break
				if cad[pos+1]==';': break
				if cad[pos+1] not in "),":
					name,lgth,pos=self._parseLeaf(cad,pos+1)
					if name: n.name=name
					n.length=lgth
					return n,pos
				else: break
			elif cad[pos]==';': 
				break
	
			if cad[pos+1]!='(': 
				name,lgth,pos=self._parseLeaf(cad,pos+1)
				n.append(Newick.Node(name,lgth))
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
		items=Newick.releaf.findall(cad[pos:i])
		if not items: raise Exception("Tree wrongly constructed")
		if items[0][0]: name=self.getName(items[0][0])
		if items[0][1]: length=float(items[0][1][1:])
	
		return name,length,i

	def getMonophyletics(self,nodes):
		found,clades=self._recur_getMonoPhyletics(nodes,self.root)
		clades.update([i for i in nodes if i in self.internalNodes])
		return clades

	def _recur_getMonoPhyletics(self,nodes,curNode):
		childres=[]
		res=set()
		found=False
		if curNode.children:
			for i in curNode.children:
				childres.append(self._recur_getMonoPhyletics(nodes,i))
			if all([i[0] for i in childres]):
				found=True
				res=set([curNode.name])
			else:
				res=reduce(set.union,[i[1] for i in childres])
		else:
			if curNode.name in nodes: return True,set([curNode.name])
			res=set()

		return found,res

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

	def getNewick(self):
		return str(self.root)+";"
	__str__=getNewick

