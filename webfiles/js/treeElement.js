function treeElement() {

};

treeElement.prototype = new element();
treeElement.prototype.constructor = treeElement;

/**
 * Re paint all the layout taking into account three physics options {barnesHut, barnesHut disabled and hierarchical}
 */
treeElement.prototype.reDrawLayout = function (){

	this.destroy();

	switch(this.enabledLayout) {
		case 1: //smoothCurves: {dynamic:false, type: "continuous"}
			this.options = {stabilize: true, stabilizationIterations:1, smoothCurves: false};
			this.network = new vis.Network(this.container, this.data, this.options);
			break;
		case 2:
			this.options = {stabilize: true, smoothCurves: false};
			this.network = new vis.Network(this.container, this.data, this.options);
			break;
	}

	this.reDrawToolLayout();

	this.network.freezeSimulation(this.freezeLayout);
};
