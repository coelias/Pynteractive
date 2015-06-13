from pynteractive.datastruct import *
import os
from newickParser import *
from htmlcolors import HTMLCOLORS
import re

class PhyloTree(DataStruct):
	recolor=re.compile("^#[0-9a-f]{6}$")
	def __init__(self,name=None):
		DataStruct.__init__(self,name)
		self.newick=""
		self.features={}
		self.tipfeatures={}
		self.newick=Newick()
		self.tracks={}
		self.gradientTracks={}
		self.ntracks=0
		self.trackBars={}
		self.nbars=0

	def __getHexColor(self,trackn,val):
		_,color,minval,maxval,_=self.gradientTracks[trackn]
		if color in HTMLCOLORS: color=HTMLCOLORS[color]
		color=color.lower()
		if not PhyloTree.recolor.findall(color): raise Exception('Wrong color format (HTML valid color name or color code (#ff00ff))')
		rng=maxval-minval
		val-=minval
		val=rng-val
		val=float(val)/rng
		colvals=[int(color[i:i+2],16) for i in range(1,7,2)]
		colvals=[min([int(i+(255-i)*val),255]) for i in colvals]
		html="#"+"".join(["{0:0>2}".format(hex(i)[2:]) for i in colvals])
		return html


	def setData(self,newick=None):
		'''Draws the specified newick tree, It can be either a string containing the newick string or a path to a file'''
		self.newick.readNewick(newick)
		self._update('setData',str(self.newick))
		self.tracks={}
		self.gradientTracks={}
		self.tipfeatures={}
		self.ntracks=0

	def _refresh(self):
		self._update('setData',str(self.newick))
		for i,j in self.features.items():
			self._update('addPhyloFeat',i,*j)

		for i,j in self.tipfeatures.items():
			for k in j:
				self._update('addPhyloTipFeat',i,k)

		for i in range(self.ntracks):
			self._update('addTreeTrack')

		for trackn,data in self.tracks.items():
			for tipname,title in data[2].items():
				self._update('addTreeTrackFeature',trackn,tipname,data[1],title,False)

		for trackn,data in self.gradientTracks.items():
			for tipname,[title,value] in data[4].items():
				self._update('addTreeTrackFeature',trackn,tipname,self.__getHexColor(trackn,value),title,value)

		self._refreshBars()

	def _refreshBars(self):
		for nbar,(description,color,minval,maxval,bars) in  self.trackBars.items():
			for tipname,value in bars.items():
				rng=maxval-minval
				val=value-minval
				val=rng-val
				val=1-float(val)/rng

				self._update('addTreeTrackBar',value,val,tipname,color,nbar,self.nbars)
			

	def getTips(self):
		'''Returns a set containing all the tip names found in the tree'''
		return self.newick.nodenames
			
	def nodeClick(self,nid):
		'''Method called when a node is clicked'''
		pass

	def selectTips(self,tips):
		'''Method usd to select nodes in the view (tree tips), you must provide tip labels'''
		self._update('selectNewickNodes',tips)

	def clearSelection(self):
		'''Method to clear the current selection in the tree'''
		self._update('clearNewickSelection')

	def addFeature(self,fid,shape,color,description=''):
		'''Adds a feature available for the tree
		
- fid: Feature id (eg: INH-resist)
- color: any html compatible color (eg: red,#f00)
- shape: [circle,square,diamond,cross]
- description: text to show in the legend'''
		assert shape in ['circle','square','diamond','cross']
		self.features[fid]=[shape,color,description]
		self._update('addPhyloFeat',fid,shape,color,description)

		
	def addTipFeature(self,tid,fid):
		'''Adds the feature `fid` to the tip `tid`'''
		assert fid in self.features and tid in self.newick.nodenames
		self.tipfeatures.setdefault(tid,[]).append(fid)
		self._update('addPhyloTipFeat',tid,fid)

	def delTipFeature(self,tid,fid):
		'''Removes the feature `fid` to the tip `tid`'''
		assert fid in self.tipfeatures[tid] and tid in self.newick.nodenames
		self.tipfeatures[tid].remove(fid)
		self._update('delPhyloTipFeat',tid,fid)

	def addTrack(self,description,color):
		self.ntracks+=1
		self.tracks[self.ntracks]=[description,color,{}]
		self._update('addTreeTrack')
		self._update('deleteBars')
		self._refreshBars()
		return self.ntracks

	def addGradientTrack(self,description,color,minval,maxval):
		self.ntracks+=1
		self.gradientTracks[self.ntracks]=[description,color,minval,maxval,{}]
		self._update('addTreeTrack')
		self._update('deleteBars')
		self._refreshBars()
		return self.ntracks

	def addTrackFeature(self,trackn,tipname,value=False,title=None):
		assert tipname in self.newick.nodenames 
		if not 0<trackn<=self.ntracks: raise Exception("Track number does not exist")
		if trackn in self.gradientTracks: 
			if title==None: title=str(value)
			if type(value)==bool: raise Exception("You must specify a value for a gradient track")
			self.gradientTracks[trackn][4][tipname]=[title,value]
			self._update('addTreeTrackFeature',trackn,tipname,self.__getHexColor(trackn,value),title,value)
		else:
			if value!=False: raise Exception("This track does not accept values")
			self.tracks[trackn][2][tipname]=title
			self._update('addTreeTrackFeature',trackn,tipname,self.tracks[trackn][1],title,value)

	def delTrackFeature(self,trackn,tipname):
		assert trackn in self.tracks and tipname in self.newick.nodenames
		if tipname in self.tracks[trackn][2]: del self.tracks[trackn][2][tipname]
		self._update('delTreeTrackFeature',trackn,tipname)

	def addBar(self,description,color,minval,maxval):
		self.nbars+=1
		self.trackBars[self.nbars]=[description,color,minval,maxval,{}]
		self._update('deleteBars')
		self._refreshBars()
		return self.nbars

	def addTrackBar(self,nbar,tipname,value):
		if not 0<nbar<=self.nbars: raise Exception("Bar number does not exist")
		_,color,minval,maxval,tipbars=self.trackBars[nbar]
		rng=maxval-minval
		val=value-minval
		val=rng-val
		val=1-float(val)/rng

		tipbars[tipname]=value

		self._update('addTreeTrackBar',value,val,tipname,color,nbar,self.nbars)

		
#delTreeTrackBar: function(tipname,barn) {
#		element.delTrackBar(tipname,barn)
#	},
#clearTracks: function() {
#		element.clearTracks()
#	},
#deleteTracks: function() {
#		element.deleteTracks()
#	},
#deleteBars: function() {
#		element.deleteBars()
#	}

