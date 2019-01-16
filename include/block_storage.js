class storage extends activeblock {
    // Our basic block for holding items
    constructor(mapsquare) {
        super(mapsquare);
        this.name = "Storage";
        this.onhand = [];
        this.collects = []; // List of item names that this block will collect from
        this.outputenabled = 0;
        this.tool = null;
        this.nexttool = 'None';
        this.capacity = 10;

        $("#"+ this.tile.id +"imageholder").html('<img src="img/storage.png" />');
        this.tile.structure = this;
    }

    getitem(itemname) {
        if(this.outputenabled==0) return null; // Storage units will only output items if the user enables it
        for(let i=0; i<this.onhand.length; i++) {
            if(this.onhand[i].name==itemname) {
                let hold = this.onhand[i];
                this.onhand.splice(i, 1);
                return hold;
            }
        }
        return null;
    }

    possibleoutputs() {
        if(this.outputenabled==0) return [];
        // We will need to run through all the elements we have stored, and add it to a list (if not already in the list)
        let output = [];
        for(let i=0; i<this.onhand.length; i++) {
            if(output.indexOf(this.onhand[0].name)==-1) {
                output.push(this.onhand.name);  // remember, we only care about the names here
            }
        }
        return output;
    }

    update() {
        // Before starting, determine if we need to load in any tools for this block
        if(this.tool==null || this.tool.endurance<=0) {
            if(this.nexttool=='None') {
                this.tool = null;
            }else{
                this.tool = blocklist.findInStorage(this.nexttool, 1);
                if(this.tool==null) {
                    this.capacity = 10;
                }else{
                    switch(this.tool.name) {
                        case 'Twine Table': this.capacity = 20; break;
                    }
                }
            }
        }

        // So long as we have room, we want to pull new items into this block (based on what the user has selected to store here)
        if(this.onhand.length>=this.capacity) return;
        if(this.collects.length==0) return;

        for(let i=0; i<4; i++) {
            let n = this.getneighbor(i); if(n==null) continue;
            for(let j=0; j<this.collects.length; j++) {
                let catchitem = n.getitem(this.collects[j]); if(catchitem==null) continue;
                this.onhand.push(catchitem);
                return;  // Limit our item collection to 1 per cycle
            }
            // Note that we can change the item that is picked up, and it doesn't affect what is already stored in this storage unit
        }
    }

    drawpanel() {
        $("#sidepanel").html('<b>Storage Unit</b><br />'+
                             '<br />'+
                             'So many items, where to put them?  This is your place to put things. The fact that its nothing but a spot on the ground isnt important.<br />'+
                             '<br />'+
                             'Use this to hold items (especially tools). This can be upgraded with shelves and other things to hold more items<br />'+
                             '<br />'+
                             'Items on hand: <span id="sidepanelonhand">'+ this.onhand.length +'</span><br />'+
                             '<br />'+
                             '<b>Items to store</b><br />');
        // Now we need to search neighboring blocks to see what items we can accept at this location
        let foundlist = []; // This is every item we have already collected, to ensure we don't list the same item multiple times (from different sources)
        for(let i=0; i<4; i++) {
            let n = this.getneighbor(i); if(n==null) continue;
            let list = n.possibleoutputs();
            for(let j=0; j<list.length; j++) {
                if(foundlist.indexOf(list[j])==-1) {
                    foundlist.push(list[j]);
                    // We can go ahead and display this new item now - but first, determine what color to make the block
                    let color = (this.collects.indexOf(list[j])==-1)? "red" : "green";
                    $("#sidepanel").append('<span id="sidepanelpick'+ multireplace(list[j], ' ', '') +'" '+
                                                 'class="sidepanelbutton" '+
                                                 'style="background-color:'+ color +';" '+
                                                 'onclick="blocklist.getById('+ this.id +').toggleinput(\''+ list[j] +'\')">'+ list[j] +'</span>');
                }
            }
        }

        // Now, display a list for tools, when they become available
        if(unlockeditems.indexOf('Twine Table')!=-1) {
            $("#sidepanel").append('<br />'+
                                   '<b>Select a Tool:</b><br />');
            let color = (this.nexttool=='None')? 'green' : 'red';
            $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepaneltoolNone" '+
                                     'style="background-color:'+ color +'" '+
                                     'onclick="blocklist.getById('+ this.id +').picktool(\'None\')">None</span>');
            color = (this.nexttool=='Twine Table')? 'green' : 'red';
            $("#sidepanel").append('<span class="sidepanelbutton" '+
                                         'id="sidepaneltoolTwineTable" '+
                                         'style="background-color:'+ color +'" '+
                                         'onclick="blocklist.getById('+ this.id +').picktool(\'Twine Table\')">Twine Table</span>');
        }
    }

    updatepanel() {
        $("#sidepanelonhand").html(this.onhand.length);
    }

    toggleinput(itemname) {
        // Add or remove an item from the list of items we collect here
        console.log('Toggling'+ itemname);
        let pos = this.collects.indexOf(itemname);
        if(pos==-1) {  // Item was not in the list.  We will add it now
            $("#sidepanelpick"+ multireplace(itemname, ' ', '')).css("background-color", "green");
            this.collects.push(itemname);
        }else{  // Item was in the list.  Remove it
            $("#sidepanelpick"+ multireplace(itemname, ' ', '')).css("background-color", "red");
            this.collects.splice(pos, 1);
        }
    }

    picktool(newtoolname) {
        $("#sidepaneltool"+ multireplace(this.nexttool, ' ', '')).css("background-color", "red");
        this.nexttool = newtoolname;
        $("#sidepaneltool"+ multireplace(this.nexttool, ' ', '')).css("background-color", "green");
    }
}


