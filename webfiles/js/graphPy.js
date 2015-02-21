$(function () {
	switch(VTYPE) {
		case "Network":
			loadNetworkVisualization();
			break;
	}
});

function loadNetworkVisualization(){
	$.getScript('visPy.js', function() {
		console.log("Network loaded");
	});
}

