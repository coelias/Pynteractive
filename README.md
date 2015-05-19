# Pynteractive: Interactive plots in python
Pynterative is a python library aimed to create interative visualizations provided by several HTML5 JavaScript libraries like [vis.js](http://visjs.org/), [d3.js](http://d3js.org/) and many more.

Its main feature is the real time communication python<->webbrowser via websockets, that allows us realtime interaction from python to the browser and from the browser to python. It means that the code you  write in python affects the isualization in real time and mouse/keyboard events happening in the web browser can be connected to python callbacks creating a bidirectional communication. 

We wanted to create a very simple [API](http://coelias.github.io/Pynteractive/html/) that, although reduces flexibility, it is extremely easy to learn and start creating web GUI's.

Pynteractive IS NOT a framework to develop: 
* Web applications: the graphic interfaces are supposed to be local. That is the main idea, not dealing with web at all, being able to use cool JS frameworks without messing with any web technology.
* Production software: it is intended to help developers/data scientists plotting data very quickly. You've got data, you need to plot it, you need to play with it, that is what pynteractive is aimed for, do not expect more.

Pynteractive is in constant development, all feedback/suggestions/bugreports are very wellcome. It was motivated by the need of using HTML5 plots in biomedical research, (bioinformatics specifically), however different charts and plots are being introduced as they are requested/needed. 



## Current features

* Networks: graphs and digraphs provided by the vis.js framework
* Trees: Using different engines (d3.js, vis.js)
* Maps: provided by leaflet (openstreet maps)
* Phylogenetic trees
* Charts: using NVD3.js

## TODO

* Annotation in phylogenetic trees + different layouts 
* Integrating Circos and making it interactive
* Extra plots extracted from D3.js
* Interactive scatter plots with selection

## Compatibility

It requires an HTML5 browser and currently it has been tested in Google Chome, Safari and Mozilla Firefox.

## Installation

There are two ways of installing pynteractive:

* Cloning the project

```bash
$ git clone https://github.com/coelias/Pynteractive.git
Cloning into 'Pynteractive'...
remote: Counting objects: 658, done.
remote: Compressing objects: 100% (98/98), done.
remote: Total 658 (delta 50), reused 0 (delta 0), pack-reused 560
Receiving objects: 100% (658/658), 136.28 KiB | 0 bytes/s, done.
Resolving deltas: 100% (381/381), done.
Checking connectivity... done.

$ cd Pynteractive
$ python setup.py install  ### (as root)
```
 
* Via [Python package index](https://pypi.python.org/pypi/pip) (pip)
```bash
$ pip install pynteractive
```

## Documentation

[Pynteractive API](http://coelias.github.io/Pynteractive/html/)

## Examples

####Graph example (click to watch video)

[![Graph example](http://coelias.github.io/Pynteractive/imgs/GraphGif.gif)](https://vimeo.com/128141946)

```python
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
```

####Chart example (click to watch video)

[![Chart example](http://coelias.github.io/Pynteractive/imgs/ChartGif.gif)](https://vimeo.com/128177043)

```python
from pynteractive import *
b=Chart()
b.view()
b.addSeries('Squirrels killed by humans',
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
    [200,240,300,313,317,380,360,320,503,460,510,600,550,500,460,490]) 
b.addSeries('People killed by squirrels',
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
    [1,20,40,60,100,110,105,150,100,80,150,180,182,210,300,491])
b.addSeries('Sharks killed by squirrels',
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
    [10,20,25,40,12,33,22,47,90,70,80,46,30,6,18,25])
```

####Map example
[![Map example](http://coelias.github.io/Pynteractive/imgs/map.png)](http://coelias.github.io/Pynteractive/imgs/map.png)


```python
from pynteractive import *
m=Map()
m.view()
m.addNode("ID1",place="london")
m.addNode("ID2",place="ox3 8pp")
m.addEdge("ID1","ID2")
m.addNode("ID3",place="08030",country="es")
m.addNode('ID4',place='paris',radius=30,color='blue')
m.addEdge('ID3','ID4',width=5,color='green')
```

####Phylogenetic tree example
[![Phylo example](http://coelias.github.io/Pynteractive/imgs/phylo.png)](http://coelias.github.io/Pynteractive/imgs/phylo.png)


```python
from pynteractive import *
a=PhyloTree()
a.setNewick('a.newick')
a.view()
a.setNewick('myco.newick')
```
## Real World Examples

[De Bruijn Graph Gene assembly using Pynteractive](https://vimeo.com/128206058)

Being able to debug graphically gene assembly while coding was very helpful. This tool motivated pynteractive development.

[![De Bruijn Graph Gene assembly using Pynteractive](http://coelias.github.io/Pynteractive/imgs/debruijn.gif)](https://vimeo.com/128206058)

[Mixing maps and phylogenetics](https://vimeo.com/128260245)

In our work it's very important to relate samples geographically in order to detect potential outbreaks and study bacterial transmission.

[![Mixing maps and phylogenetics](http://coelias.github.io/Pynteractive/imgs/phylomap.gif)](https://vimeo.com/128260245)

### Authors:
 - Carlos del Ojo
 - Oriol Mazariegos
