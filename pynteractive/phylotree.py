from pynteractive.datastruct import *
import os

class PhyloTree(DataStruct):
	def __init__(self,name=None):
		DataStruct.__init__(self,name)
		self.newick=""

	def setNewick(self,newick=None):
		if os.path.isfile(newick):
			self.newick=open(newick).read().strip()
		
		self._update('setNewick',self.newick)

	def _refresh(self):
		self._update('setNewick',self.newick)

	def nodeClick(self,nid):
		pass

	def selectTips(self,tips):
		self._update('selectNewickNodes',tips)

	def clearSelection(self):
		self._update('clearNewickSelection')
		

