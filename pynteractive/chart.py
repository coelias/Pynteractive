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
		'''Adds a series of data. A series of data has to have a name and a collection of (x,y) pairs that can be either integers or floats
		if the chart is a scatter you can add as well sizes and or shapes. 

		The available shapes are: 'circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'

		There are several ways of adding data:

.. code:: python

		a=Chart()
		a.addSeries('dataset1',[1,2,3],[4,5,6])
		a.addSeries('dataset2',[1,2,3],[4,5,6],sizes=[.5,.5,.2],shapes=['circle','cross','square'])
		a.addSeries('dataset3',data=[[1,4],[2,5],[3,6]])
		a.addSeries('dataset4',data=[[1,4,.5,'circle'],[2,5,.5,'cross'],[3,6,.2,'square']])
		a.addSeries('dataset5',csv='file.csv') # The format has to the same as we pass it to data parameter
		'''
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
		'''Deletes a series from the graph'''
		del self.data[seriesName]
		self._update("removeChartData",seriesName)

	def addValue(self,idSeries,x,y,**kwargs):
		'''Ads a value into a series, extra parameters can be size=N and shape='XXX' '''
		assert not set(kwargs)-set(["size","shape"])
		self._update("addSeriesData",idSeries,self._addValue(x,y,**kwargs))

	def delValue(self,idSeries,x):
		'''Deletes a value from a series'''
		self._update("removeSeriesData",idSeries,x)
		self.data[idSeries]=[i for i in self.data[idSeries] if i['x']!=x]

	def changeType(self,type):
		'''Changes the chart type in the view, the following types are available: 'bar','scatter','line','stack' '''
		assert type in Chart.TYPES
		self.chartype=Chart.TYPES[type]
		self._update("setChartType",self.chartype)

