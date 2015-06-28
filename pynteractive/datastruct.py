import random 
import webbrowser
import pynteractive.globals as pyn_globals
from collections import Counter
import traceback

class DataStruct:
	'''DataStruct is the basic data structure aimed to abstract any data set that will be represented in Pynteractive Web GUI. All
	different dataset inherit from DataStruct class, and datastruct class implements the basic mechanisms to communicate with the
	Pynteractive web server'''

	_JSConnector=None
	_OBJECTS={}

	def __init__(self,name=None):
		'''DataStruct is the superclass for all pynteractive objects. It requires a *name* although if it is not provided a random name will be assigned.'''
		if not name:
			name=self.__class__.__name__+"-"+"".join([random.choice("ABCDEF0123456789") for i in range(4)])
		ID=name
		if ID in DataStruct._OBJECTS:
			raise ("Object {0} already exists!".format(ID))
		DataStruct._OBJECTS[ID]=self
		self._ID=name
		self.actions={}
		self.actionid=1
		self.dclickfunc=None
	
	def setDoubleClick(self,f):
		'''Sets a callback as a response to a double click event on a graph node'''
		self.dclickfunc=f

	def _doubleClick(self,node):
		if self.dclickfunc:
			self.dclickfunc(node)

	def _performAction(self,fid,params):
		fid=int(fid)
		if fid not in self.actions:
			print "Function not found!!!"
		else:	
			try:
				return self.actions[fid][1](params)
			except:
				print "Error calling method",fid
				print traceback.format_exc()


	def _update(self,func,*pars):
		'''This method calls a JS function via the WebSockets (USED INTERNALLY BY PYNTERACTIVE)'''
		if DataStruct._JSConnector:
			DataStruct._JSConnector(self._ID,func,*pars)

	def _refreshActions(self):
		for fid,(name,func) in self.actions.items():
			self._update('addAction',fid,name)

	@staticmethod
	def _refreshData(name):
		if name in DataStruct._OBJECTS:
			DataStruct._OBJECTS[name]._refreshActions()
			DataStruct._OBJECTS[name]._refresh()

	@staticmethod
	def _connect(updateFunc):
		DataStruct._JSConnector=updateFunc

	@staticmethod
	def readCsv(csvfile):
		'''readsCsv and returns the output as a vector of vectors. Detects delimiter automatically'''
		with open(csvfile) as f:
			csv=[i.strip() for i in f]
		if csv:
			delimiter=Counter([i for i in csv[0] if i in "\t ;,|"]).most_common(1)
			if delimiter:
				csv=[i.split(delimiter[0][0]) for i in csv]
		return csv

	def log(self,log):
		'''Dumps HTML code in the Log section in the web GUI'''
		self._update('addLog',log)

	def clearLog(self):
		'''Clears the contents of the log box in the web GUI'''
		self._update('clearLog')

	def closeView(self):
		'''Closes the browser window/tab containing the dataset GUI'''
		self._update("close")

	def view(self):
		'''This method opens the default web browser in the system showing the web visualization associated to the data'''
		webbrowser.open_new_tab("http://localhost:{0}/?dataid={1}&vtype={2}&wsport={3}".format(pyn_globals.PORT,self._ID,self.__class__.__name__,pyn_globals.WEBSOCKETPORT))

	def downloadSVG(self,svg):
		q=open("/tmp/a.svg","w")
		q.write(svg)
		q.close()

	def addAction(self,name,func):
		'''Actions can be added to each visualization

		An action consists of a **label** (*name*) shown in the web interface plus a **callback method** (*func*) called then the
		button associated to the label is clicked. The callback function must accept one parameter that depending on the visualization
		can be defferent (eg. list of nodes, sample id, etc...)
		
		example:

.. code:: python

		a=Graph()
		def myfunc(nodes):
		     print 'these are the selected nodes',nodes

		a.addAction('Print selected nodes',myfunc)
		a.view()

		# Now you can select some nodes in the GUI and click your action on the left side bar
		'''

		self.actions[self.actionid]=[name,func]
		self._update('addAction',self.actionid,name)
		self.actionid+=1
