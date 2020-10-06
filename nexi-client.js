const client = () => {
  console.log("Welcome to NeXi client");
  customInit();
};

const customInit = () => {
  customOnLeaveCallback();
  customTransition();
  customMatchFoundAnimation();
  customDeathMessage();
  customKillstreakText();
  customChatMessage();
  linkFix();
  removeEmoteHint();
  staticCrosshair();
  removeWeaponMenu();
  
  console.log('All Scripts have been started!')
};

// Functionality modifications

const customOnLeaveCallback = () => {
  Player.prototype.onLeave = function () {
    this.app.mouse.disablePointerLock(),
      Utils.isMobile()
        ? (window.location.href =
            "https://beta-meta-42746.venge.io/?isMobile=yes&v=" + Math.random())
        : (window.location.href = "index.html");
  };
};

// UI Modifications

//Custom Spawn Animation.
const customTransition = () => {
  Overlay.prototype.onTransition = function (t) {
    t
      ? ((this.leftCinema.element.color = t),
        (this.rightCinema.element.color = t))
      : ((this.leftCinema.element.color = pc.colors.black),
        (this.rightCinema.element.color = pc.colors.black)),
      (this.leftCinema.enabled = !0),
      (this.rightCinema.enabled = !0),
      (this.entity.sound.slots.Whoosh.pitch = 1.1),
      this.entity.sound.play("Whoosh"),
      this.leftCinema.setLocalEulerAngles(0, 0, 0),
      this.leftCinema.setLocalScale(0.1, 0, 0),
      this.leftCinema
        .tween(this.leftCinema.getLocalScale())
        .to({ x: 1.4, y: 1, z: 1 }, 0.35, pc.QuarticInOut)
        .start(),
      this.rightCinema.setLocalEulerAngles(0, 0, 0),
      this.rightCinema.setLocalScale(0.1, 0, 0),
      this.rightCinema
        .tween(this.rightCinema.getLocalScale())
        .to({ x: 1.4, y: 1, z: 1 }, 0.35, pc.QuarticInOut)
        .start(),
      setTimeout(
        function (t) {
          t.leftCinema.setLocalEulerAngles(0, 0, 0),
          t.leftCinema
            .tween(t.leftCinema.getLocalScale())
            .to({ x: 0.1, y: 1, z: 1 }, 0.35, pc.QuarticInOut)
            .start(),
          t.rightCinema.setLocalEulerAngles(0, 0, 0),
          t.rightCinema
            .tween(t.rightCinema.getLocalScale())
            .to({ x: 0.1, y: 1, z: 1 }, 0.35, pc.QuarticInOut)
            .start(),
          (t.entity.sound.slots.Whoosh.pitch = 1),
          t.entity.sound.play("Whoosh");
        },
        400,
        this
      );
  };
};

//Custom match found animation.
const customMatchFoundAnimation = () => {
  Menu.prototype.onMatchFound = function () {
    (this.isMatchFound = !0),
      (this.app.scene.layers.getLayerByName("Lightroom").enabled = !1),
      (this.app.scene.layers.getLayerByName("Lightroom-Top").enabled = !1),
      clearTimeout(this.bannerTimeout),
      this.app.fire("Ads:BannerDestroy", "venge-io_728x90", "728x90"),
      this.app.fire("DOM:Clear", !0),
      this.app.off("Player:Character"),
      this.app.fire("Popup:Close", !0),
      (this.matchFoundBackground.enabled = !0),
      this.matchFoundBackground
        .tween(this.matchFoundBackground.element)
        .to({ opacity: 1 }, 1, pc.QuarticOut)
        .start(),
      (this.matchFoundRectangle.element.opacity = 1),
      this.matchFoundRectangle.setLocalScale(0, 0, 0),
      this.matchFoundCenter.setLocalScale(3, 3, 3),
      this.matchFoundRectangle
        .tween(this.matchFoundRectangle.getLocalScale())
        .to({ x: 1, y: 1, z: 1 }, 0.5, pc.QuarticOut)
        .start(),
      this.matchFoundRectangle
        .tween(this.matchFoundRectangle.element)
        .to({ opacity: 0.1 }, 0.5, pc.QuarticOut)
        .start(),
      this.matchFoundCenter
        .tween(this.matchFoundCenter.getLocalScale())
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 2, pc.QuarticOut)
        .start(),
      setTimeout(
        function (e) {
          (e.matchFoundLoading.enabled = !0),
            e.matchFoundRectangle
              .tween(e.matchFoundRectangle.element)
              .to({ opacity: 0 }, 0.5, pc.QuarticOut)
              .start(),
            e.matchFoundText
              .tween(e.matchFoundText.element)
              .to({ opacity: 0 }, 0.5, pc.QuarticOut)
              .start(),
            setTimeout(function () {
              pc.app.fire("Game:Connect", !0);
            }, 1300);
        },
        1500,
        this
      );
  };
};

//Changes Message when get killed on top.
const customDeathMessage = () => {
  Player.prototype.setDeath = function (t, e) {
    if (
      ((this.killedBy = t),
      (this.isDeath = !0),
      this.deathCount++,
      this.app.fire("Digit:DeathCount", this.deathCount),
      this.movement.death(),
      (this.characterHolder.enabled = !0),
      this.characterEntity.setLocalEulerAngles(0, this.movement.lookX, 0),
      setTimeout(
        function (t) {
          t.movement.lookEntity.enabled = !1;
        },
        100,
        this
      ),
      this.characterEntity.setLocalPosition(0, -2.15, 0),
      (this.characterEntity.animation.speed = 1),
      "Drown" == e
        ? (this.characterEntity.animation.play("Floating"),
          (this.characterEntity.animation.speed = 3),
          (this.characterEntity.animation.loop = !0),
          this.entity.sound.play("Splash"),
          this.characterEntity.setLocalPosition(0, -3.5, 0),
          this.characterEntity
            .tween(this.characterEntity.getLocalPosition())
            .to({ x: 0, y: -6.5, z: 0 }, 2, pc.Linear)
            .start())
        : (this.characterEntity.animation.play("Death"),
          (this.characterEntity.animation.loop = !1)),
      (this.characterCamera.script.blackWhite.enabled = !0),
      this.characterCamera.setLocalPosition(0, 1.215, -0.115),
      this.characterCamera
        .tween(this.characterCamera.getLocalPosition())
        .to({ x: 0, y: 3.015, z: 7 }, 1, pc.SineOut)
        .start(),
      this.characterCamera.setLocalEulerAngles(0, 0, 0),
      this.characterCamera
        .tween(this.characterCamera.getLocalEulerAngles())
        .rotate({ x: -18, y: 0, z: 0 }, 0.7, pc.BackOut)
        .start(),
      this.interface.hideGameplay(),
      this.killedBy && this.killedBy != this.entity)
    ) {
      var a = this.killedBy.script.enemy.username;
      this.app.fire(
        "Overlay:Status",
        'Eliminated by [color="#FF0000"]' + a + "[/color]"
      );
    }
    this.app.fire("Player:StopSpeaking", !0),
      this.showCircularMenu(),
      "undefined" != typeof PokiSDK && PokiSDK.gameplayStop();
  };
};

//Custom Killstreak Translations.
const customKillstreakText = () => {
    Overlay.prototype.onKill = function(t, e) {
      var i = "Kill"
        , a = "Kill-Icon"
        , n = "Kill";
      "Kill" == e ? (i = "Kill Point",
      a = "Kill-Icon",
      n = "Kill") : "Headshot" == e ? (i = "Headshot",
      a = "Headshot-Icon",
      n = "Headshot") : "FirstBlood" == e ? (i = "First Blood",
      a = "First-Blood-Icon",
      n = "Kill") : "Drilled" == e ? (i = "Drilled",
      a = "Kill-Drilled",
      n = "3x") : "PickedOff" == e ? (i = "Drilled",
      a = "Kill-Drilled",
      n = "4x") : "Nailed" == e ? (i = "Nailed",
      a = "Kill-Nailed",
      n = "4x") : "Pumped" == e ? (i = "Pumped",
      a = "Kill-Pumped",
      n = "2x") : "360d" == e ? (i = "360 Degree Trick Shot",
      a = "Kill-360d",
      n = "God") : "Revenge" == e ? (i = "Revenge",
      a = "Revenge-Icon",
      n = "3x") : "2x" == e ? (i = "Double Kill",
      a = "Kill-2x",
      n = "2x") : "3x" == e ? (i = "Multi Kill",
      a = "Kill-3x",
      n = "3x") : "4x" == e ? (i = "Ultra Kill",
      a = "Kill-4x",
      n = "3x") : "5x" == e ? (i = "Unbreakable",
      a = "Kill-5x",
      n = "3x") : "6x" == e ? (i = "Unbelievable",
      a = "Kill-6x",
      n = "3x") : "7x" == e ? (i = "Savage",
      a = "Kill-7x") : "8x" == e ? (i = "Immortal",
      a = "Kill-8x",
      n = "3x") : "9x" == e ? (i = "Godlike",
      a = "Kill-9x",
      n = "4x") : "10x" == e ? (i = "Annihilation",
      a = "God-Icon",
      n = "God") : "Suicide" == e ? (i = "Suicide",
      a = "Suicide-Icon",
      n = "Suicide") : "Throw" == e ? (i = "Thrower",
      a = "Throw-Icon",
      n = "Throw") : "Capture" == e && (i = "Capture",
      a = "Capture-Icon",
      n = "Point");
      var s = "+";
      t < 0 && (s = ""),
      this.app.fire("Overlay:Announce", i, s + t + " score", n, a)
  };
};

//Custom Chat Message Color.
const customChatMessage = () => {
  Chat.prototype.onMessage = function(t, e, s, i) {
    var a = this.messageEntity.clone();
    a.enabled = !0,
    a.setLocalPosition(0, 0, 0),
    a.findByName("Text").element.text = t + ' : [color="#01A9DB"]' + e + "[/color]",
    a.element.height = a.findByName("Text").element.height + 10,
    a.findByName("Text").element.color = i ? this.consoleColor : s ? this.meColor : this.whiteColor,
    this.messages.push(a),
    this.messageHolder.addChild(a),
    this.nextMessage(),
    this.entity.sound.play("Notify"),
    a.messageTimeout = setTimeout(function(t, e) {
        e && (t.messages.splice(0, 1),
        e.destroy())
    }, 1e3 * this.timeLimit, this, a)
  };
}


//Fixes link not getting destroyed when match starts.
const linkFix = () => {
      Input.prototype.initialize = function() {
      this.timeout = !1,
      this.isDestroyed = !1,
      this.currentWidth = 0,
      this.currentHeight = 0,
      this.element = document.createElement("input"),
      this.element.placeholder = this.placeholder,
      this.element.type = this.type,
      this.element.style.position = "absolute",
      this.element.style.fontFamily = this.fontFamily,
      this.element.style.border = "0px",
      this.element.style.background = "transparent",
      this.element.style.fontSize = this.fontSize + this.scaleUnit,
      this.element.style.padding = this.padding + this.scaleUnit,
      this.element.style.boxSizing = "border-box",
      this.disableTab && (this.element.tabindex = !1),
      this.maxLength > 0 && (this.element.maxLength = this.maxLength);
      var t = "rgb(" + 255 * this.color.r + ", " + 255 * this.color.g + ", " + 255 * this.color.b + ")";
      this.element.style.color = t,
      this.element.style.outline = "none",
      this.whitePlaceholder && (this.element.className = "white-placeholder"),
      document.body.appendChild(this.element),
      this.focusEntity && (this.focusEntity.enabled = !1,
      this.element.onfocus = this.onFocus.bind(this),
      this.element.onblur = this.onBlur.bind(this)),
      this.blurFunction && (this.element.onblur = this.onBlurFunction.bind(this)),
      this.element.onchange = this.onChange.bind(this),
      Utils.getItem(this.entity._guid) && this.setValue(Utils.getItem(this.entity._guid)),
      this.updateStyle(),
      this.app.on("DOM:Clear", this.onDOMClear, this),
      this.app.on("DOM:Update", this.onDomUpdate, this),
      this.app.on("Input:" + this.entity.name, this.setResultValue, this),
      this.sleepValue && this.setValue(this.sleepValue),
      this.on("state", function(t) {
          this.entity.enabled ? this.element.style.display = "block" : this.element.style.display = "none"
      }, this),
      this.on("destroy", function(t) {
          this.onDestroy()
      }, this)
  };
};

//Removes Emote Hint when getting a kill.
const removeEmoteHint = () => {
  Player.prototype.onKill = function(t, e) {
    this.app.fire("Player:Frag", !0),
    "Capture" != e && "Suicide" != e && (this.killCount++,
    this.app.fire("Digit:KillCount", this.killCount)),
    setTimeout(function(t) {
        t.movement.inspect()
    }, 1e3, this)
  };
};

//Makes the Crosshair 
const staticCrosshair = () => {
  Overlay.prototype.onShooting = function() {
    this.crosshairEntity.tween(this.crosshairEntity.element).to({
        width: 65,
        height: 65
    }, .045, pc.SineOut).start(),
    this.setAmmo()
  };
  Overlay.prototype.onJumping = function() {
  this.crosshairEntity.tween(this.crosshairEntity.element).to({
      width: 70,
        height: 70
    }, .15, pc.SineOut).start()
  };
};

//Removes the Weapon of the Main Menu character.
const removeWeaponMenu = () => {
  Menu.prototype.attachCharacterEntity = function() {
    //var e = "Character1_RightHand";
    //"Lilium" == pc.session.character ? e = "Character1_RightHand" : "Shin" == pc.session.character && (e = "Hand_R");
    //var t = this.characterEntity.findByName(e);
    //t && (this.weaponEntity = this.characterEntity.findByName("Weapon"),
    //this.weaponEntity.setLocalScale(100, 100, 100),
    //this.weaponEntity.reparent(t)),
    //this.app.fire("Player:Weapon", pc.session.weapon)
  }
}


const {dialog, app} = require('electron');
const Store = require('electron-store');
const config = new Store();
const OS = require('os');
var {initWin} = require('./main')
exports.config = config;
function fps_boost(){
    if (config.get('utilities_FPS')) {
        if (OS.cpus().findIndex(cpu => cpu.model.includes("AMD")) != -1) {
            app.commandLine.appendSwitch('enable-zero-copy');
        }
        app.commandLine.appendSwitch('disable-frame-rate-limit');
    }
    if (config.get('utilities_D3D11OND12')) {
        app.commandLine.appendSwitch('use-angle', 'd3d11ond12');
        app.commandLine.appendSwitch('enable-webgl2-compute-context');
    } else {
        app.commandLine.appendSwitch('use-angle', 'd3d9');
    }
    app.commandLine.appendSwitch('enable-quic');
    app.commandLine.appendSwitch('ignore-gpu-blacklist');
    app.commandLine.appendSwitch('disable-gpu-vsync')
    app.commandLine.appendSwitch('enable-pointer-lock-options');
    app.commandLine.appendSwitch('disable-accelerated-video-decode', false);
    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')
    app.commandLine.appendSwitch('enable-quic');
    app.commandLine.appendSwitch('high-dpi-support', 1);
}


function createSettingsWindow() {
    const settings = dialog.showMessageBoxSync(initWin, {
        type: 'question',
        buttons: ['General'],
        title: 'Settings',
        message: '',
        defaultId: 0,
        cancelId: 2
    });
    if (settings === 0) {
        openGeneralSettings();
    }

    function openGeneralSettings() {

        // !!!!! PROCESS INEFFICIENT AS HELL BUT I COULDN'T GIVE A DAMN !!!!! 
        if (config.get('utilities_FPS', true)) {
            var fps = 'Enable';
        } else {
            var fps = 'Disable';
        }

        if (config.get('utilities_D3D11OND12', true)) {
            var d3d11ond12 = 'Disable';
        } else {
            var d3d11ond12 = 'Enable';
        }
        if (config.get('utilities_RPC', true)) {
            var dc = 'Disable';
        } else {
            var dc = 'Enable';
        }
        if (config.get('utilities_FPS') == null){
            config.set('utilities_FPS',true);
        };
        if (config.get('utilities_D3D11OND12') == null){
            config.set('utilities_D3D11OND12',true);
        };
        if (config.get('utilities_RPC') == null){
            config.set('utilities_RPC',true);
        };

        // !!!!! SHOWS MENU TO USER !!!!!
        const options = dialog.showMessageBoxSync(initWin, {
            type: 'question',
            buttons: [`${fps} Frame Rate Limit Cap`, `${d3d11ond12} D3D11OND12`, `${dc} Discord RPC`],
            title: 'Settings',
            message: '',
            defaultId: 0,
            cancelId: 3
        });

        // !!!!! BASICALLY ACTS AS A SWITCH, A VERY INEFFICIENT ONE !!!!!
        if (options === 0) {
            if (config.get('utilities_FPS', true)) {
                config.set('utilities_FPS', false);
            } else {
                config.set('utilities_FPS', true)
            }
            app.relaunch();
            app.quit();
        }
        if (options === 1) {
            if (config.get('utilities_D3D11OND12', true)) {
                config.set('utilities_D3D11OND12', false);
            } else {
                config.set('utilities_D3D11OND12', true);
            }
            app.relaunch();
            app.quit();
        }
        if (options === 2){
            if (config.get('utilities_RPC', true)) {
                config.set('utilities_RPC', false);
            } else {
                config.set('utilities_RPC', true);
            }
            app.relaunch();
            app.quit();
        }
    }
}

exports.createSettingsWindow =  createSettingsWindow;
exports.fps_boost = fps_boost;
