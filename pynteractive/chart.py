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

	def _addValue(self,series,x,y,**kwargs):
		assert not set(kwargs)-set(["size","shape"])
		if 'size' in kwargs:
			if type(kwargs['size'])==str: kwargs['size']=int(kwargs['size']) if kwargs['size'].isdigit() else float(kwargs['size'].replace(',','.'))
		if type(x)==str: x=int(x) if x.isdigit() else float(x.replace(',','.'))
		if type(y)==str: y=int(y) if y.isdigit() else float(y.replace(',','.'))

		data=dict({"x":x,"y":y}.items()+kwargs.items())
		self.data[series].append(data)
		return data

	def addSeries(self,seriesName,x=[],y=[],sizes=[],shapes=[],data=[],csv=None):
		assert seriesName not in self.data
		assert (not data and not csv and x) or (not x and not csv and data) or (not data and not x and csv)
		assert len(x)==len(y)
		assert not sizes or (sizes and len(sizes)==len(x)==len(shapes))
		assert len(set([len(i) for i in data]))<2

		self.data[seriesName]=[]

		if sizes:
			values=[]
			for _x,_y,_sh,_sz in izip(x,y,shapes,sizes):
				if _sh not in Chart.SHAPES:
					raise Exception('shape must be a valid id!')
				self._addValue(_x,_y,shape=_sh,size=_sz)
		elif x:
			for _x,_y in izip(x,y):
				self._addValue(seriesName,_x,_y)
		else:
			if csv:
				data=self.readCsv(csv)
			for i in data:
				if len(i)<2 or len(i)>4: raise Exception('You need at least 2 values in the data vector and not more than 4')
				if len(i)==3:
					sh='circle'
					sz=0.5
					if i[2] in Chart.SHAPES: sh=i[2]
					else: sz=i[2]
					self._addValue(seriesName,i[0],i[1],shape=sh,size=sz)
				elif len(i)==4:
					sh='circle'
					sz=0.5
					if i[2] in Chart.SHAPES: sh,sz=i[2],i[3]
					else: sh,sz=i[3],i[2]
					self._addValue(seriesName,i[0],i[1],shape=sh,size=sz)
				else:
					self._addValue(seriesName,i[0],i[1])

		dataset={"key":seriesName,"values":self.data[seriesName]}

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

