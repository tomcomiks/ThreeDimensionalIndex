/**
* App Name: ThreeDimensionalIndex
* Plugin URI: https://github.com/tommelani/
* Version: 1.0.0
* Author: Tom Melani
* Author URI: https://github.com/tommelani/
* Description: Display a 3D Index of various items
*/

/**
* Class THREE_DIMENSIONAL_INDEX.Hierarchy
*/

var THREE_DIMENSIONAL_INDEX=THREE_DIMENSIONAL_INDEX || {};

THREE_DIMENSIONAL_INDEX.Hierarchy = class {
    
    constructor() {
		this.nodes = new Array();
        var node = new THREE_DIMENSIONAL_INDEX.Node({id:"root"});
        node.hierarchy = this;
        this.nodes[node.id] = node;
    }
    
	getNodeById(id) {
        return this.nodes[id];
	}	
    
}

/**
* Class THREE_DIMENSIONAL_INDEX.Node
*/

THREE_DIMENSIONAL_INDEX.Node = class {
    
    constructor(data) {
		this.id = data.id;
		this.data = data;
		this.parent = null;
		this.hierarchy = null;
		this.children = [];
		this.depth = 0;
    } 
    
	addChild(data) {
	
		if(this.hierarchy.nodes[data.id] == null) {	
		
			var child = new THREE_DIMENSIONAL_INDEX.Node(data);
			
			child.parent = this;
			child.hierarchy = this.hierarchy;
			child.depth = this.depth + 1;
			
			this.children.push(child);
			this.hierarchy.nodes[child.id] = child;
		}
		
		return child;
	}
    
    
}