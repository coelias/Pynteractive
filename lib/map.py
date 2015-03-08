from lib.Network import *
import urllib
import json

class Map(Network):
	def __init__(self,name=None):
		'''Creates a map object'''
		Network.__init__(self,name,False)

	def refresh(self):
		'''DO NOT USE, is used for graphic representation, everytime a new window is opened'''
		for i in self.vertices.values():
			self.update("addNode",i["_id"],i["_label"],'','','',i["_color"],i["_radius"],'',i["_lng"],i["_lat"])
		for i,j in self.edges.items():
			self.update("addEdge",i,j["_n1"],j["_n2"],'','','','','',j["_color"])

	def addNode(self,node_id,radius=5,color='red',lng=None,lat=None,place=None,country=None):
		assert (lat==None and lng==None and place) or (not place and lat!=None and lng!=None)

		if place:
			lng,lat=self.getLocation(place,country)
			if lng==None:
				print "Error getting coordinates for loading"
				return None,None
		
		_id,label=Network.addNode(self,node_id,node_id,radius=radius,color=color,lng=lng,lat=lat)
		self.update("addNode",node_id,node_id,'','','',color,radius,'',lng,lat)
		return _id,label

	def addEdge(self,n1,n2,color):
		_id,label=Network.addEdge(self,n1,n2,'',color=color)
		self.update("addEdge",_id,n1,n2,'','','','','',color)


			
		

	def getLocation(self,place,country=None):
		url="http://open.mapquestapi.com/nominatim/v1/search.php?format=json&limit=1&addressdetails=0&q={0}".format(place)
		if country: url+="&countrycodes={0}".format(country)
		try:
			data=json.loads(urllib.urlopen(url).read())[0]
			return data['lon'],data['lat']
		except:
			return None,None





		
		

