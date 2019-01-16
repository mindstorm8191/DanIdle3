class flinttoolshop extends activeblock {
    constructor(mapsquare) {
        super(mapsquare);
        this.name = "Flint Toolshop";
        this.onhand = [];
            // Not sure if we'll need these two, but just in case we do
        this.stocknames  = ["Long Stick", "Short Stick", "Flint", "Twine"];
        this.outputnames = ["Flint Hatchet", "Flint Hoe", "Flint Spear", "Twine Table", "Twine Sled", "Twine Raft"];
        this.longstick = [];
        this.shortstick = [];
        this.flint = [];
        this.twine = [];
        this.counter = 0;
        this.building = 'None';
        this.nextbuild = 'None';
        // Though we could require tools to be used here, for now we will assume that all the prior parts are shaped to what they're used for
/*        this.tool = [];  // We will need multiple tools at a time.  We will use this array to manage what we have on hand, which will affect what
                         // can be built and how fast things can be built. We can upgrade tools as we go
        this.nexttool = 'None';
*/

        this.stocklist = {"Long Stick": [],
                          "Short Stick": [],
                          "Twine": [],
                          "Flint Hatchet Head": [],
                          "Flint Hoe Head": [],
                          "Flint Spear Head": []};
        // Now, build a structure that we can navigate to determine what parts we will need for each item
        this.itemsneeded = {"Flint Hatchet": {"Short Stick": 1, "Flint Hatchet Head": 1, "Twine": 1},
                            "Flint Hoe":     {"Long Stick":  1, "Flint Hoe Head":     1, "Twine": 1},
                            "Flint Spear":   {"Long Stick":  1, "Flint Spear Head":   1, "Twine": 1},
                            "Twine Table":   {"Long Stick":  5, "Short Stick":       16, "Twine": 5},
                            "Twine Sled":    {"Long Stick":  8, "Short Stick":        8, "Twine": 5},
                            "Twine Raft":    {"Long Stick":  6, "Short Stick":        3, "Twine": 3}
                           };
        
        $("#"+ this.tile.id +"imageholder").html('<img src="img/flinttoolset.png">');
        this.tile.structure = this;
    }

    getitem(itemname) {
        for(var i=0; i<this.onhand.length; i++) {
            if(this.onhand[i].name==itemname) return this.onhand.splice(i,1)[0];
        }
        return null;
    }

    possibleoutputs() {
        return ['Flint Hatchet', 'Flint Hoe', 'Flint Spear', 'Twine Table', 'Twine Sled', 'Twine Raft'];
    }

    update() {
        if(this.onhand.length>=20) return;

        if(this.building=='None') {
            if(this.nextbuild=='None') return;
            this.building = this.nextbuild;
        }

        // Now, search for any items we can grab from nearby. Only grab specific items if they apply for the item being built
        let gotnewitem = 0;
        for(let i=0; i<4; i++) {
            let neighbor = this.getneighbor(i);
            if(neighbor==null) continue;
            for(var key in this.itemsneeded[this.building]) {
                if(this.stocklist[key].length>=20) continue; // We are already at max capacity for this item type
                if(this.itemsneeded[this.building][key]==0) continue; // We don't need any of this item type to build this tool
                let pickup = neighbor.getitem(key);
                if(pickup==null) continue; // None of this item was found at this neighbor
                this.stocklist[key].push(pickup);
                gotnewitem = 1;
                break;
            }
            if(gotnewitem==1) break;
        }

        // Now, ensure we have all the components we need.  If not, we will be unable to build.
        console.log('Building '+ this.building +': There are '+ Object.keys(this.itemsneeded[this.building]).length +' items to check through');
        let i = 0;
        for(var key in this.itemsneeded[this.building]) {
            console.log('Have '+ this.stocklist[key].length +' of '+ key +', need '+ this.itemsneeded[this.building][key]);
            if(this.stocklist[key].length < this.itemsneeded[this.building][key]) {
                return;
            }
        }
        
        // Now we are ready to do the work for this item
        this.counter++;
        if(this.counter<20) {
            $("#"+ this.tile.id +"progress").css({"width": this.counter*3});  // aka 60/20
            return;
        }

        this.counter-=20;
        this.onhand.push(new item(this.building));
        // Now, go through the list of stock items and delete the items we've used
        for(var key in this.itemsneeded[this.building]) {
            this.stocklist[key].splice(0, this.itemsneeded[this.building][key]);
        }
        this.building = this.nextbuild;  // Switch focus to the next item we need to build (if it was changed)
        $("#"+ this.tile.id +"progress").css({"width": this.counter*3});  // aka 60/20
    }

    drawpanel() {
        $("#sidepanel").html('<b>Flint Toolshop</b><br />'+
                             '<br />'+
                             'A place to build larger flint tools. Most require wood handles and twine<br />'+
                             '<br />'+
                             '<div id="sidepanelparts">'+
                             '  Parts on hand: ');
        // Now, show a list of materials we have on hand. If we are missing a particular component entirely, we want to not show its value.
        let hasentries = 0;
        if(this.stocklist['Long Stick'].length>0) {
            hasentries = 1;
            $("#sidepanelparts").append('<br />'+
                                        'Long Stick: '+ this.stocklist['Long Stick'].length);
        }
        if(this.stocklist['Short Stick'].length>0) {
            hasentries = 1;
            $("#sidepanelparts").append('<br />'+
                                        'Short Stick: '+ this.stocklist['Short Stick'].length);
        }
        if(this.stocklist['Twine'].length>0) {
            hasentries = 1;
            $("#sidepanelparts").append('<br />'+
                                        'Twine: '+ this.stocklist['Twine'].length);
        }
        if(this.stocklist['Flint Hatchet Head'].length>0) {
            hasentries = 1;
            $("#sidepanelparts").append('<br />'+
                                        'Flint Hatchet Head: '+ this.stocklist['Flint Hatchet Head'].length);
        }
        if(this.stocklist['Flint Hoe Head'].length>0) {
            hasentries = 1;
            $("#sidepanelparts").append('<br />'+
                                        'Flint Hoe Head: '+ this.stocklist['Flint Hoe Head'].length);
        }
        if(this.stocklist['Flint Spear Head'].length>0) {
            hasentries = 1;
            $("#sidepanelparts").append('<br />'+
                                        'Flint Spear Head: '+ this.stocklist['Flint Spear Head'].length);
        }
        if(hasentries==0) $("#sidepanelparts").append('None');
        $("#sidepanel").append('</div>'+
                               'Finished tools on hand: <span id="sidepanelonhand">'+ this.onhand.length +'</span><br />'+
                               'Currently building: <span id="sidepanelbuilding">'+ this.building +'</span><br />'+
                               'Current progress: <span id="sidepanelprogress">'+ Math.floor(this.counter*100/20) +'</span><br />'+
                               '<br />'+
                               '<b>Next to build:</b><br />');
        let color = (this.nextbuild=='None')? 'green' : 'grey';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelcraftNone" '+
                                     'style="background-color:'+ color +';" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'None\')">None</span>');
        color = (this.nextbuild=='Flint Hatchet')? 'green' : 'grey';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelcraftFlintHatchet" '+
                                     'style="background-color:'+ color +';" '+
                                     'title="Flint Hatchet. Suitable for cutting down trees. Needs 1 short handle" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'Flint Hatchet\')">Flint Hatchet</span>');
        color = (this.nextbuild=='Flint Hoe')? 'green' : 'grey';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelcraftFlintHoe" '+
                                     'style="background-color:'+ color +';" '+
                                     'title="Flint Hoe. Crude tool to unlock farming. Needs 1 long handle" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'Flint Hoe\')">Flint Hoe</span>');
        color = (this.nextbuild=='Flint Spear')? 'green' : 'grey';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelcraftFlintSpear" '+
                                     'style="background-color:'+ color +';" '+
                                     'title="Flint Spear. Crude tool to unlock hunting. Needs 1 long handle" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'Flint Spear\')">Flint Spear</span>');
        color = (this.nextbuild=='Twine Table')? 'green' : 'grey';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelcraftTwineTable" '+
                                     'style="background-color:'+ color +';" '+
                                     'title="Twine table. Made of sticks, to put light things on. Needs 5 long sticks, 16 short sticks, 5 twine" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'Twine Table\')">Twine Table</span>');
        color = (this.nextbuild=='Twine Sled')? 'green' : 'grey';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelcraftTwineSled" '+
                                     'style="background-color:'+ color +';" '+
                                     'title="Twine sled. Suitable for dragging light to medium loads across grass. Needs 8 long sticks, 8 short sticks, 5 twine" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'Twine Sled\')">Twine Sled</span>');
        color = (this.nextbuild=='Twine Raft')? 'green' : 'grey';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelcraftTwineRaft" '+
                                     'style="background-color:'+ color +';" '+
                                     'title="Twine raft. Crude floatation device for calm waters and light loads. Needs 6 long sticks, 3 short sticks, 3 twine" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'Twine Raft\')">Twine Raft</span>');
    }

    updatepanel() {
        $("#sidepanelonhand").html(this.onhand.length);
        $("#sidepanelbuilding").html(this.building);
        $("#sidepanelprogress").html(Math.floor(this.counter*100/20));

        // We also need to update the list of parts we have on hand here
        let hasentries = 0;
        $("#sidepanelparts").html('Parts on hand: ');
        if(this.stocklist['Long Stick'].length>0) {
            hasentries = 1;
            $("#sidepanelparts").append('<br />'+
                                        'Long Stick: '+ this.stocklist['Long Stick'].length);
        }
        if(this.stocklist['Short Stick'].length>0) {
            hasentries = 1;
            $("#sidepanelparts").append('<br />'+
                                        'Short Stick: '+ this.stocklist['Short Stick'].length);
        }
        if(this.stocklist['Twine'].length>0) {
            hasentries = 1;
            $("#sidepanelparts").append('<br />'+
                                        'Twine: '+ this.stocklist['Twine'].length);
        }
        if(this.stocklist['Flint Hatchet Head'].length>0) {
            hasentries = 1;
            $("#sidepanelparts").append('<br />'+
                                        'Flint Hatchet Head: '+ this.stocklist['Flint Hatchet Head'].length);
        }
        if(this.stocklist['Flint Hoe Head'].length>0) {
            hasentries = 1;
            $("#sidepanelparts").append('<br />'+
                                        'Flint Hoe Head: '+ this.stocklist['Flint Hoe Head'].length);
        }
        if(this.stocklist['Flint Spear Head'].length>0) {
            hasentries = 1;
            $("#sidepanelparts").append('<br />'+
                                        'Flint Spear Head: '+ this.stocklist['Flint Spear Head'].length);
        }
        if(hasentries==0) $("#sidepanelparts").append('None');
    }

    pickcraft(newcraftname) {
        if(this.nextbuild==newcraftname) return;  // take care of this situation first
        $("#sidepanelcraft"+ multireplace(this.nextbuild, " ", "")).css("background-color", "grey");
        this.nextbuild = newcraftname;
        $("#sidepanelcraft"+ multireplace(this.nextbuild, " ", "")).css("background-color", "green");
    }
}


