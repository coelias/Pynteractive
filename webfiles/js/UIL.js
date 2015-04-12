////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////    User Interface Loader (UIL)    /////////////
////////////////////////////////////////////////////////////
var element;

$(function () {

	//load generic graphic element
	jQuery('head').append('<script src="js/element.js"></script>');

	switch(VTYPE) {
		case "Graph":
			loadGraphVisualization();
			break;
		case "Tree":
			loadTreeVisualization();
			break;
		case "Map":
			loadMapVisualization();
			break;
		case "Chart":
			loadChartVisualization();
			break;
		case "PhyloTree":
			loadPhyloVisualization();
			break;
		case "GraphD3":
			loadGraphD3Visualization();
			break;
		case "TreeD3":
			loadTreeD3Visualization();
			break;
		case "ChartD3":
			loadChartD3Visualization();
			break;
	}

});


function loadTreeVisualization(){
	//load specific element
	jQuery('head').append('<script src="js/treeElement.js"></script>');

	element = new treeElement();
	element.loadInstance();
}

function loadGraphVisualization(){
	//load specific element
	jQuery('head').append('<script src="js/graphElement.js"></script>');

	element = new graphElement();
	element.loadInstance();
}

function loadMapVisualization(){
	//load specific element
	jQuery('head').append('<script src="js/mapElement.js"></script>');

	element = new mapElement();
	element.loadInstance();
}

function loadChartVisualization(){
	//load specific  element
	jQuery('head').append('<script src="js/chartElement.js"></script>');

	element = new chartElement();
	element.loadInstance();
}

function loadPhyloVisualization(){
	//load specific  element
	jQuery('head').append('<script src="js/phyloElement.js"></script>');

	element = new phyloElement();
	element.loadInstance();
}

function loadGraphD3Visualization(){
	//load specific  element
	jQuery('head').append('<script src="js/graphD3Element.js"></script>');

	element = new graphD3Element();
	element.loadInstance();
}

function loadTreeD3Visualization(){
	//load specific  element
	jQuery('head').append('<script src="js/treeD3Element.js"></script>');

	element = new treeD3Element();
	element.loadInstance();
}

function loadChartD3Visualization(){
	//load specific  element
	jQuery('head').append('<script src="js/chartD3Element.js"></script>');

	element = new chartD3Element();
	element.loadInstance();
}
