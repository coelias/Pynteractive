from pynteractive.datastruct import *
import os
from pynteractive.newickParser import *
from pynteractive.htmlcolors import HTMLCOLORS
import re


class PhyloTree(DataStruct):
    recolor = re.compile("^#[0-9a-f]{6}$")

    def __init__(self, name=None):
        DataStruct.__init__(self, name)
        self.initialize()
        self.newick.readNewick("(no:10,(tree:10,loaded:10):10):10;")

    def initialize(self):
        self.newick = ""
        self.features = {}
        self.tipfeatures = {}
        self.heatMaps = {}
        self.tipHeatMaps = {}
        self.newick = Newick()
        self.tracks = {}
        self.gradientTracks = {}
        self.ntracks = 0
        self.trackBars = {}
        self.nbars = 0
        self.cladeMarks = {}
        self.cladeColors = {}

#	def __getHexColor(self,trackn,val):
#		_,color,minval,maxval,_=self.gradientTracks[trackn]
#		if color in HTMLCOLORS: color=HTMLCOLORS[color]
#		color=color.lower()
#		if not PhyloTree.recolor.findall(color): raise Exception('Wrong color format (HTML valid color name or color code (#ff00ff))')
#		rng=maxval-minval
#		val-=minval
#		val=rng-val
#		val=float(val)/rng
#		colvals=[int(color[i:i+2],16) for i in range(1,7,2)]
#		colvals=[min([int(i+(255-i)*val),255]) for i in colvals]
#		html="#"+"".join(["{0:0>2}".format(hex(i)[2:]) for i in colvals])
#		return html

    def setData(self, newick=None):
        '''Draws the specified newick tree, It can be either a string containing the newick string or a path to a file'''
        self.initialize()
        self.newick.readNewick(newick)
        self._update('setData', str(self.newick))
        self.clearBars()
        self.clearTracks()
        self.tipfeatures = {}

    def _refresh(self):
        self._update('setData', str(self.newick))

        for trackn, data in self.tracks.items():
            self._update('newFeature', data[0], trackn, data[1])
            for tipname, title in data[2].items():
                self._update('addTipFeature', trackn, tipname, data[1])

        for trackn, data in self.gradientTracks.items():
            self._update('newGradientFeature', data[0], trackn, data[1],
                         data[2], data[3])
            for tipname, value in data[4].items():
                self._update('addTipFeature', trackn, tipname, value)

        for number, [size, color, desc] in self.heatMaps.items():
            self._update("newHeatMap", number, size, color)

        for tip, tracks in self.tipHeatMaps.items():
            for number, data in tracks.items():
                self._update("addTipHeatMap", tip, number, data)

        for tipname, color in self.cladeMarks.items():
            self._update("markClade", tipname, color)

        for tipname, color in self.cladeColors.items():
            self._update("setCladeColor", tipname, color)

    def deleteTip(self, name):
        '''Deletes a leaf from the Tree'''
        del self.newick[name]
        self._update("delLeaf", name)

    def getTips(self):
        '''Returns a set containing all the tip names found in the tree'''
        return [i.name for i in self.newick.leafs.values()]

    def nodeClick(self, nid):
        '''Method called when a node is clicked'''
        pass

    def selectTips(self, tips):
        '''Method usd to select nodes in the view (tree tips), you must provide tip labels'''
        self._update('selectTips', tips)

    def selectClade(self, tips):
        '''Select the clade containing a set of given tips'''
        dad = self.newick.getCommonParent(tips)
        print dad.name
        self._update('selectTips', [dad.name])

    def clearSelection(self):
        '''Method to clear the current selection in the tree'''
        self._update('clearNewickSelection')

    def newFeature(self, number, description, color):
        '''Ads a track as an external ring. This is a BOOLEAN track, where any tip can be flagged in the track. When clicking a coloured tip on the track, all the tips flagged in the track will automatically be selected

- description: Text used for the legend
- color: color used for the flagged tips on the track

		Returns the track ID that you will have to use to add data to it'''
        assert number not in self.tracks and number not in self.gradientTracks

        color = colorvector(color)
        self.tracks[number] = [description, color, {}]
        self._update('newFeature', description, number, color)

    def newGradientFeature(self, number, description, color, minval, maxval):
        '''A gradient Track is a track where tips in the tree can have a continuous value, and the color will be shown as a gradient color. You must specify minval and maxval of the track so that the gradient can be calculated

- description: Text used for the legend
- color: color used for the gradient on track
- minval: Minimum value of the range of values this track will have
- maxval: Minimum value of the range of values this track will have

		Returns the track ID that you will have to use to add data to it'''
        assert number not in self.tracks and number not in self.gradientTracks

        color = colorvector(color)
        self.gradientTracks[number] = [description, color, minval, maxval, {}]
        self._update('newGradientFeature', description, number, color, minval,
                     maxval)

    def delFeature(self, number):
        if number in self.gradientTracks:
            del self.gradientTracks[number]
        elif number in self.tracks:
            del self.tracks[number]
        self._update('delPhyloFeature', number)

    def addTipFeature(self, tipname, trackn, value=False):
        '''Adds a data to a track:

- trackn: Track number to add data to
- tipname: The tip you want to add the feature to
- value: Only required/necessary if it's a gradient track

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
        if trackn in self.gradientTracks:
            if type(value) == bool:
                raise Exception(
                    "You must specify a value for a gradient track")
            self.gradientTracks[trackn][4][tipname] = value
        elif trackn in self.tracks:
            if value != False:
                raise Exception("This track does not accept values")
            self.tracks[trackn][2][tipname] = True
        self._update('addTipFeature', trackn, tipname, value)


#		elif trackn in self.mcolorTracks:
#			desc,colordict,feats=self.mcolorTracks[trackn]
#			if value not in colordict: raise Exception("Value not found in color dictionary")
#			feats[tipname]=value
#			self._update('addTreeTrackFeature',trackn,tipname,colordict[value],value,value)

    def delTipFeature(self, tipname, trackn):
        '''Deletes a feature present on a track'''
        assert trackn in self.tracks and tipname in self.newick.nodenames
        if tipname in self.tracks[trackn][2]:
            del self.tracks[trackn][2][tipname]
        self._update('delTipFeature', trackn, tipname)

    def newHeatMap(self, number, size, color, description):
        assert number not in self.heatMaps
        color = colorvector(color)
        self.heatMaps[number] = [size, color, description]
        self._update("newHeatMap", number, size, color, description)

    def addTipHeatMap(self, tip, number, data):
        assert number in self.heatMaps and tip in self.newick.nodenames
        assert len(data) == self.heatMaps[number][0]
        self.tipHeatMaps.setdefault(tip, {})[number] = data
        self._update("addTipHeatMap", tip, number, data)

    # TODO
    def addBar(self, description, color, minval, maxval):
        '''Outside the tracks, bars can be drawn showing extra information. You can have as many bars you want per sector (tip) (eg: if you want two bars in a barplot per tip, you call addBar twice and then you populate them with data

- description: Text description for the legend
- color: color used for the bar
- minval: minimum value of the data that the bars will show
- maxval: maximum value of the data that the bars will show

		Returns the Bar identifier to be used to add data to it
		(See example below)
		'''

        self.nbars += 1
        self.trackBars[self.nbars] = [description, color, minval, maxval, {}]
        self._update('deleteBars')
        self._refreshBars()
        return self.nbars

    # TODO
    def addTrackBar(self, nbar, tipname, value):
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

        if not 0 < nbar <= self.nbars:
            raise Exception("Bar number does not exist")
        _, color, minval, maxval, tipbars = self.trackBars[nbar]
        rng = maxval - minval
        val = value - minval
        val = rng - val
        val = 1 - float(val) / rng

        tipbars[tipname] = value

        self._update('addTreeTrackBar', value, val, tipname, color, nbar,
                     self.nbars)

    # TODO
    def clearTracks(self):
        '''Clears all information in tracks'''
        self.tracks = {}
        self.gradientTracks = {}
        self.ntracks = 0
        self._update("deleteTracks")

    # TODO
    def clearBars(self):
        '''Clears all bars around the tracks'''
        self.trackBars = {}
        self.nbars = 0
        self._update("deleteBars")

    def markClade(self, nodes, color):
        '''Marks the region of a clade given a fill color

- nodes: Is a list of tips/internalnodes
- color: HTML compatible color '''

        color = colorvector(color)

        if type(nodes) not in [list, set]: nodes = [nodes]
        nodes = self.newick.getMonophyletics(nodes)

        for clade in nodes:
            self.cladeMarks[clade] = color
            self._update("markClade", clade, color)

    def unMarkClade(self, clade):
        '''Removes a mark for a clade'''
        del self.cladeMarks[clade]
        self._update("unMarkClade", clade)

    def clearCladeMarks(self):
        '''Removes all clade marks'''
        for i in self.cladeMarks.keys():
            self.unMarkClade(i)

    def setCladeColor(self, nodes, color):
        '''Sets tree color for a clade

- nodes: Is a list of tips/internalnodes
- color: HTML compatible color '''
        color = colorvector(color)

        if type(nodes) not in [list, set]: nodes = [nodes]
        nodes = self.newick.getMonophyletics(nodes)

        for clade in nodes:
            self.cladeColors[clade] = color
            self._update("setCladeColor", clade, color)

    def collapseBranch(self, nodes):
        nodes = self.newick.getMonophyletics(nodes)
        self._update("collapseBranch", list(nodes))

    def clearCladeColor(self, clade):
        '''Clears tree color given a clade'''
        del self.cladeColors[clade]
        self._update("clearCladeColor", clade)
