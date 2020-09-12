/**
* App Name: ThreeDimensionalIndex
* Plugin URI: https://github.com/tommelani/
* Version: 1.0.0
* Author: Tom Melani
* Author URI: https://github.com/tommelani/
* Description: Display a 3D Index of various items
*/

/**
* Class THREE_DIMENSIONAL_INDEX.World
*/

var THREE_DIMENSIONAL_INDEX=THREE_DIMENSIONAL_INDEX || {};

THREE_DIMENSIONAL_INDEX.World = class {
    
    constructor(controller, callback) {
        this.controller = controller;
        
        this.items = this.controller.dataset.index.children;
        
        this.assets = new Array();
        this.locators = new Array();
        this.lights = new Array();
        this.materials = new Array();
        this.layers = new Array();

    }
    
    //Create the world
    createWorld(){
		
        this.createMaterials();
        this.createLocators();
		this.loadAssets();
        
        this.createSky();
        this.createLights();
        
        this.animate();
    }
    
    //Animate the world
    animate() {

        for(var key in this.items) {
            var data = this.items[key]['data'];
            
            //If the key "animation" exists
            if(data.hasOwnProperty("animation"))
            {
                this.animateLocator(this.locators[data.id], data.animation);
            }   
            
        }
    }
    
    //Add locators
    createLocators() {
        
        //Build locators based on the items
        for(var key in this.items) {
            var data = this.items[key]['data'];

            //Create the locator
            var locator = new BABYLON.TransformNode(data.id); 
            locator.position = data.position;
			
			this.locators[data.id] = locator;            
        }   
    }
	
    //Load the assets
    loadAssets(callback) {
        
        var that = this;
		
        this.assetsManager = new BABYLON.AssetsManager(this.controller.scene);
        this.assetsManager.useDefaultLoadingScreen = false;
        
        for(var key in this.items)
		{
            var data = this.items[key]['data']; 

            //Check if it's not a blank locator
            if(data.path != null)
            {
				var basename = data.path.replace(/.*\//, '');
				var dirname = data.path.match(/.*\//);
				
				var meshTask = that.assetsManager.addMeshTask(data.id, "", dirname, basename);

				meshTask.onSuccess = function (task) {

					var id = task.name;

					var parent = new BABYLON.TransformNode(id);

					for(var n in task.loadedMeshes) {
						var mesh = task.loadedMeshes[n];
						mesh.parent = parent;
                        
                        mesh.overlayColor = BABYLON.Color3.White();
                        mesh.renderOverlay = true;
                        mesh.overlayAlpha  = 0;
					}

					that.assets[id] = parent;
				}	
			}
		}
		
		this.assetsManager.load();

    }

	//Position the assets on the corresponding locators
	positionAssets(asset) {
		
        for(var key in this.items)
		{
			var data = this.items[key]['data'];
			
            //Check if it's not a blank locator
            if(data.path != null)
            {
                var asset = this.assets[data.id];


                //Set parent		
                var locator = this.locators[data.id];	
                asset.parent = locator;

                var meshes = asset.getChildMeshes();
                for(var n in meshes) {

                    var mesh = meshes[n];					

                    mesh.checkCollisions = true;

                    //mesh.showBoundingBox = true;

                    //For optimization purpose, if the mesh has no animation, freeze it
                    if(!data.animation.hasOwnProperty('type'))
                    {
                        mesh.freezeWorldMatrix();
                    }

                    if(data.pickable)
                    {
                        this.attachActions(mesh);
                    }	
                } 
            }

		}
	}
       

    //Add lights
    createLights() {
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this.controller.scene);
        
        this.lights[light.name] = light;
    }
    
    //Add materials
    createMaterials() {
        //Tranparent
        this.materials.transparent = new BABYLON.StandardMaterial("transparent", this.controller.scene);
        this.materials.transparent.alpha = 0;
		this.materials.transparent.freeze();
        
        //Sky
        this.materials.sky = new BABYLON.StandardMaterial("skyBox",  this.controller.scene);
        this.materials.sky.backFaceCulling = false;
        this.materials.sky.reflectionTexture = new BABYLON.CubeTexture(threedimensionalindex_options.texture_directory + 'skybox', this.controller.scene);
        this.materials.sky.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        this.materials.sky.disableLighting = true;
		this.materials.sky.freeze();
    }
     
    //Animate locators
    animateLocator(locator, animation) {

        //Check the existence of the locator
        if (typeof locator != "undefined") {
            switch(animation.type) {
                    
                //Animation type is 'satellite', ie. rotating around the world center
                case 'satellite':    

                    //Set pivot point to animation target
                    var targetLocator = this.locators[animation.target];                    
                    var pivotPoint = locator.position.subtract(targetLocator.position).multiply(new BABYLON.Vector3(-1,-1,-1));
                    locator.setPivotPoint(pivotPoint);
                    
                    //Create and start animation
                    var satelliteAnimation = new BABYLON.Animation.CreateAndStartAnimation('satelliteAnimation', locator, 'rotation.y', 24, animation.speed, locator.rotation.y, locator.rotation.y + Math.PI*2 * animation.direction, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);  
                    
                break;
                case 'rocket':    
                    
                    //Set pivot point to animation target
                    var targetLocator = this.locators[animation.target]; 

                    //Create and start animation
                    var spaceshipAnimation = new BABYLON.Animation.CreateAndStartAnimation('spaceshipAnimation', locator, 'position', 24, animation.speed, locator.position, targetLocator.position, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);  
                    
                break;
            }
        }
      
    }
    
    //Attach action to a mesh
    attachActions(mesh) {
        
        var that = this;
        mesh.isPickable = true;
        
        mesh.actionManager = new BABYLON.ActionManager(this.controller.scene);

        //OnPickTrigger
        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger, function (event) {
                    
                    //Go to locator
                    var locator = event.source.parent;
                    
                    //Set new target
                    that.controller.setTarget(locator.name);
                }
            )
        ); 
    
        //Only on desktop devices
        if(window.matchMedia("(min-width: 767px)").matches) {
            
            //OnPointerOver, highlight the asset
            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPointerOverTrigger, function (event) {

                        //Go to locator
                        var locator = event.source.parent;

                        //Check if the locator is not already the target
                        if(locator.id != that.controller.target.id) {

                            //Highlight the child meshes
                            var meshes = locator.getChildMeshes();
                            for(var key in meshes) {
                                var mesh = meshes[key];
                                //that.layers.hovered.addMesh(mesh, BABYLON.Color3.Gray());
                                
								mesh.overlayAlpha  = 0.30;

                            }
                        }                    
                    }
                )
            );

            //OnPointerOut, remove the highlight from the meshes
            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPointerOutTrigger, function (event) {
                        //Reset highlight layer
                        //that.layers.hovered.removeAllMeshes();

                        //Go to locator
                        var locator = event.source.parent;

                        //Check if the locator is not already the target
                        if(locator.id != that.controller.target.id) {

                            //Highlight the child meshes
                            var meshes = locator.getChildMeshes();
                            for(var key in meshes) {
                                var mesh = meshes[key];
                                //that.layers.hovered.removeMesh(mesh, BABYLON.Color3.Gray());
                                //
                                if(mesh.material)
								{
									mesh.overlayAlpha  = 0;
								}
                            }
                        }   
                    }
                )
            );   
        }

    }
    
        
    //Add sky
    createSky() {

        this.sky = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, this.controller.scene);
        this.sky.material = this.materials['sky'];
   
    } 
    
    //Update the world
    update() {
        
        //Check if a target is defined
        if(typeof this.controller.target != "undefined")
        {
            var locator = this.controller.world.locators[this.controller.target.id];
            
            //Highlight the child meshes
            var meshes = locator.getChildMeshes();
            for(var key in meshes) {
                var mesh = meshes[key];   
				
				mesh.overlayAlpha = 0;                      
            } 
            
        }
		
    }
    
}