/**
* App Name: ThreeDimensionalIndex
* Plugin URI: https://github.com/tommelani/
* Version: 1.0.0
* Author: Tom Melani
* Author URI: https://github.com/tommelani/
* Description: Display a 3D Index of various items
*/

/**
* Class THREE_DIMENSIONAL_INDEX.Camera
*/

var THREE_DIMENSIONAL_INDEX=THREE_DIMENSIONAL_INDEX || {};

THREE_DIMENSIONAL_INDEX.Camera = class {

    constructor(controller) {   
        this.controller = controller;
        this.createCamera();
    }
    
    //Create the camera
    createCamera(){  
        
        var that = this;
        
        this.maxRadius = 40;
        this.minRadius = this.maxRadius * 0.15;
        
        this.offsetY = 0;

        var alpha = 0;
        var beta =  Math.PI/2*5/6;
        var radius = 20;
        var target = new BABYLON.Vector3(0, this.offsetY,0);
        
        //Creates, angles, distances and targets the camera
	    this.camera = new BABYLON.ArcRotateCamera("Camera", alpha, beta, this.maxRadius, target, this.controller.scene);

        //Enable autorotation
        this.camera.useAutoRotationBehavior = true;
        
        //Ghost camera to calculate new alpha when move
        this.ghostCamera = this.camera.clone();
        
        //Zoom min and max
        this.camera.lowerRadiusLimit = this.minRadius;
        this.camera.upperRadiusLimit = this.maxRadius;
        this.camera.useBouncingBehavior = true;
        
        //Angle mix and max
        this.camera.lowerBetaLimit = beta * 1;
        this.camera.upperBetaLimit = beta * 1.8;
        
        //This attaches the camera to the canvas
        this.camera.attachControl(this.controller.canvas, false);

        //Prevent camera collision with native system
        this.camera.checkCollisions = true;
        this.camera.collisionRadius = new BABYLON.Vector3(1,1,1);
        this.camera.onCollide = function(collidedMesh) {            
            //Push progressively the camera outside the mesh
            that.camera.radius = that.camera.radius * 1.01; 
        };
    }
    
    //Set new animation for radius
    setNewRadiusAnimation(newRadius) {

        var newRadiusAnimation = new BABYLON.Animation("cameraRadiusAnimation", "radius", 100, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        
        var keys = [];
        keys.push({ frame: 0, value: this.camera.radius }); //Frame 0
        keys.push({ frame: 100,	value: newRadius }); //Frame 100

        newRadiusAnimation.setKeys(keys);
        this.camera.animations.push(newRadiusAnimation);
		  
    }
    
    //Set new animation for target
    setNewTargetAnimation(newPosition) {
        
        //Target
        var newTargetAnimation = new BABYLON.Animation("cameraTargetAnimation", "target", 100, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        
        var keys = [];
        keys.push({ frame: 0, value: this.camera.target }); //Frame 0
        keys.push({ frame: 100,	value: newPosition }); //Frame 100

        newTargetAnimation.setKeys(keys);
        this.camera.animations.push(newTargetAnimation);
    }
    
    //Set new animation for alpha
    setNewAlphaAnimation(newPosition) {
  
        //Calculate the new alpha thanks to the ghostCamera         
        this.ghostCamera.setPosition(newPosition);        
        var toAlpha = this.ghostCamera.alpha;
        toAlpha = this.normalizeAlpha(toAlpha);
        
        var newAlphaAnimation = new BABYLON.Animation("cameraAlphaAnimation", "alpha", 100, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        
        var keysAlpha = [];
        keysAlpha.push({ frame: 0, value: this.camera.alpha }); //Frame 0
        keysAlpha.push({ frame: 100, value: toAlpha }); //Frame 100
        
        newAlphaAnimation.setKeys(keysAlpha);
        this.camera.animations.push(newAlphaAnimation);
    }
    
    //Normalize alpha to prevent unwanted spinning
    normalizeAlpha(newAlpha){
        var normalizedAlpha = null;
      
        var oldAlpha = this.camera.alpha;
        var alphaRemainder = oldAlpha % (2 * Math.PI);//[0,2Pi]
        var alphaInteger = oldAlpha - alphaRemainder;
        
        var absAlphaAngle = Math.abs(alphaRemainder - newAlpha);
        
        if(absAlphaAngle > Math.PI) {// 0 to 2Pi or 2Pi to 0
            if(alphaRemainder >= newAlpha) {//clockwise
                normalizedAlpha = newAlpha + alphaInteger + 2*Math.PI;
            }
            else{
                normalizedAlpha = newAlpha + alphaInteger - 2*Math.PI;
            }
        }
        else {
            normalizedAlpha = newAlpha + alphaInteger;
        }
        return normalizedAlpha;
    }
    
    //Update the camera position with an animation
    update() {
             
        //Check if a target is defined
        if(typeof this.controller.target != "undefined")
        {
        
            var locator = this.controller.world.locators[this.controller.target.id];

            //Pause the locator animation so there is no glitch while the camera is moving        
            var locatorAnimation = this.controller.scene.getAnimatableByTarget(locator);
            if(locatorAnimation !== null) {
                locatorAnimation.pause();            
            }

            //Get the position of the locator and offset the y by 1
            var position = locator.getAbsolutePosition();
            position = position.add(new BABYLON.Vector3(0,this.offsetY,0));

            this.setNewTargetAnimation(position);
            this.setNewAlphaAnimation(position);
            this.setNewRadiusAnimation(13);

            var cameraAnimation = this.controller.scene.beginAnimation(this.camera, 0, 100, false, 1); // Start all animations at once      

            //Restart the locator animation after the camera animation is finished
            cameraAnimation.onAnimationEnd = function() {
                if(locatorAnimation !== null) {
                    locatorAnimation.restart(); 
                }
            };
            
        }
    }
    
    //Follow the target if moving
    followTarget() {
        
        //Check if a target is defined
        if(typeof this.controller.target != "undefined")
        {
            var locator = this.controller.world.locators[this.controller.target.id];
            var locatorAnimation = this.controller.scene.getAnimatableByTarget(locator);

            //Follow target only if animated
            if(locatorAnimation !== null) {
                //Get radius and position of the target
                var cameraRadius = this.camera.radius;
                var position = this.controller.world.locators[this.controller.target.id].getAbsolutePosition();
                position = position.add(new BABYLON.Vector3(0,this.offsetY,0)); //Offset the y position by 1

                //Update the camera with the target position and reset the radius
                this.camera.setTarget(position);     
                this.camera.radius = cameraRadius;
            }
        }
  
    }
    
}