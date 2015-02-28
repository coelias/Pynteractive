$(function () {
	switch(VTYPE) {
		case "Graph":
		case "Tree":
			loadNetworkVisualization();
			break;
	}
});

function loadNetworkVisualization(){

	 //$.getScript('js/visPy.js', function() {
	 //	console.log("Network loaded");
	 //});
	$('head').append('<script src="js/visPy.js"></script>');
}
