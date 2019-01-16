class activeblock {
    // Each 'structure' the player has placed in the game.  This class will be inherited by many other classes, representing the individual structures
    // We may also have middle-man classes, for when structures share common code
    constructor(mapsquare) {
        this.name = 'ThisNeedsFixing';
        this.tile = mapsquare; // This should be a maptile instance
        this.priority = blocklist.lastpriority();
        this.id = lastblockid;
        lastblockid++;
        blocklist.push(this);
    }
    
    update() {
        console.log('Error in block (name='+ this.name +'): Missing update function');
    }
    
    drawpanel() {
        // Handles generating the basic content for the side bar
        console.log('Error in block (name='+ this.name +'): Missing drawpanel function');
    }
    
    updatepanel() {
        // Handles updating the side bar content
        console.log('Error in block (name='+ this.name +'): Missing updatepanel function');
    }

    getitem(itemname) {
        console.log('Error in block (name='+ this.name +'): Missing getItem function');
        return null;
    }

    possibleoutputs() {
        // Returns all potential outputs this block may have
        console.log('Error in block (name='+ this.name +'): Missing possibleoutputs function');
        return [];
    }

    getneighbor(side) {  // Gets access to blocks that are neighboring this block, or null if nothing is there.
        switch(side) {
            case 0:  return blocklist.findOnGrid(this.tile.xpos,   this.tile.ypos-1); // North side
            case 1:  return blocklist.findOnGrid(this.tile.xpos+1, this.tile.ypos  ); // East side
            case 2:  return blocklist.findOnGrid(this.tile.xpos,   this.tile.ypos+1); // South side
            case 3:  return blocklist.findOnGrid(this.tile.xpos-1, this.tile.ypos  ); // West side
        }
    }
}



