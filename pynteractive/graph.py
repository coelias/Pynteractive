from pynteractive.visNetwork import *
import random

class Graph(VisNetwork):
    def __init__(self,name=None,directed=False):
        '''Creates a graph, It can be directed or not, if a name is not given it is created randomly'''
        VisNetwork.__init__(self,name,directed)

        

    def _refresh(self):
        '''DO NOT USE, is used for graphic representation, everytime a new window is opened'''
        for i in self.vertices.values():
    #            addNode: function (    id,        label,        title,        group,      shape,        color,        radius,         image, lng, lat){
            self._update("addNode",i["_id"],i["_label"],i["_title"],i["_group"],i["_shape"],i["_color"],i["_radius"],i["_image"])
        for i,j in self.edges.items():
            self._update("addEdge",i,j["_n1"],j["_n2"],j["_label"],j["_title"],j["_width"],j["_style"])

    def random(self,nn,ne):
        '''Creates a random Graph containing *nn* nodes and *ne* edges'''
        map(self.addNode,xrange(nn))
        for i in xrange(ne):
            self.addEdge(random.choice(xrange(nn)),random.choice(xrange(nn)))

    def fromCsv(self,fil,matrix=False,distances=False):
        '''Draws a network given a csv file
        
        The format for the CSV can be:

.. csv-table:: Pair of nodes connected
    :header: "n1", "n2"

    "a","b"
    "a","c"
    "c","d"

.. csv-table:: Node in first column connected to the ones in the next columns 
    :header: "n1", "n2"

    "a","b","d","e"
    "b","c","e"
    "e","f","a","d","e"

.. csv-table:: Network matrix (matrix=True,distances=False) 
    :header: " ","a", "b","c","d","e","f"

    "a",1,0,0,0,0,0
    "b",1,0,0,0,0,0    
    "c",0,1,1,1,0,0    
    "d",0,1,0,0,1,0    
    "e",1,0,0,0,1,1    
    "f",0,0,0,0,1,1    
        
.. csv-table:: Network matrix with distances (matrix=True,distances=True) 
    :header: " ","a", "b","c","d","e","f"

    "a",54,0,0,0,0,0
    "b",23,0,0,0,0,0    
    "c",0,10,2,1,0,0    
    "d",0,10,0,0,13,0    
    "e",56,0,0,0,1,1    
    "f",0,0,0,0,3,1    
    '''
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

