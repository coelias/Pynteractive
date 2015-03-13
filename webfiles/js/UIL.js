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
	}

});


function loadTreeVisualization(){
	//load specific graphic element
	jQuery('head').append('<script src="js/treeElement.js"></script>');
	element = new treeElement();
	element.loadInstance();
}

function loadGraphVisualization(){
	//load specific graphic element
	jQuery('head').append('<script src="js/graphElement.js"></script>');

	//var script = document.createElement("script");
	//script.setAttribute("src", "js/graphElement.js");
	//document.head.appendChild(script); 

	//var script = document.createElement("script");
	//script.setAttribute("src", "js/graphElement.js");
	//document.getElementsByTagName('head')[0].appendChild(script);

	element = new graphElement();
	element.loadInstance();
}

function loadMapVisualization(){
	//load specific graphic element
	jQuery('head').append('<script src="js/mapElement.js"></script>');
	element = new mapElement();
	element.loadInstance();
}
