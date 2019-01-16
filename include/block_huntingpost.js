class huntingpost extends activeblock {
    constructor(mapsquare) {
        super(mapsquare);
        this.name = "Hunting Post";
        this.onhand = [];
        this.tool = null;
        this.nexttool = 'None';
        this.counter = 0;
        $("#"+ this.tile.id +"imageholder").html('<img src="img/huntingpost.png" />');
        this.tile.structure = this;
    }

    getitem(itemname) {
        for(var i=0; i<this.onhand.length; i++) {
            if(this.onhand[i].name==itemname) return this.onhand.splice(i,1)[0];
        }
        return null;
    }

    possibleoutputs() {
        // Returns all possible outputs of this block
        return ['Dead Deer', 'Dead Chicken', 'Dead Wolf'];
    }

    update() {
        if(this.onhand.length>=20) return;

        if(this.tool==null || this.tool.endurance <=0) {
            if(this.nexttool=='None') return;  // No tool is loaded, and no tool has been selected. No need to stay here...
            this.tool = blocklist.findInStorage(this.nexttool, 1);
            if(this.tool==null) return;  // Could not find a matching tool to use
        }

        this.tool.endurance--;
        this.counter += this.tool.efficiency;
        if(this.counter>=30) {
            this.counter-=30;
            this.onhand.push(new item(getRandomFrom(['Dead Deer', 'Dead Chicken', 'Dead Wolf'])));
            this.building = this.nextbuild;
        }
        $("#"+ this.tile.id +"progress").css({"width": this.counter*2});  // aka 60/30

        // Not a lot of specialty code here, but the difficulty of this is getting to here (and then using its output).
    }

    drawpanel() {
        $("#sidepanel").html('<b>Hunting Post</b><br />'+
                             '<br />'+
                             'Humans are not herbivores.  They require meats equally as much as plants. Without good sources of both, '+
                             'the body will struggle to survive.<br />'+
                             '<br />'+
                             'Uses weapons to hunt game animals in the area. Once killed, brings the animals back here for further uses.<br />'+
                             '<br />'+
                             'Items on hand: <span id="sidepanelonhand">'+ this.onhand.length +'</span><br />'+
                             'Hunting progress: <span id="sidepanelprogress">'+ (Math.floor(this.counter*100/30)) +'</span><br />'+
                             '<br />'+
                             '<br />'+
                             '<b>Select a tool:</b>');
        let color = (this.nexttool=='None')? 'green' : 'red';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepaneltoolNone" '+
                                     'style="background-color:'+ color +'" '+
                                     'onclick="blocklist.getById('+ this.id +').picktool(\'None\')">None</span>');
        color = (this.nexttool=='Flint Spear')? "green" : "red";
        $("#sidepanel").append('<span id="sidepaneltoolFlintSpear" '+
                                     'class="sidepanelbutton" '+
                                     'onclick="blocklist.getById('+ this.id +').picktool(\'Flint Spear\')" '+
                                     'style="background-color:'+ color +'">Flint Spear</span>');
    }

    updatepanel() {
        $("#sidepanelonhand").html(this.onhand.length);
        $("#sidepanelprogress").html(Math.floor(this.counter*100/40));
    }

    picktool(newtoolname) {
        $("#sidepaneltool"+ multireplace(this.nexttool, ' ', '')).css("background-color", "red");
        this.nexttool = newtoolname;
        $("#sidepaneltool"+ multireplace(this.nexttool, ' ', '')).css("background-color", "green");
    }
}


