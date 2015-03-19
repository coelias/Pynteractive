from datastruct import *

class Chart(DataStruct):
	def __init__(self,name=None):
		DataStruct.__init__(self,name)

	def addSeries(self,seriesName,x=[],y=[]):
		assert len(x)==len(y)
		dataset=[{"key":seriesName,"values":[{"x":str(x),"y":str(y)} for x,y in zip(x,y)]}]
		self._update("addChartData",dataset)

	def delSeries(self,seriesName):
		self._update("removeChartData",seriesName)

	def addValue(self,idSeries,x,y,**kwargs):
		self._update("addSeriesData",idSeries,dict({"x":str(x),"y":str(y)}.items()+kwargs.items()))

	def delValue(self,idSeries,x):
		self._update("removeSeriesData",idSeries,x)


