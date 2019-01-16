class leanto extends activeblock {
    constructor(mapsquare) {
        super(mapsquare);
        this.name = 'Lean-To';
        this.counter = 0; // how much time this has left to build (or rebuild)
        this.endurance = 0; // How long this structure will last before needing to be repaired
        this.peakendurance = 0; // How much endurance this building had when constructed. This is used to determine how much life to show for the
                                // building as it decays
        this.lifespeed = 5;  // How much endurance this structure gains per construction tick
        this.age = 0; // After construction, the age counter will increase, where this will wear out and become unuseable.
        $("#"+ this.tile.id +"imageholder").html('<img src="img/leanto.png" />');
        this.tile.structure = this;
        this.currenttool = null;
        this.nexttool = "None";
        
        this.state = 0; // 0=not built, 1=working
    }

    getitem(itemname) {
        return null;  // This doesn't output any items
    }

    possibleoutputs() {
        // This doesn't output anything
        return [];
    }
    
    update() {
        if(this.state==0) {
                // While we are building, we want to use the selected tool.  If it is not available, we will continue to build without it (and its
                // benefits).
            if(this.tool==null || this.tool.endurance<=0) {
                if(this.nexttool=='None') {
                    this.tool = null;
                }else{
                    this.tool = blocklist.findInStorage(this.nexttool, 1);  // If this returns null, we will still continue on without a tool
                    if(this.tool==null) {
                        this.lifespeed = 5;
                    }else{
                        switch(this.tool.name) {
                            case 'Flint Stabber': this.lifespeed = 10; break;
                            case 'Flint Hatchet': this.lifespeed = 13; break;
                        }
                    }
                }
            }

            this.counter++;
            this.endurance += this.lifespeed;
            if(this.tool!=null) this.tool.endurance--;
            if(this.counter>=120) { // aka 2 minutes
                this.state = 1;
                this.peakendurance = this.endurance;
                $("#"+ this.tile.id +"progress").css({"width": 60});
            }else{
                $("#"+ this.tile.id +"progress").css({"width": this.counter*0.5});  // aka 60/120
                //$("#"+ this.id +
                //$("#"+ this.tile.id +"progress").css({"width": "50px"});
            }
            return;
        }
        if(this.state==1) {
            this.endurance--;
            $("#"+ this.tile.id +"progress").css({"width": (this.endurance/this.peakendurance)*60});
            if(this.endurance<=0) {
                this.state = 1;
                this.counter = 0;
            }
        }
    }
    
    drawpanel() {
        $("#sidepanel").html('<b>Lean-To</b><br />'+
                'Before food, even before water, one must find shelter from the elements. It is the first requirement for survival; for the '+
                'elements will defeat you before anything else.<br />'+
                '<br />'+
                'Consisting of a downed branch with leaves on top, this is easy to set up, needing no tools - but wont last long in the '+
                'elements itself. With luck, youll be able to upgrade this soon enough<br />'+
                '<br />'+
                'Once set up, will require regular maintenance to remain functional.<br />'+
                '<br />');
        if(this.state==0) {
            $("#sidepanel").append('Status: <span id="sidepanelstatus">Building: '+ (Math.floor(this.counter/1.2)) +'% complete</span>');
        }else{
            $("#sidepanel").append('Status: <span id="sidepanelstatus">In use. '+ (Math.floor(this.endurance/6)) +'% lifespan remaining</span>');
        }
        if(unlockeditems.indexOf('Flint Stabber')!=-1) {  // This is the first item, which should unlock the opportunity to use tools to build the
                                                          // lean-to
            $("#sidepanel").append('<b>Select a Tool</b><br />');
            let color = (this.nexttool=='None')? 'green' : 'red';
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
    }
    
    updatepanel() {
        if(this.state==0) {
            $("#sidepanelstatus").html('Building: '+ (Math.floor(this.counter/1.2)) +'% complete');
        }else{
            $("#sidepanelstatus").html('In use. '+ (Math.floor(this.endurance*100/this.peakendurance)) +'% lifespan remaining</span>');
        }
    }

    picktool(newtoolname) {
        $("#sidepaneltool"+ multireplace(this.nexttool, ' ', '')).css("background-color", "red");
        this.nexttool = newtoolname;
        $("#sidepaneltool"+ multireplace(this.nexttool, ' ', '')).css("background-color", "green");
    }
}


