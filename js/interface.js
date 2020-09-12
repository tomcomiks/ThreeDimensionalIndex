/**
* App Name: ThreeDimensionalIndex
* Plugin URI: https://github.com/tommelani/
* Version: 1.0.0
* Author: Tom Melani
* Author URI: https://github.com/tommelani/
* Description: Display a 3D Index of various items
*/

/**
* Class THREE_DIMENSIONAL_INDEX.Interface
*/

var THREE_DIMENSIONAL_INDEX=THREE_DIMENSIONAL_INDEX || {};

THREE_DIMENSIONAL_INDEX.Interface = class {

	constructor(controller)
	{
		this.controller = controller;
		this.loadingScreenDiv = window.document.getElementById("loadingScreen");
		this.initialize();
	}

    //Initialize the interface
	initialize() {
		this.setLoadingScreen();
	}

    //Update the interface
	update()
	{	
		var that = this;
		window.document.getElementsByClassName('threedimensionalindex-title')[0].innerHTML = that.controller.target.data['title'];
		window.document.getElementsByClassName('threedimensionalindex-content')[0].innerHTML = that.controller.target.data['content'];
	}
	
    //Set the options for the loading screen
	setLoadingScreen() {
		
		var that = this;
		
		BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
            //console.log("customLoadingScreen loading");
            that.loadingScreenDiv.innerHTML = "Loading...";
		};

		BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function(){
			//console.log("customLoadingScreen loaded");
			that.loadingScreenDiv.style.display = "none";
		}	
		
		this.controller.engine.displayLoadingUI();	

	}

}