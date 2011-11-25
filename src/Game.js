var Game = {

	gameover : false,

	init : function( gl ) {

		Settings.init();

		Stats.init();
		Stats.loadSettings();

		Menu.init();

		Camera.init();

		Element.init( gl );
		Grid.init();

		// moved to Menu.showHUD()
		// EventHandler.init();

		this.reset();

	},

	draw : function( gl ) {

		var redraw = false;

		if ( Settings.animations && TWEEN.getAll().length ) {

			if ( Grid.leftClicked || Grid.rightClicked ) {

				TWEEN.completeAll();

				Grid.leftClicked = Grid.rightClicked = false;

			} else {

				TWEEN.update();

			}

			redraw = true;

		}


		Grid.update();


		if ( Camera.update() ) {

			mat4.set( Camera.getMvMatrix(), gl.matrix );

			if ( Camera.updateRotation ) {

				Camera.updateFaceDirections( gl, Face.vertices, Face.attributeBuffer );

			}

			Grid.setElementInRay( null );

			redraw = true;

		}

		if ( Camera.updateRay ) {

			Grid.getCubeInRay( Camera.getMouseRay() );

		}


		if ( Grid.redraw || redraw ) {

			gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

			Grid.draw( gl );

		}

	},

	reset : function() {

		this.gameover = false;

		TWEEN.removeAll();

		Camera.reset();

	},

	start : function( resize ) {

		this.saveStats( Grid.playTime, false );

		if ( resize ) {

			Grid.init();

		} else {

			Grid.start();

		}

		this.reset();

	},

	restart : function() {

		this.saveStats( Grid.playTime, false );

		Grid.restart();

		this.reset();

	},

	over : function( won ) {

		var name = Settings.getKey();

		this.saveStats( Grid.playTime, won );

		this.gameover = true;

		Grid.showMines();

		if ( won ) {

			if ( Stats.updateScores( name, Grid.playTime ) ) {

				Menu.showScores( name );

			}

			Menu.win();

		} else {

			Menu.lose();

		}

	},

	saveStats : function( time, won ) {

		if ( !this.gameover && Grid.started ) {

			Stats.updateStats( time, won );
			Menu.updateStats();

		}

	}

};
