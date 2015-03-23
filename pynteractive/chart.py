from datastruct import *
from itertools import izip

class Chart(DataStruct):
	TYPES={'bar':'Bar','scatter':'Scatter','line':'Line','stack':'Stack'}
	SHAPES=set(['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'])
	def __init__(self,name=None,type='line'):
		assert type in Chart.TYPES
		DataStruct.__init__(self,name)
		self.chartype=Chart.TYPES[type]
		self.data={}

	def _refresh(self):
		self._update("setChartType",self.chartype)
		for seriesName,values in self.data.items():
			dataset={"key":seriesName,"values":values}
			self._update("addChartData",dataset)
		

	def addSeries(self,seriesName,x=[],y=[],sizes=[],shapes=[],data=[]):
		assert (x and not data) or (data and not x)
		assert len(x)==len(y)
		assert not sizes or (sizes and len(sizes)==len(x)==len(shapes))
		assert len(set([len(i) for i in data]))<2

		if sizes:
			values=[]
			for _x,_y,_sh,_sz in izip(x,y,shapes,sizes):
				if _sh not in Chart.SHAPES:
					raise Exception('shape must be a valid id!')
				values.append({"x":str(_x),"y":str(_y),'shape':_sh,'size':_sz})
			dataset={"key":seriesName,"values":values}
			self.data[seriesName]=dataset
		elif x:
			dataset={"key":seriesName,"values":[{"x":str(_x),"y":str(_y)} for _x,_y in izip(x,y)]}
			self.data[seriesName]=dataset
		else:
			values=[]
			for i in data:
				if len(data)<2 or len(data)>4: raise Exception('You need at least 2 values in the data vector and not more than 4')
				if type(i[0]) not in [float,int] or type(i[1]) not in [float,int]: raise Exception('Bad format for X/Y')
				if len(i)==3:
					sh='circle'
					sz=0.5
					if i[2] in Chart.SHAPES: sh=i[2]
					else: sz=i[2]
					values.append({"x":str(i[0]),"y":str(i[1]),'shape':sh,'size':sz})
				elif len(i)==4:
					sh='circle'
					sz=0.5
					if i[2] in Chart.SHAPES: sh,sz=i[2],i[3]
					else: sh,sz=i[3],i[2]
					values.append({"x":str(i[0]),"y":str(i[1]),'shape':sh,'size':sz})
				else:
					values.append({"x":str(i[0]),"y":str(i[1])})
			dataset={"key":seriesName,"values":values}
			self.data[seriesName]=dataset


		self._update("addChartData",dataset)


	def delSeries(self,seriesName):
		del self.data[seriesName]
		self._update("removeChartData",seriesName)

	def addValue(self,idSeries,x,y,**kwargs):
		assert not set(kwargs)-set(["size","shape"])
		data=dict({"x":str(x),"y":str(y)}.items()+kwargs.items())
		self._update("addSeriesData",idSeries,data)
		self.data[idSeries].append(data)

	def delValue(self,idSeries,x):
		self._update("removeSeriesData",idSeries,x)
		self.data[idSeries]=[i for i in self.data[idSeries] if i['x']!=x]

	def changeType(self,type):
		assert type in Chart.TYPES
		self.chartype=Chart.TYPES[type]
		self._update("setChartType",self.chartype)

