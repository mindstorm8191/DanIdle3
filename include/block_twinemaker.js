class twinemaker extends activeblock {
    constructor(mapsquare) {
        super(mapsquare);
        this.name = "Twine Maker";
        this.counter = 0;
        this.onhand = [];
        this.tool  = null;
        this.nexttool = 'None';
        $("#"+ this.tile.id +"imageholder").html('<img src="img/twinemaker.png" />');
        this.tile.structure = this;
    }

    getitem(itemname) {
        // Returns an item, if the correct item name is provided
        if(itemname!='Twine') return null;  // Since this only outputs twine, we don't need to worry about finding an item in our list
        if(this.onhand.length==0) return null;
        let hold = this.onhand[0];
        this.onhand.splice(0, 1);
        return hold;
    }

    possibleoutputs() {
        return ['twine'];
    }

    update() {
        if(this.onhand.length>=10) return;  // Make sure we have room to accept more items
        // Start by checking the status of the tools
        if(this.tool==null || this.tool.endurance <=0) {
            if(this.nexttool=='None') return;
            // Now, attempt to grab a tool from a storage unit.
            this.tool = blocklist.findInStorage(this.nexttool, 1);
            if(this.tool==null) {
                return;  // We could not find this type of tool.  Go ahead and exit
            }
        }

        this.tool.endurance--;
        this.counter += this.tool.efficiency;
        $("#"+ this.tile.id +"progress").css({"width": this.counter*1.5});  // aka 60/20
        if(this.counter<40) return;

        this.counter -= 40;
        this.onhand.push(new item('Twine'));
        $("#"+ this.tile.id +"progress").css({"width": this.counter*1.5});  // aka 60/20
    }


    drawpanel() {
        $("#sidepanel").html('<b>Twine Maker</b><br />'+
                             '<br />'+
                             'Rope is an essential tool for survival, providing hundreds of potential uses to get things done. Twine isnt a '+
                             'very effective rope, but it will do, for now.<br />'+
                             '<br />'+
                             'Produces twine from vines of the forest and tree bark.<br />'+
                             '<br />'+
                             'Twine on hand: <span id="sidepanelonhand">'+ this.onhand.length +'</span><br />'+
                             'Progress: <span id="sidepanelprogress">'+ Math.floor(this.counter*100/40) +'</span><br />'+
                             '<br />'+
                             '<b>Tools (Knife):</b><br />');
        // Now, list all the available tools we have for producing twine.  Right now it's only one, though...
        let color = (this.nexttool=='None')? "green" : "red";
        $("#sidepanel").append('<span id="sidepaneltoolNone" '+
                                     'class="sidepanelbutton" '+
                                     'onclick="blocklist.getById('+ this.id +').settool(\'None\')" '+
                                     'style="background-color:'+ color +'">None</span>');
        color = (this.nexttool=='Flint Knife')? "green" : "red";
        $("#sidepanel").append('<span id="sidepaneltoolFlintKnife" '+
                                     'class="sidepanelbutton" '+
                                     'onclick="blocklist.getById('+ this.id +').settool(\'Flint Knife\')" '+
                                     'style="background-color:'+ color +'">Flint Knife</span>');
    }

    updatepanel() {
        $("#sidepanelonhand").html(this.onhand.length);
        $("#sidepanelprogress").html(Math.floor(this.counter*100/40));
    }

    settool(newtoolname) {
        $("#sidepaneltool"+ multireplace(this.nexttool, ' ', '')).css("background-color", "red");
        this.nexttool = newtoolname;
        $("#sidepaneltool"+ multireplace(this.nexttool, ' ', '')).css("background-color", "green");
    }
}
