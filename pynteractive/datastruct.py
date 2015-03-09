import random 
import webbrowser
import pynteractive.globals as pyn_globals

class DataStruct:
	JSConnector=None
	OBJECTS={}

	def __init__(self,name=None):
		if not name:
			name=self.__class__.__name__+"-"+"".join([random.choice("ABCDEF0123456789") for i in range(4)])
		ID=name
		if ID in DataStruct.OBJECTS:
			raise ("Object {0} already exists!".format(ID))
		DataStruct.OBJECTS[ID]=self
		self._ID=name
	
	def view(self):
		webbrowser.open_new_tab("http://localhost:{0}/?dataid={1}&vtype={2}".format(pyn_globals.PORT,self._ID,self.__class__.__name__))

	def closeView(self):
		self.update("close")

	def update(self,func,*pars):
		DataStruct.JSConnector(self._ID,func,*pars)

	@staticmethod
	def refreshData(name):
		if name in DataStruct.OBJECTS:
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

