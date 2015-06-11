from pynteractive.datastruct import *
import os
from newickParser import *

class PhyloTree(DataStruct):
	def __init__(self,name=None):
		DataStruct.__init__(self,name)
		self.newick=""
		self.features={}
		self.tipfeatures={}
		self.newick=Newick()

	def setData(self,newick=None):
		'''Draws the specified newick tree, It can be either a string containing the newick string or a path to a file'''
		self.newick.readNewick(newick)
		self._update('setData',str(self.newick))

	def _refresh(self):
		self._update('setData',str(self.newick))
		for i,j in self.features.items():
			self._update('addPhyloFeat',i,*j)

		for i,j in self.tipfeatures.items():
			for k in j:
				self._update('addPhyloTipFeat',i,k)

	def getTips(self):
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
		assert fid in self.features
		self.tipfeatures.setdefault(tid,[]).append(fid)
		self._update('addPhyloTipFeat',tid,fid)


