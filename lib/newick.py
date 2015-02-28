import re

class Node:
	def __init__(self,name=None,lgth=None):
		self.name=name
		self.length=lgth
		self.children=[]

	def append(self,x):
		self.children.append(x)

def parseTree(cad,pos):
	n=Node()
	assert cad[pos]=='('
	
	while True:
		if cad[pos]==')':
			if pos==len(cad)-1: break
			if cad[pos+1]==';': break
			if cad[pos+1] not in "),":
				 name,lgth,pos=parseLeaf(cad,pos+1)
				 n.name=name
				 n.length=lgth
				 return n,pos
			else: break
		elif cad[pos]==';': 
			break

		if cad[pos+1]!='(': 
			name,lgth,pos=parseLeaf(cad,pos+1)
			n.append(Node(name,lgth))
		else:
			nn,pos=parseTree(cad,pos+1)
			n.append(nn)
	return n,pos+1
		

releaf=re.compile("([^:]+)?(:[0-9.]+)?")

def parseLeaf(cad,pos):
	length=None
	name=None
	i=pos
	while i<=len(cad) and cad[i] not in ",);":
		i+=1
	items=releaf.findall(cad[pos:i])
	if not items: raise Exception("Tree wrongly constructed")
	if items[0][0]: name=items[0][0]
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
