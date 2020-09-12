/**
* App Name: ThreeDimensionalIndex
* Plugin URI: https://github.com/tommelani/
* Version: 1.0.0
* Author: Tom Melani
* Author URI: https://github.com/tommelani/
* Description: Display a 3D Index of various items
*/

/**
* Class ThreeDimensionalIndex
*/

var threedimensionalindex_options = {
    world_id: 1,
    first_post_id: 1,
    selector: "body",
    texture_directory: "res/textures/",
}
;

class ThreeDimensionalIndex {

    constructor() {

        var that = this;
		
        this.canvas = document.getElementById('renderCanvas');
        this.engine = new BABYLON.Engine(this.canvas, true);
		
        this.scene = new BABYLON.Scene(this.engine); 
		
        //this.scene.debugLayer.show();
		
        this.interface = new THREE_DIMENSIONAL_INDEX.Interface(this);
		
        //Load the world and the interface after the data is loaded
        this.dataset = new THREE_DIMENSIONAL_INDEX.Dataset();

         this.initialize();

    }

    //Initialize the controller
    initialize()
    {
        var that = this;

        this.world = new THREE_DIMENSIONAL_INDEX.World(this);   
        this.camera = new THREE_DIMENSIONAL_INDEX.Camera(this);

        //Wait for all assets being loaded before launching the app
		this.world.createWorld();
		
        this.world.assetsManager.onFinish = function() {

            //Position the assets on the corresponding locators
			that.world.positionAssets();
			
			//Set the target
            var target = Object.keys(that.dataset.hierarchy.nodes)[0];
            if(threedimensionalindex_options.first_post_id != "") {
                target = threedimensionalindex_options.first_post_id;
            }
            
            that.setTarget(target);

            //Run the render loop
            that.engine.runRenderLoop(function(){
                that.camera.followTarget();
                that.scene.render();
            });

            //The canvas/window resize event handler
            window.addEventListener('resize', function(){
                that.engine.resize();
            });

        };

        //Enable collision support
        this.scene.collisionsEnabled = true;
    }


    //Set new target
    setTarget(id) {

        //Get the position corresponding to the name
        var node = this.dataset.hierarchy.nodes[id];

        this.target = node;

        this.update();
    }

    //Update all the dependancies
    update()
    {
        this.world.update();
        this.camera.update();		
        this.interface.update();
    }

}

//Start the script after the DOM is loaded
(function( $ ) {
    window.addEventListener('DOMContentLoaded', function(){
        $(threedimensionalindex_options.selector).prepend('<div id="loadingScreen"></div><canvas id="renderCanvas"></canvas>');
        new ThreeDimensionalIndex();
    });
    
})( jQuery );