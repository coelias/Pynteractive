from pynteractive.datastruct import *
import os

class PhyloTree(DataStruct):
	def __init__(self,name):
		DataStruct.__init__(self,name)

	def setNewick(self,newick=None):
		if os.path.isfile(newick):
			newick=open(newick).read().strip()
		
		self._update('setNewick',newick)

