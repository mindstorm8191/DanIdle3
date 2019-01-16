class rockknapper extends activeblock {
    constructor(mapsquare) {
        super(mapsquare);
        this.name = "Rock Knapper";
        this.counter = 0;
        this.building = 'none';  // What item we are currently building
        this.nextbuild = 'none'; // What item to build next (as selected by the user)
        this.onhand = [];
        $("#"+ this.tile.id +"imageholder").html('<img src="img/rockknapper.png" />');
        this.tile.structure = this;
    }

    getitem(itemname) {
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
        return ['Flint Knife', 'Flint Stabber', 'Flint Hatchet Head'];
    }

    update() {
        // Again, no tools needed here. Just rocks
        if(this.onhand.length>15) return;
        
        if(this.building=='none') {
            if(this.nextbuild=='none') return; // We are building nothing, we have nothing selected to build
            this.building = this.nextbuild;
        }

        this.counter++;
        if(this.counter>20) {
            this.counter-=20;
            this.onhand.push(new item(this.building));
            this.building = this.nextbuild; // Now switch to the next selected item (if not the same as before)
        }
        $("#"+ this.tile.id +"progress").css({"width": this.counter*3});  // aka 60/20
    }

    drawpanel() {
        $("#sidepanel").html('<b>Rock Knapper</b><br />'+
                             '<br />'+
                             'Tools are critical to survival, and rocks are your first tool. Knapping is the art of smashing rocks '+
                             'into the shapes you need.<br />'+
                             '<br />'+
                             'Knapp rocks to craft either knives or stabbers - you must select one before crafting can begin. Once '+
                             'crafted, place into a storage unit to use where-ever needed.<br />'+
                             '<br />'+
                             'Items on hand: <span id="sidepanelonhand">'+ this.onhand.length +'</span><br />'+
                             'Currently building: <span id="sidepaneltarget">'+ this.building +'</span><br />'+
                             'Current progress: <span id="sidepanelprogress">'+ (Math.floor((this.counter/20)*100)) +'%</span><br />'+
                             '<br />'+
                             '<b>Select an output:</b><br />');
        let color = (this.nextbuild=='None')? 'grey' : 'green';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelchoicenone" '+
                                     'style="background-color:'+ color +';" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'none\')">None</span>');
        color = (this.nextbuild=='Flint Knife')? 'green' : 'grey';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelchoiceFlintKnife" '+
                                     'style="background-color:'+ color +';" '+
                                     'title="Crude knife. Good for cutting weak things" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'Flint Knife\')">Flint Knife</span>');
        color = (this.nextbuild=='Flint Stabber')? 'green' : 'grey';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelchoiceFlintStabber" '+
                                     'style="background-color:'+ color +';" '+
                                     'title="Hand-held stabbing device. Good enough for crude wood cuts" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'Flint Stabber\')">Flint Stabber</span>');
        if(unlockeditems.indexOf('Twine')!=-1) {
            color = (this.nextbuild=='Flint Hatchet Head')? 'green' : 'grey';
            $("#sidepanel").append('<span class="sidepanelbutton" '+
                                         'id="sidepanelchoiceFlintHatchetHead" '+
                                         'style="background-color:'+ color +';" '+
                                         'title="Crude head for a small axe. Needs a stick and twine to be used" '+
                                         'onclick="blocklist.getById('+ this.id +').pickcraft(\'Flint Hatchet Head\')">Flint Hatchet Head</span>');
            color = (this.nextbuild=='Flint Spear Head')? 'green' : 'grey';
            $("#sidepanel").append('<span class="sidepanelbutton" '+
                                         'id="sidepanelchoiceFlintSpearHead" '+
                                         'style="background-color:'+ color +';" '+
                                         'title="Crude head for a hunting spear. Needs a stick and twine to be used" '+
                                         'onclick="blocklist.getById('+ this.id +').pickcraft(\'Flint Spear Head\')">Flint Spear Head</span>');
            color = (this.nextbuild=='Flint Hoe Head')? 'green' : 'grey';
            $("#sidepanel").append('<span class="sidepanelbutton" '+
                                         'id="sidepanelchoiceFlintHoeHead" '+
                                         'style="background-color:'+ color +';" '+
                                         'title="Crude head for a farming hoe. Needs a stick and twine to be used" '+
                                         'onclick="blocklist.getById('+ this.id +').pickcraft(\'Flint Hoe Head\')">Flint Hoe Head</span>');
        }
    }

    updatepanel() {
        $("#sidepanelonhand").html(this.onhand.length);
        $("#sidepaneltarget").html(this.building);
        $("#sidepanelprogress").html(Math.floor((this.counter/20)*100));
    }

    pickcraft(newtoolname) {
        // Selects a new tool to use.  Called by an onclick event from the side panel
        if(this.nextbuild==newtoolname) return;  // take care of this situation first
        $("#sidepanelchoice"+ multireplace(this.nextbuild, " ", "")).css("background-color", "grey");
        this.nextbuild = newtoolname;
        $("#sidepanelchoice"+ multireplace(this.nextbuild, " ", "")).css("background-color", "green");
    }
}


