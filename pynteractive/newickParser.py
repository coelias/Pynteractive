import os
import re
import random
import sys
VER = sys.version_info[0]
if VER >= 3:
     from functools import reduce

class Newick:
    releaf=re.compile("([^:]+)?(:[0-9.e-]+)?")

    class Node:
        RANDOMNAMES=set()
        def __init__(self,name=None,lgth=None):
            self.name=name
            self.length=lgth
            if self.length==None: self.length=0
            self.children=[]
            if not self.name:
                self.name=Newick.Node.randomName()
            self.parent=None

        def dadsToRoot(self):
            dads=[]
            x=self
            while x.parent:
                dads.append(x.parent)
                x=x.parent
            return dads[::-1]
    
        def append(self,x):
            self.children.append(x)

        def setParent(self,dad):
            self.parent=dad

        def __str__(self):
            cad=""
            if self.children:
                cad+="({0})".format(",".join([str(i) for i in self.children]))
            if self.name:
                cad+=self.name
            if self.length: cad+=":{0}".format(self.length)
            return cad

        def __lt__(self, a):
            return self.name<a.name
             

        @staticmethod
        def randomName():
            while True:
                name="clade-"+str(random.randint(1,99999))
                if name not in Newick.Node.RANDOMNAMES:
                    Newick.Node.RANDOMNAMES.add(name)
                    return name
        def getMaxLength(self):
            if not self.children:
                return self.length
            return self.length+max([i.getMaxLength() for i in self.children])

        def reorient(self):
            if not self.children: return self.length
            else:
                b=[(i.reorient()+self.length,i) for i in self.children]
                b.sort()
                self.children=[i[1] for i in b]
                return b[-1][0]
            

    def __init__(self):
        self.root=None
        self.nodenames=set()
        self.internalNodes=set()
        self.leafs={}

    def __delitem__(self,leaf):
        if leaf not in self.leafs:
            raise Exception ("leaf not found ! {0}".format(leaf))
        leaf=self.leafs[leaf]
        leaf.parent.children.remove(leaf)
        if len(leaf.parent.children)==1 and leaf.parent.parent:
            leaf.parent.children[0].length+=leaf.parent.length
            leaf.parent.parent.children.remove(leaf.parent)
            leaf.parent.parent.children.append(leaf.parent.children[0])
            leaf.parent.children[0].parent=leaf.parent.parent
        elif len(leaf.parent.children)==1:
            leaf.parent.length+=leaf.parent.children[0].length
            for i in leaf.parent.children[0].children:
                i.parent=leaf.parent
            leaf.parent.children=leaf.parent.children[0].children
            

    def reorient(self):
        self.root.reorient()

    def getMaxLength(self):
        return self.root.getMaxLength()

    def readNewick(self,newick):
        self.nodenames=set()
        try:
            if os.path.isfile(newick):
                self.root,pos=self._parseTree(open(newick).read(),0)
            else:
                self.root,pos=self._parseTree(newick,0)
        except:
            raise Exception('Invalid format for Newick')

        if not self.root.length:
            self.root.length=self.getMaxLength()/10

        self.internalNodes=self.getInternalNodes(self.root)
        self.reorient()

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
                nn=Newick.Node(name,lgth)
                self.leafs[name]=nn
                nn.setParent(n)
                n.append(nn)
            else:
                nn,pos=self._parseTree(cad,pos+1)
                n.append(nn)
                nn.setParent(n)
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
        assert type(nodes)==list
        found,clades=self._recur_getMonoPhyletics(nodes,self.root)
        clades.update([i for i in nodes if i in self.internalNodes])
        return clades

    def getCommonParent(self,nodes):
        assert type(nodes)==list
        parentslists=[]
        for i in nodes:
            parentslists.append(self.leafs[i].dadsToRoot())

        last=None
        for i in zip(*parentslists):
            if len(set(i))==1:
                last=i[0]
        return last


    def _recur_getMonoPhyletics(self,nodes,curNode):
        assert type(nodes)==list
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

