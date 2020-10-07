var Payload = pc.createScript('payload');

// initialize code called once per entity
Payload.prototype.initialize = function() {
    this.wheelsBack  = this.entity.findByName('Wheels_Back');
    this.wheelsFront = this.entity.findByName('Wheels_Front');
};

// update code called every frame
Payload.prototype.update = function(dt) {
    this.entity.translateLocal(0.03, 0, 0);
    this.wheelsBack.rotateLocal(0, 1.6, 0);
    this.wheelsFront.rotateLocal(0, 1.6, 0);
};

// swap method called for script hot-reloading
// inherit your script state here
// Payload.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/