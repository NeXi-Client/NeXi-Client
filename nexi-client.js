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
  fixAdPreroll();
  inspectWeaponKeyboardBind();
  customNextMatchMessages();
  reduceMessageFix();
  shopFix();
  customMatchEndMessages();
  inspectWeapon();
  removeRandomInspect();
  scoreboardFix();
  
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
      n = "Throw") : "Capture" == e ? (i = "Capture",
      a = "Capture-Icon",
      n = "Point") : "Rank 1" == e ? (i = "Rank 1",
      a = "Rank-1",
      n = "Rank-Up") : "Rank 2" == e ? (i = "Rank 2",
      a = "Rank-2",
      n = "Rank-Up-2") : "Rank 3" == e ? (i = "Rank 3",
      a = "Rank-3",
      n = "Rank-Up") : "Rank 4" == e ? (i = "Rank 4",
      a = "Rank-4",
      n = "Rank-Up-2") : "Rank 5" == e ? (i = "Rank 5",
      a = "Rank-5",
      n = "Rank-Up") : "Rank 6" == e ? (i = "Rank 6",
      a = "Rank-6",
      n = "Rank-Up-2") : "Rank 7" == e ? (i = "Rank 7",
      a = "Rank-7",
      n = "Rank-Up") : "Rank 8" == e ? (i = "Rank 8",
      a = "Rank-8",
      n = "Rank-Up-2") : "Rank 9" == e ? (i = "Rank 9",
      a = "Rank-9",
      n = "Rank-Up") : "Rank 10" == e ? (i = "Rank 10",
      a = "Rank-10",
      n = "Rank-Up-2") : "Rank Lost" == e && (i = "Rank Lost",
      a = "Death-Icon",
      n = "Suicide");
      var s = "+";
      t < 0 && (s = ""),
      this.app.fire("Overlay:Announce", i, s + t + " score", n, a)
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

//Removes Emote Hint when getting a kill & removes inspect animation when doing a kill.
const removeEmoteHint = () => {
  Player.prototype.onKill = function(t, e) {
    this.app.fire("Player:Frag", !0),
    "Capture" != e && "Suicide" != e && (this.killCount++,
    this.app.fire("Digit:KillCount", this.killCount))
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

//Remove Ad Preroll after match
const fixAdPreroll = () => {
  NetworkManager.prototype.mode = function(e) {
    e[0] && (this.lastMode = this.currentMode + "",
    this.currentMode = e[0],
    pc.currentMode = this.currentMode,
    this.app.fire("Game:Mode", this.currentMode)),
    this.setModeState(this.lastMode, !1),
    this.setModeState(this.currentMode, !0);
    var t = this.app.root.findByName("Result");
    if (t) {
        var i = this.app.root.findByName("ChatWrapper");
        i && (i.setLocalPosition(0, 0, 0),
        i.reparent(this.app.root.findByName("ChatGame"))),
        t.destroy()
    }
    this.app.fire("Game:PreStart", !0),
    this.app.fire("Outline:Restart", !0);
    var a = e[1];
    if (console.log("Map load triggered!"),
    clearTimeout(this.mapTimer),
    this.mapTimer = setTimeout(function(e) {
        a ? e.app.fire("Map:Load", a) : e.app.fire("Map:Load", "Sierra")
    }, 100, this),
    pc.isFinished = !1,
    pc.isPauseActive = !1,
    this.app.fire("Game:Start", !0),
    this.app.fire("Player:Lock", !0),
    setTimeout(function(e) {
        e.app.fire("DOM:Update", !0)
    }, 500, this),
    Date.now() - this.lastGameStart > 1e5) {
        var r = this;
        this.app.fire("Player:Hide", !1)
       // this.app.fire("Ads:Preroll", function() {
       //     r.app.fire("Player:Show", !0)
       // })
    }
  }
}

//Add Inspect Weapon Keybind
const inspectWeaponKeyboardBind = () => {
  Menu.prototype.setKeyboardTable = function(e) {
    var t = [{
        key: keyboardMap[pc.KEY_W],
        default_key: "W",
        function: "Forward",
        waiting: ""
    }, {
        key: keyboardMap[pc.KEY_S],
        default_key: "S",
        function: "Backward",
        waiting: ""
    }, {
        key: keyboardMap[pc.KEY_A],
        default_key: "A",
        function: "Left",
        waiting: ""
    }, {
        key: keyboardMap[pc.KEY_D],
        default_key: "D",
        function: "Right",
        waiting: ""
    }, {
        key: keyboardMap[pc.KEY_SPACE],
        default_key: "SPACE",
        function: "Jump",
        waiting: ""
    }, {
        key: keyboardMap[pc.KEY_R],
        default_key: "R",
        function: "Reload",
        waiting: ""
    }, {
        key: keyboardMap[pc.KEY_E],
        default_key: "E",
        function: "Melee",
        waiting: ""
    }, {
        key: keyboardMap[pc.KEY_F],
        default_key: "F",
        function: "Throw",
        waiting: ""
    }, {
        key: keyboardMap[pc.KEY_B],
        default_key: "B",
        function: "Buy",
        waiting: ""
    }, {
        key: keyboardMap[pc.KEY_SHIFT],
        default_key: "SHIFT",
        function: "Focus",
        waiting: ""
    }, {
        key: keyboardMap[pc.KEY_H],
        default_key: "H",
        function: "Dance",
        waiting: ""
    }, {
        key: keyboardMap[pc.KEY_ENTER],
        default_key: "ENTER",
        function: "Chat",
        waiting: ""
    }, {
        key: keyboardMap[pc.KEY_X],
        default_key: "X",
        function: "Fire (Shoot)",
        waiting: ""
    }, {
        key: keyboardMap[pc.KEY_T],
        default_key: "T",
        function: "Inspect Weapon",
        waiting: ""
    }, {
      key: keyboardMap[pc.KEY_J],
      default_key: "J",
      function: "Toggle Viewmodel",
      waiting: ""
    }];
    if (e) {
        for (var n in t) {
            t[n].default_key == e.default_key && (t[n].waiting = "Waiting for prompt...")
        }
        this.currentKey = e.default_key,
        this.app.keyboard.once("keydown", this.defineKey, this)
    }
    var i = Utils.getItem("KeyConfiguration");
    if (i)
        for (var a in i = JSON.parse(i)) {
            var o = i[a];
            for (var s in t) {
                t[s].default_key == a && (t[s].key = keyboardMap[o])
            }
        }
    this.app.fire("Table:Keys", {
        result: t
    })
  }
}

//Keybind additions
const inspectWeapon = () => {
    Movement.prototype.setKeyboard = function() {
      return !this.player.isDeath && (!pc.isFinished && (!this.locked && ("INPUT" != document.activeElement.tagName && (this.jumpingTime + this.jumpLandTime < this.timestamp && this.currentHeight < this.nearGround && (this.isForward = !1,
      this.isBackward = !1,
      this.isLeft = !1,
      this.isRight = !1),
      (this.app.keyboard.isPressed(pc.KEY_W) || this.isMobileForward) && (this.isForward = !0),
      (this.app.keyboard.isPressed(pc.KEY_S) || this.isMobileBackward) && (this.isBackward = !0),
      (this.app.keyboard.isPressed(pc.KEY_A) || this.isMobileLeft) && (this.isLeft = !0),
      (this.app.keyboard.isPressed(pc.KEY_D) || this.isMobileRight) && (this.isRight = !0),
      this.app.keyboard.wasPressed(pc.KEY_SPACE) && this.jump(),
      this.app.keyboard.wasPressed(pc.KEY_R) && this.reload(),
      this.app.keyboard.wasPressed(pc.KEY_F) && this.throw(),
      this.app.keyboard.wasPressed(pc.KEY_E) && this.meleeSkill(),
      this.app.keyboard.wasPressed(pc.KEY_X) && (this.leftMouse = !0),
      this.app.keyboard.wasReleased(pc.KEY_X) && (this.leftMouse = !1),
      this.app.keyboard.wasPressed(pc.KEY_L) && (this.app.mouse.enablePointerLock(),
      this.app.fire("Overlay:Pause", !1)),
      this.app.keyboard.wasPressed(pc.KEY_M),
      this.app.keyboard.wasPressed(pc.KEY_SHIFT) && (this.isFocusing = !0),
      this.app.keyboard.wasPressed(pc.KEY_J) && (this.app.scene.layers.getLayerByName("NonFOV").enabled = checkFOV()),
      this.app.keyboard.wasPressed(pc.KEY_T) && (this.inspectAfterReload = !0),
      
      this.app.keyboard.wasReleased(pc.KEY_T) && (this.animation.movementAngleX = 0,
        this.animation.movementAngleY = 0,
        this.animation.movementAngleZ = 0,
        this.tween.inspect0 && this.tween.inspect0.stop(),
        this.tween.inspect1 && this.tween.inspect1.stop(),
        this.tween.inspect2 && this.tween.inspect2.stop(),
        clearTimeout(this.timer.inspect0),
        clearTimeout(this.timer.inspect1),
        clearTimeout(this.timer.inspect2),
        this.timer.inspect0 = setTimeout(function(t) {
        t.tween.inspect0 = t.app.tween(t.animation).to({
            movementAngleX: 26.2,
            movementAngleY: 47.65,
            movementAngleZ: 2.89
        }, .5, pc.BackInOut).start()
    }, 1, this),
    this.timer.inspect1 = setTimeout(function(t) {
        t.tween.inspect1 = t.app.tween(t.animation).to({
            movementAngleX: -66.53,
            movementAngleY: 18.52,
            movementAngleZ: 20.29
        }, .6, pc.BackInOut).start()
    }, 9999999999, this)),

      void (this.app.keyboard.wasReleased(pc.KEY_SHIFT) && (this.isFocusing = !1))))))
  }
}
var toggle = 0;
function checkFOV(){
  toggle += 1;
  toggle %= 2;
  return toggle;
}
//Remove random Inspect Animations
const removeRandomInspect = () => {
    Movement.prototype.reload = function() {
      return !(this.isHitting > this.timestamp) && (!(this.isReloading > this.timestamp) && (this.currentWeapon.capacity !== this.currentWeapon.ammo && (this.cancelInspect(),
      this.stopFiring(),
      this.player.fireNetworkEvent("r"),
      this.reloadingTime = this.currentWeapon.reloadingTime,
      this.isReloading = this.timestamp + this.reloadingTime,
      this.entity.sound.play("Takeout"),
      this.interface.showPrepare(),
      "Shotgun" == this.currentWeapon.type ? (this.timerTween[0] = this.app.tween(this.animation).to({
          weaponAngleX: -68.27,
          weaponAngleY: 29.63,
          weaponAngleZ: -14.15
      }, .4, pc.BackInOut),
      this.timerTween[0].start(),
      this.timerBag.push(setTimeout(function(t) {
          t.currentWeapon.hideArms()
      }, 150, this)),
      this.timerBag.push(setTimeout(function(t) {
          t.timerTween[1] = t.app.tween(t.animation).to({
              weaponAngleX: -65.42,
              weaponAngleY: 9.84,
              weaponAngleZ: 0,
              bounceAngle: 15
          }, .1, pc.BackInOut),
          t.timerTween[1].start(),
          t.currentWeapon.magazineThrow()
      }, 400, this))) : (this.timerTween[2] = this.app.tween(this.animation).to({
          weaponAngleX: 29.25,
          weaponAngleY: 6.02,
          weaponAngleZ: 30.34
      }, .4, pc.BackInOut),
      this.timerTween[2].start(),
      this.timerBag.push(setTimeout(function(t) {
          t.currentWeapon.hideArms()
      }, 150, this)),
      this.timerBag.push(setTimeout(function(t) {
          t.timerTween[3] = t.app.tween(t.animation).to({
              weaponAngleX: 32.25,
              weaponAngleY: 4.02,
              weaponAngleZ: 30.34,
              bounceAngle: 15
          }, .1, pc.BackInOut),
          t.timerTween[3].start(),
          t.currentWeapon.magazineThrow()
      }, 400, this))),
      this.timerBag.push(setTimeout(function(t) {
          t.timerTween[4] = t.app.tween(t.animation).to({
              bounceAngle: -5
          }, .1, pc.BackInOut),
          t.timerTween[4].start(),
          t.currentWeapon.magazineAttach()
      }, 1e3, this)),
      this.timerBag.push(setTimeout(function(t) {
          t.timerTween[5] = t.app.tween(t.animation).to({
              weaponAngleX: -68.27,
              weaponAngleY: 29.63,
              weaponAngleZ: -14.15
          }, .3, pc.BackInOut),
          t.timerTween[5].start()
      }, 1400, this)),
      this.timerBag.push(setTimeout(function(t) {
          t.timerTween[6] = t.app.tween(t.animation).to({
              bounceZ: -.1
          }, .15, pc.BackInOut),
          t.timerTween[6].start(),
          t.currentWeapon.reload()
      }, 1600, this)),
      this.timerBag.push(setTimeout(function(t) {
          t.timerTween[7] = t.app.tween(t.animation).to({
              weaponAngleX: 0,
              weaponAngleY: 0,
              weaponAngleZ: 0
          }, .15, pc.BackInOut),
          t.timerTween[7].start(),
          t.takeout()
      }, 2e3, this)),
      void this.timerBag.push(setTimeout(function(t) {
          t.setAmmoFull()
      }, 2e3, this)))))
  }
}

//Adds custom string at the result screen top right corner
const customNextMatchMessages = () => {
    Result.prototype.tick = function() {
      if (!this.timerEntity || !this.timerEntity.element || !this.timerEntity.element.text)
          return !1;
      var t = Math.max(this.time, 0);
      t >= 0 && t <= 5 ? (this.timerEntity.element.text = 'Next Match starting in - [color="#ffc703"]' + t + "[/color]",
      this.time > -1 && this.entity.sound.play("Count")) : this.timerEntity.element.text = 'Next Match starting in - [color="#ffc703"]' + t + "[/color]";
      var e = this.time - 10;
      e = Math.max(e, 0),
      this.time--,
      t >= 0 && setTimeout(function(t) {
          t.tick()
      }, 1e3, this)
  }
}

//Fix getting reduced card getting a message also which is unimportant
const reduceMessageFix = () => {
    SpellManager.prototype.applyReduce = function() {
      this.isReducedApplied || ("Lilium" == this.characterName ? this.player.throwCooldown = 7 : "Shin" == this.characterName && (this.player.throwCooldown = 2),
      this.isReducedApplied = !0)
      //this.app.fire("Overlay:Announce", "Reduce", "Throw cooldown time reduced", !1, "Reduce-Icon"))
  }
}

//Fix for the ads
const fixAds = () => {
    AdsManager.prototype.initalizeAdinplay = function() {
      var e = this
        , t = document.createElement("script");
      t.src = "https://api.adinplay.com/libs/aiptag/pub/SHP/venge.io/tag.min.js",
      t.onload = function() {
          e.onAdinplay()
      }
      ,
      document.body.appendChild(t)
  }
  ,
  AdsManager.prototype.initalizeVLISDK = function() {
      var e = this
        , t = document.createElement("script");
      t.src = "https://services.vlitag.com/adv1/?q=88c341984e92f1782076da0b24e5bffb",
      t.onload = function() {
          e.onVLI()
      }
      ,
      document.body.appendChild(t)
  }
}

//Shop fix
const shopFix = () => {
    Shop.prototype.onTransactionToken = function(t) {
      if (!t || !0 !== t.success)
          return !1;
      if ("mobile_3ce5" == t.token)
          return this.lastSelectedSKU = t.sku,
          window.webkit.messageHandlers.iosListener.postMessage("buy:" + t.sku),
          !1;
      var e = {
          access_token: t.token
      }
        , i = this
        , o = document.createElement("script");
      o.type = "text/javascript",
      o.async = !0,
      o.src = "https://static.xsolla.com/embed/paystation/1.0.7/widget.min.js",
      o.addEventListener("load", function(t) {
          XPayStationWidget.init(e),
          setTimeout(function() {
              i.buyButton.enabled = !0,
              XPayStationWidget.open()
          }, 100)
      }, !1),
      document.getElementsByTagName("head")[0].appendChild(o)
  }
}

const customMatchEndMessages = () => {
    Result.prototype.initialize = function() {
      for (var t in this.players = [],
      this.rankOpacity = 0,
      this.mapEntities = [],
      this.time = this.maxTime,
      this.tick(),
      this.rowEntity.enabled = !1,
      this.resultHolder.enabled = !0,
      this.scoresEntity.enabled = !1,
      !0 === pc.isSpectator ? this.showMessage("MATCH HAS FINISHED") : pc.isVictory ? this.showMessage("VICTORY") : this.showMessage("DEFEATED"),
      setTimeout(function(t) {
          t.showScoreTable(pc.stats)
      }, 3e3, this),
      this.app.fire("Overlay:Gameplay", !1),
      this.app.mouse.disablePointerLock(),
      pc.isFinished = !0,
      this.app.fire("Player:Lock", !1),
      this.app.fire("Game:Finish", !0),
      this.currentSkillIndex = 0,
      this.skills = [],
      pc.stats) {
          var e = pc.stats[t];
          e.isMe && (this.skills = [{
              name: "Experience",
              score: e.experience
          }, {
              name: "Bonus XP",
              score: e.bonus
          }, {
              name: "Total Experience",
              score: e.experience + e.bonus
          }],
          this.app.fire("Miniplay:Save", "kills", e.kill),
          this.app.fire("Miniplay:Save", "deaths", e.death),
          this.app.fire("Miniplay:Save", "objective_score", e.totalCardPoint),
          this.app.fire("Miniplay:Save", "assist", e.assist),
          this.app.fire("Miniplay:Save", "headshot", e.headshot),
          this.app.fire("Miniplay:Save", "reward", e.reward),
          this.app.fire("Miniplay:Save", "score", e.score))
      }
      this.skillPoints = [],
      this.voteBar.setLocalScale(.001, 1, 1),
      this.on("state", this.onStateChange, this),
      this.entity.on("destroy", this.onDestroy, this),
      this.app.on("Result:Preroll", this.onPreroll, this),
      this.onStateChange(!0),
      this.rewardButtonTimer = setTimeout(function(t) {
          pc.app.fire("Result:DestroyBanner", !0)
      }, 18e3, this),
      "undefined" != typeof PokiSDK && PokiSDK.gameplayStop(),
      this.app.on("Result:Banner", this.setBanner, this),
      this.app.on("Result:DestroyBanner", this.destroyBanner, this),
      window.onbeforeunload = !1
  }
}

//Fix Scoreboard being stuck on some occasions
const scoreboardFix = () => {
    Overlay.prototype.onStart = function() {
      this.app.fire("Overlay:Gameplay", !0),
      this.clearAbilityList(),
      this.abilityBar.setLocalScale(1, .001, 1),
      this.abilityHolderEntity.enabled = !1,
      this.skillIcon.enabled = !0,
      this.abilityNotification.enabled = !1,
      this.abilityBuyClock.enabled = !0,
      this.abilityBuyKey.enabled = !1,
      this.abilityBuyButton.findByName("TierLevel").element.color = pc.colors.gray,
      this.abilityBuyButton.findByName("Thumbnail").element.color = pc.colors.gray,
      this.isAbilitySelected = !1,
      this.isOvertime = !1
      this.app.fire("Overlay:PlayerStats", !1)
  }
  ,
  Overlay.prototype.onFinish = function() {
      this.pauseEntity.enabled = !1,
      pc.isPauseActive = !1,
      this.taskEntity.enabled = !1,
      this.achievementEntity.enabled = !1,
      this.focusBulletsEntity.enabled = !1,
      this.cardEntity.enabled = !1,
      this.entity.sound.stop("Card-Selection-Loop"),
      this.entity.sound.stop("Overtime-Loop"),
      this.abilities = [],
      this.hideAllGameplay(),
      this.app.fire("Overlay:PlayerStats", !1)
  }
}

const {dialog, app} = require('electron');
const Store = require('electron-store');
const config = new Store();
const OS = require('os');
var {initWin} = require('./main')
exports.config = config;
function fps_boost(){
    if (config.get('utilities_FPS') == null){
      config.set('utilities_FPS',true);
    };
    if (config.get('utilities_D3D11OND12') == null){
        config.set('utilities_D3D11OND12',true);
    };
    if (config.get('utilities_RPC') == null){
        config.set('utilities_RPC',true);
    };

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
