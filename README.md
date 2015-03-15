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

(Pynteractive API)[http://coelias.github.io/Pynteractive/html/]

## Examples

TODO

### Authors:
 - Carlos del Ojo
 - Oriol Mazariegos
