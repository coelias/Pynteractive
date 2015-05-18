# Pynteractive: Interactive plots in python
Pynterative is a python library aimed to create interative visualizations provided by several HTML5 JavaScript libraries like [vis.js](http://visjs.org/) or [d3.js](http://d3js.org/).

It was motivated by the need of using HTML5 plots in biomedical research, (bioinformatics to be specific), however different charts and plots are being introduced as they are requested/needed. 

It is designed to implement a very simple API allowing bidirectional communications. (Python<-->webbrowser)

## Current features

* Networks: graphs and digraphs provided by the vis.js framework
* Trees: Using different engines (d3.js, vis.js)
* Maps: provided by leaflet (openstreet maps)

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

####Simple Graph usage

[![Simple Graph usage ](http://coelias.github.io/Pynteractive/imgs/GraphGif.gif)](https://vimeo.com/128141946)

```python
from pynteractive import *
a=Graph(directed=True)
a.view()
a.addNode()
a.addNode(10)
a.addNode(11,color='red')
a.addNode('john',shape='star',color='green')
a.addEdge(1,10)
a.addEdge(1,'john',style='dash-line')
a.addEdge(1,11,width='4')
a.addEdge(10,11,width='2',label='hello world')
a.delNode('john')
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
a.clear()
a.random(40,50)
a.log('Hello world')
a.log('<h1>header</h1>')
a.log('<code>code</code>')
def Multiply_by2(node
    a.log(str( int(node)*2)+"<br>")
a.setDoubleClick(Multiply_by2)
def sumall(nodes
    a.log(str( sum([int(i) for i in nodes]))+"<br>")
a.addAction('Add node values',sumall)
```

[![Simple Chart usage ](http://coelias.github.io/Pynteractive/imgs/ChartGif.gif)](https://vimeo.com/128177043)

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
### Authors:
 - Carlos del Ojo
 - Oriol Mazariegos
