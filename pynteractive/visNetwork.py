from pynteractive.Network import *

class VisNetwork(Network):
    def __init__(self,name=None,directed=False):
        '''Implements a network for vis.js'''
        Network.__init__(self,name,directed)

    def addNode(self,node_id=None,label=None,title=None,group=None,shape='ellipse',color=None,radius=None,image=None):
        '''Adds a node to the network:

- node_id: identification of the node, if not specified it will be randomly generated
- label: Text that will be shown within the node
- title: Tooltip shown when hovering the node
- group: color group (numeric, eg: 1,2,3,4) used for clusterings
- shape: any of *ellipse*, *circle*, *box*, *database*, *image*, *circularImage*, *label*, *dot*, *star*, *triangle*, *triangleDown*, *square*
- color: color name or html code (eg: red, #FF0000)
- radius: radius of the shape
- image: Image in case the shape is image or circularImage'''

        assert not shape or shape in ['ellipse','circle','box','database','image','circularImage','label','dot','star','triangle','triangleDown','square']
        if shape in ['image','circularImage']: assert image!=None

        node_id,label=Network.addNode(self,node_id,label,title=title,group=group,shape=shape,color=color,radius=radius,image=image)

        self._update("addNode",node_id,label,title,group,shape,color,radius,image)
        return node_id,label

    def updateNode(self,node_id,label=None,title=None,group=None,shape=None,color=None,radius=None,image=None):
        '''Updates a node in the network'''
        Network.updateNode(self,node_id,label=label,title=title,group=group,shape=shape,color=color,radius=radius,image=image)
        i=self.vertices[node_id]
        self._update("updateNode",i["_id"],i["_label"],i["_title"],i["_group"],i["_shape"],i["_color"],i["_radius"],i["_image"])

    def addEdge(self,n1,n2,label=None,title=None,width=None,style=None,length=None):
        '''Adds an edge to a node, if it is not directed the order does not matter:

- label: label on the edge
- title: text shown when hovering the edge
- width: width in pixeld of the edge
- style: line style -> *line*, *arrow*, *arrow-center*, *dash-line*
- length: length of the edge'''

        assert not style or style in ['line','arrow','arrow-center','dash-line']
        if not self.directed: assert style not in ['arrow','arrow-center']

        if not label: label=''

        if self.directed:
            if not style: style='arrow'
        else:
            if not style: style='line'

        _id,label=Network.addEdge(self,n1,n2,label,title=title,width=width,style=style,length=length)
        self._update("addEdge",_id,n1,n2,label,title,width,style,length)
        return _id,label
    
    def delNode(self,node_id):
        '''Deletes a node from the network as well as the edges'''
        
        node,edges=Network.delNode(self,node_id)

        for i in edges:
            self._update("removeEdge",i)
        self._update("removeNode",node)

    def focusNode(self,id):
        '''Forces the GUI to zoom in into the specified node''' 
        self._update("searchNode",id)

    def delEdge(self,ed_id):
        '''Deletes a connection between two given nodes'''
        Network.delEdge(self,ed_id)
        self._update("removeEdge",ed_id)

    def clear(self):
        '''Clears the GUI by removing every node and edge in the network'''
        v=self.getEdges()
        n=self.getNodes()
        for i in v:
            self.delEdge(i)
        for i in n:
            self.delNode(i)
