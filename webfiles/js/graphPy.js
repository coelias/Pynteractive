$(function () {
	switch(VTYPE) {
		case "Network":
			loadNetworkVisualization();
			break;
	}
});

function loadNetworkVisualization(){
	$.getScript('js/visPy.js', function() {
		console.log("Network loaded");
	});
}

