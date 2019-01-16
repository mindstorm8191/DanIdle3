class stickmaker extends activeblock {
    constructor(mapsquare) {
        super(mapsquare);
        this.name = "Stick Maker";
        this.onhand = [];
        this.counter = 0;
        this.tool = null;
        this.nexttool = 'None';
        this.building = 'None';
        this.nextbuild = 'None';
        $("#"+ this.tile.id +"imageholder").html('<img src="img/stickmaker.png" />');
        this.tile.structure = this;
    }

    getitem(itemname) {
        if(itemname=='') return null;
        
        // Since we can have many types of items in this, we need to run through everything we're currently holding
        for(let i=0; i<this.onhand.length; i++) {
            if(this.onhand[i].name==itemname) {
                return this.onhand.splice(i, 1)[0];
            }
        }
    }

    possibleoutputs() {
        return ['Firewood', 'Short Stick', 'Long Stick'];
    }

    update() {
        if(this.onhand.length>=20) return;

        //First, determine what we are trying to build here
        if(this.building=='None') {
            if(this.nextbuild=='None') return;
            this.building = this.nextbuild;
        }

        // Now, get our tools arranged
        if(this.tool==null || this.tool.endurance <=0) {
            if(this.nexttool=='None') return;
            this.tool = blocklist.findInStorage(this.nexttool, 1);
            if(this.tool==null) return;
        }

        this.tool.endurance--;
        this.counter += this.tool.efficiency;
        if(this.counter>=30) {
            this.counter-=30;
            this.onhand.push(new item(this.building));
            this.building = this.nextbuild;
        }
        $("#"+ this.tile.id +"progress").css({"width": this.counter*2});  // aka 60/30
    }

    drawpanel() {
        $("#sidepanel").html('<b>Stick Maker</b><br />'+
                             '<br />'+
                             'The effective use of wood is crucial for continued expansion of your colony. While tools may be hard to aquire '+
                             'early in your development, many of them require wood for handles<br />'+
                             '<br />'+
                             'Cuts down small trees and branches of larger ones to produce sticks of various sizes, including firewood.<br />'+
                             '<br />'+
                             'Items on hand: <span id="sidepanelonhand">'+ this.onhand.length +'</span><br />'+
                             'Currently building: <span id="sidepanelcurrent">'+ this.building +'</span><br />'+
                             'Current progress: <span id="sidepanelprogress">'+ (Math.floor(this.counter*100/30)) +'</span><br />'+
                             '<br />'+
                             '<b>Select an output:</b><br />');
        let color = (this.nextbuild=='None')? 'green' : 'grey';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelchoiceNone" '+
                                     'style="background-color:'+ color +';" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'None\')">None</span>');
        color = (this.nextbuild=='Short Stick')? 'green' : 'grey';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelchoiceShortStick" '+
                                     'style="background-color:'+ color +';" '+
                                     'title="Crude short stick. Good for smaller tools (like hatchets)" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'Short Stick\')">Short Stick</span>');
        color = (this.nextbuild=='Long Stick')? 'green' : 'grey';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelchoiceLongStick" '+
                                     'style="background-color:'+ color +';" '+
                                     'title="Crude long stick. Good for larger tools (like hoes)" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'Long Stick\')">Long Stick</span>');
        color = (this.nextbuild=='Firewood')? 'green' : 'grey';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepanelchoiceFirewood" '+
                                     'style="background-color:'+ color +';" '+
                                     'title="Small kindle for fires" '+
                                     'onclick="blocklist.getById('+ this.id +').pickcraft(\'Firewood\')">Firewood</span>');
        // With all the options listed, now allow users to select a tool to use
        $("#sidepanel").append('<br />'+
                               '<br />'+
                               '<b>Select a tool:</b><br />');
        color = (this.nexttool=='None')? 'green' : 'red';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepaneltoolNone" '+
                                     'style="background-color:'+ color +'" '+
                                     'onclick="blocklist.getById('+ this.id +').picktool(\'None\')">None</span>');
        color = (this.nexttool=='Flint Stabber')? 'green' : 'red';
        $("#sidepanel").append('<span class="sidepanelbutton" '+
                                     'id="sidepaneltoolFlintStabber" '+
                                     'style="background-color:'+ color +'" '+
                                     'onclick="blocklist.getById('+ this.id +').picktool(\'Flint Stabber\')">Flint Stabber</span>');
        if(unlockeditems.indexOf('Flint Hatchet')!=-1) {
            color = (this.nexttool=='Flint Hatchet')? 'green' : 'red';
            $("#sidepanel").append('<span class="sidepanelbutton" '+
                                         'id="sidepaneltoolFlintHatchet" '+
                                         'style="background-color:'+ color +'" '+
                                         'onclick="blocklist.getById('+ this.id +').picktool(\'Flint Hatchet\')">Flint Hatchet</span>');
        }
    }

    updatepanel() {
        $("#sidepanelonhand").html(this.onhand.length);
        $("#sidepanelcurrent").html(this.building);
        $("#sidepanelprogress").html(Math.floor(this.counter*100/30));
    }

    pickcraft(newbuildname) {
        // Selects a new item to build.  Called by onclick event from the DOM
        if(this.nextbuild==newbuildname) return;
        $("#sidepanelchoice"+ multireplace(this.nextbuild, ' ', '')).css("background-color", "grey");
        this.nextbuild = newbuildname;
        $("#sidepanelchoice"+ multireplace(this.nextbuild, ' ', '')).css("background-color", "green");
    }

    picktool(newtoolname) {
        if(this.nexttool==newtoolname) return;
        $("#sidepaneltool"+ multireplace(this.nexttool, ' ', '')).css('background-color', 'red');
        this.nexttool = newtoolname;
        $("#sidepaneltool"+ multireplace(this.nexttool, ' ', '')).css('background-color', 'green');
    }
}


