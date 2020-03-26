from pynteractive import *
m=Map()
m.view()
m.addNode("ID1",place="london")
m.addNode("ID2",place="ox3 8pp")
m.addEdge("ID1","ID2")
m.addNode("ID3",place="08030",country="es")
m.addNode('ID4',place='paris',radius=30,color='blue')
m.addEdge('ID3','ID4',width=5,color='green')
