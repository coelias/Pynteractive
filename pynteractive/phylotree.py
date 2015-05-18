from pynteractive.datastruct import *
import os

class PhyloTree(DataStruct):
	def __init__(self,name=None):
		DataStruct.__init__(self,name)
		self.newick=""

	def setNewick(self,newick=None):
		'''Draws the specified newick tree'''
		if os.path.isfile(newick):
			self.newick=open(newick).read().strip()
		
		self._update('setNewick',self.newick)

	def _refresh(self):
		self._update('setNewick',self.newick)

	def nodeClick(self,nid):
		'''Method called when a node is clicked'''
		pass

	def selectTips(self,tips):
		'''Method usd to select nodes in the view (tree tips)'''
		self._update('selectNewickNodes',tips)

	def clearSelection(self):
		'''Method to clear the current selection in the tree'''
		self._update('clearNewickSelection')
