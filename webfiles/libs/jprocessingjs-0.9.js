/*
jProcessingJS v0.9
https://github.com/GildasP/jProcessingJS

by Gildas P. / http://www.gildasp.fr
*/

function jProcessingJS(cible, params){

	if(typeof cible == "object"){

		// paramètres par défaut
		var defaultParams = {
			fullscreen: false,
			responsive: true,
			mouseoverlay: false,
			preventmouse: true,
			touchenabled: true,
			optmath: false
		};

		if(typeof params == "undefined"){
			var params = defaultParams;
		} else {
			for(key in defaultParams){
				if(!params[key]) params[key] = defaultParams[key];
			}
		}

		// un raccourci vers la canvas (dom)
		cible.canvas = cible.externals.canvas;

		// correction du halo par défaut sous chrome...
		cible.canvas.style.outline = 'none';
		cible.canvas.style['-webkit-tap-highlight-color'] = 'rgba(255, 255, 255, 0)'; /* mobile webkit */

		// petit raccourci bonus : background transparent
		cible.transBackground = function(){
			this.background(0,0);
		};

		// outil pour obtenir l'offset de la canvas, si besoin (même placée dans une div en relative par exemple...)
		if(params.responsive || params.mouseoverlay){
			var realOffset = function(item){
				//var item = document.getElementById(img);
				var parent = item.offsetParent;
				var posElmX = 0;
				var posElmY = 0;
				while(parent) {
					posElmX += parent.offsetLeft;
					posElmY += parent.offsetTop;
					parent = parent.offsetParent;
				}
				var positionX = item.offsetLeft + posElmX;
				var positionY = item.offsetTop + posElmY;
				return new Array(positionX, positionY);
			};
		}

		// mode fullscreen
		if(params.fullscreen){

			cible.canvasX = 0;
			cible.canvasY = 0;
			
			var doOnResize = function(){
				cible.size( window.innerWidth, window.innerHeight, cible.externals.context );
			};
			var prevOnresize = window.onresize; // pour ne pas écraser celui d'un autre sketch...
			window.onresize = function(){ 
				if(prevOnresize) prevOnresize();
				doOnResize();
			}
			doOnResize(); // au démarrage

			// positionnement css, pour éviter les barres de scroll
			var positionnement = getComputedStyle(cible.canvas)['position'];
			if(positionnement != 'fixed' && positionnement != 'absolute'){
				cible.canvas.style.position = 'fixed';
			}

		// mode responsive
		} else if(params.responsive){ // mode de déformation de la canvas et du sketch
			var doOnResize = function(){
				var offset = realOffset(cible.canvas);
				cible.canvasX = offset[0];
				cible.canvasY = offset[1]; 
				//cible.canvasX = cible.canvas.offsetLeft;
				//cible.canvasY = cible.canvas.offsetTop; 
				//console.log('coords canvas : '+cible.canvasX+' / '+cible.canvasY);
				cible.size( cible.canvas.offsetWidth, cible.canvas.offsetHeight, cible.externals.context );
				//console.log('dims canvas : '+cible.width+' / '+cible.height);
			};
			var prevOnresize = window.onresize; // pour ne pas écraser celui d'un autre sketch...
			window.onresize = function(){ 
				if(prevOnresize) prevOnresize();
				doOnResize();
			}
			doOnResize(); // au démarrage	

		// mode normal, mais avec prise en charge des events souris en overlay
		} else if(params.mouseoverlay){ // on aura besoin des coordonnées de la canvas, pour savoir si on est au dessus du sketch
			var doOnResize = function(){
				var offset = realOffset(cible.canvas);
				cible.canvasX = offset[0];
				cible.canvasY = offset[1]; 
				//cible.canvasX = cible.canvas.offsetLeft;
				//cible.canvasY = cible.canvas.offsetTop;
			};
			var prevOnresize = window.onresize; // pour ne pas écraser celui d'un autre sketch...
			window.onresize = function(){ 
				if(prevOnresize) prevOnresize();
				doOnResize();
			}
			doOnResize(); // au démarrage	
		}

		// gestion des events souris en cas d'overlay :)
		/*
		Le comportement naturel de procesing.js :
		- mouseButton mouseClicked() mouseDragged() mouseMoved() mouseOut() mouseOver() mousePressed() mousePressed mouseReleased() mouseX mouseY pmouseX pmouseY
		- tous les events sont activés même s'ils ne servent pas dans le sketch
		- impossible de désactiver les events d'origine, qui passent par des fonctions anonymes.
		Rq : pjs transmet déjà les touch events aux mouse events... donc je fais pareil par défaut.
		il y a aussi une méthode de désactivation du clic droit active par défaut.

		- pour la variable mousePressed, on y accède via cible.__mousePressed :)
		*/

		if(params.mouseoverlay){

			/*
			Pas moyen d'annuler les events de processing.js, qui sont tous activés au démarrage, même s'ils ne servent pas...
			On les neutralise en vidant les méthodes associées du sketch.
			-> les events originaux ne déclenchent plus rien
			*/

			// mouseMoved() mouseX mouseY pmouseX pmouseY / mouseDragged() / mouseOut() mouseOver()	
			if(typeof cible.mouseMoved == "function"){ cible.mouseMoved_ = cible.mouseMoved; } else { cible.mouseMoved_ = function(){}; }
			cible.mouseMoved = function(){};
			
			if(typeof cible.mouseDragged == "function"){ cible.mouseDragged_ = cible.mouseDragged; } else { cible.mouseDragged_ = function(){}; }
			cible.mouseDragged = function(){};			
			
			if(typeof cible.mouseOver == "function"){ cible.mouseOver_ = cible.mouseOver; } else { cible.mouseOver_ = function(){}; }
			cible.mouseOver = function(){};

			if(typeof cible.mouseOut == "function"){ cible.mouseOut_ = cible.mouseOut; } else { cible.mouseOut_ = function(){}; }
			cible.mouseOut = function(){};

			if(typeof cible.mousePressed == "function"){ cible.mousePressed_ = cible.mousePressed; } else { cible.mousePressed_ = function(){}; }
			cible.mousePressed = function(){};

			if(typeof cible.mouseReleased == "function"){ cible.mouseReleased_ = cible.mouseReleased; } else { cible.mouseReleased_ = function(){}; }
			cible.mouseReleased = function(){};

			if(typeof cible.mouseClicked == "function"){ cible.mouseClicked_ = cible.mouseClicked; } else { cible.mouseClicked_ = function(){}; }
			cible.mouseClicked = function(){};

			cible.updateMousePosition = function(){}; // désactiver la maj de mouseX et mouseY via pjs

			/*
			une variable pour savoir à tout moment si on est au-dessus du sketch ou pas
			on n'agit via les écouteurs que si on survole le sketch.
			*/
			var hover = false; // état survolé ou non-survolé


			/*
			méthodes déclenchées lors des events; la même méthode pour mouse/touch
			*/

			// mouseMove() / mouseOver() / mouseOut() / mouseDragged() / mouseX mouseY pmouseY pmouseY
			var doOnMove = function(eventX, eventY){

				var relX = eventX - cible.canvasX;
				var relY = eventY - cible.canvasY; //console.log(relX+' / '+relY+' dims : '+cible.width+' / '+cible.height);

				if(!hover && relX>0 && relX<cible.width && relY>0 && relY<cible.height){
					hover = true;
					cible.mouseOver_(); //console.log('plugin mouseOver');
				}
				if(hover && (relX<=0 || relX>=cible.width || relY<=0 || relY>=cible.height)){
					hover = false;
					cible.mouseOut_(); //console.log('plugin mouseOut');
				}

				if(hover){ // action seulement si on est au-dessus de la canvas
					cible.pmouseX = cible.mouseX; 
					cible.pmouseY = cible.mouseY;
					cible.mouseX = relX;
					cible.mouseY = relY;

					cible.mouseMoved_(); //console.log('plugin mouseMoved');

					if(cible.__mousePressed)cible.mouseDragged_();
				}		
			};

			// mousePressed() / mousePressed=true
			var doOnPress = function(keycode){
				if(hover){ // action seulement si on est au-dessus de la canvas					

					switch (keycode) { // ça c'est pris directement de processing.js...
						case 1:
						cible.mouseButton = 37;
						break;
						case 2:
						cible.mouseButton = 3;
						break;
						case 3:
						cible.mouseButton = 39;
						break;
					}

					cible.__mousePressed = true;

					//console.log('plugin mousePressed / mousebutton : '+cible.mouseButton);
					cible.mousePressed_();
				}
			};

			// mouseReleased() / mouseClicked() / mousePressed=false
			var doOnRelease = function(){
				if(hover){ // action seulement si on est au-dessus de la canvas					

					cible.__mousePressed = false;

					//console.log('plugin mouseReleased / mouseClicked');
					cible.mouseReleased_();
					cible.mouseClicked_();
				}
			};


			/*
			déclinaison mouse/touch
			ce qui permet aussi de désactiver manuellement ces events via removeEventListener()
			contrairement aux events natifs de processing.js
			*/

			var doOnMouseMove = function(e){
				doOnMove(e.pageX, e.pageY);
			};
			var doOnTouchMove = function(e){
				e.preventDefault();
				var touch = e.originalEvent.changedTouches[0];
				doOnMove(touch.pageX, touch.pageY);
			};
			var doOnMousePress = function(e){
				if(params.preventmouse){ e.preventDefault(); }
				doOnPress(e.which);
			};
			var doOnTouchPress = function(e){
				e.preventDefault();
				doOnPress(1);
			};
			var doOnMouseRelease = function(e){
				if(params.preventmouse){ e.preventDefault(); }
				doOnRelease();
			};
			var doOnTouchRelease = function(e){
				e.preventDefault();
				doOnRelease();
			};

			/*
			nouveaux écouteurs d'événements, sur le document au lieu du sketch
			*/			
			
			document.addEventListener('mousemove', doOnMouseMove, false);						
			document.addEventListener('mousedown', doOnMousePress, false);							
			document.addEventListener('mouseup', doOnMouseRelease, false);

			if(params.touchenabled){ // touch events
				document.addEventListener('touchmove', doOnTouchMove, false);
				document.addEventListener('touchstart', doOnTouchPress, false);	
				document.addEventListener('touchend', doOnTouchRelease, false);	
			}	
		}

		// quelques optimisations de fonctions mathématiques
		if(params.optMath){
			/*
			Au lieu de rediriger vers les fonctions js de base, autant faire mieux !
			Références :
			http://code.google.com/p/jspeed/
			http://www.html5rocks.com/en/tutorials/canvas/performance/
			*/
			cible.round = function(nb){
				return (0.5 + nb) << 0;
			};
			cible.floor = function(nb){
				return nb >> 0;
			};
			cible.abs = function(nb){
				return nb < 0 ? ~nb++ : nb;
			};
			cible.min = function(nb1, nb2){
				return nb1 < nb2 ? nb1 : nb2;
			};
		}
	}
};