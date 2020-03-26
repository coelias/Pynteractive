from pynteractive.datastruct import *
import os
from pynteractive.newickParser import *
from pynteractive.htmlcolors import HTMLCOLORS
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
		self.mcolorTracks={}
		self.ntracks=0
		self.trackBars={}
		self.nbars=0
		self.cladeMarks={}
		self.cladeColors={}

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
		self.clearBars()
		self.clearTracks()
		self.tipfeatures={}

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

		for trackn,data in self.mcolorTracks.items():
			for tipname,value in data[2].items():
				self._update('addTreeTrackFeature',trackn,tipname,data[1][value],value,value)

		for tipname,color in self.cladeMarks.items():
			self._update("markClade",tipname,color)

		for tipname,color in self.cladeColors.items():
			self._update("setCladeColor",tipname,color)

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
		return [i.name for i in self.newick.leafs.values()]
			
	def nodeClick(self,nid):
		'''Method called when a node is clicked'''
		pass

	def selectTips(self,tips):
		'''Method usd to select nodes in the view (tree tips), you must provide tip labels'''
		self._update('selectNewickNodes',tips)


	def selectClade(self,tips):
		'''Select the clade containing a set of given tips'''
		dad=self.newick.getCommonParent(tips)
		self._update('selectNewickNodes',[dad.name])

	def clearSelection(self):
		'''Method to clear the current selection in the tree'''
		self._update('clearNewickSelection')

#	def addFeature(self,fid,shape,color,description=''):
#		'''Adds a feature available for the tree
#		
#- fid: Feature id (eg: INH-resist)
#- color: any html compatible color (eg: red,#f00)
#- shape: [circle,square,diamond,cross]
#- description: text to show in the legend'''
#		assert shape in ['circle','square','diamond','cross']
#		self.features[fid]=[shape,color,description]
#		self._update('addPhyloFeat',fid,shape,color,description)
#
#		
#	def addTipFeature(self,tid,fid):
#		'''Adds the feature `fid` to the tip `tid`'''
#		assert fid in self.features and tid in self.newick.nodenames
#		self.tipfeatures.setdefault(tid,[]).append(fid)
#		self._update('addPhyloTipFeat',tid,fid)
#
#	def delTipFeature(self,tid,fid):
#		'''Removes the feature `fid` to the tip `tid`'''
#		assert fid in self.tipfeatures[tid] and tid in self.newick.nodenames
#		self.tipfeatures[tid].remove(fid)
#		self._update('delPhyloTipFeat',tid,fid)

	def addTrack(self,description,color):
		'''Ads a track as an external ring. This is a BOOLEAN track, where any tip can be flagged in the track. When clicking a coloured tip on the track, all the tips flagged in the track will automatically be selected
		
- description: Text used for the legend
- color: color used for the flagged tips on the track

		Returns the track ID that you will have to use to add data to it'''

		self.ntracks+=1
		self.tracks[self.ntracks]=[description,color,{}]
		self._update('addTreeTrack')
		self._update('deleteBars')
		self._refreshBars()
		return self.ntracks

	def addMultiColorTrack(self,description,colordict):
		'''A Multicolor track is a track that can have random colors given a color dictionary eg: {"uk":'red',"france":'green',"germany":"#a2a2a2"}
- description: Text used for the legend
- colordict: Dictionary mapping values to colors
		
		Returns the track ID that you will have to use to add data to it '''

		self.ntracks+=1
		self.mcolorTracks[self.ntracks]=[description,colordict,{}]
		self._update('addTreeTrack')
		self._update('deleteBars')
		self._refreshBars()
		return self.ntracks

	def addGradientTrack(self,description,color,minval,maxval):
		'''A gradient Track is a track where tips in the tree can have a continuous value, and the color will be shown as a gradient color. You must specify minval and maxval of the track so that the gradient can be calculated
		
- description: Text used for the legend
- color: color used for the gradient on track
- minval: Minimum value of the range of values this track will have
- maxval: Minimum value of the range of values this track will have
		
		Returns the track ID that you will have to use to add data to it'''


		self.ntracks+=1
		self.gradientTracks[self.ntracks]=[description,color,minval,maxval,{}]
		self._update('addTreeTrack')
		self._update('deleteBars')
		self._refreshBars()
		return self.ntracks

	def addTrackFeature(self,trackn,tipname,value=False,title=None):
		'''Adds a data to a track:

- trackn: Track number to add data to
- tipname: The tip you want to add the feature to
- value: Only required/necessary if it's a gradient track
- title: Tooltip shown when hovering with the mouse 

.. code:: python

		p=PhyloTree()
		p.setData("file.newick")
		resistanteTrack=p.addTrack('Antibiotic resistante','red')
		coverageTrack=p.addTrack('Avg Depth coverage','blue',0,344)
		p.addTrackFeature(resistanceTrack,'sample1')
		p.addTrackFeature(resistanceTrack,'sample3')
		p.addTrackFeature(coverageTrack,'sampler1',25)
		p.addTrackFeature(coverageTrack,'sampler2',221)
		p.addTrackFeature(coverageTrack,'sampler3',344) '''

		assert tipname in self.newick.nodenames 
		if not 0<trackn<=self.ntracks: raise Exception("Track number does not exist")
		if trackn in self.gradientTracks: 
			if title==None: title=str(value)
			if type(value)==bool: raise Exception("You must specify a value for a gradient track")
			self.gradientTracks[trackn][4][tipname]=[title,value]
			self._update('addTreeTrackFeature',trackn,tipname,self.__getHexColor(trackn,value),title,value)
		elif trackn in self.tracks:
			if value!=False: raise Exception("This track does not accept values")
			self.tracks[trackn][2][tipname]=title
			self._update('addTreeTrackFeature',trackn,tipname,self.tracks[trackn][1],title,value)
		elif trackn in self.mcolorTracks:
			desc,colordict,feats=self.mcolorTracks[trackn]
			if value not in colordict: raise Exception("Value not found in color dictionary")
			feats[tipname]=value
			self._update('addTreeTrackFeature',trackn,tipname,colordict[value],value,value)
			

	def delTrackFeature(self,trackn,tipname):
		'''Deletes a feature present on a track'''

		assert trackn in self.tracks and tipname in self.newick.nodenames
		if tipname in self.tracks[trackn][2]: del self.tracks[trackn][2][tipname]
		self._update('delTreeTrackFeature',trackn,tipname)

	def addBar(self,description,color,minval,maxval):
		'''Outside the tracks, bars can be drawn showing extra information. You can have as many bars you want per sector (tip) (eg: if you want two bars in a barplot per tip, you call addBar twice and then you populate them with data
	
- description: Text description for the legend
- color: color used for the bar
- minval: minimum value of the data that the bars will show
- maxval: maximum value of the data that the bars will show

		Returns the Bar identifier to be used to add data to it 
		(See example below)
		'''

		self.nbars+=1
		self.trackBars[self.nbars]=[description,color,minval,maxval,{}]
		self._update('deleteBars')
		self._refreshBars()
		return self.nbars

	def addTrackBar(self,nbar,tipname,value):
		'''Adds data to a bar
	
- nbar: bar ID provided by addBar function
- tipname: name of the tip you will add data to
- value: Value the the bar will show 

.. code:: python

		p=PhyloTree()
		p.setData("file.newick")
		contaminationBars=p.addBar('contamination','green',0,28)
		p.addTrackBar(contaminationBars,'sample1',4)
		p.addTrackBar(contaminationBars,'sample2',22)
		p.addTrackBar(contaminationBars,'sample3',17) '''

		if not 0<nbar<=self.nbars: raise Exception("Bar number does not exist")
		_,color,minval,maxval,tipbars=self.trackBars[nbar]
		rng=maxval-minval
		val=value-minval
		val=rng-val
		val=1-float(val)/rng

		tipbars[tipname]=value

		self._update('addTreeTrackBar',value,val,tipname,color,nbar,self.nbars)

	def clearTracks(self):
		'''Clears all information in tracks'''
		self.tracks={}
		self.gradientTracks={}
		self.ntracks=0
		self._update("deleteTracks")

	def clearBars(self):
		'''Clears all bars around the tracks'''
		self.trackBars={}
		self.nbars=0
		self._update("deleteBars")

	def markClade(self,nodes,color):
		'''Marks the region of a clade given a fill color

- nodes: Is a list of tips/internalnodes
- color: HTML compatible color '''

		if type(nodes) not in [list,set]: nodes=[nodes]
		nodes=self.newick.getMonophyletics(nodes)

		for clade in nodes:
			self.cladeMarks[clade]=color
			self._update("markClade",clade,color)

	def unMarkClade(self,clade):
		'''Removes a mark for a clade'''
		del self.cladeMarks[clade]
		self._update("unMarkClade",clade)

	def clearCladeMarks(self):
		'''Removes all clade marks'''
		for i in self.cladeMarks.keys():
			self.unMarkClade(i)

	def setCladeColor(self,nodes,color):
		'''Sets tree color for a clade

- nodes: Is a list of tips/internalnodes
- color: HTML compatible color '''

		if type(nodes) not in [list,set]: nodes=[nodes]
		nodes=self.newick.getMonophyletics(nodes)

		for clade in nodes:
			self.cladeColors[clade]=color
			self._update("setCladeColor",clade,color)

	def clearCladeColor(self,clade):
		'''Clears tree color given a clade'''
		del self.cladeColors[clade]
		self._update("clearCladeColor",clade)
