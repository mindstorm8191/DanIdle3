class foragepost extends activeblock {
    constructor(mapsquare) {
        super(mapsquare);
        this.name = "Forage Post";
        this.counter = 0; // How much time until we find the next 'meal'
        this.onhand = []; // List of every object we are holding here
        $("#"+ this.tile.id +"imageholder").html('<img src="img/foragepost.png" />');
        this.tile.structure = this;
    }

    getitem(itemname) {
        return null;  // This block does not output anything (yet...)
    }

    possibleoutputs() {
        // This is not set to output anything... yet
        return [];
    }
    
    update() {
        // No tools needed here, just slow resource collection
        if(this.onhand.length>15) {
            return;
        }
        
        this.counter++;
        if(this.counter>=30) {
            this.counter-=30;
            this.onhand.push(new item(getRandomFrom(['Apple', 'Mushroom', 'Berry', 'Tree nut'])));
        }
        $("#"+ this.tile.id +"progress").css({"width": this.counter*2});  // aka 60/30
    }
    
    drawpanel() {
        $("#sidepanel").html('<b>Foraging Post</b><br />'+
                                '<br />'+
                                'All around you is a world teeming with life - and food. It is there for the taking, you just have to find it first.<br />'+
                                '<br />'+
                                'Collects edible foods from the surrounding environment.  Can only support up to 4 workers. Cannot place another one in the area<br />'+
                                '<br />'+
                                'Food on-hand: <span id="sidepanelonhand">'+ this.onhand.length +'</span><br />'+
                                'Progress to next: <span id="sidepanelprogress">'+ (Math.floor((this.counter/30)*100)) +'</span>');
    }

    updatepanel() {
        $("#sidepanelonhand").html(this.onhand.length);
        $("#sidepanelprogress").html(Math.floor((this.counter/30)*100));
    }
}


