const directionmap = [
    [{"x": 0, "y":-1}, {"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x":-1, "y": 0}],
    [{"x": 0, "y":-1}, {"x": 1, "y": 0}, {"x":-1, "y": 0}, {"x": 0, "y": 1}],
    [{"x": 0, "y":-1}, {"x": 0, "y": 1}, {"x": 1, "y": 0}, {"x":-1, "y": 0}],
    [{"x": 0, "y":-1}, {"x": 0, "y": 1}, {"x":-1, "y": 0}, {"x": 1, "y": 0}],
    [{"x": 0, "y":-1}, {"x":-1, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y": 1}],
    [{"x": 0, "y":-1}, {"x":-1, "y": 0}, {"x": 0, "y": 1}, {"x": 1, "y": 0}],
    [{"x": 1, "y": 0}, {"x": 0, "y":-1}, {"x": 0, "y": 1}, {"x":-1, "y": 0}],
    [{"x": 1, "y": 0}, {"x": 0, "y":-1}, {"x":-1, "y": 0}, {"x": 0, "y": 1}],
    [{"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y":-1}, {"x":-1, "y": 0}],
    [{"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x":-1, "y": 0}, {"x": 0, "y":-1}],
    [{"x": 1, "y": 0}, {"x":-1, "y": 0}, {"x": 0, "y":-1}, {"x": 0, "y": 1}],
    [{"x": 1, "y": 0}, {"x":-1, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y":-1}],
    [{"x": 0, "y": 1}, {"x": 0, "y":-1}, {"x": 1, "y": 0}, {"x":-1, "y": 0}],
    [{"x": 0, "y": 1}, {"x": 0, "y":-1}, {"x":-1, "y": 0}, {"x": 1, "y": 0}],
    [{"x": 0, "y": 1}, {"x": 1, "y": 0}, {"x": 0, "y":-1}, {"x":-1, "y": 0}],
    [{"x": 0, "y": 1}, {"x": 1, "y": 0}, {"x":-1, "y": 0}, {"x": 0, "y":-1}],
    [{"x": 0, "y": 1}, {"x":-1, "y": 0}, {"x": 0, "y":-1}, {"x": 1, "y": 0}],
    [{"x": 0, "y": 1}, {"x":-1, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y":-1}],
    [{"x":-1, "y": 0}, {"x": 0, "y":-1}, {"x": 1, "y": 0}, {"x": 0, "y": 1}],
    [{"x":-1, "y": 0}, {"x": 0, "y":-1}, {"x": 0, "y": 1}, {"x": 1, "y": 0}],
    [{"x":-1, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y":-1}, {"x": 0, "y": 1}],
    [{"x":-1, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y":-1}],
    [{"x":-1, "y": 0}, {"x": 0, "y": 1}, {"x": 1, "y": 0}, {"x": 0, "y": 1}],
    [{"x":-1, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 1}, {"x": 1, "y": 0}]];
    // This chart is used to select (at random) a direction to expand, when deciding which way to expand the BiomePoint instances.
    // If one direction fails, the next is selected. This eliminates the need to rule out directions when the first, second, or
    // third fails.

class biomepoint {
    // Class used to generate clustered land groupings within a chunk. Will also be used to extend existing land groupings across
    // chunk boundaries
    constructor(chunk, y, x, landtype) {
        // Declares a new chunk center-point.  This assumes the map provided is empty (as in, filled with zeros)
        this.chunk = chunk;
        this.y = y;
        this.x = x;
        this.c = landtype;
        this.points = [{x:this.x, y:this.y}];  // This points list is what keeps track of all possible locations to expand from.
    }

    advance() {
        // picks one filled location at random and checks around it for a valid location to add in. The direction is chosen at random (with help from the
        // directionmap array).
        // Returns 1 if successful (and will keep going), or 0 if there is nothing left for this to process
        if(this.points.length==0) {
            // This boime area has no points left to work with.  Exit with a zero so it can be deleted from the chunk's biomepoint list.
            return 0;
        }
        if(this.c==3 && Math.random()>0.25) {  // If this is rock, we want it to have only 25% chance of expanding
            return 1;
        }
        let pickedspot = Math.floor(Math.random() * this.points.length);
        let pickeddir  = Math.floor(Math.random() * 24);
        for(let i=0; i<4; i++) {
            let targetx = this.points[pickedspot].x + directionmap[pickeddir][i].x;
            let targety = this.points[pickedspot].y + directionmap[pickeddir][i].y;
            if(targety<0) continue;
            if(targety>=chunksize) continue;
            if(targetx<0) continue;
            if(targetx>=chunksize) continue;
            if(this.chunk.map[targety][targetx].tile==0) {
                this.chunk.map[targety][targetx].settile(this.c);
                this.points.push({"x": targetx, "y": targety});
                return;
            }
        }
        this.points.splice(pickedspot, 1);
        return 1;
    }
}

class mapchunk {
    // Large block of land.  Maps are subdivided into chunks for easier management & generation

    constructor(chunkxpos, chunkypos) {
        // Generates a new chunk at the specified chunk-scale coordinates.  Land types within this chunk will be generated as needed
        // To start, ensure that the chunklist array is generated correctly.
        if(typeof chunklist[chunkypos] === 'undefined') {
            console.log('Generating 1d array...');
            chunklist = [];
            chunklist[chunkypos] = [];
        }
        if(typeof chunklist[chunkypos][chunkxpos] === 'undefined') {
            console.log('Generating 2d array...');
            chunklist[chunkypos] = [];
        }
        
        this.chunkx = chunkxpos;
        this.chunky = chunkypos;
        chunklist[this.chunky][this.chunkx] = this;
            // Now, generate an empty map
        this.map = [];
        for(let y=0; y<chunksize; y++) {
            this.map[y] = [];
            for(let x=0; x<chunksize; x++) {
                this.map[y][x] = new TileData(y,x,0);
            }
        }

        // Now, go through all neighboring chunks, and generate biomepoints for all lands neighboring this chunk.
        this.biomelist = [];
        if((typeof chunklist[chunkypos-1] != 'undefined') && (typeof chunklist[chunkypos-1][chunkxpos] != 'undefined')) {
            // We have a neighboring chunk above this chunk. Run along the neighbor's bottom edge to generate new biomepoints.
            console.log('New chunk has a northern neighbor');
            let sourcechunk = chunklist[chunkypos-1][chunkxpos];
            let lastcolormatch = -1;
            let lastpoint = 0;
            for(let x=0; x<chunksize; x++) {
                if(sourcechunk.map[chunksize][x].tile == lastcolormatch) {
                    lastpoint.stretchcount++; // Same color as last square. Expand that point's range
                }else{
                    if(lastpoint!=0) {  // Finished with this biomepoint - but we need to wrap it up
                        lastpoint.x = Math.floor(lastpoint.stretchcount/2);
                        lastpoint.points = [{x: lastpoint.x, y:lastpoint.y}];
                    }
                    lastpoint = new biomepoint(this, x, 0, sourcechunk.map[chucksize][x].tile);
                    this.biomepoints.push(lastpoint);
                    lastpoint.stretchcount = 1;
                    lastcolormatch = lastpoint.c;
                }
            }
            // Also, wrap up the last point
            lastpoint.x = Math.floor(lastpoint.stretchcount/2);
            lastpoint.points = [{"x": lastpoint.x, "y": lastpoint.y}];
        }

        // now do the bottom direction
        if((typeof chunklist[chunkypos+1] != 'undefined') && (typeof chunklist[chunkypos+1][chunkxpos] != 'undefined')) {
            console.log('New chunk has a southern neighbor');
            let sourcechunk = chunklist[chunkypos+1][chunkxpos];
            let lastcolormatch = -1;
            let lastpoint = 0;
            for(let x=0; x<chunksize; x++) {
                if(sourcechunk.map[0][x].tile == lastcolormatch) {
                    lastpoint.stretchcount++;
                }else{
                    if(lastpoint!=0) {  // adjust the last point
                        lastpoint.x = Math.floor(lastpoint.stretchcount/2);
                        lastpoint.points = [{"x": lastpoint.x, "y": lastpoint.y}];
                    }
                    lastpoint = new biomepoint(this, x, chunksize, sourcechunk.map[0][x].tile);
                    this.biomepoints.push(lastpoint);
                    lastpoint.stretchcount = 1;
                    lastcolormatch = lastpoint.c;
                }
            }
            lastpoint.x = Math.floor(lastpoint.stretchcount/2);
            lastpoint.points = [{"x": lastpoint.x, "y": lastpoint.y}];
        }
        // left side... we can assume that chunklist[chunkypos] already exists
        if(typeof chunklist[chunkypos][chunkxpos-1] != 'undefined') {
            console.log('New chunk has a western neighbor');
            let sourcechunk = chunklist[chunkypos][chunkxpos-1];
            let lastcolormatch = -1;
            let lastpoint = 0;
            for(let y=0; y<chunksize; y++) {
                if(sourcechunk.map[y][chunksize].tile == lastcolormatch) {
                    lastpoint.stretchcount++;
                }else{
                    if(lastpoint!=0) {
                        lastpoint.y = Math.floor(lastpoint.stretchcount/2);
                        lastpoint.points = [{"x": lastpoint.x, "y": lastpoint.y}];
                    }
                    lastpoint = new biomepoint(this, 0, y, sourcechunk.map[y][chunksize].tile);
                    this.biomepoints.push(lastpoint);
                    lastpoint.stretchcount = 1;
                    lastcolormatch = lastpoint.c;
                }
            }
            lastpoint.y = Math.floor(lastpoint.stretchcount/2);
            lastpoint.points = [{"x": lastpoint.x, "y": lastpoint.y}];
        }
        // right side
        if(typeof chunklist[chunkypos][chunkxpos+1] != 'undefined') {
            console.log('New chunk has an eastern neighbor');
            let sourcechunk = chunklist[chunkypos][chunkxpos+1];
            let lastcolormatch = -1;
            let lastpoint = 0;
            for(let y=0; y<chunksize; y++) {
                if(sourcechunk.map[y][0].tile == lastcolormatch) {
                    lastpoint.stretchcount++;
                }else{
                    if(lastpoint!=0) {
                        lastpoint.y = Math.floor(lastpoint.stretchcount/2);
                        lastpoint.points = [{"x": lastpoint.x, "y": lastpoint.y}];
                    }
                    lastpoint = new biomepoint(this, chunksize, y, sourcechunk.map[y][0].tile);
                    this.biomepoints.push(lastpoint);
                    lastpoint.stretchcount = 1;
                    lastcolormatch = lastpoint.c;
                }
            }
            lastpoint.y = Math.floor(lastpoint.stretchcount/2);
            lastpoint.points = [{"x": lastpoint.x, "y": lastpoint.y}];
        }
        
        // Now, generate new biomepoints to fill this map in
        const numpoints = chunksize * chunksize / mapkinddensity;
        for(let i=0; i<numpoints; i++) {
            this.biomelist.push(new biomepoint(this,
                                               Math.floor(Math.random()*chunksize),
                                               Math.floor(Math.random()*chunksize),
                                               Math.floor(Math.random()*4+1)));
        }
        // With all the points generated, allow them to run until the list is empty
        while(this.biomelist.length>0) {
            for(let i=0; i<this.biomelist.length; i++) {
                if(this.biomelist[i].advance()==0) {
                    this.biomelist.splice(i, 1); // This one has no work left. Remove it
                    i--; // Also, back up the iterator, so we will still see the next one in line
        }   }   }
    }
}