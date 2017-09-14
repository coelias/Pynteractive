from pynteractive import *
a=Graph(directed=True)
a.view()

# adding nodes
a.addNode()
a.addNode(10)
a.addNode(11,color='red')
a.addNode('john',shape='star',color='green')

# adding edges
a.addEdge(1,10)
a.addEdge(1,'john',style='dash-line')
a.addEdge(1,11,width='4')
a.addEdge(10,11,width='2',label='hello world')
a.delNode('john')

# creating a circular graph
a.addNode('a',shape='dot',radius=30)
a.addNode('b',shape='dot',radius=20,color='red')
a.addNode('c',shape='dot',radius=10,color='green')
a.addNode('d',shape='dot',radius=20,color='blue')
a.addNode('e',shape='dot',radius=30,color='#FFFF00')
a.addNode('f',shape='dot',radius=35,color='#bbb')
a.addEdge('a','b')
a.addEdge('b','c',style='arrow-center')
a.addEdge('c','d')
a.addEdge('d','e',style='arrow-center')
a.addEdge('e','f')
a.addEdge('f','a',style='arrow-center')

# cleaning the view
a.clear()

# Generating a randon graph (40 nodes, 50 edges
a.random(40,50)

# Logging into the log area
a.log('Hello world')
a.log('<h1>header</h1>')
a.log('<code>code</code>')

# Defining callbacks to perform actions after events in the GUI
def Multiply_by2(node):
    a.log(str( int(node)*2)+"<br>")
a.setDoubleClick(Multiply_by2)

def sumall(nodes):
    a.log(str( sum([int(i) for i in nodes]))+"<br>")
a.addAction('Add node values',sumall)
