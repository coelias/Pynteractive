////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////    User Interface Loader (UIL)    /////////////
////////////////////////////////////////////////////////////
var element;

$(function () {

	//load generic graphic element
	$('head').append('<script src="js/element.js"></script>');

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
	}

});


function loadTreeVisualization(){
	//load specific graphic element
	$('head').append('<script src="js/treeElement.js"></script>');
	element = new treeElement();
	element.loadInstance();
}

function loadGraphVisualization(){
	//load specific graphic element
	$('head').append('<script src="js/graphElement.js"></script>');
	element = new graphElement();
	element.loadInstance();
}

function loadMapVisualization(){
	//load specific graphic element
	$('head').append('<script src="js/mapElement.js"></script>');
	element = new mapElement();
	element.loadInstance();
}