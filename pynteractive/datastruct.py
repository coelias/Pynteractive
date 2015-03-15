import random 
import webbrowser
import pynteractive.globals as pyn_globals

class DataStruct:
	JSConnector=None
	OBJECTS={}

	def __init__(self,name=None):
		'''DataStruct is the superclass for all pynteractive objects. It requires a *name* although if it is not provided a random name will be assigned.'''
		if not name:
			name=self.__class__.__name__+"-"+"".join([random.choice("ABCDEF0123456789") for i in range(4)])
		ID=name
		if ID in DataStruct.OBJECTS:
			raise ("Object {0} already exists!".format(ID))
		DataStruct.OBJECTS[ID]=self
		self._ID=name
		self.actions={}
		self.actionid=1
	
	def view(self):
		'''This method opens the default web browser in the system showing the web visualization associated to the data'''
		webbrowser.open_new_tab("http://localhost:{0}/?dataid={1}&vtype={2}".format(pyn_globals.PORT,self._ID,self.__class__.__name__))

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

		# Noe select some nodes in the GUI and click your action on the left side bar
		'''

		self.actions[self.actionid]=[name,func]
		self.update('addAction',self.actionid,name)
		self.actionid+=1



	def performAction(self,fid,params):
		fid=int(fid)
		if fid not in self.actions:
			print "Function not found!!!"
		else:	
			try:
				return self.actions[fid][1](params)
			except:
				print "Error calling method",fid

	def log(self,log):
		self.update('addLog',log)

	def clearLog(self):
		self.update('clearLog')

	def closeView(self):
		self.update("close")

	def update(self,func,*pars):
		if DataStruct.JSConnector:
			DataStruct.JSConnector(self._ID,func,*pars)

	def refreshActions(self):
		
		for fid,(name,func) in self.actions.items():
			self.update('addAction',fid,name)

	@staticmethod
	def refreshData(name):
		if name in DataStruct.OBJECTS:
			DataStruct.OBJECTS[name].refreshActions()
			DataStruct.OBJECTS[name].refresh()

	@staticmethod
	def connect(updateFunc):
		DataStruct.JSConnector=updateFunc

	@staticmethod
	def readCsv(csvfile):
		with open(csvfile) as f:
			csv=[i.strip() for i in f]
		if csv:
			delimiter=Counter([i for i in csv[0] if i in "\t ;,|"]).most_common(1)
			if delimiter:
				csv=[i.split(delimiter[0][0]) for i in csv]
		return csv

