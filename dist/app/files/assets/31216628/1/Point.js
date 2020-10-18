var Point = pc.createScript('point');

Point.attributes.add('playerEntity', { type : 'entity' });
Point.attributes.add('radius', { type : 'number', default : 5 });
Point.attributes.add('labelEntity', { type : 'entity' });
Point.attributes.add('labelTime', { type : 'entity' });
Point.attributes.add('screenEntity', { type : 'entity' });
Point.attributes.add('objectiveBackground', { type : 'entity' });
Point.attributes.add('objectiveTime', { type : 'entity' });
Point.attributes.add('maxTime', { type : 'number', default : 30 });

Point.prototype.initialize = function() {
    this.activePlayer = false;
    this.distance     = 100;
    this.wasInside    = false;
    
    this.time         = parseInt(this.maxTime + '');
    
    this.nextCapture();
    
    this.app.on('Mode:NextObjective', this.onNextObjective, this);
    this.app.on('Server:Tick', this.setTick, this);
    
    this.app.on('Game:Finish', this.onFinish, this);
};

Point.prototype.onFinish = function() {
    this.labelEntity.enabled = false;
    this.entity.enabled = false;
};

Point.prototype.setTick = function() {
    this.time--;
    this.objectiveTime.element.text = this.time + '';
    this.labelTime.element.text = this.time + '';
    
    if(this.time <= 0){
        this.time = this.maxTime;
    }
};

Point.prototype.onNextObjective = function(index) {
    var objectives = this.app.root.findByTag('Objective');
    var currentObjective = objectives[index];
    
    if(currentObjective){
        var position = currentObjective.getPosition().clone();
        
        this.entity.setPosition(position);
    }
};

Point.prototype.nextCapture = function() {
    this.distance = this.playerEntity.getPosition().sub(this.entity.getPosition()).length();
    
    if(this.distance < this.radius){
        this.app.fire('Network:Point', true);
        this.objectiveBackground.element.color = pc.colors.capture;
        this.objectiveBackground.element.opacity = 0.5;
        
        if(!this.wasInside){
            this.entity.sound.play('Deep-Whoosh');   
        }
        
        this.wasInside = true;
    }else{
        this.objectiveBackground.element.color = pc.colors.black;
        this.objectiveBackground.element.opacity = 0.15;
        
        this.wasInside = false;
    }
    
    setTimeout(function(self){
        self.nextCapture();
    }, 800, this);
};

Point.prototype.update = function(){
    //hide if we are close to it
    if(this.distance < this.radius + 5){
        this.labelEntity.enabled = false;
        return false;
    }
    
    var screenPos = new pc.Vec3();
    var camera    = this.app.systems.camera.cameras[0];
    var ratio     = this.app.graphicsDevice.maxPixelRatio;
    
    var screenEntity = this.screenEntity.screen;
    var scale        = screenEntity.scale;
    var device       = this.app.graphicsDevice;
    var position     = this.entity.getPosition().add(new pc.Vec3(0, 5, 0));
    
    camera.worldToScreen(position, screenPos);
    
    screenPos.x *= ratio;
    screenPos.y *= ratio;
    
    if(
        screenPos.x > 0 && screenPos.x < this.app.graphicsDevice.width &&
        screenPos.y > 0 && screenPos.y < this.app.graphicsDevice.height &&
        screenPos.z > 0
    ){
        this.labelEntity.setLocalPosition(
            screenPos.x / scale, 
            (device.height - screenPos.y) / scale, 
            0
        );
        
        this.labelEntity.enabled = true;
    }else{
        this.labelEntity.enabled = false;
    }  
};