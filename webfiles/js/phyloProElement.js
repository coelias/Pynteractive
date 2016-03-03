function phyloElement() {
};

phyloElement.prototype = new element();
phyloElement.prototype.constructor = phyloElement;

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////    FUNCTIONS    ///////////////////////
////////////////////////////////////////////////////////////

/**
 * Load html page
 */
phyloElement.prototype.loadHtml = function () {
	
	//create tools
	var tag = {};

	tag = {tag:'div', to:'#sidebar', id:'containerNetwork'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'div', to:'#containerNetwork', id:'optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelLog', text: 'Enable/Disable Log'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'enableLog', type: 'checkbox', checked: this.enabledLog, onclick: 'element.changeEnabledLog();'};
	this.loadHtmlTag(tag);
	
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'label', to:'#optionsNetwork', id: 'labelRadius', text: 'Radius'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'sliderRadius', type: 'range', value: this.resolution, min: '960', max: '8192', step: '8', onclick: 'element.changeResolution(value)'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'label', to:'#optionsNetwork', id: 'labelRotate', text: 'Rotate Speed'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'sliderRotate', type: 'range', value: element.rotateFactor, min: '0.5', max: '3', step: '0.2', onclick: 'element.changeRotateSpeed(value)'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelLabel', text: 'Circular Labels'};
	this.loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'enableCircularLabel', type: 'checkbox', checked: this.circularLabel, onclick: 'element.changeCircularLabel();'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelLabel', text: 'Hide Labels'};
	this.loadHtmlTag(tag);
	tag = {tag:'input', to:'#optionsNetwork', id: 'disableTipLabels', type: 'checkbox', checked: this.disableTipLabels, onclick: 'element.toggleTipLabels();'};
	this.loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'disableNodeCirclesLabel', text: 'Hide Node Circles'};
	this.loadHtmlTag(tag);
	tag = {tag:'input', to:'#optionsNetwork', id: 'disableNodeCirclesLabel', type: 'checkbox', checked: this.disableNodeCirclesLabel, onclick: 'element.toggleNodeCircles();'};
	this.loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);
	tag = {tag:'hr', to:'#optionsNetwork'};
	this.loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'ExportSVG', text: 'Export SVG'};
	this.loadHtmlTag(tag);
	tag = {tag:'button', to:'#optionsNetwork', id: 'exportSVGButton', type: 'button', onclick: 'element.exportSVG();'};
	this.loadHtmlTag(tag);

};

/**
 * Load graph on layout div html page
 */
phyloElement.prototype.load = function () {
	canvas = document.createElement('canvas');
	canvas.id = "mycanvas"

	canvas.setAttribute("id", "mycanvas");
	canvas.setAttribute("data-processing-sources", "../js/anything2.pjs");
	canvas.setAttribute("tabindex", "0");
	
	document.getElementById('layout').appendChild(canvas)
	
};

phyloElement.prototype.initParams=function(){}
phyloElement.prototype.setData=function(x)
{
	loadTree(x);
}
phyloElement.prototype.repaint=function(){}

phyloElement.prototype.action = function (e){
	var id = jQuery(e).attr("idaction");
	PYCON.send('performAction',{n:id,selectedNodes:TREE.getSelected()});
};
