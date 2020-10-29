const client = () => {
  console.log("Welcome to NeXi client");
  customInit();
};

const customInit = () => {
  customOnLeaveCallback();
  startCustomSolo();
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
  hexagonBreak();
  weaponSelectionFix();
  //teamModeFixes();
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

const startCustomSolo = () => {
    RoomManager.prototype.onStart = function() {
      this.app.fire("Analytics:Event", "Invite", "TriedToStart"),
      this.send([this.keys.start]),
      this.app.fire("Analytics:Event", "Invite", "Start")
  }
}

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
    }, {
      key: keyboardMap[pc.KEY_F6],
      default_key: "F6",
      function: "Toggle UI",
      waiting: ""
    },];
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
    var toggle = 0;
    var e = 0;
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
      this.app.keyboard.wasPressed(pc.KEY_F6) && (
        (e == 1) ? (this.interface.showGameplay(), e = 0) : (this.interface.hideAllGameplay(), e = 1)
      ),
      this.app.keyboard.wasPressed(pc.KEY_F5) && (
        this.app.mouse.disablePointerLock(),
        "ShowTeamSelection" == e,
        pc.isModeMenuActive = !0,
        this.app.fire("Overlay:Pause", !0),
        console.log("Opened"),
        this.app.fire("View:Pause", "Team"),
        pc.app.fire("Player:PointerLock", !1),
        setTimeout(function() {
          pc.app.fire("Player:PointerLock", !0),
          pc.isModeMenuActive = !1,
          this.app.fire("Overlay:Pause", !1)
        }, 5000)
      ),
      this.app.keyboard.wasPressed(pc.KEY_J) && (this.app.scene.layers.getLayerByName("NonFOV").enabled = checkFOV()),
      toggle = this.app.scene.layers.getLayerByName("NonFOV").enabled,
      this.app.keyboard.wasPressed(pc.KEY_T) && (this.inspectAfterReload = !0),
      this.app.keyboard.wasReleased(pc.KEY_T) && (
        this.animation.movementAngleX = 0,
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
  
  function checkFOV(){
    console.log('Function CheckFOV called.');
    if (toggle == 1){
      console.log(0);
      return 0;
    }
    else {
      console.log(1);
      return 1;
    }
  } 
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

//Fix Hexagon Tiles not breaking :P
const hexagonBreak = () => {
    Damageable.prototype.setDamage = function(t) {
      var e = this.entity.getPosition().clone();
      this.health = t,
      this.app.fire("EffectManager:CustomSound", "Hit-Sound", 1 - .005 * this.health, e),
      this.health <= -500 && (this.app.fire("EffectManager:ExplosionEffect", e),
      this.entity.destroy())
  }
}

//Fix Weapon Selection
const weaponSelectionFix = () => {
    Menu.prototype.onWeaponSelect = function(e) {
      var t = this.weaponEntity.findByTag("Weapon")
        , n = this.app.assets.find(e + "-Thumbnail-White.png");
      for (var i in t) {
          t[i].enabled = !1
      }
      this.weaponIcon.element.textureAsset = n,
      this.weaponName.element.text = e.toLowerCase(),
      this.entity.sound.play("Whoosh"),
      pc.session.weapon = e
  }
}

//TDM Mode fixes
const teamModeFixes = () => {
    NetworkManager.prototype.initialize = function() {
      "undefined" != typeof VERSION && (this.isDebug = !1),
      this.pack = MessagePack.initialize(4194304),
      this.ws = !1,
      this.isMuted = !1,
      this.playerId = !1,
      this.username = "none",
      this.mapTimer = !1,
      this.currentVolume = 1,
      this.lastGameStart = Date.now(),
      this.lastGuardTime = Date.now(),
      pc.session && pc.session.hash ? (this.hash = pc.session.hash,
      pc.session.username && (this.username = pc.session.username)) : this.hash = !1,
      this.skin = "Lilium",
      this.team = "none",
      pc.currentMode = "TDM",
      this.currentWeapon = "Scar",
      this.currentMode = "TDM",
      this.currentMap = "Sierra2v2",
      this.isSpectator = !1,
      void 0 !== pc.currentMap && (this.currentMap = pc.currentMap),
      pc.session && void 0 !== pc.session.character ? (this.characterName = pc.session.character,
      this.skin = pc.session.character) : this.skin = this.characterName,
      pc.session && void 0 !== pc.session.dance ? this.dance = pc.session.dance : this.dance = "Techno",
      this.group = 0,
      this.keys = this.getKeys(),
      this.players = [],
      this.stats = [],
      this.lastPingDate = Date.now(),
      this.currentPing = 0;
      var e = 300;
      pc.isMobile && (e = 140),
      this.options = {
          maxTime: e,
          maxPlayer: 4,
          points: 4,
          gameMode: this.currentMode,
          map: this.currentMap
      },
      this.payloadPercentage = 0,
      pc.globalAngle = 62,
      this.app.on("Network:Options", this.setOptions, this),
      this.app.on("Network:Issue", this.setIssue, this),
      this.app.on("Network:Reconnect", this.reconnect, this),
      this.app.on("Network:Position", this.setPosition, this),
      this.app.on("Network:Event", this.setEvent, this),
      this.app.on("Network:State", this.setState, this),
      this.app.on("Network:Damage", this.setDamage, this),
      this.app.on("Network:Hurt", this.setHurt, this),
      this.app.on("Network:Chat", this.sendChatMessage, this),
      this.app.on("Network:Vote", this.setVote, this),
      this.app.on("Network:RadiusEffect", this.setRadiusEffect, this),
      this.app.on("Network:PointEffect", this.setPointEffect, this),
      this.app.on("Network:Respawn", this.setRespawn, this),
      this.app.on("Network:Throw", this.setThrow, this),
      this.app.on("Network:Weapon", this.setWeapon, this),
      this.app.on("Network:Point", this.setPoint, this),
      this.app.on("Network:Buy", this.setBuy, this),
      this.app.on("Network:Card", this.setCard, this),
      this.app.on("Network:Reward", this.setReward, this),
      this.app.on("Network:DealSpell", this.setDealSpell, this),
      this.app.on("Network:Report", this.setReport, this),
      this.app.on("Network:Drown", this.setDrown, this),
      this.app.on("Network:Kick", this.setPlayerKick, this),
      this.app.on("Network:Team", this.setTeam, this),
      this.app.on("Network:ObjectDamage", this.setObjectDamage, this),
      this.app.on("Network:RequestTeamList", this.requestTeamList, this),
      this.app.on("Network:Guard", this.setGuard, this),
      this.app.on("Network:Restart", this.onRestart, this),
      this.app.on("Player:Hide", this.setPlayerHide, this),
      this.app.on("Player:Show", this.setPlayerShow, this),
      this.app.on("Player:Character", this.setCharacterSkin, this),
      this.app.on("Map:Loaded", this.onMapLoaded, this),
      window.onhashchange = this.reconnect.bind(this),
      this.enemyEntity.enabled = !1,
      this.isDebug ? this.reconnect() : this.blackShadow.enabled = !0,
      "undefined" != typeof PokiSDK && this.app.fire("Analytics:GameplayStart", !0)
  }

  Enemy.prototype.damage = function(t, i, e) {
      var s = !1;
      if (e && e.y > .9 && (s = !0),
      this.damageAngle = Utils.lookAt(0, 0, e.x, e.z),
      this.skinMaterial && (this.skinMaterial.emissiveIntensity = .65,
      this.skinMaterial.update()),
      this.tempAngle.x += 3 * Math.random() - 3 * Math.random(),
      this.tempAngle.y += 2 * Math.random() - 2 * Math.random(),
      !this.isActivated) {
          clearTimeout(this.skinMaterialTimer),
          this.skinMaterialTimer = setTimeout(function(t) {
              var i = pc.app.tween(t.skinMaterial).to({
                  emissiveIntensity: 0
              }, .15, pc.Linear);
              i.on("update", function(i) {
                  t.skinMaterial.update()
              }),
              i.start()
          }, 50, this);
          var n = Math.round(2 * Math.random()) + 1
            , a = this.skin + "-Grunt-" + n
            , h = !0;
          "TDM" != pc.currentMode && "PAYLOAD" != pc.currentMode || pc.currentTeam == this.team && (h = !1,
          this.app.fire("Overlay:FriendlyFire", !0)),
          h && (this.app.fire("Hit:Point", this.entity, Math.floor(20 * Math.random()) + 5),
          this.entity.sound.play(a),
          s && this.app.fire("Hit:Headshot", this.entity, Math.floor(20 * Math.random()) + 5)),
          this.lastDamage = Date.now(),
          "TDM" != pc.currentMode && "PAYLOAD" != pc.currentMode || this.app.fire("Outline:Add", this.characterEntity)

          if(pc.currentMode == "TDM" && pc.currentTeam == this.team && h == !1) {
              this.app.fire("Overlay:FriendlyFire", !1)
          }
          
      }
      this.app.fire("Network:Damage", t, i, s, this.playerId)
  }
  
  ModeManager.prototype.triggerWeaponChange = function(e) {
      if ("GUNGAME" == this.currentMode) {
          var a = this.variables.gungame.weapons.indexOf(this.currentWeapon)
            , i = this.variables.gungame.weapons.indexOf(e)
            , t = this.variables.gungame.weapons[i + 1]
            , n = this.variables.gungame.weapons[i + 2];
          a > i && (this.variables.kills = 0),
          this.app.fire("Overlay:OtherIcons", t, n),
          this.app.fire("Overlay:WeaponText", this.variables.kills + " / " + this.variables.gungame.weaponLevels[e])
      }
      else
      {
          this.app.fire("Overlay:WeaponText")
          this.app.fire("Overlay:OtherIcons")
      }
      this.currentWeapon = e
  }

  NetworkManager.prototype.setTeam = function(e) {
      var t = e.team;
      this.isTeamSelected || (this.send([this.keys.team, t]),
      pc.app.fire("View:Pause", "Popup"),
      setTimeout(function() {
          pc.app.fire("Player:PointerLock", !0)
      }, 50),
      this.isTeamSelected = !0,
      pc.isModeMenuActive = !1)
  }
}