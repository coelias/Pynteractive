from datastruct import *

class Chart(DataStruct):
	def __init__(self,name=None):
		DataStruct.__init__(self,name)

	def addData(self,seriesName,x,y):
		assert len(x)==len(y)
		dataset=[{"key":seriesName,"values":[{"x":str(x),"y":str(y)} for x,y in zip(x,y)]}]
		self._update("addChartData",dataset)
