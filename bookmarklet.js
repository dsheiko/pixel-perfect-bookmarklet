/**
 * jscs standard:Jquery
 */
(function(){
			/**
			 * @module
			 */
	var storage = (function(){
				/**
				 * @constant
				 */
				var PREF = "pixelPerfect_";
				return {
					/**
					 * @param {string} key
					 * @returns {*}
					 */
					get: function( key ) {
						return window.localStorage.getItem( PREF + key );
					},
					/**
					 * @param {string} key
					 * @param {*} val
					 */
					set: function( key, val ) {
						window.localStorage.setItem( PREF + key, val );
					}
				};
			}()),
			/**
			 * @constant
			 * @default
			 * @type {number{
			 */
			KEYCODE_UP = 38,
			/**
			 * @constant
			 * @default
			 * @type {number{
			 */
			KEYCODE_DOWN = 40,
			/**
			 * @callback doneCb
			 * @param {Node} container
			 */

			/**
			 * Load widget markup
			 * @param {doneCb} doneCb
			 * @returns {void}
			 */
			loadHtml = function( doneCb ){
				var node = document.createElement( "div" );
				node.id = "pixel-perfect-container";
				node.innerHTML = '' +
'	<link rel="stylesheet" type="text/css" href="https://dsheiko.github.io/pixel-perfect-bookmarklet/style.css">' +
'		<div class="pixel-perfect-panel" draggable="true">' +
'		<div>' +
'			<a class="pixel-perfect-panel-close">Close</a>' +
'			<div class="pixel-perfect-panel-main">' +
'				<div>Overlay: <button class="pixel-perfect-overlay-btn">Off</button></div>' +
'				<div>Settings: <button class="pixel-perfect-settings-btn">Show</button></div>' +
'				<form class="pixel-perfect-panel-settings pixel-perfect-hidden">' +
'					<fieldset>' +
'						<label>image:</label><input type="file" name="image" class="pixel-perfect-overlay-image" multiple accept="image/*" />' +
'					</fieldset>' +
'					<fieldset>' +
'						<label>top (px):</label><input type="text" name="top" class="pixel-perfect-overlay-top" />' +
'					</fieldset>' +
'					<fieldset>' +
'						<label>left (px):</label><input type="text" name="left" class="pixel-perfect-overlay-left" />' +
'					</fieldset>' +
'					<p>Use arrow keys `up` and `down` with or without `Shift`</p>' +
'					<fieldset>' +
'						<label>opacity:</label><input type="range" min="0" max="1" step="0.05" name="opacity" class="pixel-perfect-overlay-opacity" />' +
'					</fieldset>' +
'				</form>' +
'			</div>' +
'			<div class="pixel-perfect-panel-footer" draggable="true">' +
'				<a href="https://dsheiko.github.io/pixel-perfect-bookmarklet/">Pixel Perfect Bookmarklet</a>' +
'			</div>' +
'		</div>' +
'	</div>' +
'	<img class="pixel-perfect-overlay"  draggable="true" />';
				document.body.appendChild( node );
				doneCb( node );
			},

			/**
			 * @class
			 * @param {Node} container
			 */
			DragAndDrop = function( container ) {
				/**
				 * @type {object}
				 * @property {number} top
				 * @property {number} left
				 */
				var transferObjOnStartState = {
								top: 0,
								left: 0
						},
						/**
						 * @type {Node}
						 */
						panel = container.querySelector( ".pixel-perfect-panel" ),
						footer = container.querySelector( ".pixel-perfect-panel-footer" );
				return {
					/**
					 * @constructs
					 */
					init: function() {
						this.bindUi();
					},
					/**
					 * Register listeners
					 */
					bindUi: function() {
						footer.addEventListener( "dragstart", this.handleDragStart, false );
						footer.addEventListener( "dragover", this.handleDragOver, false );
						footer.addEventListener( "drop", this.handleDrop, false );
						footer.addEventListener( "dragend", this.handlerDragEnd, false );
					},
					/**
					 * @param {Event} e
					 */
					handleDragStart: function( e ){
						var style = window.getComputedStyle( panel );
						transferObjOnStartState = {
							top: e.screenY - style.top.replace( "px", "" ),
							left: e.screenX - style.left.replace( "px", "" )
						};
						panel.style.opacity = "0.5";
						e.dataTransfer.effectAllowed = "move";
						e.dataTransfer.setData( "text/html", panel.innerHTML );
					},
					/**
					 * @param {Event} e
					 */
					handleDragOver: function( e ) {
						if ( e.preventDefault ) {
							e.preventDefault();
						}
						e.dataTransfer.dropEffect = "move";
					},
					/**
					 * @param {Event} e
					 */
					handleDrop: function( e ){
						if ( e.stopPropagation ) {
							e.stopPropagation();
						}
						return false;
					},
					/**
					 * @param {Event} e
					 */
					handlerDragEnd: function( e ){
						var left = e.screenX - transferObjOnStartState.left,
								top = e.screenY - transferObjOnStartState.top;
						panel.style.opacity = "1";
						left = left > 0 ? ( left < window.innerWidth - 200 ? left : window.innerWidth - 200 ) : 0;
						top = top > 0 ? ( top < window.innerHeight - 240 ? top : window.innerHeight - 240 ) : 0;
						panel.style.left = left;
						panel.style.top = top;
					}
				};
			},

			/**
			 * @class
			 * @param {Node} overlay
			 * @param {object} overlaySettings
			 */
			DragAndDropOverlay = function( overlay, overlaySettings ) {
				/**
				 * @type {object}
				 * @property {number} top
				 * @property {number} left
				 */
				var transferObjOnStartState = {
								top: 0,
								left: 0
						};
				return {
					/**
					 * @constructs
					 */
					init: function() {
						this.bindUi();
					},
					/**
					 * Register listeners
					 */
					bindUi: function() {
						overlay.addEventListener( "dragstart", this.handleDragStart, false );
						overlay.addEventListener( "dragover", this.handleDragOver, false );
						overlay.addEventListener( "drop", this.handleDrop, false );
						overlay.addEventListener( "dragend", this.handlerDragEnd, false );
					},
					/**
					 * @param {Event} e
					 */
					handleDragStart: function( e ){
						var style = window.getComputedStyle( overlay );
						transferObjOnStartState = {
							top: e.screenY - style.top.replace( "px", "" ),
							left: e.screenX - style.left.replace( "px", "" )
						};
						e.dataTransfer.effectAllowed = "move";
						e.dataTransfer.setData( "text/html", overlay.innerHTML );
					},
					/**
					 * @param {Event} e
					 */
					handleDragOver: function( e ) {
						if ( e.preventDefault ) {
							e.preventDefault();
						}
						e.dataTransfer.dropEffect = "move";
					},
					/**
					 * @param {Event} e
					 */
					handleDrop: function( e ){
						if ( e.stopPropagation ) {
							e.stopPropagation();
						}
						return false;
					},
					/**
					 * @param {Event} e
					 */
					handlerDragEnd: function( e ){
						var left = e.screenX - transferObjOnStartState.left,
								top = e.screenY - transferObjOnStartState.top;

						left = left > 0 ? left : 0;
						top = top > 0 ? top : 0;

						storage.set( "left", left );
						storage.set( "top", top );
						overlaySettings.left.value = left;
						overlaySettings.top.value = top;
						overlay.style.left = left + "px";
						overlay.style.top = top + "px";
					}
				};
			},

			/**
			 * @class
			 * @param {Node} container
			 */
			Main = function( container ) {
						/** @type {Node} */
				var overlayBtn = container.querySelector( ".pixel-perfect-overlay-btn" ),
						/** @type {Node} */
						settingsBtn = container.querySelector( ".pixel-perfect-settings-btn" ),
						/** @type {Node} */
						overlay = container.querySelector( ".pixel-perfect-overlay" ),
						/** @type {Node} */
						settingsPanel = container.querySelector( ".pixel-perfect-panel-settings" ),
						/** @type {Node} */
						closePanelBtn = container.querySelector( ".pixel-perfect-panel-close" ),
						/**
						 * @type {object}
						 * @property {Node} image
						 * @property {Node} top
						 * @property {Node} left
						 * @property {Node} opacity
						 */
						overlaySettings = {
							top: container.querySelector( ".pixel-perfect-overlay-top" ),
							left: container.querySelector( ".pixel-perfect-overlay-left" ),
							opacity: container.querySelector( ".pixel-perfect-overlay-opacity" )
						},
						/** @type {Node} */
						image = container.querySelector( ".pixel-perfect-overlay-image" ),
						/**
						 * @type {object}
						 * @property {Node} image
						 * @property {Node} top
						 * @property {Node} left
						 * @property {Node} opacity
						 */
						settings = {
							image: "",
							top: "0",
							left: "0",
							opacity: "0.8"
						};

				return {
					/**
					 * @constructs
					 */
					init: function() {
						this.bindUi();
						this.syncUi();
						( new DragAndDropOverlay( overlay, overlaySettings ) ).init();
					},

					/**
					 * Sync UI state
					 */
					syncUi: function() {
						// Fill out the form
						Object.keys( overlaySettings ).forEach(function( key ){
							overlaySettings[ key ].value = storage.get( key ) || settings[ key ];
							storage.set( key, overlaySettings[ key ].value );
						});
						// Update overlay style
						this.updateOverlay();
					},
					/**
					 * Register listeners
					 */
					bindUi: function() {
						var that = this,
								/**
								 * Proxy
								 * @param {Event} e
								 */
								handleInputChange = function( e ) {
									that.handleInputChange( e );
								},
								/**
								 * Proxy
								 * @param {Event} e
								 */
								handleInputKeyUp = function( e ) {
									that.handleInputKeyUp( e );
								};

						overlayBtn.addEventListener( "click", function( e ){
							e.preventDefault();
							that.toggleOverlay();
						}, false );
						settingsBtn.addEventListener( "click", function( e ){
							e.preventDefault();
							that.toggleSettings();
						}, false );

						closePanelBtn.addEventListener( "click", function( e ){
							e.preventDefault();
							container.parentNode.removeChild( container );
						}, false );

						Object.keys( overlaySettings ).forEach(function( key ){
							overlaySettings[ key ].addEventListener( "change", handleInputChange, false );
							overlaySettings[ key ].addEventListener( "input", handleInputChange, false );
						});

						overlaySettings[ "top" ].addEventListener( "keyup", handleInputKeyUp, false );
						overlaySettings[ "left" ].addEventListener( "keyup", handleInputKeyUp, false );

						image.addEventListener( "change", function(){
							that.handleImageInputChange( this.files );
						}, false );
					},
					/**
					 * Update styles of overlay node from form input values
					 */
					updateOverlay: function() {
						var re = /[^\d-]/;
						try {
							overlay.style.top = storage.get( "top" ).replace( re, "" ) + "px";
							overlay.style.left = storage.get( "left" ).replace( re, "" ) + "px";
							overlay.style.opacity = storage.get( "opacity" );
							overlay.src = storage.get( "image" );
						} catch( e ) {
							// keep silentce
						}
					},
					/**
					 * Handle keyup event
					 * @param {Event} e
					 */
					handleInputKeyUp: function( e ){
						e.stopPropagation();
						e.preventDefault();

						if ( e.keyCode === KEYCODE_UP && !e.shiftKey ) {
							e.target.value = window.parseInt( e.target.value, 10 ) + 1;
						}
						if ( e.keyCode === KEYCODE_UP && e.shiftKey ) {
							e.target.value = window.parseInt( e.target.value, 10 ) + 10;
						}
						if ( e.keyCode === KEYCODE_DOWN && !e.shiftKey ) {
							e.target.value = window.parseInt( e.target.value, 10 ) - 1;
						}
						if ( e.keyCode === KEYCODE_DOWN && e.shiftKey ) {
							e.target.value = window.parseInt( e.target.value, 10 ) - 10;
						}
						if ( window.parseInt( e.target.value, 10 ) < 0 ) {
							e.target.value = "0";
						}
						this.handleInputChange( e );
					},
					/**
					 * Handle event when an image file input changed
					 * @param {File[]} files
					 */
					handleImageInputChange: function( files ){
						var that = this,
								reader = new FileReader();
						if ( files.length ) {
							reader.onload = function( e ){
								storage.set( "image", e.target.result );
								that.updateOverlay();
							};
							reader.readAsDataURL( files[ 0 ] );
						}
					},
					/**
					 * Handle event when an input changed
					 * @param {type} e
					 */
					handleInputChange: function( e ){
						storage.set( e.target.name, e.target.value );
						this.updateOverlay();
					},
					/**
					 * Toggle overlay state
					 */
					toggleOverlay: function(){
						if ( overlayBtn.innerHTML === "On" ) {
							overlayBtn.innerHTML = "Off";
							overlay.classList.remove( "pixel-perfect-hidden" );
						} else {
							overlayBtn.innerHTML = "On";
							overlay.classList.add( "pixel-perfect-hidden" );
						}
					},
					/**
					 * Toggle settigs panel state
					 */
					toggleSettings: function(){
						if ( settingsBtn.innerHTML === "Show" ) {
							settingsBtn.innerHTML = "Hide";
							settingsPanel.classList.remove( "pixel-perfect-hidden" );
						} else {
							settingsBtn.innerHTML = "Show";
							settingsPanel.classList.add( "pixel-perfect-hidden" );
						}
					}
				};
			};

	if ( typeof window.localStorage === "undefined" || typeof FileReader === "undefined" ){
		alert( "Sorry, cannot do it - your browser is too old" );
	}
	loadHtml(function( container ){
		( new Main( container ) ).init();
		( new DragAndDrop( container ) ).init();
	});

}());
