/**
* App Name: ThreeDimensionalIndex
* Plugin URI: https://github.com/tommelani/
* Version: 1.0.0
* Author: Tom Melani
* Author URI: https://github.com/tommelani/
* Description: Display a 3D Index of various items
*/

/**
* Class THREE_DIMENSIONAL_INDEX.Dataset
*/

var THREE_DIMENSIONAL_INDEX=THREE_DIMENSIONAL_INDEX || {};

THREE_DIMENSIONAL_INDEX.Dataset = class {
   
    constructor() {
        
        //Create new hierarchy
        this.hierarchy = new THREE_DIMENSIONAL_INDEX.Hierarchy();        
        
        //Add data into the hierarchy
        this.populateData();
        
    }
    
    //Populate the dataset with data
    populateData() {

        var root = this.hierarchy.nodes["root"];
        root.addChild({ id : "index", position: new BABYLON.Vector3(0,0,0)}); 
        this.index = this.hierarchy.nodes["index"];

        var data = [
           { id: 1, slug: "island", title: {rendered: "The Island"}, content: {rendered: "An island or isle is any piece of sub-continental land that is surrounded by water."}, meta: {_threedimensionalindex_data : '{"path": "/res/assets/island.glb", "position": {"x": 0, "y": -2, "z":0}, "pickable": true, "animation":{} }' }},
            
            { id: 2, slug: "windmill", title: {rendered: "The Windmill"}, content: {rendered: "A windmill is a structure that converts wind power into rotational energy by means of vanes called sails or blades, specifically to mill grain."}, meta: {_threedimensionalindex_data : '{"path": "/res/assets/windmill.glb", "position": {"x": 0, "y": 2.5, "z":-1}, "pickable": true, "animation":{} }' }},
            { id: 3, slug: "plane", title: {rendered: "The Plane"}, content: {rendered: "An airplane is a powered, fixed-wing aircraft that is propelled forward by thrust from a jet engine, propeller or rocket engine."}, meta: {_threedimensionalindex_data : '{"path": "/res/assets/plane.glb", "position": {"x": -5, "y": 4, "z":0}, "pickable": true, "animation":{ "type":"satellite", "speed": 400, "direction": 1, "target": 1 } }' }},
            { id: 4, slug: "tree", title: {rendered: "The Tree"}, content: {rendered: "A tree is a perennial plant with an elongated stem, or trunk, supporting branches and leaves in most species."}, meta: {_threedimensionalindex_data : '{"path": "/res/assets/tree.glb", "position": {"x": 0, "y": 1, "z":1.5}, "pickable": true, "animation":{} }' }},
            { id: 5, slug: "large_cloud", title: {rendered: "The Large Cloud"}, content: {rendered: "A cloud is an aerosol consisting of a visible mass of minute liquid droplets, frozen crystals, or other particles suspended in the atmosphere of a planetary body or similar space."}, meta: {_threedimensionalindex_data : '{"path": "/res/assets/large_cloud.glb", "position": {"x": 5, "y": 5, "z":5}, "pickable": true, "animation":{ "type":"satellite", "speed": 3000, "direction": -1, "target": 1 } }' }},
            { id: 6, slug: "small_cloud", title: {rendered: "The Small Cloud"}, content: {rendered: "A cloud is an aerosol consisting of a visible mass of minute liquid droplets, frozen crystals, or other particles suspended in the atmosphere of a planetary body or similar space."}, meta: {_threedimensionalindex_data : '{"path": "/res/assets/small_cloud.glb", "position": {"x": 5, "y": 3, "z":-5}, "pickable": true, "animation":{ "type":"satellite", "speed": 2000, "direction": -1, "target": 1 } }' }},
            
            { id:7, slug: "island2", title: {rendered: "The Other Island"}, content: {rendered: "An island or isle is any piece of sub-continental land that is surrounded by water."}, meta: {_threedimensionalindex_data : '{"path": "/res/assets/island.glb", "position": {"x": 5, "y": 4, "z":20}, "pickable": true, "animation":{} }' }},    
            
        ]
        
        for(var key in data) {
            var item = data[key];
            this.addItem(item);
        }
    }

    //Add an item to the index    
    addItem(item) {
        		
        var threedimensionalindex_data = JSON.parse(item.meta._threedimensionalindex_data);
		
        this.index.addChild(
            {
                id : item.id,
                slug : item.slug,
                title: item.title.rendered, 
                content: item.content.rendered, 
                path: threedimensionalindex_data.path,
                position: new BABYLON.Vector3( threedimensionalindex_data.position.x, threedimensionalindex_data.position.y, threedimensionalindex_data.position.z),
                pickable: threedimensionalindex_data.pickable,
                animation: threedimensionalindex_data.animation,
            } 
        ); 
        
    }

    
}