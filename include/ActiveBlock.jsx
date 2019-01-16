class ActiveBlock extends React.Component {
    // Each building, structure, or other object on the map.
    constructor(xpos, ypos, maptile) {
        super();
        this.y = ypos;
        this.x = xpos;
        this.id = lastblockid; lastblockid++;
        this.counter = 0;
        this.countertarget = 1;
        this.img = '';
        this.name = 'Needs-a-name';
        this.description = 'This is a new game element. It still requires a description';
        this.tileHandle = maptile; // This is a direct reference to the React element for this map tile
        blocklist.push(this);
    }

    select() {
        // This is triggered when a building is clicked on from the map
        console.log('Structure selected');
    }

    update() {
        // Manages updating this game block, which is triggered once per tick
        // This is a holder function for the subclass to declare
        console.log('Error: Activeblock (name='+ this.name +') is missing its update function');
    }

    render() {
        return (<div>This ActiveBlock is missing a render method</div>);
    }
}

class foragepost extends ActiveBlock {
    // A center for collecting edible foods from the surrounding forage
    constructor(xpos, ypos, maptile) {
        super(xpos, ypos, maptile);
        this.counter = 0;
        this.countertarget = 30;
        this.onhand = [];
        this.name = 'Forage Post';
        this.img = 'img/foragepost.png';
        chunklist[0][0].map[this.y][this.x].structure = this;
    }

    update() {
        if(this.onhand.length>15) {  // Cannot hold more than 15 units of food
            return;
        }
        this.counter++;
        if(this.counter<30) {
            triggerSidepanelUpdate(this);
            return;
        }
        this.counter-=30;
        switch(Math.floor(Math.random() *4)) {
            case 1: this.onhand.push(new item("apple")); break;
            case 2: this.onhand.push(new item("berry")); break;
            case 3: this.onhand.push(new item("nut")); break;
            case 4: this.onhand.push(new item("mushroom")); break;
        }
        triggerSidepanelUpdate(this);
    }

    render() {
        return (
            <div>
                <center><b>Foraging Post</b></center>
                Employs one worker to gather edible foods from the surrounding forage. Foods found this way include apples, berries of various types, nuts, even mushrooms.<br />
                The local forage can only support up to 4 workers. Anything more will drain the local food supplies. You will need to find other food sources to grow your colony.<br />
                <br />
                Total food on hand: {this.onhand.length}<br />
                Progess to next find: {Math.floor(this.counter/this.countertarget*100)}%
            </div>
        );
    }
}

class leanto extends ActiveBlock {
    // A basic structure for colonists to hide from the elements.  This will be the first thing new players build

    constructor(xpos, ypos, maptile) {
        super(xpos,ypos, maptile);
        this.counter = 0;
        this.countertarget = 120;
        this.buildstate = 0;
        this.name = 'Lean-To';
        this.img = "img/leanto.png";  // This field must be set by all blocks
        chunklist[0][0].map[this.y][this.x].structure = this;  // We need to add this part last, so that the ActiveBlock's image can be set before
                                                               // the map gets re-rendered
    }

    update() {
        if(this.buildstate==1) {
            this.counter--;
            if(this.counter<=0) {
                this.buildstate = 0;
                this.counter = 0;
                this.countertarget = 120;
            }
            triggerSidepanelUpdate(this);
            return;
        }
        this.counter++;
        if(this.counter>=120) {
            this.buildstate = 1;
            this.counter = 600;
            this.countertarget = 600;
        }
        triggerSidepanelUpdate(this);
    }

    render() {
        return (
            <div>
                <center><b>Lean-To</b></center>
                Before food, even before water, one must find shelter from the elements. It is the first requirement for survival; for the elements will defeat you before anything else.<br />
                Consisting of a downed branch with leaves on top, this is easy to set up, and needs no tools - but wont last long in the elements itself. With luck, youll be able to upgrade this soon enough.<br />
                Once constructed, will require regular maintenance to remain functional.<br />
                <br />
                Status: {this.renderstatus()}<br />
                Progress: {Math.floor(this.counter/this.countertarget*100)}%
            </div>
        );
    }

    renderstatus() {
        // Helper function to render the current status of this lean-to
        switch(this.buildstate) {
            case 0: return 'Under construction'; break;
            case 1: return 'Ready to use'; break;
            case 2: return 'Repairing'; break;
        }
        return 'Unknown status of '+ this.buildstate;
    }
}

class rockknapper extends ActiveBlock {
    constructor(xpos, ypos, maptile) {
        super(xpos, ypos, maptile);
        this.counter = 0;
        this.countertarget = 20;
        this.onhand = [];
        this.crafting = ''; // What item we are building here. We would normally place this in a state variable, but that can't work here
        this.name = 'Rock Knapper';
        this.img = "img/rockknapper.png";
        chunklist[0][0].map[this.y][this.x].structure = this;
    }

    update() {
        if(this.onhand.length>10) {
            return;
        }
        if(this.crafting=='') {
            return;
        }
        this.counter++;
        if(this.counter<this.countertarget) {
            triggerSidepanelUpdate(this);
            return;
        }
        this.counter-= this.countertarget;
        switch(this.crafting) {
            case 'knife': this.onhand.push(new item('flint knife')); break;
            case 'stabber': this.onhand.push(new item('flint stabber')); break;
        }
        triggerSidepanelUpdate(this);
    }

    changecraft(newtarget) {
        if(this.crafting==newtarget) {
            // Since changing item type will reset crafting progress, we want to ensure that the item picked isn't already selected
            return;
        }
        switch(newtarget) {
            case 'knife':
                this.countertarget = 12;
            break;
            case 'stabber':
                this.countertarget = 20;
            break;
            case '': break; // This is still a valid result. This keeps setting the crafttype to none from throwing an error
            default:
                console.log('Error in rockknapper->pickitemtobuild: new craft target of '+ newtarget +' is not valid');
        }
        this.crafting = newtarget;
        this.counter = 0;
    }

    render() {
        return (
            <div>
                <center><b>Rock Knapper</b></center>
                Uses a hard rock to smash a flaky rock (such as flint) into a point, to be used as a tool.<br />
                You will need to specify which tool you would like to make, before starting.<br />
                <br />
                Tools on hand: {this.onhand.length}<br />
                Progress: {Math.floor(this.counter/this.countertarget*100)}%<br />
                <span style={{backgroundColor:"green"}} onClick={()=>blocklist.getById(this.id).changecraft('')}>(None)</span>: Build nothing<br />
                <span style={{backgroundColor:"grey"}} onClick={()=>blocklist.getById(this.id).changecraft('knife')}>Flint Knife</span>: used for cutting bark & vines into twine<br />
                <span style={{backgroundColor:"grey"}} onClick={()=>blocklist.getById(this.id).changecraft('stabber')}>Flint Stabber</span>: used to (crudely) cut branches from trees<br />
            </div>
        )
    }
}
