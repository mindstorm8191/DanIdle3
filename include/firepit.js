class firepit extends activeblock {
    constructor(mapsquare) {
        super(mapsquare);
        this.name = 'Fire Pit';
        this.counter = 0;
        this.onhand = []; // This is considered finished cooked items
        this.tocook = []; // This is for items we need to cook. Items will be cooked one at a time
        this.firewood = []; // This is used for keeping the fire burning
        $("#"+ this.tile.id +"imageholder").html('<img src="img/campfire.png" />');
        this.tile.structure = this;
    }

    getitem(itemname) {
        
    }
}