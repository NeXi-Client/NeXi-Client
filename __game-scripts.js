pc.extend(pc, function() {
    var t = function(t) {
        this._app = t,
        this._tweens = [],
        this._add = []
    };
    t.prototype = {
        add: function(t) {
            return this._add.push(t),
            t
        },
        update: function(t) {
            for (var i = 0, e = this._tweens.length; i < e; )
                this._tweens[i].update(t) ? i++ : (this._tweens.splice(i, 1),
                e--);
            this._add.length && (this._tweens = this._tweens.concat(this._add),
            this._add.length = 0)
        }
    };
    var i = function(t, i, e) {
        pc.events.attach(this),
        this.manager = i,
        e && (this.entity = null),
        this.time = 0,
        this.complete = !1,
        this.playing = !1,
        this.stopped = !0,
        this.pending = !1,
        this.target = t,
        this.duration = 0,
        this._currentDelay = 0,
        this.timeScale = 1,
        this._reverse = !1,
        this._delay = 0,
        this._yoyo = !1,
        this._count = 0,
        this._numRepeats = 0,
        this._repeatDelay = 0,
        this._from = !1,
        this._slerp = !1,
        this._fromQuat = new pc.Quat,
        this._toQuat = new pc.Quat,
        this._quat = new pc.Quat,
        this.easing = pc.Linear,
        this._sv = {},
        this._ev = {}
    }
      , e = function(t) {
        var i;
        return t instanceof pc.Vec2 ? i = {
            x: t.x,
            y: t.y
        } : t instanceof pc.Vec3 ? i = {
            x: t.x,
            y: t.y,
            z: t.z
        } : t instanceof pc.Vec4 ? i = {
            x: t.x,
            y: t.y,
            z: t.z,
            w: t.w
        } : t instanceof pc.Quat ? i = {
            x: t.x,
            y: t.y,
            z: t.z,
            w: t.w
        } : t instanceof pc.Color ? (i = {
            r: t.r,
            g: t.g,
            b: t.b
        },
        void 0 !== t.a && (i.a = t.a)) : i = t,
        i
    };
    i.prototype = {
        to: function(t, i, n, s, r, h) {
            return this._properties = e(t),
            this.duration = i,
            n && (this.easing = n),
            s && this.delay(s),
            r && this.repeat(r),
            h && this.yoyo(h),
            this
        },
        from: function(t, i, n, s, r, h) {
            return this._properties = e(t),
            this.duration = i,
            n && (this.easing = n),
            s && this.delay(s),
            r && this.repeat(r),
            h && this.yoyo(h),
            this._from = !0,
            this
        },
        rotate: function(t, i, n, s, r, h) {
            return this._properties = e(t),
            this.duration = i,
            n && (this.easing = n),
            s && this.delay(s),
            r && this.repeat(r),
            h && this.yoyo(h),
            this._slerp = !0,
            this
        },
        start: function() {
            var t, i, e, n;
            if (this.playing = !0,
            this.complete = !1,
            this.stopped = !1,
            this._count = 0,
            this.pending = this._delay > 0,
            this._reverse && !this.pending ? this.time = this.duration : this.time = 0,
            this._from) {
                for (t in this._properties)
                    this._properties.hasOwnProperty(t) && (this._sv[t] = this._properties[t],
                    this._ev[t] = this.target[t]);
                this._slerp && (this._toQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z),
                i = void 0 !== this._properties.x ? this._properties.x : this.target.x,
                e = void 0 !== this._properties.y ? this._properties.y : this.target.y,
                n = void 0 !== this._properties.z ? this._properties.z : this.target.z,
                this._fromQuat.setFromEulerAngles(i, e, n))
            } else {
                for (t in this._properties)
                    this._properties.hasOwnProperty(t) && (this._sv[t] = this.target[t],
                    this._ev[t] = this._properties[t]);
                this._slerp && (this._fromQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z),
                i = void 0 !== this._properties.x ? this._properties.x : this.target.x,
                e = void 0 !== this._properties.y ? this._properties.y : this.target.y,
                n = void 0 !== this._properties.z ? this._properties.z : this.target.z,
                this._toQuat.setFromEulerAngles(i, e, n))
            }
            return this._currentDelay = this._delay,
            this.manager.add(this),
            this
        },
        pause: function() {
            this.playing = !1
        },
        resume: function() {
            this.playing = !0
        },
        stop: function() {
            this.playing = !1,
            this.stopped = !0
        },
        delay: function(t) {
            return this._delay = t,
            this.pending = !0,
            this
        },
        repeat: function(t, i) {
            return this._count = 0,
            this._numRepeats = t,
            this._repeatDelay = i || 0,
            this
        },
        loop: function(t) {
            return t ? (this._count = 0,
            this._numRepeats = 1 / 0) : this._numRepeats = 0,
            this
        },
        yoyo: function(t) {
            return this._yoyo = t,
            this
        },
        reverse: function() {
            return this._reverse = !this._reverse,
            this
        },
        chain: function() {
            for (var t = arguments.length; t--; )
                t > 0 ? arguments[t - 1]._chained = arguments[t] : this._chained = arguments[t];
            return this
        },
        update: function(t) {
            if (this.stopped)
                return !1;
            if (!this.playing)
                return !0;
            if (!this._reverse || this.pending ? this.time += t * this.timeScale : this.time -= t * this.timeScale,
            this.pending) {
                if (!(this.time > this._currentDelay))
                    return !0;
                this._reverse ? this.time = this.duration - (this.time - this._currentDelay) : this.time = this.time - this._currentDelay,
                this.pending = !1
            }
            var i = 0;
            (!this._reverse && this.time > this.duration || this._reverse && this.time < 0) && (this._count++,
            this.complete = !0,
            this.playing = !1,
            this._reverse ? (i = this.duration - this.time,
            this.time = 0) : (i = this.time - this.duration,
            this.time = this.duration));
            var e, n, s = this.time / this.duration, r = this.easing(s);
            for (var h in this._properties)
                this._properties.hasOwnProperty(h) && (e = this._sv[h],
                n = this._ev[h],
                this.target[h] = e + (n - e) * r);
            if (this._slerp && this._quat.slerp(this._fromQuat, this._toQuat, r),
            this.entity && (this.entity._dirtifyLocal(),
            this.element && this.entity.element && (this.entity.element[this.element] = this.target),
            this._slerp && this.entity.setLocalRotation(this._quat)),
            this.fire("update", t),
            this.complete) {
                var a = this._repeat(i);
                return a ? this.fire("loop") : (this.fire("complete", i),
                this.entity && this.entity.off("destroy", this.stop, this),
                this._chained && this._chained.start()),
                a
            }
            return !0
        },
        _repeat: function(t) {
            if (this._count < this._numRepeats) {
                if (this._reverse ? this.time = this.duration - t : this.time = t,
                this.complete = !1,
                this.playing = !0,
                this._currentDelay = this._repeatDelay,
                this.pending = !0,
                this._yoyo) {
                    for (var i in this._properties) {
                        var e = this._sv[i];
                        this._sv[i] = this._ev[i],
                        this._ev[i] = e
                    }
                    this._slerp && (this._quat.copy(this._fromQuat),
                    this._fromQuat.copy(this._toQuat),
                    this._toQuat.copy(this._quat))
                }
                return !0
            }
            return !1
        }
    };
    var n = function(t) {
        return 1 - s(1 - t)
    }
      , s = function(t) {
        return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
    };
    return {
        TweenManager: t,
        Tween: i,
        Linear: function(t) {
            return t
        },
        QuadraticIn: function(t) {
            return t * t
        },
        QuadraticOut: function(t) {
            return t * (2 - t)
        },
        QuadraticInOut: function(t) {
            return (t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
        },
        CubicIn: function(t) {
            return t * t * t
        },
        CubicOut: function(t) {
            return --t * t * t + 1
        },
        CubicInOut: function(t) {
            return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
        },
        QuarticIn: function(t) {
            return t * t * t * t
        },
        QuarticOut: function(t) {
            return 1 - --t * t * t * t
        },
        QuarticInOut: function(t) {
            return (t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
        },
        QuinticIn: function(t) {
            return t * t * t * t * t
        },
        QuinticOut: function(t) {
            return --t * t * t * t * t + 1
        },
        QuinticInOut: function(t) {
            return (t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
        },
        SineIn: function(t) {
            return 0 === t ? 0 : 1 === t ? 1 : 1 - Math.cos(t * Math.PI / 2)
        },
        SineOut: function(t) {
            return 0 === t ? 0 : 1 === t ? 1 : Math.sin(t * Math.PI / 2)
        },
        SineInOut: function(t) {
            return 0 === t ? 0 : 1 === t ? 1 : .5 * (1 - Math.cos(Math.PI * t))
        },
        ExponentialIn: function(t) {
            return 0 === t ? 0 : Math.pow(1024, t - 1)
        },
        ExponentialOut: function(t) {
            return 1 === t ? 1 : 1 - Math.pow(2, -10 * t)
        },
        ExponentialInOut: function(t) {
            return 0 === t ? 0 : 1 === t ? 1 : (t *= 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
        },
        CircularIn: function(t) {
            return 1 - Math.sqrt(1 - t * t)
        },
        CircularOut: function(t) {
            return Math.sqrt(1 - --t * t)
        },
        CircularInOut: function(t) {
            return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
        },
        BackIn: function(t) {
            return t * t * (2.70158 * t - 1.70158)
        },
        BackOut: function(t) {
            return --t * t * (2.70158 * t + 1.70158) + 1
        },
        BackInOut: function(t) {
            var i = 2.5949095;
            return (t *= 2) < 1 ? t * t * ((i + 1) * t - i) * .5 : .5 * ((t -= 2) * t * ((i + 1) * t + i) + 2)
        },
        BounceIn: n,
        BounceOut: s,
        BounceInOut: function(t) {
            return t < .5 ? .5 * n(2 * t) : .5 * s(2 * t - 1) + .5
        },
        ElasticIn: function(t) {
            var i, e = .1;
            return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1,
            i = .1) : i = .4 * Math.asin(1 / e) / (2 * Math.PI),
            -e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / .4))
        },
        ElasticOut: function(t) {
            var i, e = .1;
            return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1,
            i = .1) : i = .4 * Math.asin(1 / e) / (2 * Math.PI),
            e * Math.pow(2, -10 * t) * Math.sin((t - i) * (2 * Math.PI) / .4) + 1)
        },
        ElasticInOut: function(t) {
            var i, e = .1;
            return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1,
            i = .1) : i = .4 * Math.asin(1 / e) / (2 * Math.PI),
            (t *= 2) < 1 ? e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / .4) * -.5 : e * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / .4) * .5 + 1)
        }
    }
}()),
function() {
    pc.Application.prototype.addTweenManager = function() {
        this._tweenManager = new pc.TweenManager(this),
        this.on("update", function(t) {
            this._tweenManager.update(t)
        })
    }
    ,
    pc.Application.prototype.tween = function(t) {
        return new pc.Tween(t,this._tweenManager)
    }
    ,
    pc.Entity.prototype.tween = function(t, i) {
        var e = this._app.tween(t);
        return e.entity = this,
        this.once("destroy", e.stop, e),
        i && i.element && (e.element = i.element),
        e
    }
    ;
    var t = pc.Application.getApplication();
    t && t.addTweenManager()
}();
var Utils = {
    prefix: "venge",
    zeroVector: new pc.Vec3(0,0,0),
    heightVector: new pc.Vec3(0,-5,0),
    nullVector: new pc.Vec3(0,-100,0),
    whiteColor: new pc.Color(1,1,1),
    parseFloat: function(e) {
        return 5 * parseFloat(parseFloat(e).toFixed(1))
    },
    hex2RGB: function(e) {
        var t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
        return t ? {
            r: parseInt(t[1], 16) / 255,
            g: parseInt(t[2], 16) / 255,
            b: parseInt(t[3], 16) / 255
        } : null
    },
    encodeFloat: function(e) {
        return 5 * parseFloat(parseFloat(e).toFixed(1))
    },
    decodeFloat: function(e) {
        return e / 5
    },
    lookAt: function(e, t, r, o) {
        return Math.atan2(r - e, o - t)
    },
    distance: function(e, t, r, o) {
        return Math.sqrt(Math.pow(e - r, 2) + Math.pow(t - o, 2))
    },
    toDeg: function(e) {
        return e * (180 / Math.PI)
    },
    toRad: function(e) {
        return e * (Math.PI / 180)
    },
    lerp: function(e, t, r) {
        var o = (1 - r) * e + r * t;
        return isNaN(o) ? 0 : Math.abs(o - e) > 50 ? t : o
    },
    rotate: function(e, t, r) {
        return e + this.shortAngleDist(e, t) * r
    },
    shortcutName: function(e) {
        return e ? e.replace("-Grenade", "") : ""
    },
    clearName: function(e) {
        return e ? e.replace("_", ".").replace("Ammo-", "") : ""
    },
    clearId: function(e) {
        return e ? e.replace("Ammo-", "") : ""
    },
    shortAngleDist: function(e, t) {
        var r = 2 * Math.PI
          , o = (t - e) % r;
        return 2 * o % r - o
    },
    float: function(e) {
        return isNaN(e) ? 0 : e.toFixed(3)
    },
    pad: function(e, t) {
        return ("000" + e).slice(-3)
    },
    mmssmm: function(e) {
        var t = e
          , r = Math.floor(1e3 * t % 1e3)
          , o = Math.floor(t % 60)
          , n = Math.floor(1e3 * t / 6e4 % 60)
          , a = "MM:SS:XX";
        return o < 10 && (o = "0" + o),
        n < 10 && (n = "0" + n),
        r < 100 && (r = "0" + r),
        a = (a = (a = a.replace(/MM/, n)).replace(/SS/, o)).replace(/XX/, r.toString().slice(0, 2))
    },
    mmss: function(e) {
        var t = e
          , r = Math.floor(1e3 * t % 1e3)
          , o = Math.floor(t % 60)
          , n = Math.floor(1e3 * t / 6e4 % 60)
          , a = "MM:SS";
        return o < 10 && (o = "0" + o),
        n < 10 && (n = "0" + n),
        r < 100 && (r = "0" + r),
        a = (a = a.replace(/MM/, n)).replace(/SS/, o),
        e >= 0 ? a : "00:00"
    },
    isLocalStorageSupported: function() {
        var e = !1;
        try {
            window.localStorage,
            e = !0
        } catch (t) {
            e = !1
        }
        return e
    },
    setItem: function(e, t) {
        this.isLocalStorageSupported() ? window.localStorage.setItem(e, t) : this.createCookie(e, t)
    },
    getItem: function(e) {
        return this.isLocalStorageSupported() ? window.localStorage.getItem(e) : this.readCookie(e)
    },
    createCookie: function(e, t, r) {
        if (r) {
            var o = new Date;
            o.setTime(o.getTime() + 24 * r * 60 * 60 * 1e3);
            var n = "; expires=" + o.toGMTString()
        } else
            n = "";
        document.cookie = e + "=" + t + n + "; path=/"
    },
    readCookie: function(e) {
        for (var t = e + "=", r = document.cookie.split(";"), o = 0; o < r.length; o++) {
            for (var n = r[o]; " " == n.charAt(0); )
                n = n.substring(1, n.length);
            if (0 == n.indexOf(t))
                return n.substring(t.length, n.length)
        }
        return null
    },
    shuffle: function(e) {
        var t, r, o;
        for (o = e.length - 1; o > 0; o--)
            t = Math.floor(Math.random() * (o + 1)),
            r = e[o],
            e[o] = e[t],
            e[t] = r;
        return e
    },
    isMobile: function() {
        return !(!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && !pc.isMobile)
    },
    isIOS: function() {
        return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform)
    },
    number: function(e, t) {
        return e ? parseInt(e) : t
    },
    getURLParams: function(e, t) {
        t || (t = location.href),
        e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var r = new RegExp("[\\?&]" + e + "=([^&#]*)").exec(t);
        return null == r ? null : r[1]
    },
    closestPointLine: function(e, t, r) {
        var o = r.x - t.x
          , n = r.y - t.y
          , a = o * o + n * n
          , i = (e.x - t.x) * o + (e.y - t.y) * n
          , E = Math.min(1, Math.max(0, i / a));
        return i = (r.x - t.x) * (e.y - t.y) - (r.y - t.y) * (e.x - t.x),
        {
            point: {
                x: t.x + o * E,
                y: t.y + n * E
            },
            left: i < 1,
            dot: i,
            t: E
        }
    },
    copyToClipboard: function(e) {
        if (window.clipboardData && window.clipboardData.setData)
            return clipboardData.setData("Text", e);
        if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var t = document.createElement("textarea");
            t.textContent = e,
            t.style.position = "fixed",
            document.body.appendChild(t),
            t.select();
            try {
                return document.execCommand("copy")
            } catch (e) {
                return console.warn("Copy to clipboard failed.", e),
                !1
            } finally {
                document.body.removeChild(t)
            }
        }
    }
}
  , setMat4Forward = function() {
    var e, t, r;
    return e = new pc.Vec3,
    t = new pc.Vec3,
    r = new pc.Vec3,
    function(o, n, a) {
        r.copy(n).scale(-1),
        t.copy(a).normalize(),
        e.cross(t, r).normalize(),
        t.cross(r, e);
        var i = o.data;
        return i[0] = e.x,
        i[1] = e.y,
        i[2] = e.z,
        i[3] = 0,
        i[4] = t.x,
        i[5] = t.y,
        i[6] = t.z,
        i[7] = 0,
        i[8] = r.x,
        i[9] = r.y,
        i[10] = r.z,
        i[11] = 0,
        i[15] = 1,
        o
    }
}();
pc.setFromNormal = function(e) {
    var t = new pc.Mat4
      , r = new pc.Quat;
    return setMat4Forward(t, e, pc.Vec3.UP),
    r.setFromMat4(t),
    r.getEulerAngles()
}
;
var keyboardMap = ["", "", "", "CANCEL", "", "", "HELP", "", "BACK_SPACE", "TAB", "", "", "CLEAR", "ENTER", "ENTER_SPECIAL", "", "SHIFT", "CONTROL", "ALT", "PAUSE", "CAPS_LOCK", "KANA", "EISU", "JUNJA", "FINAL", "HANJA", "", "ESCAPE", "CONVERT", "NONCONVERT", "ACCEPT", "MODECHANGE", "SPACE", "PAGE_UP", "PAGE_DOWN", "END", "HOME", "LEFT", "UP", "RIGHT", "DOWN", "SELECT", "PRINT", "EXECUTE", "PRINTSCREEN", "INSERT", "DELETE", "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "COLON", "SEMICOLON", "LESS_THAN", "EQUALS", "GREATER_THAN", "QUESTION_MARK", "AT", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "OS_KEY", "", "CONTEXT_MENU", "", "SLEEP", "NUMPAD0", "NUMPAD1", "NUMPAD2", "NUMPAD3", "NUMPAD4", "NUMPAD5", "NUMPAD6", "NUMPAD7", "NUMPAD8", "NUMPAD9", "MULTIPLY", "ADD", "SEPARATOR", "SUBTRACT", "DECIMAL", "DIVIDE", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "", "", "", "", "", "", "", "", "NUM_LOCK", "SCROLL_LOCK", "WIN_OEM_FJ_JISHO", "WIN_OEM_FJ_MASSHOU", "WIN_OEM_FJ_TOUROKU", "WIN_OEM_FJ_LOYA", "WIN_OEM_FJ_ROYA", "", "", "", "", "", "", "", "", "", "CIRCUMFLEX", "EXCLAMATION", "DOUBLE_QUOTE", "HASH", "DOLLAR", "PERCENT", "AMPERSAND", "UNDERSCORE", "OPEN_PAREN", "CLOSE_PAREN", "ASTERISK", "PLUS", "PIPE", "HYPHEN_MINUS", "OPEN_CURLY_BRACKET", "CLOSE_CURLY_BRACKET", "TILDE", "", "", "", "", "VOLUME_MUTE", "VOLUME_DOWN", "VOLUME_UP", "", "", "SEMICOLON", "EQUALS", "COMMA", "MINUS", "PERIOD", "SLASH", "BACK_QUOTE", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "OPEN_BRACKET", "BACK_SLASH", "CLOSE_BRACKET", "QUOTE", "", "META", "ALTGR", "", "WIN_ICO_HELP", "WIN_ICO_00", "", "WIN_ICO_CLEAR", "", "", "WIN_OEM_RESET", "WIN_OEM_JUMP", "WIN_OEM_PA1", "WIN_OEM_PA2", "WIN_OEM_PA3", "WIN_OEM_WSCTRL", "WIN_OEM_CUSEL", "WIN_OEM_ATTN", "WIN_OEM_FINISH", "WIN_OEM_COPY", "WIN_OEM_AUTO", "WIN_OEM_ENLW", "WIN_OEM_BACKTAB", "ATTN", "CRSEL", "EXSEL", "EREOF", "PLAY", "ZOOM", "", "PA1", "WIN_OEM_CLEAR", ""];
var Movement = pc.createScript("movement");
Movement.attributes.add("defaultSpeed", {
    type: "number"
}),
Movement.attributes.add("defaultSensitivity", {
    type: "number"
}),
Movement.attributes.add("focusSensitivity", {
    type: "number"
}),
Movement.attributes.add("defaultLookSense", {
    type: "number"
}),
Movement.attributes.add("focusLookSense", {
    type: "number"
}),
Movement.attributes.add("focusSpeedFactor", {
    type: "number"
}),
Movement.attributes.add("strafingSpeed", {
    type: "number"
}),
Movement.attributes.add("nearGround", {
    type: "number",
    default: 4
}),
Movement.attributes.add("collisionHeight", {
    type: "number"
}),
Movement.attributes.add("airHeight", {
    type: "number"
}),
Movement.attributes.add("groundFriction", {
    type: "number",
    default: .8
}),
Movement.attributes.add("slideHopFriction", {
    type: "number",
    default: .2
}),
Movement.attributes.add("jumpDuration", {
    type: "number"
}),
Movement.attributes.add("jumpForce", {
    type: "number"
}),
Movement.attributes.add("jumpHeightSpeed", {
    type: "number"
}),
Movement.attributes.add("jumpLandTime", {
    type: "number",
    default: .25
}),
Movement.attributes.add("bounceJumpDuration", {
    type: "number"
}),
Movement.attributes.add("bounceJumpForce", {
    type: "number"
}),
Movement.attributes.add("gravity", {
    type: "number"
}),
Movement.attributes.add("gravitySpeed", {
    type: "number",
    default: .05
}),
Movement.attributes.add("gravityStep", {
    type: "number"
}),
Movement.attributes.add("suicideHeight", {
    type: "number",
    default: -2
}),
Movement.attributes.add("defaultFov", {
    type: "number"
}),
Movement.attributes.add("defaultNonFov", {
    type: "number",
    default: 60
}),
Movement.attributes.add("airDamping", {
    type: "number"
}),
Movement.attributes.add("groundDamping", {
    type: "number"
}),
Movement.attributes.add("stopDamping", {
    type: "number"
}),
Movement.attributes.add("stoppingSpeed", {
    type: "number",
    default: .25
}),
Movement.attributes.add("movementAnimationSpeed", {
    type: "number"
}),
Movement.attributes.add("movementAnimationFactor", {
    type: "number"
}),
Movement.attributes.add("movementAngleFactor", {
    type: "number"
}),
Movement.attributes.add("movementSwingSpeed", {
    type: "number"
}),
Movement.attributes.add("movementSwingFactor", {
    type: "number"
}),
Movement.attributes.add("footSpeed", {
    type: "number",
    default: 500
}),
Movement.attributes.add("weaponPositionEntity", {
    type: "entity"
}),
Movement.attributes.add("focusPositionEntity", {
    type: "entity"
}),
Movement.attributes.add("cameraEntity", {
    type: "entity"
}),
Movement.attributes.add("cameraNonFOVEntity", {
    type: "entity"
}),
Movement.attributes.add("lookEntity", {
    type: "entity"
}),
Movement.attributes.add("autoLockEntity", {
    type: "entity"
}),
Movement.attributes.add("angleEntity", {
    type: "entity"
}),
Movement.attributes.add("armEntity", {
    type: "entity"
}),
Movement.attributes.add("armRightEntity", {
    type: "entity"
}),
Movement.attributes.add("shoulderEntity", {
    type: "entity"
}),
Movement.attributes.add("headEntity", {
    type: "entity"
}),
Movement.attributes.add("handEntity", {
    type: "entity"
}),
Movement.attributes.add("senseHolder", {
    type: "entity"
}),
Movement.attributes.add("movementHolder", {
    type: "entity"
}),
Movement.attributes.add("takePoint", {
    type: "entity"
}),
Movement.attributes.add("weaponCenter", {
    type: "entity"
}),
Movement.attributes.add("weaponFront", {
    type: "entity"
}),
Movement.attributes.add("meleeCenter", {
    type: "entity"
}),
Movement.attributes.add("meleePoint", {
    type: "entity"
}),
Movement.attributes.add("shurikenPoint1", {
    type: "entity"
}),
Movement.attributes.add("shurikenPoint2", {
    type: "entity"
}),
Movement.attributes.add("shurikenPoint3", {
    type: "entity"
}),
Movement.attributes.add("axeEntity", {
    type: "entity"
}),
Movement.attributes.add("throwPoint", {
    type: "entity"
}),
Movement.attributes.add("interfaceEntity", {
    type: "entity"
}),
Movement.prototype.initialize = function() {
    this.locked = !1,
    this.mouseLocked = !1,
    this.isMouseLocked = !1,
    this.lastDelta = 0,
    pc.dt = 1 / 60,
    this.heightVector = new pc.Vec3(0,-1e3,0),
    this.isZoomEffectEnabled = !1,
    this.currentFriction = .2,
    this.previousVelocity = !1,
    this.collision = {
        start: {
            name: ""
        },
        end: {
            name: ""
        }
    },
    this.spreadCount = 0,
    this.spreadNumber = 0,
    this.force = new pc.Vec3(0,0,0),
    this.currentForce = new pc.Vec3(0,0,0),
    this.lastVelocity = new pc.Vec3(0,0,0),
    this.dynamicGravity = 0,
    this.footCount = 0,
    this.footForce = 0,
    this.groundMaterial = "Gravel",
    this.lastFootDate = this.now(),
    this.nearestPlayerPosition = new pc.Vec3(0,0,0),
    this.lastAutoLockTime = 0,
    this.timerBag = [],
    this.timerTween = [],
    this.lastThrowDate = this.now() - 5e3,
    this.lastDashDate = this.now() - 5e3,
    this.animation = {
        jumpAngle: 0,
        landAngle: 0,
        jumpHeight: 0,
        bounceX: 0,
        bounceZ: 0,
        shootSwing: 0,
        bounceAngle: 0,
        activeBounce: 0,
        horizantalSpread: 0,
        movementFactor: 1,
        weaponAngleX: 0,
        weaponAngleY: 0,
        weaponAngleZ: 0,
        movementAngleX: 0,
        movementAngleY: 0,
        movementAngleZ: 0,
        movementPositionZ: 0,
        takeX: 0,
        takeY: 0,
        takeZ: 0,
        fov: 0,
        cameraBounce: 0,
        cameraImpact: 0,
        cameraShootBounce: 0
    },
    this.timer = {
        inspect0: !1,
        inspect1: !1,
        inspect2: !1
    },
    this.tween = {
        inspect0: !1,
        inspect1: !1,
        inspect2: !1
    },
    this.lastHeight = 0,
    this.currentHeight = 0,
    this.defaultHeight = this.entity.collision.height / 2,
    this.lastImpactTime = this.now(),
    this.airTime = this.now(),
    this.leftAirTime = this.now(),
    this.focusStartTime = this.now(),
    this.lastScanUpdate = Date.now(),
    this.jumpingTime = 0,
    this.bounceJumpTime = 0,
    this.randomDirection = 1,
    this.currentFov = 60,
    this.currentNonFov = 60,
    this.currentSpeed = 0,
    this.movementSpeed = 0,
    this.deltaHeight = 0,
    this.leftMouse = !1,
    this.isShootingLocked = !1,
    this.isFireStopped = !1,
    this.directionSenseX = 0,
    this.directionSenseZ = 0,
    this.isForward = !1,
    this.isBackward = !1,
    this.isLeft = !1,
    this.isRight = !1,
    this.isMobileForward = !1,
    this.isMobileBackward = !1,
    this.isMobileLeft = !1,
    this.isMobileRight = !1,
    this.mobileShootTimer = !1,
    this.timestamp = 0,
    this.isLanded = !1,
    this.isCollided = !1,
    this.isJumping = !0,
    this.isShooting = 0,
    this.isReloading = 0,
    this.isHitting = 0,
    this.isThrowing = !1,
    this.isMobile = !1,
    this.reloadingTime = 1.5,
    this.hittingTime = .7,
    this.inspectAfterReload = !1,
    this.isFocusing = !1,
    this.raycastShootFrom = !1,
    this.raycastTo = !1,
    this.forwardCount = 0,
    this.leftCount = 0,
    this.lookX = 0,
    this.lookY = 0,
    this.currentLook = 0,
    this.currentWeapon = this.entity.script.weaponManager.currentWeapon,
    this.senseX = 0,
    this.senseY = 0,
    Utils.isMobile() ? (this.isMouseLocked = !0,
    this.app.on("Touch:Direction", this.onTouchMove, this),
    this.app.on("Touch:Joystick", this.onJoystick, this),
    this.app.on("Touch:Shoot", this.onTouchShoot, this),
    this.app.on("Touch:Jump", this.onTouchJump, this),
    this.app.on("Touch:Throw", this.onTouchThrow, this),
    this.app.on("Touch:AutoLock", this.setAutoLock, this),
    this.app.on("Touch:Melee", this.onTouchMelee, this),
    this.isMobile = !0) : (this.app.mouse.on("mousedown", this.onMouseDown, this),
    window.addEventListener("mousemove", this.onMouseMove.bind(this)),
    this.app.mouse.on("mouseup", this.onMouseUp, this)),
    this.app.on("Player:Respawn", this.onRespawn, this),
    this.app.on("Player:Lock", this.onLockChange, this),
    this.app.on("Player:Inspect", this.inspect, this),
    this.app.on("Player:Frag", this.onFrag, this),
    this.app.on("Game:Settings", this.onSettingsChange, this),
    this.app.on("Map:Loaded", this.onMapLoaded, this),
    this.entity.collision.on("collisionstart", this.onCollisionStart, this),
    this.entity.collision.on("collisionend", this.onCollisionEnd, this),
    document.addEventListener("pointerlockchange", this.setMouseState.bind(this)),
    document.addEventListener("blur", function() {
        pc.app.fire("Overlay:Reminder", "Press [L] to lock mouse!")
    }),
    document.addEventListener("focus", function() {
        pc.isPauseActive = !1
    }),
    this.interface = this.interfaceEntity.script.overlay,
    this.interface.movement = this,
    this.player = this.entity.script.player,
    this.weaponManager = this.entity.script.weaponManager,
    pc.controls = this,
    this.mouseFrame = 0,
    this.setRandomPosition(),
    this.onSettingsChange()
}
,
Movement.prototype.onFrag = function() {
    this.animation.fov = -5
}
,
Movement.prototype.onSettingsChange = function() {
    pc.settings || (pc.settings = {}),
    pc.settings.sensivity || (pc.settings.sensivity = 1),
    pc.settings.adsSensivity || (pc.settings.adsSensivity = 1),
    this.mouseInvertAxis = 1,
    !0 === pc.settings.invertAxis && (this.mouseInvertAxis = -1),
    pc.settings.fov > 0 && (this.defaultFov = pc.settings.fov),
    pc.settings.hideArms ? this.app.scene.layers.getLayerByName("NonFOV").enabled = !1 : this.app.scene.layers.getLayerByName("NonFOV").enabled = !0
}
,
Movement.prototype.onRespawn = function() {
    this.entity.rigidbody.linearVelocity.x = 0,
    this.entity.rigidbody.linearVelocity.y = 0,
    this.entity.rigidbody.linearVelocity.z = 0,
    this.setAmmoFull()
}
,
Movement.prototype.onMapLoaded = function() {
    this.entity.collision.enabled = !0,
    this.entity.rigidbody.enabled = !0,
    setTimeout(function() {
        pc.app.fire("Player:Show", !0),
        pc.app.fire("Player:Ready", !0)
    }, 1e3)
}
,
Movement.prototype.setRandomPosition = function() {
    var t = 2 * Math.random()
      , e = 2 * Math.random()
      , i = 2 * Math.random();
    this.entity.rigidbody.teleport(t, e, i)
}
,
Movement.prototype.onLockChange = function(t) {
    t ? this.enableMovement() : this.disableMovement()
}
,
Movement.prototype.setCurrentWeapon = function() {
    this.currentWeapon = this.entity.script.weaponManager.currentWeapon,
    this.currentWeapon.player = this.entity,
    this.takeout(),
    this.interface.capacityEntity.element.text = this.currentWeapon.capacity + ""
}
,
Movement.prototype.onCollisionStart = function(t) {
    return !this.player.isDeath && (!pc.isFinished && (t.other && ("Bounce" == t.other.name && this.bounceJump(this.airTime, t.other),
    "Water" == t.other.name && this.app.fire("Network:Drown", !0),
    "Kill" == t.other.name && this.app.fire("Player:Respawn", !0)),
    this.now() - this.leftAirTime > 1e3 && (this.airTime = this.now()),
    this.isDashing && this.dashTrigger(t),
    this.collision.start = t.other,
    void (t.contacts[0].normal.y > .85 && (this.isCollided = !0,
    this.land()))))
}
,
Movement.prototype.onCollisionEnd = function(t) {
    this.collision.end = t,
    this.isCollided = !1
}
,
Movement.prototype.setMouseState = function() {
    this.isMouseLocked = pc.Mouse.isPointerLocked(),
    this.isMouseLocked ? this.app.fire("Overlay:Pause", !1) : this.app.fire("Overlay:Pause", !0)
}
,
Movement.prototype.onMouseDown = function(t) {
    return !this.player.isDeath && (!pc.isFinished && (!pc.isDisplayingAds && (!this.locked && (!pc.isPauseActive && (this.app.mouse.enablePointerLock(),
    2 === t.button && (this.isFocusing = !0,
    this.focusStartTime = this.now(),
    this.cancelInspect(!0),
    this.app.fire("Overlay:SetAmmo", !0)),
    void (0 === t.button && (this.leftMouse = !0)))))))
}
,
Movement.prototype.onMouseMove = function(t) {
    return !this.player.isDeath && (!this.mouseLocked && (this.isMouseLocked && (this.isFocusing ? (this.lookX -= t.movementX * this.focusSensitivity * pc.settings.adsSensivity * this.mouseInvertAxis * this.animation.movementFactor,
    this.lookY -= t.movementY * this.focusSensitivity * pc.settings.adsSensivity * this.mouseInvertAxis * this.animation.movementFactor) : (this.lookX -= t.movementX * this.defaultSensitivity * pc.settings.sensivity * this.mouseInvertAxis * this.animation.movementFactor,
    this.lookY -= t.movementY * this.defaultSensitivity * pc.settings.sensivity * this.mouseInvertAxis * this.animation.movementFactor),
    this.isFocusing ? (this.senseX -= t.movementX * this.focusLookSense * this.mouseInvertAxis,
    this.senseY -= t.movementY * this.focusLookSense * this.mouseInvertAxis) : (this.senseX -= t.movementX * this.defaultLookSense * this.mouseInvertAxis,
    this.senseY -= t.movementY * this.defaultLookSense * this.mouseInvertAxis)),
    void (this.lookX = this.lookX % 360)))
}
,
Movement.prototype.onTouchMove = function(t, e) {
    if (this.player.isDeath)
        return !1;
    this.isFocusing ? (this.lookX -= t * this.focusSensitivity * pc.settings.sensivity * this.mouseInvertAxis,
    this.lookY -= e * this.focusSensitivity * pc.settings.sensivity * this.mouseInvertAxis) : (this.lookX -= t * this.defaultSensitivity * pc.settings.sensivity * this.mouseInvertAxis,
    this.lookY -= e * this.defaultSensitivity * pc.settings.sensivity * this.mouseInvertAxis),
    this.isFocusing ? (this.senseX -= t * this.focusLookSense * this.mouseInvertAxis,
    this.senseY -= e * this.focusLookSense * this.mouseInvertAxis) : (this.senseX -= t * this.defaultLookSense * this.mouseInvertAxis,
    this.senseY -= e * this.defaultLookSense * this.mouseInvertAxis),
    this.scanShootables(),
    this.lookX = this.lookX % 360
}
,
Movement.prototype.onTouchShoot = function(t) {
    return !this.player.isDeath && (!pc.isFinished && (!this.locked && (!pc.isPauseActive && (!!this.isMobile && (this.leftMouse = "true" == t,
    void this.scanShootables())))))
}
,
Movement.prototype.onTouchJump = function() {
    this.jump()
}
,
Movement.prototype.onTouchThrow = function() {
    this.throw()
}
,
Movement.prototype.onTouchMelee = function() {
    this.meleeSkill()
}
,
Movement.prototype.onJoystick = function(t) {
    this.isMobileForward = !1,
    this.isMobileBackward = !1,
    this.isMobileLeft = !1,
    this.isMobileRight = !1,
    "UP" == t ? this.isMobileForward = !0 : "LEFT-UP" == t ? (this.isMobileForward = !0,
    this.isMobileLeft = !0) : "RIGHT-UP" == t ? (this.isMobileForward = !0,
    this.isMobileRight = !0) : "DOWN" == t ? this.isMobileBackward = !0 : "LEFT-DOWN" == t ? (this.isMobileBackward = !0,
    this.isMobileLeft = !0) : "RIGHT-DOWN" == t ? (this.isMobileBackward = !0,
    this.isMobileRight = !0) : "RIGHT" == t ? this.isMobileRight = !0 : "LEFT" == t && (this.isMobileLeft = !0),
    this.scanShootables()
}
,
Movement.prototype.onMouseUp = function(t) {
    return !this.player.isDeath && (!pc.isFinished && (2 === t.button && (this.isFocusing = !1),
    void (0 === t.button && (this.leftMouse = !1))))
}
,
Movement.prototype.setCameraAngle = function(t) {
    this.lookY = Math.max(-90, this.lookY),
    this.lookY = Math.min(90, this.lookY),
    this.lookEntity.setLocalEulerAngles(this.lookY + this.animation.cameraBounce + this.animation.cameraImpact, this.lookX + this.animation.cameraImpact, 0),
    this.isLanded ? this.currentLook = this.lookX + this.animation.cameraImpact : this.currentLook = pc.math.lerpAngle(this.currentLook, this.lookX + this.animation.cameraImpact, .01),
    this.angleEntity.setLocalEulerAngles(0, this.currentLook, 0),
    this.isReloading > this.timestamp && (this.isFocusing = !1)
}
,
Movement.prototype.setHandAngle = function(t) {
    this.senseX = pc.math.lerp(this.senseX, 0, .1),
    this.senseY = pc.math.lerp(this.senseY, 0, .1),
    this.senseHolder.setLocalEulerAngles(.5 * this.senseX + .5 * this.senseY + this.animation.cameraImpact, .5 * this.senseX, 2 * -this.senseY)
}
,
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
    void (this.app.keyboard.wasReleased(pc.KEY_SHIFT) && (this.isFocusing = !1))))))
}
,
Movement.prototype.setMovement = function() {
    if (this.player.isDeath)
        return !1;
    if (pc.isFinished)
        return !1;
    if (this.isDashing)
        return !1;
    var t = this.angleEntity.forward
      , e = this.angleEntity.right
      , i = 1;
    this.isFocusing && (i = this.focusSpeedFactor),
    i *= this.animation.movementFactor,
    this.force.x = 0,
    this.force.z = 0,
    !this.isForward || this.isLeft || this.isRight ? this.isForward && (this.force.x += t.x * this.strafingSpeed * i,
    this.force.z += t.z * this.strafingSpeed * i) : (this.force.x += t.x * this.defaultSpeed * i,
    this.force.z += t.z * this.defaultSpeed * i),
    this.isBackward && (this.force.x -= t.x * this.strafingSpeed * i,
    this.force.z -= t.z * this.strafingSpeed * i),
    this.isLeft && (this.force.x -= e.x * this.strafingSpeed * i,
    this.force.z -= e.z * this.strafingSpeed * i),
    this.isRight && (this.force.x += e.x * this.strafingSpeed * i,
    this.force.z += e.z * this.strafingSpeed * i),
    this.entity.rigidbody.applyForce(this.currentForce)
}
,
Movement.prototype.setMovementAnimation = function(t) {
    if (this.player.isDeath)
        return !1;
    var e = Math.sin(this.forwardCount / this.movementAnimationSpeed) * this.movementAnimationFactor * this.movementSpeed * this.animation.movementFactor
      , i = Math.cos(this.forwardCount / this.movementAnimationSpeed) * this.movementAnimationFactor * this.movementSpeed * this.animation.movementFactor
      , s = Math.cos(this.forwardCount / this.movementSwingSpeed) * Math.sin(this.forwardCount / this.movementSwingSpeed) * this.movementSwingFactor * 2 * this.movementSpeed * this.animation.movementFactor
      , n = Math.cos(this.forwardCount / this.movementSwingSpeed) * this.movementSwingFactor * this.movementSpeed * this.animation.movementFactor;
    !this.isFocusing && this.movementSpeed > .8 ? this.animation.movementPositionZ = pc.math.lerp(this.animation.movementPositionZ, -.04, .08) : this.animation.movementPositionZ = pc.math.lerp(this.animation.movementPositionZ, 0, .1),
    this.isJumping ? (e = 0,
    i = 0,
    s = 0,
    this.animation.jumpHeight = pc.math.lerp(this.animation.jumpHeight, this.deltaHeight, .15)) : this.animation.jumpHeight = pc.math.lerp(this.animation.jumpHeight, 0, .1);
    var o = this.weaponPositionEntity
      , a = 1
      , h = this.defaultFov
      , r = this.defaultNonFov;
    this.isFocusing && this.isReloading < this.timestamp ? (o = this.focusPositionEntity,
    a = .1,
    h = this.currentWeapon.focusFov,
    r = this.currentWeapon.focusFov,
    this.isFocused || (this.directionSenseX = 5),
    this.isFocused || this.currentWeapon.focus(),
    this.isFocused = !0) : this.isFocused = !1,
    this.isShooting > this.timestamp && (a = pc.math.lerp(a, 0, .1));
    var p = this.animation.jumpHeight * this.animation.jumpHeight * .01;
    p = Math.min(p, .08);
    var m = .4;
    "Shotgun" == this.currentWeapon.type && (m = .8);
    var c = this.handEntity.getLocalPosition().lerp(this.handEntity.getLocalPosition(), o.getLocalPosition(), m);
    "Sniper" == this.currentWeapon.type && this.isFocusing && this.now() - this.focusStartTime > 60 ? (this.currentWeapon.modelEntity.enabled = !1,
    this.currentWeapon.armEntity.enabled = !1) : (this.currentWeapon.modelEntity.enabled = !0,
    this.currentWeapon.armEntity.enabled = !0),
    this.handEntity.setLocalPosition(c),
    this.movementHolder.setLocalPosition(.1 * s * a + this.animation.bounceZ + this.animation.movementPositionZ, (e + p) * a + this.animation.landAngle * a, .2 * -s * a),
    this.takePoint.setLocalEulerAngles(this.animation.takeX, this.animation.takeY, this.animation.takeZ);
    var u = this.animation.cameraBounce;
    if (this.isFocusing && (u = 0),
    this.movementHolder.setLocalEulerAngles(u + this.animation.movementAngleX + this.animation.shootSwing + this.directionSenseX + s * this.movementAngleFactor * a + this.animation.jumpAngle * a * this.randomDirection, this.animation.movementAngleY + e + s * this.movementAngleFactor * a, this.animation.movementAngleZ + this.directionSenseZ + this.animation.jumpAngle * a),
    this.headEntity.setLocalEulerAngles(.2 * -this.animation.jumpAngle * a - this.animation.cameraShootBounce, 0, 0),
    this.weaponCenter.setLocalEulerAngles(this.animation.horizantalSpread + this.animation.weaponAngleX, -e * e + .1 * this.senseX + n + 20 * this.animation.bounceX + this.animation.weaponAngleY, this.animation.bounceAngle + this.animation.activeBounce + this.animation.weaponAngleZ + 80 * i * a),
    this.weaponFront.setLocalEulerAngles(0, 0, n + s * s * 2),
    this.isLeft ? (this.forwardCount += 1.25 * t,
    this.movementSpeed = 1) : this.isBackward || this.isRight ? (this.forwardCount -= 1.25 * t,
    this.movementSpeed = 1) : this.isForward ? (this.forwardCount += t,
    this.movementSpeed = 1) : this.currentSpeed > .1 && (this.forwardCount += t,
    this.movementSpeed = pc.math.lerp(this.movementSpeed, 0, .1)),
    this.isShooting < this.timestamp) {
        var l = 1;
        this.isFocusing && (l = .12),
        this.isLeft ? this.directionSenseX = pc.math.lerp(this.directionSenseX, -25 * l, .07) : this.isRight && (this.directionSenseX = pc.math.lerp(this.directionSenseX, 17 * l, .07)),
        this.isBackward && (this.directionSenseZ = pc.math.lerp(this.directionSenseZ, .8, .1))
    }
    if (this.directionSenseX = pc.math.lerp(this.directionSenseX, 0, .1),
    this.directionSenseZ = pc.math.lerp(this.directionSenseZ, 0, .05),
    this.currentSpeed = this.entity.rigidbody.linearVelocity.length(),
    this.currentFov = pc.math.lerp(this.currentFov, h, .4),
    this.currentNonFov = pc.math.lerp(this.currentNonFov, r, .4),
    this.cameraEntity.camera.fov = this.currentFov + this.animation.fov,
    this.cameraNonFOVEntity.camera.fov = this.currentNonFov + this.animation.fov,
    this.isForward || this.isBackward || (this.movementSpeed = pc.math.lerp(this.movementSpeed, 0, .05)),
    this.isLeft || this.isRight || (this.movementSpeed = pc.math.lerp(this.movementSpeed, 0, .01)),
    this.isJumping ? this.lastHeight > this.currentHeight ? this.deltaHeight += t * this.jumpHeightSpeed : this.deltaHeight -= t * this.jumpHeightSpeed : this.deltaHeight = pc.math.lerp(this.deltaHeight, 0, .01),
    this.now() - this.lastFootDate > this.footSpeed && this.currentSpeed > 1 && this.isLanded) {
        var d = this.groundMaterial + "-Run-" + (this.footCount + 1)
          , y = this.currentSpeed;
        this.entity.sound.slots[d].pitch = 1 + .1 * Math.random(),
        this.entity.sound.slots[d].volume = .2 + .2 * Math.random() + .3 * this.footForce,
        this.entity.sound.play(d),
        (this.isLeft || this.isRight || this.isBackward) && (y += 50),
        y += 20 * this.footForce,
        this.lastFootDate = this.now() - y,
        this.footForce = pc.math.lerp(this.footForce, 0, .2),
        this.footCount = Math.floor(5 * Math.random())
    }
    pc.isFinished || this.locked || (pc.settings.hideArms || (this.interface.crosshairEntity.enabled = !this.isFocusing),
    this.interface.focusBulletsEntity.enabled = this.isFocusing),
    "Sniper" == this.currentWeapon.type ? this.now() - this.focusStartTime > 60 && (this.cameraEntity.script.zoom.enabled = this.isFocusing,
    this.currentWeapon.scopeOverlay.enabled = this.isFocusing) : this.isZoomEffectEnabled ? this.cameraEntity.script.zoom.enabled = !0 : this.cameraEntity.script.zoom.enabled = !1
}
,
Movement.prototype.dash = function() {
    if (Date.now() - this.lastDashDate < 1e3 * this.player.dashCooldown)
        return this.entity.sound.play("Error"),
        !1;
    if (!this.isLanded)
        return !1;
    var t = this.angleEntity.forward.scale(160);
    this.isDashing = !0,
    this.showMelee(),
    this.hideWeapons(),
    this.entity.rigidbody.applyImpulse(t),
    this.player.melee(),
    this.app.fire("Effect:Trigger", "Wind"),
    this.app.fire("Overlay:MeleeTimer", 10),
    this.player.fireNetworkEvent("dash"),
    this.entity.sound.play("Buff-Attack-1"),
    this.entity.sound.play("Whoosh-High"),
    this.entity.sound.slots["Whoosh-High"].pitch = 1 + .2 * Math.random(),
    this.app.tween(this.animation).to({
        fov: 10
    }, .2, pc.BackOut).start(),
    this.axeEntity.setLocalEulerAngles(106.08, 39.04, 48.43),
    this.axeEntity.tween(this.axeEntity.getLocalEulerAngles()).rotate({
        x: 48.79,
        y: -44.81,
        z: 34.89
    }, .25, pc.BackOut).delay(.08).start(),
    setTimeout(function(t) {
        t.isDashing = !1,
        t.showWeapons(),
        t.hideMelee()
    }, 200, this),
    this.isHitting = this.timestamp + this.hittingTime,
    this.lastDashDate = Date.now()
}
,
Movement.prototype.melee = function() {
    this.hideWeapons(),
    this.showMelee(),
    this.meleeHit(),
    this.isHitting = this.timestamp + this.hittingTime,
    this.player.fireNetworkEvent("m"),
    this.player.melee()
}
,
Movement.prototype.meleeSkill = function() {
    return !(this.isHitting > this.timestamp) && (this.cancelReload(),
    !this.isThrowing && (this.cancelInspect(!0),
    void ("Lilium" == this.player.characterName ? this.melee() : "Shin" == this.player.characterName && this.dash())))
}
,
Movement.prototype.meleeHit = function() {
    this.axeEntity.setLocalPosition(-1.341, -2.65, -3.462),
    this.axeEntity.tween(this.axeEntity.getLocalPosition()).to({
        y: .67
    }, .2, pc.BackOut).start(),
    this.playEffortSound(),
    Math.random() > .5 ? (this.axeEntity.setLocalEulerAngles(66.97, -17.07, 29.54),
    this.axeEntity.tween(this.axeEntity.getLocalEulerAngles()).rotate({
        x: -20.32,
        y: 40.6,
        z: -108.25
    }, .25, pc.BackOut).delay(.2).start()) : (this.axeEntity.setLocalEulerAngles(-42.45, -13.74, 21.08),
    this.axeEntity.tween(this.axeEntity.getLocalEulerAngles()).rotate({
        x: 37.81,
        y: -38.75,
        z: -130.44
    }, .25, pc.BackOut).delay(.2).start()),
    setTimeout(function(t) {
        t.meleeTrigger(),
        t.entity.sound.play("Throw"),
        t.app.tween(t.animation).to({
            cameraImpact: -3
        }, .1, pc.BackOut).start()
    }, 200, this),
    setTimeout(function(t) {
        t.showWeapons(),
        t.hideMelee()
    }, 500, this)
}
,
Movement.prototype.meleeTrigger = function() {
    this.setShootDirection();
    var t = this.raycastShootFrom
      , e = this.meleePoint.getPosition().clone()
      , i = Math.round(20 * Math.random()) + 80;
    this.app.fire("EffectManager:Hit", "Melee", t, e, this.player.playerId, i)
}
,
Movement.prototype.dashTrigger = function(t) {
    var e = Math.round(20 * Math.random()) + 50
      , i = {
        entity: t.other,
        normal: t.contacts[0].normal,
        point: t.contacts[0].point
    };
    this.app.fire("EffectManager:DealHit", "Dash", i, e, this.player.playerId, !1)
}
,
Movement.prototype.playEffortSound = function() {
    var t = "Throw-" + (Math.floor(1.4 * Math.random()) + 1);
    this.app.fire("Character:Sound", t, .1 * Math.random())
}
,
Movement.prototype.throwGrenade = function() {
    this.app.fire("EffectManager:Throw", "Grenade", this.throwPoint.getPosition().clone(), this.throwPoint.forward, this.player.playerId, this.player.cards.length > 0),
    this.app.fire("Network:Throw", "Grenade", this.throwPoint.getPosition().clone(), this.throwPoint.forward),
    this.entity.sound.play("Throw"),
    this.app.fire("Overlay:SkillTimer", this.player.throwCooldown)
}
,
Movement.prototype._throwShuriken = function() {
    this.setShootDirection(),
    this.entity.sound.play("Whoosh-High"),
    this.entity.sound.slots["Whoosh-High"].pitch = 1 + .2 * Math.random(),
    this.app.fire("EffectManager:Shuriken", this.throwPoint.getPosition(), [this.shurikenPoint1.getPosition(), this.shurikenPoint2.getPosition(), this.shurikenPoint3.getPosition()], this.player.playerId),
    this.app.fire("Network:Throw", "Shuriken", this.throwPoint.getPosition(), [this.shurikenPoint1.getPosition(), this.shurikenPoint2.getPosition(), this.shurikenPoint3.getPosition()])
}
,
Movement.prototype.throwShuriken = function() {
    for (var t = 0; t < 3; t++)
        setTimeout(function(t) {
            t._throwShuriken()
        }, 90 * t, this);
    this.app.fire("Overlay:SkillTimer", this.player.throwCooldown)
}
,
Movement.prototype.throw = function() {
    return this.now() - this.lastThrowDate < 1e3 * this.player.throwCooldown ? (this.entity.sound.play("Error"),
    !1) : !(this.isReloading > this.timestamp) && (!(this.isHitting > this.timestamp) && (this.isFocusing = !1,
    this.player.throw(),
    this.stopFiring(),
    this.isThrowing = !0,
    "Lilium" == this.player.characterName ? this.throwGrenadeAnimation() : "Shin" == this.player.characterName && this.throwShurikenAnimation(),
    void (this.lastThrowDate = this.now())))
}
,
Movement.prototype.throwShurikenAnimation = function() {
    this.shoulderEntity.tween(this.shoulderEntity.getLocalEulerAngles()).rotate({
        x: 42.75,
        y: 30.65,
        z: -57.65
    }, .4, pc.SineOut).start(),
    this.shoulderEntity.reparent(this.handEntity),
    this.app.tween(this.animation).to({
        takeX: -.52,
        takeY: 22.19,
        takeZ: -55.11
    }, .1, pc.BackInOut).start(),
    setTimeout(function(t) {
        t.shoulderEntity.tween(t.shoulderEntity.getLocalEulerAngles()).rotate({
            x: 147.77,
            y: 3.9,
            z: 138.54
        }, .1, pc.Linear).start()
    }, 50, this),
    setTimeout(function(t) {
        t.shoulderEntity.tween(t.shoulderEntity.getLocalEulerAngles()).rotate({
            x: 113.4,
            y: -9.2,
            z: 25.38
        }, .15, pc.QuinticInOut).start(),
        setTimeout(function() {
            t.throwShuriken()
        }, 15)
    }, 150, this),
    setTimeout(function(t) {
        t.shoulderEntity.tween(t.shoulderEntity.getLocalEulerAngles()).rotate({
            x: 64.6,
            y: 4.31,
            z: 1.91
        }, .2, pc.BackOut).start()
    }, 850, this),
    setTimeout(function(t) {
        t.isThrowing = !1,
        t.shoulderEntity.reparent(t.armEntity),
        t.shoulderEntity.tween(t.shoulderEntity.getLocalEulerAngles()).rotate({
            x: 0,
            y: 0,
            z: 0
        }, .2, pc.BackOut).start(),
        t.app.tween(t.animation).to({
            takeX: 0,
            takeY: 0,
            takeZ: 0
        }, .2, pc.BackInOut).start()
    }, 1e3, this)
}
,
Movement.prototype.throwGrenadeAnimation = function() {
    this.shoulderEntity.tween(this.shoulderEntity.getLocalEulerAngles()).rotate({
        x: 42.75,
        y: 30.65,
        z: -57.65
    }, .4, pc.SineOut).start(),
    this.shoulderEntity.reparent(this.handEntity),
    this.app.tween(this.animation).to({
        takeX: -.52,
        takeY: 22.19,
        takeZ: -55.11
    }, .15, pc.BackInOut).start(),
    setTimeout(function(t) {
        t.shoulderEntity.tween(t.shoulderEntity.getLocalEulerAngles()).rotate({
            x: 147.77,
            y: 3.9,
            z: 138.54
        }, .2, pc.Linear).start()
    }, 200, this),
    setTimeout(function(t) {
        t.playEffortSound(),
        t.shoulderEntity.tween(t.shoulderEntity.getLocalEulerAngles()).rotate({
            x: 113.4,
            y: -9.2,
            z: 25.38
        }, .55, pc.QuinticInOut).start(),
        setTimeout(function() {
            t.throwGrenade(),
            t.app.tween(t.animation).to({
                cameraImpact: -3
            }, .1, pc.BackOut).start()
        }, 200)
    }, 400, this),
    setTimeout(function(t) {
        t.shoulderEntity.tween(t.shoulderEntity.getLocalEulerAngles()).rotate({
            x: 64.6,
            y: 4.31,
            z: 1.91
        }, .2, pc.BackOut).start()
    }, 1150, this),
    setTimeout(function(t) {
        t.isThrowing = !1,
        t.shoulderEntity.reparent(t.armEntity),
        t.shoulderEntity.tween(t.shoulderEntity.getLocalEulerAngles()).rotate({
            x: 0,
            y: 0,
            z: 0
        }, .2, pc.BackOut).start(),
        t.app.tween(t.animation).to({
            takeX: 0,
            takeY: 0,
            takeZ: 0
        }, .2, pc.BackInOut).start()
    }, 1300, this)
}
,
Movement.prototype.now = function() {
    return this.app._time
}
,
Movement.prototype.slowMovement = function(t) {
    this.app.tween(this.animation).to({
        movementFactor: .1
    }, t, pc.Linear).start()
}
,
Movement.prototype.fastMovement = function() {
    this.app.tween(this.animation).to({
        movementFactor: 1
    }, .4, pc.Linear).start()
}
,
Movement.prototype.enableMovement = function() {
    this.isForward = !1,
    this.isBackward = !1,
    this.isLeft = !1,
    this.isRight = !1,
    pc.isFinished || (this.interface.crosshairEntity.enabled = !0),
    this.locked = !1
}
,
Movement.prototype.disableMovement = function() {
    this.isForward = !1,
    this.isBackward = !1,
    this.isLeft = !1,
    this.isRight = !1,
    this.currentSpeed = 0,
    this.interface.crosshairEntity.enabled = !1,
    this.isShooting = !1,
    this.isFocusing = !1,
    this.isFocused = !1,
    this.leftMouse = !1,
    this.locked = !0
}
,
Movement.prototype.inspect = function() {
    return !(this.isHitting > this.timestamp) && (this.isReloading > this.timestamp ? (this.inspectAfterReload = !0,
    !1) : (Math.random() > .6 && this.app.fire("Player:Speak", "Attack", 4),
    !(Math.random() > .8) && (this.cancelInspect(),
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
    }, 1200, this),
    this.timer.inspect2 = setTimeout(function(t) {
        t.tween.inspect2 = t.app.tween(t.animation).to({
            movementAngleX: 0,
            movementAngleY: 0,
            movementAngleZ: 0
        }, .5, pc.BackInOut).start()
    }, 2e3, this),
    void (this.inspectAfterReload = !1))))
}
,
Movement.prototype.cancelInspect = function(t) {
    t ? (this.animation.movementAngleX = 0,
    this.animation.movementAngleY = 0,
    this.animation.movementAngleZ = 0,
    this.inspectAfterReload = !1) : setTimeout(function(t) {
        t.animation.movementAngleX = 0,
        t.animation.movementAngleY = 0,
        t.animation.movementAngleZ = 0
    }, 500, this),
    this.tween.inspect0 && this.tween.inspect0.stop(),
    this.tween.inspect1 && this.tween.inspect1.stop(),
    this.tween.inspect2 && this.tween.inspect2.stop(),
    clearTimeout(this.timer.inspect0),
    clearTimeout(this.timer.inspect1),
    clearTimeout(this.timer.inspect2)
}
,
Movement.prototype.setAmmoFull = function() {
    this.currentWeapon.ammo = this.currentWeapon.capacity,
    this.app.fire("Overlay:SetAmmo", !0)
}
,
Movement.prototype.cancelReload = function() {
    if (this.isReloading < this.timestamp)
        return !1;
    for (var t in this.timerBag) {
        var e = this.timerBag[t];
        e && clearTimeout(e)
    }
    for (var i in this.timerTween) {
        var s = this.timerTween[i];
        s && s.stop()
    }
    this.isReloading = 0,
    this.animation.weaponAngleX = 0,
    this.animation.weaponAngleY = 0,
    this.animation.weaponAngleZ = 0,
    this.animation.takeX = 0,
    this.animation.takeY = 0,
    this.animation.takeZ = 0,
    this.currentWeapon.magazineAttach(),
    this.timerBag = [],
    this.timerTween = []
}
,
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
    this.timerBag.push(setTimeout(function(t) {
        t.inspectAfterReload && t.inspect()
    }, 3e3, this)),
    void this.timerBag.push(setTimeout(function(t) {
        t.setAmmoFull()
    }, 2e3, this)))))
}
,
Movement.prototype.takeout = function() {
    this.animation.takeX = -.52,
    this.animation.takeY = 22.19,
    this.animation.takeZ = -55.11,
    this.app.tween(this.animation).to({
        takeX: 0,
        takeY: 0,
        takeZ: 0
    }, .3, pc.BackInOut).start(),
    this.entity.sound.play("Takeout"),
    this.interface.hidePrepare(),
    this.app.fire("Overlay:SetAmmo", !0)
}
,
Movement.prototype.showMelee = function() {
    this.meleeCenter.enabled = !0,
    this.meleeCenter.tween(this.meleeCenter.getLocalPosition()).to({
        y: -.246
    }, .2, pc.BackOut).start()
}
,
Movement.prototype.hideMelee = function() {
    this.meleeCenter.tween(this.meleeCenter.getLocalPosition()).to({
        y: -1.5
    }, .15, pc.BackOut).start(),
    setTimeout(function(t) {
        t.meleeCenter.enabled = !1
    }, 150, this)
}
,
Movement.prototype.hideWeapons = function() {
    this.weaponCenter.tween(this.weaponCenter.getLocalPosition()).to({
        y: -1.5
    }, .15, pc.BackOut).start()
}
,
Movement.prototype.showWeapons = function() {
    this.weaponCenter.tween(this.weaponCenter.getLocalPosition()).to({
        y: -.058
    }, .2, pc.BackOut).start()
}
,
Movement.prototype.impact = function() {
    var t = 3 * Math.random() - 3 * Math.random();
    if (this.app.tween(this.animation).to({
        cameraImpact: -t
    }, .09, pc.BackOut).start(),
    this.now() - this.lastImpactTime < 2e3)
        return !1;
    var e = "Grunt-" + (Math.round(1 * Math.random()) + 1);
    this.app.fire("Character:Sound", e, .1 * Math.random()),
    this.lastImpactTime = this.now()
}
,
Movement.prototype.disableZoom = function() {
    this.isZoomEffectEnabled = !1,
    this.isFocusing = !1,
    this.isFocused = !1,
    "Sniper" == this.currentWeapon.type && (this.cameraEntity.script.zoom.enabled = !1,
    this.currentWeapon.scopeOverlay.enabled = !1)
}
,
Movement.prototype.death = function() {
    this.app.fire("Character:Sound", "Death-1", .1 * Math.random()),
    this.stopFiring(),
    this.isShooting = !1,
    this.leftMouse = !1,
    this.isZoomEffectEnabled = !1,
    this.isFocusing = !1,
    this.isFocused = !1,
    "Sniper" == this.currentWeapon.type && (this.cameraEntity.script.zoom.enabled = !1,
    this.currentWeapon.scopeOverlay.enabled = !1),
    this.interface.crosshairEntity.enabled = !0,
    this.interface.focusBulletsEntity.enabled = !1,
    this.interface.fullDamage(),
    this.movementSpeed = 0,
    this.entity.sound.stop("Footsteps")
}
,
Movement.prototype.jump = function() {
    if (!this.isLanded && !this.isCollided)
        return !1;
    if (this.isDashing)
        return !1;
    if (this.bounceJumpTime > this.timestamp)
        return !1;
    if (this.jumpingTime = this.timestamp + this.jumpDuration,
    this.isJumping = !0,
    this.isLanded = !1,
    this.airTime = this.now(),
    this.randomDirection = Math.random() > .5 ? -1 : 1,
    this.previousVelocity,
    this.now() - this.lastImpactTime > 3e3) {
        var t = "Jump-" + (Math.round(1 * Math.random()) + 1);
        this.app.fire("Character:Sound", t, .1 * Math.random()),
        this.entity.sound.play("Only-Jump"),
        this.entity.sound.slots["Only-Jump"].pitch = .1 * Math.random() + 1.1
    }
    if (this.dynamicGravity = 0,
    this.app.fire("Overlay:Jump", !0),
    this.player.fireNetworkEvent("j"),
    this.isShooting > this.timestamp)
        return !1;
    this.app.tween(this.animation).to({
        jumpAngle: -11
    }, .15, pc.BackOut).start()
}
,
Movement.prototype.bounceJump = function(t, e) {
    if (this.jumpingTime > this.timestamp)
        return !1;
    if (this.locked)
        return !1;
    var i = 1;
    if (e) {
        var s = e.tags.list();
        s.indexOf("Long") > -1 ? i = 1.25 : s.indexOf("Short") > -1 && (i = .7)
    }
    if (this.airTime = this.now(),
    this.bounceJumpTime = this.timestamp - 500,
    this.entity.sound.play("BounceJump"),
    this.entity.sound.play("Only-Jump"),
    this.entity.rigidbody.applyImpulse(0, this.bounceJumpForce * i, 0),
    this.entity.sound.slots["Only-Jump"].pitch = .1 * Math.random() + 1.1,
    this.isJumping = !0,
    this.isLanded = !1,
    this.app.fire("Overlay:Jump", !0),
    this.player.fireNetworkEvent("bj"),
    this.isShooting > this.timestamp)
        return !1;
    this.app.tween(this.animation).to({
        jumpAngle: -18,
        cameraShootBounce: 2,
        fov: 10
    }, .15, pc.BackOut).start()
}
,
Movement.prototype.land = function() {
    var t = Math.min((this.now() - this.airTime) / 1e3, 1);
    if (this.airTime = this.now(),
    this.isLanded = !0,
    this.isJumping = !1,
    this.isForward = !1,
    this.isBackward = !1,
    this.isLeft = !1,
    this.isRight = !1,
    this.deltaHeight = 0,
    this.dynamicGravity = 0,
    this.previousVelocity = this.entity.rigidbody.linearVelocity.clone(),
    this.player.fireNetworkEvent("l"),
    t < .3)
        return !1;
    if (this.isShooting > this.timestamp)
        return !1;
    if (Math.abs(this.currentHeight - this.lastHeight) > .1) {
        var e = Math.round(Math.random()) + 1;
        this.entity.sound.play("Land-" + e),
        this.app.tween(this.animation).to({
            landAngle: -.4 * t,
            cameraShootBounce: -5 * t
        }, .15, pc.BackOut).start(),
        this.footForce = 1
    }
}
,
Movement.prototype.setDamping = function(t) {
    if (this.currentHeight > this.defaultHeight && !this.isLanded && !this.isDashing) {
        var e = Math.min((this.now() - this.airTime) / 1e3, 1);
        this.dynamicGravity += t * this.gravityStep * this.gravityStep,
        this.entity.rigidbody.linearDamping = this.airDamping,
        this.entity.rigidbody.applyForce(0, this.gravity + this.gravity * e - this.dynamicGravity, 0)
    } else
        this.movementSpeed < .5 ? this.entity.rigidbody.linearDamping = pc.math.lerp(this.entity.rigidbody.linearDamping, this.stopDamping, this.stoppingSpeed) : this.entity.rigidbody.linearDamping = this.groundDamping
}
,
Movement.prototype.setCurrentValues = function(t) {
    this.isLanded ? this.animation.jumpAngle = pc.math.lerp(this.animation.jumpAngle, 0, .2) : this.animation.jumpAngle = pc.math.lerp(this.animation.jumpAngle, 0, .05),
    this.animation.landAngle = pc.math.lerp(this.animation.landAngle, 0, .1);
    var e = 1;
    this.isLanded || (e = .1),
    this.currentForce.x = pc.math.lerp(this.currentForce.x, this.force.x, e),
    this.currentForce.y = pc.math.lerp(this.currentForce.y, this.force.y, e),
    this.currentForce.z = pc.math.lerp(this.currentForce.z, this.force.z, e)
}
,
Movement.prototype.setGravity = function() {
    var t = this.entity.getPosition().clone()
      , e = t.clone().add(this.heightVector)
      , i = this.app.systems.rigidbody.raycastFirst(t, e)
      , s = 1e3
      , n = [];
    i && (n = i.entity.tags.list(),
    s = i.point.sub(this.entity.getPosition().clone()).length(),
    n.indexOf("Wood") > -1 || n.indexOf("Concrete") > -1 ? this.groundMaterial = "Concrete" : n.indexOf("Snow") > -1 ? this.groundMaterial = "Snow" : this.groundMaterial = "Gravel");
    var o = this.currentHeight;
    this.lastHeight = o,
    this.currentHeight = s,
    this.jumpingTime > this.timestamp && (this.entity.rigidbody.applyForce(0, this.jumpForce, 0),
    this.entity.rigidbody.applyForce(this.lastVelocity)),
    this.currentHeight > this.collisionHeight ? (this.isLanded && (this.lastVelocity = this.entity.rigidbody.linearVelocity.clone()),
    this.isLanded = !1) : (this.isLanded = !0,
    this.lastVelocity.x = pc.math.lerp(this.lastVelocity.x, 0, .1),
    this.lastVelocity.y = pc.math.lerp(this.lastVelocity.y, 0, .1),
    this.lastVelocity.z = pc.math.lerp(this.lastVelocity.z, 0, .1)),
    this.currentHeight > this.airHeight && (this.leftAirTime = this.now())
}
,
Movement.prototype.setShooting = function(t) {
    if (!this.isMouseLocked)
        return !1;
    if (this.leftMouse || this.isShootingLocked || this.isFireStopped || (this.stopFiring(),
    0 === this.currentWeapon.ammo && this.reload()),
    this.leftMouse && !this.isShootingLocked && !this.isThrowing && this.isReloading < this.timestamp && this.isHitting < this.timestamp && (this.currentWeapon.ammo > 0 ? this.isShooting = this.currentWeapon.shootTime + this.timestamp : this.reload()),
    this.player.checkShooting(),
    this.isShooting > this.timestamp && !this.isShootingLocked) {
        var e = this.currentWeapon.recoil
          , i = this.currentWeapon.cameraShake
          , s = .03 * Math.random() - .03 * Math.random()
          , n = -.15 * e
          , o = 6 * e
          , a = -1.2
          , h = 2
          , r = this.currentWeapon.spread
          , p = Math.cos(110 * this.spreadCount)
          , m = this.currentWeapon.spread * p;
        this.cancelInspect(!0),
        this.setShootDirection(),
        this.isFocusing && "Rifle" == this.currentWeapon.type && (n = -.05,
        o = .5,
        a = -.2,
        i *= .5,
        h = .05,
        r = this.currentWeapon.focusSpread,
        m = this.currentWeapon.focusSpread * p),
        "Sniper" != this.currentWeapon.type && "Shotgun" != this.currentWeapon.type || (this.spreadNumber = this.currentWeapon.spread,
        this.isFocusing && (this.spreadNumber = this.currentWeapon.focusSpread),
        a = -5,
        h = 5.2),
        this.currentWeapon.shoot();
        var c = this.currentWeapon.bulletPoint.getPosition().clone()
          , u = this.currentWeapon.bulletPoint.getEulerAngles().clone();
        "Sniper" == this.currentWeapon.type && this.isFocusing || (this.app.fire("EffectManager:Bullet", c, u),
        this.entity.script.weaponManager.triggerShooting());
        var l = this.currentWeapon.muzzlePoint.getPosition().clone()
          , d = this.raycastShootFrom
          , y = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber
          , g = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber
          , v = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber
          , f = this.raycastTo.clone().add(new pc.Vec3(y,g,v))
          , w = this.currentWeapon.damage
          , M = this.currentWeapon.distanceMultiplier;
        if ("Shotgun" == this.currentWeapon.type) {
            this.app.fire("EffectManager:Fire", d, f, l, this.player.playerId, w, "Shotgun", M);
            for (var b = 0; b < 6; b++)
                y = Math.cos(b / 3 * Math.PI) * this.spreadNumber,
                g = Math.sin(b / 3 * Math.PI) * this.spreadNumber,
                v = Math.cos(b / 3 * Math.PI) * this.spreadNumber,
                f = this.raycastTo.clone().add(new pc.Vec3(y,g,v)),
                this.app.fire("EffectManager:Fire", d, f, l, this.player.playerId, w, "Shotgun", M)
        } else
            this.app.fire("EffectManager:Fire", d, f, l, this.player.playerId, w);
        this.lookY += .04 * i,
        this.spreadNumber = pc.math.lerp(this.spreadNumber, r, .4),
        this.spreadCount += t,
        this.currentWeapon.ammo--,
        this.app.fire("Overlay:Shoot", !0),
        this.app.tween(this.animation).to({
            bounceX: s,
            bounceZ: n,
            bounceAngle: o,
            shootSwing: h
        }, .03, pc.BackOut).start(),
        this.app.tween(this.animation).to({
            cameraShootBounce: a,
            cameraBounce: this.animation.cameraBounce + .025 * i
        }, .09, pc.BackOut).start(),
        this.animation.activeBounce = pc.math.lerp(this.animation.activeBounce, -i, .05),
        this.animation.horizantalSpread = pc.math.lerp(this.animation.horizantalSpread, .04 * m, .1),
        this.isShootingLocked = !0,
        this.isFireStopped = !1
    }
    this.isShooting < this.timestamp && this.isShootingLocked && (this.isShootingLocked = !1),
    this.isShooting > this.timestamp + .1 && (this.animation.jumpAngle = pc.math.lerp(this.animation.jumpAngle, 0, .2)),
    this.animation.fov = pc.math.lerp(this.animation.fov, 0, .1),
    this.animation.bounceX = pc.math.lerp(this.animation.bounceX, 0, .3),
    this.animation.bounceZ = pc.math.lerp(this.animation.bounceZ, 0, .1),
    this.animation.bounceAngle = pc.math.lerp(this.animation.bounceAngle, 0, .2),
    this.animation.shootSwing = pc.math.lerp(this.animation.shootSwing, 0, .01),
    this.animation.activeBounce = pc.math.lerp(this.animation.activeBounce, 0, .1),
    this.animation.cameraShootBounce = pc.math.lerp(this.animation.cameraShootBounce, 0, .1),
    this.animation.cameraBounce = pc.math.lerp(this.animation.cameraBounce, 0, .1),
    this.animation.cameraImpact = pc.math.lerp(this.animation.cameraImpact, 0, .1),
    this.spreadNumber = pc.math.lerp(this.spreadNumber, 0, .2),
    this.animation.horizantalSpread = pc.math.lerp(this.animation.horizantalSpread, 0, .01)
}
,
Movement.prototype.shake = function() {
    this.app.tween(this.animation).to({
        cameraShootBounce: 1,
        cameraBounce: this.animation.cameraBounce + .025
    }, .15, pc.BackOut).start()
}
,
Movement.prototype.stopFiring = function() {
    this.currentWeapon && !this.isFireStopped && this.currentWeapon.stopShooting(),
    this.isFireStopped = !0
}
,
Movement.prototype.setShootDirection = function() {
    var t = this.app.graphicsDevice.maxPixelRatio
      , e = this.app.graphicsDevice.width / 2 / t
      , i = this.app.graphicsDevice.height / 2 / t
      , s = this.cameraEntity.getPosition()
      , n = this.cameraEntity.camera.screenToWorld(e, i, this.cameraEntity.camera.farClip);
    this.raycastShootFrom = s,
    this.raycastTo = n
}
,
Movement.prototype.updateAutoLock = function() {
    if (this.lastAutoLockTime > this.timestamp) {
        this.autoLockEntity.lookAt(this.nearestPlayerPosition);
        this.autoLockEntity.getLocalEulerAngles();
        var t = this.entity.getPosition()
          , e = Utils.lookAt(this.nearestPlayerPosition.x, this.nearestPlayerPosition.z, t.x, t.z);
        this.lookX = e * pc.math.RAD_TO_DEG
    }
    this.setShootDirection();
    var i = this.app.systems.rigidbody.raycastFirst(this.raycastShootFrom, this.raycastTo);
    i && i.entity.tags && i.entity.tags.list().indexOf("Player") > -1 && ("-1" != i.entity.script.enemy.playerId && (this.currentWeapon.spread = .1,
    this.leftMouse = !0,
    clearTimeout(this.mobileShootTimer),
    this.mobileShootTimer = setTimeout(function(t) {
        t.leftMouse = !1
    }, 300, this)))
}
,
Movement.prototype.setAutoLock = function(t) {
    this.lastAutoLockTime < this.timestamp && (this.nearestPlayerPosition = t,
    this.lastAutoLockTime = this.timestamp + .1)
}
,
Movement.prototype.scanShootables = function() {
    if (Date.now() - this.lastScanUpdate < 200)
        return !1;
    var t = this.entity.getPosition()
      , e = !1
      , i = 900
      , s = this.app.systems.rigidbody.raycastFirst(this.raycastShootFrom, this.raycastTo);
    if (s && s.entity.tags.list().indexOf("Player") > -1) {
        var n = s.entity.getPosition().sub(t).length();
        n < i && (e = s.point,
        i = n,
        this.app.fire("Touch:AutoLock", e))
    }
    e && this.app.fire("Touch:AutoLock", e),
    this.lastScanUpdate = Date.now()
}
,
Movement.prototype.checkGlitches = function() {
    (this.entity.rigidbody.linearVelocity.length() > 300 || this.currentHeight > 100) && this.app.fire("Player:Respawn", !0)
}
,
Movement.prototype.update = function(t) {
    this.lastDelta += t,
    this.setCameraAngle(),
    this.setKeyboard(),
    this.setGravity(),
    this.setMovement(),
    this.setDamping(t);
    var e = this.lastDelta;
    e > pc.dt - .001 && (this.setHandAngle(e),
    this.setCurrentValues(e),
    this.setMovementAnimation(e),
    this.checkGlitches(),
    this.setShooting(e),
    pc.isMobile && this.updateAutoLock(),
    this.timestamp += e,
    this.lastDelta = 0)
}
;
"undefined" != typeof document && (function(t, e) {
    function s(t, e) {
        for (var n in e)
            try {
                t.style[n] = e[n]
            } catch (t) {}
        return t
    }
    function H(t) {
        return null == t ? String(t) : "object" == typeof t || "function" == typeof t ? Object.prototype.toString.call(t).match(/\s([a-z]+)/i)[1].toLowerCase() || "object" : typeof t
    }
    function R(t, e) {
        if ("array" !== H(e))
            return -1;
        if (e.indexOf)
            return e.indexOf(t);
        for (var n = 0, o = e.length; n < o; n++)
            if (e[n] === t)
                return n;
        return -1
    }
    function I() {
        var t, e = arguments;
        for (t in e[1])
            if (e[1].hasOwnProperty(t))
                switch (H(e[1][t])) {
                case "object":
                    e[0][t] = I({}, e[0][t], e[1][t]);
                    break;
                case "array":
                    e[0][t] = e[1][t].slice(0);
                    break;
                default:
                    e[0][t] = e[1][t]
                }
        return 2 < e.length ? I.apply(null, [e[0]].concat(Array.prototype.slice.call(e, 2))) : e[0]
    }
    function N(t) {
        return 1 === (t = Math.round(255 * t).toString(16)).length ? "0" + t : t
    }
    function S(t, e, n, o) {
        t.addEventListener ? t[o ? "removeEventListener" : "addEventListener"](e, n, !1) : t.attachEvent && t[o ? "detachEvent" : "attachEvent"]("on" + e, n)
    }
    function D(t, o) {
        function g(t, e, n, o) {
            return l[0 | t][Math.round(Math.min((e - n) / (o - n) * z, z))]
        }
        function r() {
            C.legend.fps !== L && (C.legend.fps = L,
            C.legend[c] = L ? "FPS" : "ms"),
            w = L ? O.fps : O.duration,
            C.count[c] = 999 < w ? "999+" : w.toFixed(99 < w ? 0 : F.decimals)
        }
        function m() {
            for (p = n(),
            T < p - F.threshold && (O.fps -= O.fps / Math.max(1, 60 * F.smoothing / F.interval),
            O.duration = 1e3 / O.fps),
            y = F.history; y--; )
                j[y] = 0 === y ? O.fps : j[y - 1],
                q[y] = 0 === y ? O.duration : q[y - 1];
            if (r(),
            F.heat) {
                if (E.length)
                    for (y = E.length; y--; )
                        E[y].el.style[h[E[y].name].heatOn] = L ? g(h[E[y].name].heatmap, O.fps, 0, F.maxFps) : g(h[E[y].name].heatmap, O.duration, F.threshold, 0);
                if (C.graph && h.column.heatOn)
                    for (y = M.length; y--; )
                        M[y].style[h.column.heatOn] = L ? g(h.column.heatmap, j[y], 0, F.maxFps) : g(h.column.heatmap, q[y], F.threshold, 0)
            }
            if (C.graph)
                for (v = 0; v < F.history; v++)
                    M[v].style.height = (L ? j[v] ? Math.round(b / F.maxFps * Math.min(j[v], F.maxFps)) : 0 : q[v] ? Math.round(b / F.threshold * Math.min(q[v], F.threshold)) : 0) + "px"
        }
        function k() {
            20 > F.interval ? (f = i(k),
            m()) : (f = setTimeout(k, F.interval),
            x = i(m))
        }
        function G(t) {
            (t = t || window.event).preventDefault ? (t.preventDefault(),
            t.stopPropagation()) : (t.returnValue = !1,
            t.cancelBubble = !0),
            O.toggle()
        }
        function U() {
            F.toggleOn && S(C.container, F.toggleOn, G, 1),
            t.removeChild(C.container)
        }
        function V() {
            if (C.container && U(),
            h = D.theme[F.theme],
            !(l = h.compiledHeatmaps || []).length && h.heatmaps.length) {
                for (v = 0; v < h.heatmaps.length; v++)
                    for (l[v] = [],
                    y = 0; y <= z; y++) {
                        var e, n = l[v], o = y;
                        e = .33 / z * y;
                        var a = h.heatmaps[v].saturation
                          , i = h.heatmaps[v].lightness
                          , p = void 0
                          , c = void 0
                          , u = void 0
                          , d = u = void 0
                          , g = p = c = void 0;
                        g = void 0;
                        0 === (u = .5 >= i ? i * (1 + a) : i + a - i * a) ? e = "#000" : (c = (u - (d = 2 * i - u)) / u,
                        g = (e *= 6) - (p = Math.floor(e)),
                        g *= u * c,
                        0 === p || 6 === p ? (p = u,
                        c = d + g,
                        u = d) : 1 === p ? (p = u - g,
                        c = u,
                        u = d) : 2 === p ? (p = d,
                        c = u,
                        u = d + g) : 3 === p ? (p = d,
                        c = u - g) : 4 === p ? (p = d + g,
                        c = d) : (p = u,
                        c = d,
                        u -= g),
                        e = "#" + N(p) + N(c) + N(u)),
                        n[o] = e
                    }
                h.compiledHeatmaps = l
            }
            for (var m in C.container = s(document.createElement("div"), h.container),
            C.count = C.container.appendChild(s(document.createElement("div"), h.count)),
            C.legend = C.container.appendChild(s(document.createElement("div"), h.legend)),
            C.graph = F.graph ? C.container.appendChild(s(document.createElement("div"), h.graph)) : 0,
            E.length = 0,
            C)
                C[m] && h[m].heatOn && E.push({
                    name: m,
                    el: C[m]
                });
            if (M.length = 0,
            C.graph)
                for (C.graph.style.width = F.history * h.column.width + (F.history - 1) * h.column.spacing + "px",
                y = 0; y < F.history; y++)
                    M[y] = C.graph.appendChild(s(document.createElement("div"), h.column)),
                    M[y].style.position = "absolute",
                    M[y].style.bottom = 0,
                    M[y].style.right = y * h.column.width + y * h.column.spacing + "px",
                    M[y].style.width = h.column.width + "px",
                    M[y].style.height = "0px";
            s(C.container, F),
            r(),
            t.appendChild(C.container),
            C.graph && (b = C.graph.clientHeight),
            F.toggleOn && ("click" === F.toggleOn && (C.container.style.cursor = "pointer"),
            S(C.container, F.toggleOn, G))
        }
        "object" === H(t) && t.nodeType === e && (o = t,
        t = document.body),
        t || (t = document.body);
        var h, l, p, f, x, b, w, y, v, O = this, F = I({}, D.defaults, o || {}), C = {}, M = [], z = 100, E = [], A = F.threshold, P = 0, T = n() - A, j = [], q = [], L = "fps" === F.show;
        O.options = F,
        O.fps = 0,
        O.duration = 0,
        O.isPaused = 0,
        O.tickStart = function() {
            P = n()
        }
        ,
        O.tick = function() {
            p = n(),
            A += (p - T - A) / F.smoothing,
            O.fps = 1e3 / A,
            O.duration = P < T ? A : p - P,
            T = p
        }
        ,
        O.pause = function() {
            return f && (O.isPaused = 1,
            clearTimeout(f),
            a(f),
            a(x),
            f = x = 0),
            O
        }
        ,
        O.resume = function() {
            return f || (O.isPaused = 0,
            k()),
            O
        }
        ,
        O.set = function(t, e) {
            return F[t] = e,
            L = "fps" === F.show,
            -1 !== R(t, u) && V(),
            -1 !== R(t, d) && s(C.container, F),
            O
        }
        ,
        O.showDuration = function() {
            return O.set("show", "ms"),
            O
        }
        ,
        O.showFps = function() {
            return O.set("show", "fps"),
            O
        }
        ,
        O.toggle = function() {
            return O.set("show", L ? "ms" : "fps"),
            O
        }
        ,
        O.hide = function() {
            return O.pause(),
            C.container.style.display = "none",
            O
        }
        ,
        O.show = function() {
            return O.resume(),
            C.container.style.display = "block",
            O
        }
        ,
        O.destroy = function() {
            O.pause(),
            U(),
            O.tick = O.tickStart = function() {}
        }
        ,
        V(),
        k()
    }
    var n, o = t.performance;
    n = o && (o.now || o.webkitNow) ? o[o.now ? "now" : "webkitNow"].bind(o) : function() {
        return +new Date
    }
    ;
    for (var a = t.cancelAnimationFrame || t.cancelRequestAnimationFrame, i = t.requestAnimationFrame, h = 0, l = 0, p = (o = ["moz", "webkit", "o"]).length; l < p && !a; ++l)
        i = (a = t[o[l] + "CancelAnimationFrame"] || t[o[l] + "CancelRequestAnimationFrame"]) && t[o[l] + "RequestAnimationFrame"];
    a || (i = function(e) {
        var o = n()
          , a = Math.max(0, 16 - (o - h));
        return h = o + a,
        t.setTimeout(function() {
            e(o + a)
        }, a)
    }
    ,
    a = function(t) {
        clearTimeout(t)
    }
    );
    var c = "string" === H(document.createElement("div").textContent) ? "textContent" : "innerText";
    D.extend = I,
    window.FPSMeter = D,
    D.defaults = {
        interval: 100,
        smoothing: 10,
        show: "fps",
        toggleOn: "click",
        decimals: 1,
        maxFps: 60,
        threshold: 100,
        position: "absolute",
        zIndex: 10,
        left: "5px",
        top: "5px",
        right: "auto",
        bottom: "auto",
        margin: "0 0 0 0",
        theme: "dark",
        heat: 0,
        graph: 0,
        history: 20
    };
    var u = ["toggleOn", "theme", "heat", "graph", "history"]
      , d = "position zIndex left top right bottom margin".split(" ")
}(window),
function(t, e) {
    e.theme = {};
    var n = e.theme.base = {
        heatmaps: [],
        container: {
            heatOn: null,
            heatmap: null,
            padding: "5px",
            minWidth: "95px",
            height: "30px",
            lineHeight: "30px",
            textAlign: "right",
            textShadow: "none"
        },
        count: {
            heatOn: null,
            heatmap: null,
            position: "absolute",
            top: 0,
            right: 0,
            padding: "5px 10px",
            height: "30px",
            fontSize: "24px",
            fontFamily: "Consolas, Andale Mono, monospace",
            zIndex: 2
        },
        legend: {
            heatOn: null,
            heatmap: null,
            position: "absolute",
            top: 0,
            left: 0,
            padding: "5px 10px",
            height: "30px",
            fontSize: "12px",
            lineHeight: "32px",
            fontFamily: "sans-serif",
            textAlign: "left",
            zIndex: 2
        },
        graph: {
            heatOn: null,
            heatmap: null,
            position: "relative",
            boxSizing: "padding-box",
            MozBoxSizing: "padding-box",
            height: "100%",
            zIndex: 1
        },
        column: {
            width: 4,
            spacing: 1,
            heatOn: null,
            heatmap: null
        }
    };
    e.theme.dark = e.extend({}, n, {
        heatmaps: [{
            saturation: .8,
            lightness: .8
        }],
        container: {
            background: "#222",
            color: "#fff",
            border: "1px solid #1a1a1a",
            textShadow: "1px 1px 0 #222"
        },
        count: {
            heatOn: "color"
        },
        column: {
            background: "#3f3f3f"
        }
    }),
    e.theme.light = e.extend({}, n, {
        heatmaps: [{
            saturation: .5,
            lightness: .5
        }],
        container: {
            color: "#666",
            background: "#fff",
            textShadow: "1px 1px 0 rgba(255,255,255,.5), -1px -1px 0 rgba(255,255,255,.5)",
            boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
        },
        count: {
            heatOn: "color"
        },
        column: {
            background: "#eaeaea"
        }
    }),
    e.theme.colorful = e.extend({}, n, {
        heatmaps: [{
            saturation: .5,
            lightness: .6
        }],
        container: {
            heatOn: "backgroundColor",
            background: "#888",
            color: "#fff",
            textShadow: "1px 1px 0 rgba(0,0,0,.2)",
            boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
        },
        column: {
            background: "#777",
            backgroundColor: "rgba(0,0,0,.2)"
        }
    }),
    e.theme.transparent = e.extend({}, n, {
        heatmaps: [{
            saturation: .8,
            lightness: .5
        }],
        container: {
            padding: 0,
            color: "#fff",
            textShadow: "1px 1px 0 rgba(0,0,0,.5)"
        },
        count: {
            padding: "0 5px",
            height: "40px",
            lineHeight: "40px"
        },
        legend: {
            padding: "0 5px",
            height: "40px",
            lineHeight: "42px"
        },
        graph: {
            height: "40px"
        },
        column: {
            width: 5,
            background: "#999",
            heatOn: "backgroundColor",
            opacity: .5
        }
    })
}(window, FPSMeter));
var Fps = pc.createScript("fps");
Fps.prototype.initialize = function() {
    this.fps = new FPSMeter({
        heat: !0,
        graph: !0
    })
}
,
Fps.prototype.update = function(t) {
    this.fps.tick()
}
;
var Overlay = pc.createScript("overlay");
Overlay.attributes.add("focusBulletsEntity", {
    type: "entity"
}),
Overlay.attributes.add("focusAmmoEntity", {
    type: "entity"
}),
Overlay.attributes.add("focusBulletsMask", {
    type: "entity"
}),
Overlay.attributes.add("focusBulletsInner", {
    type: "entity"
}),
Overlay.attributes.add("blackShadow", {
    type: "entity"
}),
Overlay.attributes.add("cameraEntity", {
    type: "entity"
}),
Overlay.attributes.add("timeEntity", {
    type: "entity"
}),
Overlay.attributes.add("ammoEntity", {
    type: "entity"
}),
Overlay.attributes.add("capacityEntity", {
    type: "entity"
}),
Overlay.attributes.add("crosshairEntity", {
    type: "entity"
}),
Overlay.attributes.add("prepareEntity", {
    type: "entity"
}),
Overlay.attributes.add("infoEntity", {
    type: "entity"
}),
Overlay.attributes.add("abilityBuyButton", {
    type: "entity"
}),
Overlay.attributes.add("abilityBuyClock", {
    type: "entity"
}),
Overlay.attributes.add("abilityBuyKey", {
    type: "entity"
}),
Overlay.attributes.add("abilityBar", {
    type: "entity"
}),
Overlay.attributes.add("abilityNotification", {
    type: "entity"
}),
Overlay.attributes.add("cardEntities", {
    type: "entity",
    array: !0
}),
Overlay.attributes.add("cardEntity", {
    type: "entity"
}),
Overlay.attributes.add("cardTimer", {
    type: "entity"
}),
Overlay.attributes.add("cardTitle", {
    type: "entity"
}),
Overlay.attributes.add("cardBackground", {
    type: "entity"
}),
Overlay.attributes.add("abilityBind", {
    type: "entity"
}),
Overlay.attributes.add("abilityEntity", {
    type: "entity"
}),
Overlay.attributes.add("abilityHolderEntity", {
    type: "entity"
}),
Overlay.attributes.add("abilityIcon", {
    type: "entity"
}),
Overlay.attributes.add("abilityInfo", {
    type: "entity"
}),
Overlay.attributes.add("friendlyFire", {
    type: "entity"
}),
Overlay.attributes.add("teamNotification", {
    type: "entity"
}),
Overlay.attributes.add("teamNotificationText", {
    type: "entity"
}),
Overlay.attributes.add("whiteShadowEntity", {
    type: "entity"
}),
Overlay.attributes.add("whiteShadowColor", {
    type: "entity"
}),
Overlay.attributes.add("statusEntity", {
    type: "entity"
}),
Overlay.attributes.add("countBackEntity", {
    type: "entity"
}),
Overlay.attributes.add("damageIndictator", {
    type: "entity"
}),
Overlay.attributes.add("ricochetIndictator", {
    type: "entity"
}),
Overlay.attributes.add("explosiveIndicator", {
    type: "entity"
}),
Overlay.attributes.add("explosiveIndicatorArrow", {
    type: "entity"
}),
Overlay.attributes.add("explosiveIcon", {
    type: "entity"
}),
Overlay.attributes.add("leftDamageEntity", {
    type: "entity"
}),
Overlay.attributes.add("rightDamageEntity", {
    type: "entity"
}),
Overlay.attributes.add("healthBarEntity", {
    type: "entity"
}),
Overlay.attributes.add("healthBarColor", {
    type: "entity"
}),
Overlay.attributes.add("healthValue", {
    type: "entity"
}),
Overlay.attributes.add("notificationMessage", {
    type: "entity"
}),
Overlay.attributes.add("notificationKill", {
    type: "entity"
}),
Overlay.attributes.add("notificationHolder", {
    type: "entity"
}),
Overlay.attributes.add("announceEntity", {
    type: "entity"
}),
Overlay.attributes.add("announceInfoEntity", {
    type: "entity"
}),
Overlay.attributes.add("announceIconEntity", {
    type: "entity"
}),
Overlay.attributes.add("announceTextBackground", {
    type: "entity"
}),
Overlay.attributes.add("announceTextEntity", {
    type: "entity"
}),
Overlay.attributes.add("announceStripeEntity", {
    type: "entity"
}),
Overlay.attributes.add("reminderEntity", {
    type: "entity"
}),
Overlay.attributes.add("reminderTextEntity", {
    type: "entity"
}),
Overlay.attributes.add("leaderboardEntity", {
    type: "entity"
}),
Overlay.attributes.add("leaderboardItem", {
    type: "entity"
}),
Overlay.attributes.add("playerStatsEntity", {
    type: "entity"
}),
Overlay.attributes.add("taskEntity", {
    type: "entity"
}),
Overlay.attributes.add("taskTitleEntity", {
    type: "entity"
}),
Overlay.attributes.add("taskIconEntity", {
    type: "entity"
}),
Overlay.attributes.add("taskCountEntity", {
    type: "entity"
}),
Overlay.attributes.add("taskLevelEntity", {
    type: "entity"
}),
Overlay.attributes.add("achievementEntity", {
    type: "entity"
}),
Overlay.attributes.add("achievementName", {
    type: "entity"
}),
Overlay.attributes.add("achievementLevel", {
    type: "entity"
}),
Overlay.attributes.add("achievementIcon", {
    type: "entity"
}),
Overlay.attributes.add("holdEntity", {
    type: "entity"
}),
Overlay.attributes.add("holdBarEntity", {
    type: "entity"
}),
Overlay.attributes.add("circularEntity", {
    type: "entity"
}),
Overlay.attributes.add("circularPiece", {
    type: "entity"
}),
Overlay.attributes.add("circularHolder", {
    type: "entity"
}),
Overlay.attributes.add("circularSpinner", {
    type: "entity"
}),
Overlay.attributes.add("skillTimer", {
    type: "entity"
}),
Overlay.attributes.add("skillCountText", {
    type: "entity"
}),
Overlay.attributes.add("skillKeyEntity", {
    type: "entity"
}),
Overlay.attributes.add("skillIcon", {
    type: "entity"
}),
Overlay.attributes.add("skillClockIcon", {
    type: "entity"
}),
Overlay.attributes.add("meleeIcon", {
    type: "entity"
}),
Overlay.attributes.add("meleeTimer", {
    type: "entity"
}),
Overlay.attributes.add("meleeCountText", {
    type: "entity"
}),
Overlay.attributes.add("meleeKeyEntity", {
    type: "entity"
}),
Overlay.attributes.add("throwIconEntity", {
    type: "entity"
}),
Overlay.attributes.add("throwSkillEntity", {
    type: "entity"
}),
Overlay.attributes.add("meleeIconEntity", {
    type: "entity"
}),
Overlay.attributes.add("weaponIconEntity", {
    type: "entity"
}),
Overlay.attributes.add("pointNumberEntity", {
    type: "entity"
}),
Overlay.attributes.add("pointHolder", {
    type: "entity"
}),
Overlay.attributes.add("subtitleEntity", {
    type: "entity"
}),
Overlay.attributes.add("respawnEntity", {
    type: "entity"
}),
Overlay.attributes.add("leftCinema", {
    type: "entity"
}),
Overlay.attributes.add("rightCinema", {
    type: "entity"
}),
Overlay.attributes.add("chatEntity", {
    type: "entity"
}),
Overlay.attributes.add("modeEntity", {
    type: "entity"
}),
Overlay.attributes.add("weaponButtons", {
    type: "entity"
}),
Overlay.attributes.add("weaponTimeout", {
    type: "entity"
}),
Overlay.attributes.add("weaponTimeoutText", {
    type: "entity"
}),
Overlay.attributes.add("statsEntity", {
    type: "entity"
}),
Overlay.attributes.add("alreadyStarted", {
    type: "entity"
}),
Overlay.attributes.add("alreadyStartedCount", {
    type: "entity"
}),
Overlay.attributes.add("pauseEntity", {
    type: "entity"
}),
Overlay.attributes.add("garbageEntity", {
    type: "entity"
}),
Overlay.attributes.add("ammoAngleFactor", {
    type: "number",
    default: 4.15
}),
Overlay.attributes.add("defaultDamageTime", {
    type: "number",
    default: 2
}),
Overlay.prototype.initialize = function() {
    this.isDeath = !1,
    this.activeTaskTimer = !1,
    this.taskHideTimer = !1,
    this.lastSmallBannerUpdate = 0,
    this.smallBannerSet = !1,
    this.notifications = [],
    this.leaderboardItems = [],
    this.lastStatUpdate = Date.now(),
    this.circularItems = [],
    this.circularItemsList = [],
    this.circularCallback = !1,
    this.isOvertime = !1,
    this.blackShadowPlaying = !1,
    pc.isPauseActive = !1,
    this.isBannerSet = !1,
    this.pausePlayers = [],
    this.stats = [],
    this.playerStats = [],
    this.ping = 0,
    this.cards = [],
    this.abilities = [],
    this.abilityHolder = [],
    this.currentCards = [],
    this.isAbilitySelected = !1,
    this.hasAbility = !1,
    this.lastAnnounceDate = Date.now(),
    this.lastKillTime = -1,
    this.killCount = 0,
    this.myLastRank = -1,
    this.timestamp = 0,
    this.damageTime = 0,
    this.ricochetTime = 0,
    this.maxAmmoValue = 27,
    this.damagePosition = new pc.Vec3(0,0,0),
    this.explosivePosition = new pc.Vec3(0,0,0),
    this.ricochetPosition = new pc.Vec3(0,0,0),
    this.lastExplosiveWarning = this.now(),
    this.defaultCrosshairSize = this.crosshairEntity.element.width,
    this.leftCinema.enabled = !1,
    this.rightCinema.enabled = !1,
    this.leaderboardItem.enabled = !1,
    this.leftCinema.element.height = 2500,
    this.rightCinema.element.height = 2500,
    this.app.on("Overlay:SetAmmo", this.setAmmo, this),
    this.app.on("Overlay:Shoot", this.onShooting, this),
    this.app.on("Overlay:Jump", this.onJumping, this),
    this.app.on("Overlay:Damage", this.onDamage, this),
    this.app.on("Overlay:Ricochet", this.onRicochet, this),
    this.app.on("Overlay:FriendlyFire", this.onFriendlyFire, this),
    this.app.on("Overlay:Circular", this.onCircularMenu, this),
    this.app.on("Overlay:CircularSelect", this.onCircularSelect, this),
    this.app.on("Overlay:Explosive", this.onExplosive, this),
    this.app.on("Overlay:SkillTimer", this.onSkillTimer, this),
    this.app.on("Overlay:MeleeTimer", this.onMeleeTimer, this),
    this.app.on("Player:Health", this.setHealth, this),
    this.app.on("Player:Death", this.setDeath, this),
    this.app.on("Player:Respawn", this.setRespawn, this),
    this.app.on("Player:Kill", this.onKill, this),
    this.app.on("Player:Team", this.onTeamChange, this),
    this.app.on("Follow:User", this.onFollowUser, this),
    this.app.on("Overlay:Task", this.onTaskMessage, this),
    this.app.on("Overlay:Cards", this.onCards, this),
    this.app.on("Overlay:SetAbility", this.setAbility, this),
    this.app.on("Overlay:Status", this.setStatus, this),
    this.app.on("Overlay:Unlock", this.onUnlock, this),
    this.app.on("Overlay:Info", this.onInfoMessage, this),
    this.app.on("Overlay:InfoClose", this.onInfoClose, this),
    this.app.on("Overlay:Notification", this.onNotification, this),
    this.app.on("Overlay:Announce", this.onAnnounce, this),
    this.app.on("Overlay:Reminder", this.setReminder, this),
    this.app.on("Overlay:Leaderboard", this.setLeaderboard, this),
    this.app.on("Overlay:PlayerStats", this.onPlayerStats, this),
    this.app.on("Overlay:Point", this.onPoint, this),
    this.app.on("Overlay:Pause", this.onPause, this),
    this.app.on("Overlay:OpenReport", this.openReport, this),
    this.app.on("Overlay:OpenKickMenu", this.openKickMenu, this),
    this.app.on("Overlay:Subtitle", this.setSubtitle, this),
    this.app.on("Overlay:Weapon", this.onWeaponChange, this),
    this.app.on("Overlay:Transition", this.onTransition, this),
    this.app.on("Overlay:Gameplay", this.setOverlayStatus, this),
    this.app.on("Overlay:WhiteShadow", this.setWhiteShadow, this),
    this.app.on("Overlay:Ping", this.setPing, this),
    this.app.on("Game:Mode", this.onModeSet, this),
    this.app.on("Game:PreStart", this.onPreStart, this),
    this.app.on("Game:Start", this.onStart, this),
    this.app.on("Game:Finish", this.onFinish, this),
    this.app.on("Game:Overtime", this.setOvertime, this),
    this.app.on("Game:Settings", this.onSettingsChange, this),
    this.onSettingsChange(),
    this.app.on("Player:Character", this.onCharacterSet, this),
    this.app.on("Player:Respawn", this.onRespawn, this),
    this.app.on("Player:AllowRespawn", this.allowRespawn, this),
    this.app.on("Map:Loaded", this.onLoaded, this),
    this.app.on("Server:Tick", this.onTick, this),
    this.subtitleEntity.enabled = !1,
    setTimeout(function(t) {
        t.blackShadow.enabled = !1
    }, 1e4, this)
}
,
Overlay.prototype.onSettingsChange = function() {
    !0 === pc.settings.hideChat ? this.chatEntity.enabled = !1 : this.chatEntity.enabled = !0,
    pc.settings && !0 === pc.settings.fpsCounter ? this.statsEntity.enabled = !0 : this.statsEntity.enabled = !1
}
,
Overlay.prototype.onFollowUser = function(t) {
    this.app.fire("Fetcher:Follow", {
        username: t
    }),
    this.app.fire("Network:Chat", t + " followed!")
}
,
Overlay.prototype.onModeSet = function(t) {
    this.modeEntity.element.text = t + " - MODE"
}
,
Overlay.prototype.onCharacterSet = function(t) {
    var e = this.app.assets.find(t + "-Throw.png")
      , i = this.app.assets.find(t + "-ThrowSkill.png")
      , a = this.app.assets.find(t + "-Melee.png");
    this.throwIconEntity.element.textureAsset = e,
    this.throwSkillEntity.element.textureAsset = i,
    this.meleeIconEntity.element.textureAsset = a
}
,
Overlay.prototype.hideDesktop = function() {
    if (!Utils.isMobile())
        return !1;
    var t = this.app.root.findByTag("OnlyDesktop");
    for (var e in t) {
        t[e].enabled = !1
    }
}
,
Overlay.prototype.allowRespawn = function() {
    this.blackShadow.enabled = !1
}
,
Overlay.prototype.onRespawn = function() {}
,
Overlay.prototype.onPreStart = function() {
    this.blackShadow.enabled = !0
}
,
Overlay.prototype.onLoaded = function() {
    clearTimeout(this.blackShadowTimer),
    this.blackShadowTimer = setTimeout(function(t) {
        t.blackShadow.enabled = !1
    }, 1500, this),
    this.app.fire("DOM:Update", !0)
}
,
Overlay.prototype.onFriendlyFire = function() {
    this.friendlyFire.enabled = !0,
    clearTimeout(this.friendlyFireTimer),
    this.friendlyFireTimer = setTimeout(function(t) {
        t.friendlyFire.enabled = !1
    }, 2e3, this)
}
,
Overlay.prototype.onPlayerStats = function(t) {
    t ? (this.playerStatsEntity.enabled = !0,
    this.setPlayerStats(this.stats)) : (this.playerStatsEntity.enabled = !1,
    this.clearPlayerStats())
}
,
Overlay.prototype.onPause = function(t) {
    if (pc.isFinished)
        return !1;
    this.pauseEntity.enabled = t,
    pc.isPauseActive = this.pauseEntity.enabled,
    t ? (this.setPausePlayers(this.stats),
    this.isBannerSet || (setTimeout(function() {
        pc.app.fire("Ads:BannerSet", "venge-io_728x90", "728x90")
    }, 100, this),
    this.isBannerSet = !0)) : this.clearPausePlayers()
}
,
Overlay.prototype.openReport = function() {
    this.app.fire("View:Pause", "Report"),
    this.app.fire("Table:Users", {
        result: this.stats
    }),
    this.app.fire("Table:KickUsers", {
        result: this.stats
    })
}
,
Overlay.prototype.openKickMenu = function() {
    this.app.fire("View:Pause", "Kick"),
    this.app.fire("Table:KickUsers", {
        result: this.stats
    })
}
,
Overlay.prototype.clearPausePlayers = function() {
    for (var t = this.pausePlayers.length; t--; )
        this.pausePlayers[t].destroy()
}
,
Overlay.prototype.setPausePlayers = function(t) {
    this.clearPausePlayers();
    var e = this.pauseEntity.findByName("Content")
      , i = this.pauseEntity.findByName("Row");
    for (var a in t) {
        var n = t[a]
          , s = 38 * -parseInt(a)
          , o = this.app.assets.find("Tier-" + n.tier + ".png")
          , l = this.app.assets.find(n.skin + "-Thumbnail-3")
          , r = i.clone();
        r.enabled = !0,
        r.setLocalPosition(0, s, 0),
        r.findByName("Username").element.text = n.username,
        r.findByName("Kill").element.text = n.kill + "",
        r.findByName("Death").element.text = n.death + "",
        r.findByName("Score").element.text = n.score + "",
        r.findByName("Tier").element.textureAsset = o,
        r.findByName("Character").element.textureAsset = l,
        n.verified && (r.findByName("Username").findByName("Verified").enabled = !0,
        r.findByName("Username").setLocalPosition(65, 0, 0)),
        this.pausePlayers.push(r),
        e.addChild(r)
    }
}
,
Overlay.prototype.clearPlayerStats = function() {
    for (var t = this.playerStats.length; t--; )
        this.playerStats[t].destroy()
}
,
Overlay.prototype.setPlayerStats = function(t) {
    this.clearPlayerStats();
    var e = this.playerStatsEntity.findByName("Content")
      , i = this.playerStatsEntity.findByName("Row");
    for (var a in t) {
        var n = t[a]
          , s = 38 * -parseInt(a)
          , o = this.app.assets.find("Tier-" + n.tier + ".png")
          , l = this.app.assets.find(n.skin + "-Thumbnail-3")
          , r = i.clone();
        r.enabled = !0,
        r.setLocalPosition(0, s, 0),
        r.findByName("Username").element.text = n.username,
        r.findByName("Kill").element.text = n.kill + "",
        r.findByName("Death").element.text = n.death + "",
        r.findByName("Score").element.text = n.score + "",
        r.findByName("Tier").element.textureAsset = o,
        r.findByName("Character").element.textureAsset = l,
        n.verified && (r.findByName("Username").findByName("Verified").enabled = !0,
        r.findByName("Username").setLocalPosition(65, 0, 0)),
        this.playerStats.push(r),
        e.addChild(r)
    }
}
,
Overlay.prototype.onTeamChange = function(t) {
    if (pc.currentTeam == t)
        return !1;
    this.teamNotification.enabled = !0,
    this.teamNotification.setLocalPosition(0, -100, 0),
    this.teamNotificationText.element.text = "Your team changed to " + t + ".",
    this.teamNotification.tween(this.teamNotification.getLocalPosition()).to({
        x: 0,
        y: 150,
        z: 0
    }, .8, pc.BackOut).start(),
    "red" == t ? this.teamNotification.element.color = pc.colors.redTeam : "blue" == t && (this.teamNotification.element.color = pc.colors.blueTeam),
    clearTimeout(this.teamChangeTimer),
    this.teamChangeTimer = setTimeout(function(t) {
        t.teamNotification.enabled = !1
    }, 7e3, this)
}
,
Overlay.prototype.setWhiteShadow = function(t) {
    t ? (this.entity.sound.play("White-Shadow"),
    this.whiteShadowEntity.enabled = !0,
    this.whiteShadowEntity.setLocalScale(80, 80, 80),
    this.whiteShadowEntity.tween(this.whiteShadowEntity.getLocalScale()).to({
        x: 45,
        y: 45,
        z: 45
    }, 1, pc.SineIn).start(),
    this.whiteShadowColor.element.opacity = 0,
    this.whiteShadowColor.tween(this.whiteShadowColor.element).to({
        opacity: 1
    }, 1, pc.SineIn).start(),
    this.holdEntity.enabled = !0,
    clearTimeout(this.holdTimer),
    this.holdBarEntity.setLocalScale(.01, 1, 1),
    this.holdAnimation && this.holdAnimation.stop(),
    this.holdAnimation = this.holdBarEntity.tween(this.holdBarEntity.getLocalScale()).to({
        x: 1,
        y: 1,
        z: 1
    }, 1, pc.SineIn),
    this.holdAnimation.start()) : this.holdAnimation && (this.entity.sound.stop("White-Shadow"),
    this.entity.sound.play("Whoosh"),
    this.whiteShadowEntity.enabled = !1,
    this.holdAnimation.stop(),
    this.holdAnimation = this.holdBarEntity.tween(this.holdBarEntity.getLocalScale()).to({
        x: .01,
        y: 1,
        z: 1
    }, .5, pc.SineIn),
    this.holdAnimation.start(),
    this.holdTimer = setTimeout(function(t) {
        t.holdEntity.enabled = !1
    }, 500, this))
}
,
Overlay.prototype.setOvertime = function(t) {
    t ? (this.isOvertime = !0,
    this.entity.sound.play("Overtime-Loop")) : (this.isOvertime = !1,
    this.entity.sound.stop("Overtime-Loop"))
}
,
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
    this.hideAllGameplay()
}
,
Overlay.prototype.onPoint = function(t) {
    if (pc.isFinished)
        return !1;
    if (this.isDeath)
        return !1;
    var e = this.pointNumberEntity.clone();
    e.element.text = t + "",
    e.enabled = !0,
    e.setLocalPosition(0, -50, 0),
    this.pointHolder.addChild(e),
    this.entity.sound.play("Point"),
    e.tween(e.getLocalPosition()).to({
        x: 0,
        y: 0,
        z: 0
    }, .2, pc.BackOut).start(),
    e.tween(e.element).to({
        opacity: 1
    }, .2, pc.Linear).start(),
    setTimeout(function(t) {
        t.tween(t.getLocalPosition()).to({
            x: 0,
            y: 50,
            z: 0
        }, .2, pc.BackOut).start(),
        t.tween(t.element).to({
            opacity: 0
        }, .2, pc.Linear).start()
    }, 400, e),
    setTimeout(function(t) {
        t.destroy()
    }, 600, e)
}
,
Overlay.prototype.onCards = function(t) {
    for (var e in this.taskEntity.enabled = !1,
    this.achievementEntity.enabled = !1,
    this.focusBulletsEntity.enabled = !1,
    this.cardEntity.enabled = !0,
    this.cardTimer.enabled = !0,
    this.cardTitle.enabled = !0,
    this.isAbilitySelected = !1,
    this.abilityBuyClock.enabled = !0,
    this.abilityBuyKey.enabled = !1,
    this.abilityBuyButton.findByName("TierLevel").element.color = pc.colors.gray,
    this.abilityBuyButton.findByName("Thumbnail").element.color = pc.colors.gray,
    this.cardBackground.element.color = pc.colors.gray,
    this.cardBackground.element.opacity = .5,
    this.currentCards = t,
    this.entity.sound.play("Card-Selection-Loop"),
    this.entity.sound.play("Show-Cards"),
    this.entity.sound.play("Praying"),
    this.currentCards) {
        var i = this.currentCards[e]
          , a = this.app.assets.find(i + "-Card.png")
          , n = 0
          , s = 220 * ((l = parseInt(e)) - 1);
        0 === l ? n = 3 : 2 === l && (n = -3),
        this.cardEntities[e].glow || (this.cardEntities[e].glow = this.cardEntities[e].findByName("Glow"),
        this.cardEntities[e].key = this.cardEntities[e].findByName("Key")),
        this.cardEntities[e].glow.setLocalScale(1, 1, 1),
        this.cardEntities[e].glow.element.opacity = 0,
        this.cardEntities[e].glow.element.color = pc.colors.white,
        this.cardEntities[e].key.enabled = !1,
        this.cardEntities[e].setLocalScale(.5, .5, .5),
        this.cardEntities[e].setLocalPosition(s, 0, 0),
        this.cardEntities[e].setLocalEulerAngles(0, 0, n),
        this.cardEntities[e].enabled = !0,
        this.cardEntities[e].element.opacity = 0,
        this.cardEntities[e].element.textureAsset = a
    }
    for (var o in this.cardEntities) {
        var l, r = this.cardEntities[o], y = (s = 220 * ((l = parseInt(o)) - 1),
        l % 2 == 0 ? 0 : 30), h = .6 * (l + 1);
        r.tween(r.getLocalPosition()).to({
            x: s,
            y: y,
            z: 0
        }, .5, pc.BackOut).delay(h).start(),
        r.tween(r.getLocalScale()).to({
            x: .7,
            y: .7,
            z: .7
        }, 1, pc.BackOut).delay(h).start(),
        setTimeout(function(t, e) {
            e.key.enabled = !0,
            e.glow.enabled = !0,
            e.glow.tween(e.glow.element).to({
                opacity: .1
            }, .2, pc.Linear).delay(.3).start(),
            e.glow.tween(e.glow.getLocalScale()).to({
                x: 1.1,
                y: 1.1,
                z: 1.1
            }, .2, pc.BackOut).delay(.3).start(),
            t.entity.sound.slots["Show-Card"].pitch = .1 * Math.random() + 1,
            t.entity.sound.play("Show-Card")
        }, 1e3 * h, this, r),
        r.tween(r.element).to({
            opacity: 1
        }, .5, pc.Linear).delay(h).start()
    }
    clearTimeout(this.cardTimeout),
    this.cardTimeout = setTimeout(function(t) {
        t.app.fire("Overlay:SetAbility", 0),
        t.app.fire("Network:Card", 1)
    }, 8e3, this)
}
,
Overlay.prototype.setAbility = function(t) {
    if (this.isAbilitySelected)
        return !1;
    var e = this.cardEntities[t]
      , i = this.currentCards[t];
    for (var a in clearTimeout(this.cardTimeout),
    this.isAbilitySelected = !0,
    this.cardEntities) {
        var n = this.cardEntities[a];
        parseInt(a) != t && (n.enabled = !1)
    }
    this.cardTimer.enabled = !1,
    this.cardTitle.enabled = !1,
    this.entity.sound.play("Select-Ability"),
    this.app.fire("Player:Speak", "Weapon-Selection", 1),
    e.key.enabled = !1,
    e.glow.element.opacity = .8,
    e.glow.element.color = pc.colors.active,
    e.glow.setLocalScale(1.05, 1.05, 1.05),
    e.tween(e.getLocalPosition()).to({
        x: 0,
        y: 0,
        z: 0
    }, .5, pc.BackOut).start(),
    e.tween(e.getLocalScale()).to({
        x: 1.1,
        y: 1.1,
        z: 1.1
    }, .5, pc.BackOut).delay(.4).start(),
    e.tween(e.getEulerAngles()).rotate({
        x: 0,
        y: 0,
        z: 0
    }, .3, pc.BackOut).start(),
    setTimeout(function(t) {
        t.entity.sound.play("Add-Ability"),
        e.tween(e.getLocalPosition()).to({
            x: 600,
            y: -100,
            z: 0
        }, .4, pc.Linear).start(),
        e.tween(e.getLocalScale()).to({
            x: .32,
            y: .32,
            z: .32
        }, .35, pc.Linear).delay(.05).start(),
        e.tween(e.getLocalEulerAngles()).rotate({
            x: 0,
            y: 0,
            z: 90
        }, .2, pc.BackOut).delay(.2).start(),
        setTimeout(function() {
            t.cardBackground.tween(t.cardBackground.element).to({
                opacity: 1,
                color: pc.colors.black
            }, .2, pc.Linear).start()
        }, 400),
        setTimeout(function() {
            t.entity.sound.stop("Card-Selection-Loop"),
            t.entity.sound.stop("Praying"),
            t.cardEntity.enabled = !1
        }, 600)
    }, 1400, this),
    -1 === this.abilities.indexOf(i) && this.abilities.push(i),
    this.setAbilityList(),
    this.app.fire("Analytics:Event", "Card", i)
}
,
Overlay.prototype.clearAbilityList = function() {
    for (var t = this.abilityHolder.length; t--; )
        this.abilityHolder[t].destroy();
    this.abilityHolder = []
}
,
Overlay.prototype.setAbilityList = function() {
    this.clearAbilityList();
    for (var t = this.abilities.length, e = 0; t--; ) {
        if (e < 2) {
            var i = this.app.assets.find(this.abilities[t] + "-32x.png")
              , a = this.abilityEntity.clone();
            a.enabled = !0,
            a.setLocalPosition(25 * -t, 0, 0),
            a.element.textureAsset = i,
            this.abilityHolder.push(a),
            this.abilityHolderEntity.addChild(a)
        }
        e++
    }
    this.skillIcon.enabled = !1,
    this.abilityHolderEntity.enabled = !0
}
,
Overlay.prototype.setSubtitle = function(t) {
    return !pc.isFinished && (!this.isDeath && (this.subtitleEntity.element.text = t,
    this.subtitleEntity.enabled = !0,
    void setTimeout(function(t) {
        t.subtitleEntity.enabled = !1
    }, 2500, this)))
}
,
Overlay.prototype.onWeaponChange = function(t) {
    var e = this.app.assets.find(t + "-Thumbnail-White.png");
    this.weaponIconEntity.element.textureAsset = e;
    var i = this.weaponButtons.findByTag("Weapon");
    for (var a in i) {
        var n = i[a];
        n.name == t ? n.element.color = pc.colors.active : n.element.color = pc.colors.gray
    }
    this.weaponTimer = 8,
    this.weaponTimeout.enabled = !0,
    this.weaponTimeoutSet(),
    clearTimeout(this.lastWeaponSelection),
    this.lastWeaponSelection = setTimeout(function(t) {
        t.weaponTimeout.enabled = !1
    }, 8e3, this)
}
,
Overlay.prototype.weaponTimeoutSet = function() {
    this.weaponTimeoutText.element.text = "Please wait " + this.weaponTimer + " seconds...",
    this.weaponTimer--,
    this.weaponTimer > 0 && setTimeout(function(t) {
        t.weaponTimeoutSet()
    }, 1e3, this)
}
,
Overlay.prototype.clearCircularMenu = function() {
    for (var t = this.circularItems.length; t--; )
        this.circularItems[t].destroy();
    this.circularItems = [],
    this.circularItemsList = []
}
,
Overlay.prototype.showSmallBanner = function(t) {}
,
Overlay.prototype.triggerSmallBanner = function(t) {}
,
Overlay.prototype.onCircularMenu = function(t) {
    this.clearCircularMenu(),
    this.circularEntity.enabled = !0,
    this.circularPiece.enabled = !1;
    var e = 0
      , i = 23.15 * t.length;
    for (var a in t) {
        var n = t[a]
          , s = this.app.assets.find(n + "-Thumbnail-White.png")
          , o = parseInt(a)
          , l = .1 * o
          , r = this.circularPiece.clone();
        r.setLocalScale(.5, .5, .5),
        r.findByName("Key").element.text = o + 1 + "",
        r.findByName("Icon").element.textureAsset = s,
        r.findByName("Icon").setLocalEulerAngles(0, 0, -e - i),
        r.setLocalEulerAngles(0, 0, e),
        r.tween(r.getLocalScale()).to({
            x: 1.1,
            y: 1.1,
            z: 1.1
        }, .35 + l, pc.BackOut).delay(l).start(),
        setTimeout(function(t, e) {
            e.enabled = !0,
            t.entity.sound.play("Whoosh")
        }, 1e3 * l, this, r),
        this.circularHolder.addChild(r),
        this.circularItems.push(r),
        this.circularItemsList.push(n),
        e -= 62
    }
    this.circularHolder.setLocalEulerAngles(0, 0, i),
    this.circularSpinner.enabled = !0,
    this.circularEntity.setLocalPosition(0, -300, 0),
    this.circularEntity.tween(this.circularEntity.getLocalPosition()).to({
        x: 0,
        y: 55,
        z: 0
    }, .5, pc.BackOut).start(),
    setTimeout(function(t) {
        t.hideCircularMenu()
    }, 3500, this)
}
,
Overlay.prototype.onCircularSelect = function(t, e) {
    var i = this.circularItemsList.indexOf(t);
    if (i > -1) {
        var a = this.circularItems[i];
        if (a && a.element && a.element.color) {
            a.getLocalEulerAngles().clone();
            for (var n in a.element.color = pc.colors.active,
            a.tween(a.getLocalScale()).to({
                x: 1.2,
                y: 1.2,
                z: 1.2
            }, .2, pc.BackOut).start(),
            a.setLocalEulerAngles(0, 0, 0),
            a.findByName("Icon").setLocalEulerAngles(0, 0, 0),
            this.circularHolder.tween(this.circularHolder.getLocalEulerAngles()).rotate({
                x: 0,
                y: 0,
                z: 0
            }, .2, pc.BackOut).start(),
            this.circularSpinner.enabled = !1,
            this.circularItems) {
                var s = this.circularItems[n];
                i != n && s.destroy()
            }
            this.entity.sound.play("Select")
        }
    }
    setTimeout(function(t) {
        t.hideCircularMenu()
    }, 1500, this)
}
,
Overlay.prototype.hideCircularMenu = function() {
    this.entity.sound.play("Whoosh"),
    this.circularEntity.tween(this.circularEntity.getLocalPosition()).to({
        x: 0,
        y: -300,
        z: 0
    }, .5, pc.BackOut).start(),
    setTimeout(function(t) {
        t.circularEntity.enabled = !1
    }, 500, this)
}
,
Overlay.prototype.setLeaderboard = function(t) {
    for (var e = this.leaderboardItems.length; e--; )
        this.leaderboardItems[e].destroy();
    this.leaderboardItems = [],
    this.stats = t;
    var i = 1.3
      , a = 0
      , n = 0;
    for (var s in t) {
        var o = t[s]
          , l = parseInt(s)
          , r = this.app.assets.find("Tier-" + o.tier + ".png")
          , y = this.leaderboardItem.clone();
        y.enabled = !0,
        y.setLocalPosition(-3 * parseInt(s), a, 0),
        y.setLocalScale(i, i, i),
        y.findByName("Bar").setLocalScale(o.bar, 1, 1),
        y.findByName("Tier").element.textureAsset = r,
        y.findByName("Rank").element.text = l + 1 + ".",
        y.findByName("Username").element.text = o.username,
        "red" == o.team ? (y.findByName("Team").element.color = pc.colors.redTeam,
        y.findByName("Team").enabled = !0) : "blue" == o.team ? (y.findByName("Team").element.color = pc.colors.blueTeam,
        y.findByName("Team").enabled = !0) : y.findByName("Team").enabled = !1,
        o.isMe && (y.findByName("Username").element.color = pc.colors.me,
        y.findByName("Leader").element.color = pc.colors.me,
        n = l),
        o.verified ? (y.findByName("Username").findByName("Verified").enabled = !0,
        y.findByName("Username").setLocalPosition(55, -7, 0),
        y.element.width = y.findByName("Username").element.width + 70 + 20) : y.element.width = y.findByName("Username").element.width + 70,
        y.findByName("Leader").enabled = 0 === l,
        this.leaderboardEntity.addChild(y),
        this.leaderboardItems.push(y),
        a += -45 * (i -= .15) - 10
    }
    this.leaderboardEntity.element.height = 50 - a,
    this.myLastRank != n && (0 === n && 0 !== this.myLastRank && this.app.fire("Overlay:Subtitle", "You are the leader now!"),
    0 === this.myLastRank && 0 !== n && this.app.fire("Overlay:Subtitle", "You are no longer leader."),
    this.myLastRank = n)
}
,
Overlay.prototype.onMeleeTimer = function(t) {
    this.setMeleeState(!1),
    this.currentMeleeTime = t + 1,
    this.setMeleeTime()
}
,
Overlay.prototype.onSkillTimer = function(t) {
    this.setSkillState(!1),
    this.currentSkillTime = t + 1,
    this.setSkillTime()
}
,
Overlay.prototype.setSkillTime = function() {
    this.currentSkillTime--,
    this.skillCountText.element.text = this.currentSkillTime + "",
    this.currentSkillTime <= 0 ? this.setSkillState(!0) : setTimeout(function(t) {
        t.setSkillTime()
    }, 1e3, this)
}
,
Overlay.prototype.setMeleeTime = function() {
    this.currentMeleeTime--,
    this.meleeCountText.element.text = this.currentMeleeTime + "",
    this.currentMeleeTime <= 0 ? this.setMeleeState(!0) : setTimeout(function(t) {
        t.setMeleeTime()
    }, 1e3, this)
}
,
Overlay.prototype.setMeleeState = function(t) {
    this.meleeKeyEntity.enabled = t,
    this.meleeTimer.enabled = !t,
    t ? (this.meleeIcon.element.color = new pc.Color(1,1,1),
    this.entity.sound.play("Active")) : this.meleeIcon.element.color = this.skillClockIcon.element.color
}
,
Overlay.prototype.setSkillState = function(t) {
    this.skillKeyEntity.enabled = t,
    this.skillTimer.enabled = !t,
    t ? (this.abilityIcon.element.color = new pc.Color(1,1,1),
    this.skillIcon.element.color = new pc.Color(1,1,1),
    this.entity.sound.play("Active")) : (this.skillIcon.element.color = this.skillClockIcon.element.color,
    this.abilityIcon.element.color = this.skillClockIcon.element.color)
}
,
Overlay.prototype.onExplosive = function(t) {
    if ("Star" == t.type)
        return !1;
    this.explosiveEntity = t,
    this.lastExplosiveWarning = this.now(),
    this.explosiveIndicator.enabled = !0,
    this.explosiveAnimation1 = this.explosiveIndicator.tween(this.explosiveIndicator.getLocalScale()).to({
        x: 1.05,
        y: 1.05,
        z: 1.05
    }, .15, pc.Linear).yoyo(!0).loop(!0),
    this.explosiveAnimation2 = this.explosiveIndicatorArrow.tween(this.explosiveIndicatorArrow.getLocalScale()).to({
        x: 1.35,
        y: 1.35,
        z: 1.35
    }, .1, pc.Linear).yoyo(!0).loop(!0),
    this.explosiveAnimation1.start(),
    this.explosiveAnimation2.start(),
    this.entity.sound.play("Tick-Tock"),
    setTimeout(function(t) {
        t.explosiveAnimation1.stop(),
        t.explosiveAnimation2.stop(),
        t.entity.sound.stop("Tick-Tock"),
        t.explosiveIndicator.enabled = !1
    }, 1500, this)
}
,
Overlay.prototype.updateExplosiveIndicator = function() {
    if (this.now() - this.lastExplosiveWarning > 3e3)
        return !1;
    if (!this.explosiveEntity)
        return this.explosiveIndicator.enabled = !1,
        !1;
    var t = this.explosiveEntity.getPosition()
      , e = this.cameraEntity.getPosition();
    if (t.clone().sub(e).length() > 60)
        return this.explosiveIndicator.enabled = !1,
        this.entity.sound.stop("Tick-Tock"),
        !1;
    var i = Date.now() - this.explosiveEntity.startTime;
    i > 1e3 && i < 1400 ? (this.explosiveIndicatorArrow.element.color = pc.colors.danger,
    this.entity.sound.slots["Emergency-Alarm"].isPlaying || this.entity.sound.play("Emergency-Alarm")) : this.explosiveIndicatorArrow.element.color = pc.colors.explosive;
    var a = this.movement.lookX % 360
      , n = (Utils.lookAt(e.x, e.z, t.x, t.z) * pc.math.RAD_TO_DEG - a) % 360;
    n -= 180,
    this.explosiveIndicator.setLocalEulerAngles(0, 0, n),
    this.explosiveIcon.setLocalEulerAngles(0, 0, -n)
}
,
Overlay.prototype.setOverlayStatus = function(t) {
    !0 === t ? this.showGameplay() : this.hideGameplay()
}
,
Overlay.prototype.onTransition = function(t) {
    t ? (this.leftCinema.element.color = t,
    this.rightCinema.element.color = t) : (this.leftCinema.element.color = pc.colors.black,
    this.rightCinema.element.color = pc.colors.black),
    this.leftCinema.enabled = !0,
    this.rightCinema.enabled = !0,
    this.entity.sound.slots.Whoosh.pitch = 1.1,
    this.entity.sound.play("Whoosh"),
    this.leftCinema.setLocalEulerAngles(0, 0, 0),
    this.leftCinema.setLocalScale(.1, 1, 1),
    this.leftCinema.tween(this.leftCinema.getLocalScale()).to({
        x: 1.4,
        y: 1,
        z: 1
    }, .5, pc.QuarticInOut).start(),
    this.rightCinema.setLocalEulerAngles(0, 0, 0),
    this.rightCinema.setLocalScale(.1, 1, 1),
    this.rightCinema.tween(this.rightCinema.getLocalScale()).to({
        x: 1.4,
        y: 1,
        z: 1
    }, .5, pc.QuarticInOut).start(),
    setTimeout(function(t) {
        t.leftCinema.setLocalEulerAngles(0, 0, 0),
        t.leftCinema.tween(t.leftCinema.getLocalScale()).to({
            x: .1,
            y: 1,
            z: 1
        }, .5, pc.QuarticInOut).start(),
        t.rightCinema.setLocalEulerAngles(0, 0, 0),
        t.rightCinema.tween(t.rightCinema.getLocalScale()).to({
            x: .1,
            y: 1,
            z: 1
        }, .5, pc.QuarticInOut).start(),
        t.entity.sound.slots.Whoosh.pitch = 1,
        t.entity.sound.play("Whoosh")
    }, 500, this)
}
,
Overlay.prototype.setDeath = function() {
    this.hideGameplay(),
    this.subtitleEntity.enabled = !1,
    this.taskEntity.enabled = !1,
    this.achievementEntity.enabled = !1,
    this.focusBulletsEntity.enabled = !1,
    this.entity.sound.play("Death-UI"),
    this.isDeath = !0
}
,
Overlay.prototype.setHealth = function(t) {
    this.health = t;
    var e = 497 * this.health / 100;
    this.healthBarEntity.tween(this.healthBarEntity.element).to({
        width: e
    }, .5, pc.SineOut).start(),
    this.healthValue.element.text = Math.abs(this.health) + "",
    this.health < 30 ? this.healthBarColor.element.color = pc.colors.lowHealth : this.healthBarColor.element.color = pc.colors.health
}
,
Overlay.prototype.setStatus = function(t) {
    this.statusEntity.enabled = !0,
    this.statusEntity.setLocalPosition(0, 50, 0),
    this.statusEntity.tween(this.statusEntity.getLocalPosition()).to({
        x: 0,
        y: -85,
        z: 0
    }, .2, pc.BackOut).start(),
    this.statusEntity.element.text = t,
    setTimeout(function(t) {
        t.statusEntity.enabled = !1
    }, 4e3, this)
}
,
Overlay.prototype.setRespawn = function() {
    this.respawnEntity.enabled = !1,
    this.isDeath = !1,
    pc.isFinished || this.showGameplay()
}
,
Overlay.prototype.setReminder = function(t) {
    if (this.reminderEntity.enabled)
        return !1;
    this.reminderEntity.enabled = !0,
    this.reminderEntity.setLocalPosition(0, -140, 0),
    this.reminderEntity.tween(this.reminderEntity.getLocalPosition()).to({
        x: 0,
        y: 260,
        z: 0
    }, .25, pc.BackOut).start(),
    this.reminderTextEntity.element.text = t.toUpperCase(),
    setTimeout(function(t) {
        t.reminderEntity.enabled = !1
    }, 3e3, this)
}
,
Overlay.prototype.onTaskMessage = function(t, e, i, a, n) {
    if (this.achievementEntity.enabled)
        return !1;
    if (this.taskEntity.enabled)
        return this.setTaskScore(t, e, i, a, 0),
        !1;
    if (this.activeTaskTimer)
        return !1;
    var s = 2500;
    i - e < 5 && (s = 800),
    this.abilityBuyButton.findByName("TierLevel").element.text = t,
    this.activeTaskTimer = setTimeout(function(s) {
        s._onTaskMessage(t, e, i, a, n)
    }, s, this)
}
,
Overlay.prototype.setTaskScore = function(t, e, i, a, n) {
    this.taskTitleEntity.element.text = t,
    this.taskCountEntity.element.text = i + " / " + a,
    this.taskLevelEntity.setLocalScale(e / a, 1, 1),
    this.taskLevelEntity.tween(this.taskLevelEntity.getLocalScale()).to({
        x: i / a,
        y: 1,
        z: 1
    }, .8, pc.BackOut).delay(n).start(),
    this.abilityBar.setLocalScale(1, e / a, 1),
    this.abilityBar.tween(this.abilityBar.getLocalScale()).to({
        x: 1,
        y: i / a,
        z: 1
    }, .8, pc.BackOut).delay(n).start(),
    this.setTaskHideTimer()
}
,
Overlay.prototype._onTaskMessage = function(t, e, i, a, n) {
    this.taskEntity.enabled = !0,
    this.taskEntity.setLocalPosition(0, -75, 0),
    this.taskEntity.tween(this.taskEntity.getLocalPosition()).to({
        x: 0,
        y: 25,
        z: 0
    }, .25, pc.BackOut).start(),
    this.setTaskScore(t, e, i, a, .25),
    setTimeout(function(t) {
        t.entity.sound.play("Data-Increase")
    }, 250, this),
    this.setTaskHideTimer()
}
,
Overlay.prototype.setTaskHideTimer = function() {
    clearTimeout(this.taskHideTimer),
    this.taskHideTimer = setTimeout(function(t) {
        t.taskEntity.tween(t.taskEntity.getLocalPosition()).to({
            x: 0,
            y: -75,
            z: 0
        }, .1, pc.BackOut).start(),
        setTimeout(function() {
            t.taskEntity.enabled = !1,
            t.activeTaskTimer = !1
        }, 100)
    }, 3e3, this)
}
,
Overlay.prototype.onUnlock = function(t, e) {
    this.taskEntity.enabled = !1,
    this.abilityNotification.enabled = !1,
    this.abilityBuyClock.enabled = !1,
    this.abilityBuyKey.enabled = !0,
    this.abilityBuyButton.findByName("TierLevel").element.color = pc.colors.white,
    this.abilityBuyButton.findByName("Thumbnail").element.color = pc.colors.white,
    this.abilityBuyButton.findByName("TierLevel").element.text = t,
    this.achievementName.element.text = t + " - Abilities",
    this.achievementLevel.element.text = "Unlocked (" + e + "/" + e + ")";
    var i = this.achievementEntity.findByTag("Card");
    for (var a in i) {
        var n = i[a]
          , s = .3 * parseInt(a) + .5;
        n.setLocalPosition(84.136, 89.082, 0),
        n.setLocalEulerAngles(0, 0, 0),
        n.element.opacity = 1,
        n.tween(n.getLocalPosition()).to({
            x: 640,
            y: 265
        }, 1, pc.BackOut).delay(s).start(),
        n.tween(n.getLocalEulerAngles()).rotate({
            z: 165
        }, 1, pc.Linear).delay(s).start(),
        n.tween(n.element).to({
            opacity: 0
        }, .2, pc.Linear).delay(s + .5).start(),
        setTimeout(function(t) {
            t.entity.sound.play("Whoosh")
        }, 1e3 * s, this)
    }
    this.achievementEntity.enabled = !0,
    this.achievementEntity.setLocalPosition(0, -75, 0),
    this.achievementEntity.tween(this.achievementEntity.getLocalPosition()).to({
        x: 0,
        y: 38,
        z: 0
    }, .15, pc.BackOut).start(),
    this.hasAbility || (this.abilityNotification.enabled = !0,
    this.abilityInfo.enabled = !0,
    this.abilityInfo.setLocalPosition(-145, 0, 0),
    this.abilityInfo.tween(this.abilityInfo.getLocalPosition()).to({
        x: -165,
        y: 0,
        z: 0
    }, .3, pc.Linear).yoyo(!0).repeat(7).start(),
    setTimeout(function(t) {
        t.abilityInfo.enabled = !1,
        t.abilityNotification.enabled = !1
    }, 1e4, this),
    this.hasAbility = !0),
    this.entity.sound.play("Deep-Whoosh"),
    setTimeout(function(t) {
        t.achievementEntity.tween(t.achievementEntity.getLocalPosition()).to({
            x: 0,
            y: -75,
            z: 0
        }, .1, pc.BackOut).start(),
        setTimeout(function() {
            t.achievementEntity.enabled = !1
        }, 100)
    }, 3e3, this)
}
,
Overlay.prototype.fullDamage = function() {
    this.damageTime = this.timestamp + 2 * this.defaultDamageTime,
    this.leftDamageEntity.element.opacity = 1,
    this.rightDamageEntity.element.opacity = 1
}
,
Overlay.prototype.onRicochet = function(t) {
    if (this.movement.isDeath)
        return !1;
    this.ricochetTime = this.timestamp + this.defaultDamageTime,
    this.ricochetIndictator.element.opacity = 1,
    this.ricochetPosition.x = t.x,
    this.ricochetPosition.y = t.y,
    this.ricochetPosition.z = t.z
}
,
Overlay.prototype.onDamage = function(t) {
    if (this.movement.isDeath)
        return !1;
    this.damageTime = this.timestamp + this.defaultDamageTime,
    this.damageIndictator.element.opacity = 1,
    this.damagePosition.x = t.x,
    this.damagePosition.y = t.y,
    this.damagePosition.z = t.z;
    var e = this.cameraEntity.getPosition()
      , i = this.movement.lookX % 360
      , a = (Utils.lookAt(e.x, e.z, this.damagePosition.x, this.damagePosition.z) * pc.math.RAD_TO_DEG - i) % 360;
    a > -180 && a < 0 && (this.leftDamageEntity.element.opacity = .8),
    a > 0 && a < 180 && (this.rightDamageEntity.element.opacity = .8),
    a < -180 && a > -360 && (this.rightDamageEntity.element.opacity = .8),
    this.damageIndictator.setLocalScale(1.8, 1.8, 1.8),
    this.damageIndictator.tween(this.damageIndictator.getLocalScale()).to({
        x: .92,
        y: .92,
        z: .92
    }, .18, pc.BackInOut).start();
    var n = Math.round(2 * Math.random()) + 1;
    this.entity.sound.play("Body-Impact-" + n),
    this.movement.impact()
}
,
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
}
,
Overlay.prototype.onAnnounce = function(t, e, i, a) {
    this.announceEntity.enabled = !0,
    this.announceIconEntity.setLocalScale(3, 3, 3),
    this.announceIconEntity.tween(this.announceIconEntity.getLocalScale()).to({
        x: 1,
        y: 1,
        z: 1
    }, .15, pc.SineOut).start();
    var n = this.app.assets.find(a + ".png");
    if (this.announceIconEntity.element.textureAsset = n,
    this.announceIconEntity.element.opacity = 0,
    this.announceIconEntity.tween(this.announceIconEntity.element).to({
        opacity: 1
    }, .15, pc.SineOut).start(),
    this.announceTextEntity.element.text = t.toUpperCase(),
    this.announceTextEntity.element.opacity = 0,
    this.announceTextEntity.tween(this.announceTextEntity.element).to({
        opacity: 1
    }, .15, pc.SineOut).delay(.15).start(),
    this.announceStripeEntity.setLocalScale(2.5, 1, 1),
    this.announceStripeEntity.tween(this.announceStripeEntity.getLocalScale()).to({
        x: .015,
        y: 1,
        z: 1
    }, .3, pc.SineOut).start(),
    this.announceStripeEntity.element.opacity = .3,
    this.announceStripeEntity.tween(this.announceStripeEntity.element).to({
        opacity: 0
    }, .15, pc.SineOut).delay(.25).start(),
    this.announceInfoEntity.element.text = e.toUpperCase(),
    this.announceInfoEntity.element.opacity = 0,
    this.announceInfoEntity.tween(this.announceInfoEntity.element).to({
        opacity: 1
    }, .3, pc.SineOut).delay(.5).start(),
    console.log(this.announceTextEntity.element.width),
    this.announceTextBackground.element.width = this.announceTextEntity.element.width + 100,
    this.announceInfoEntity.setLocalPosition(0, -7, 0),
    this.announceInfoEntity.tween(this.announceInfoEntity.getLocalPosition()).to({
        x: 0,
        y: -22,
        z: 0
    }, .3, pc.SineOut).delay(.5).start(),
    clearTimeout(this.announceTimer),
    this.announceTimer = setTimeout(function(t) {
        t.announceEntity.enabled = !1
    }, 4500, this),
    i) {
        var s = "Announce-" + i;
        Date.now() - this.lastAnnounceDate < 3e3 ? this.entity.sound.slots[s].pitch += .1 : this.entity.sound.slots[s].pitch = 1,
        this.entity.sound.play(s)
    }
    this.lastAnnounceDate = Date.now()
}
,
Overlay.prototype.updateCrosshair = function(t) {
    var e = this.cameraEntity.getPosition()
      , i = this.movement.lookX % 360;
    if (this.crosshairEntity.element.width = pc.math.lerp(this.crosshairEntity.element.width, this.defaultCrosshairSize, .25),
    this.crosshairEntity.element.height = this.crosshairEntity.element.width,
    this.ricochetTime > this.timestamp) {
        var a = Utils.lookAt(e.x, e.z, this.ricochetPosition.x, this.ricochetPosition.z);
        this.ricochetIndictator.element.opacity = pc.math.lerp(this.ricochetIndictator.element.opacity, 0, .1),
        this.ricochetIndictator.setLocalEulerAngles(0, 0, a * pc.math.RAD_TO_DEG - i)
    }
    if (this.damageTime > this.timestamp) {
        var n = Utils.lookAt(e.x, e.z, this.damagePosition.x, this.damagePosition.z);
        this.damageIndictator.element.opacity = pc.math.lerp(this.damageIndictator.element.opacity, 0, .05),
        this.leftDamageEntity.element.opacity = pc.math.lerp(this.leftDamageEntity.element.opacity, 0, .01),
        this.rightDamageEntity.element.opacity = pc.math.lerp(this.rightDamageEntity.element.opacity, 0, .01),
        this.damageIndictator.setLocalEulerAngles(0, 0, n * pc.math.RAD_TO_DEG - i)
    }
}
,
Overlay.prototype.setAmmo = function() {
    var t = Math.max(this.movement.currentWeapon.ammo, 0);
    if (this.ammoEntity.element.text = t + "",
    this.focusAmmoEntity.element.text = t + "",
    !this.focusBulletsEntity.enabled)
        return !1;
    this.focusBulletsMask.setLocalEulerAngles(0, 0, -(this.maxAmmoValue - this.movement.currentWeapon.ammo) * this.ammoAngleFactor),
    this.focusBulletsInner.setLocalEulerAngles(0, 0, (this.maxAmmoValue - this.movement.currentWeapon.ammo) * this.ammoAngleFactor),
    this.focusAmmoEntity.setLocalScale(1.5, 1.5, 1.5),
    this.focusAmmoEntity.tween(this.focusAmmoEntity.getLocalScale()).to({
        x: 1,
        y: 1,
        z: 1
    }, .2, pc.CircularInOut).start()
}
,
Overlay.prototype.onShooting = function() {
    this.crosshairEntity.tween(this.crosshairEntity.element).to({
        width: 65,
        height: 65
    }, .045, pc.SineOut).start(),
    this.setAmmo()
}
,
Overlay.prototype.onJumping = function() {
    this.crosshairEntity.tween(this.crosshairEntity.element).to({
        width: 70,
        height: 70
    }, .15, pc.SineOut).start()
}
,
Overlay.prototype.onNotification = function(t, e, i) {
    var a = 35 * -this.notifications.length
      , n = !1;
    if ("message" == t)
        (n = this.notificationMessage.clone()).findByName("Message").element.text = e,
        n.element.width = 7 * (e.length - 23);
    else if ("kill" == t && e.killer && e.killed) {
        var s = e.killer.length + e.killed.length
          , o = e.killedSkin
          , l = e.killerSkin;
        (n = this.notificationKill.clone()).findByName("Gibbon").element.color = e.color,
        n.findByName("Gibbon").element.width = 7 * (e.killer.length + 15),
        n.findByName("Killer").element.text = e.killer,
        n.findByName("Killed").element.text = e.killed,
        n.element.width = 7 * (s + 17);
        var r = this.app.assets.find(o + "-Thumbnail-2");
        n.findByName("KilledPicture").element.textureAsset = r;
        var y = this.app.assets.find(l + "-Thumbnail-2");
        n.findByName("KillerPicture").element.textureAsset = y
    }
    if (!n)
        return !1;
    n.enabled = !0,
    n.setLocalPosition(180, a, 0),
    n.tween(n.getLocalPosition()).to({
        x: 0,
        y: a,
        z: 0
    }, .15, pc.BackOut).start(),
    this.notificationHolder.addChild(n),
    this.notifications.push(n),
    this.entity.sound.play("Whoosh"),
    setTimeout(function(t, e) {
        t.destroy(),
        e.notifications.splice(0, 1)
    }, 3500, n, this)
}
,
Overlay.prototype.onTick = function(t, e) {
    this.isOvertime ? (this.timeEntity.element.text = t,
    this.timeEntity.element.color = pc.colors.health,
    this.timeEntity.element.fontSize = 35) : (this.timeEntity.element.text = Utils.mmss(e),
    this.timeEntity.element.color = pc.colors.white,
    this.timeEntity.element.fontSize = 25),
    t < 0 && !pc.isFinished ? (this.alreadyStarted.enabled = !0,
    this.alreadyStartedCount.element.text = 20 + t) : this.alreadyStarted.enabled = !1,
    t >= 0 && t <= 5 ? (this.countBackEntity.enabled = !0,
    this.countBackEntity.element.text = t,
    this.entity.sound.play("Count")) : (this.countBackEntity.enabled = !1,
    this.isOvertime && !pc.isFinished && this.entity.sound.play("Overtime-Count"))
}
,
Overlay.prototype.onInfoMessage = function(t) {
    this.infoEntity.enabled || (this.infoEntity.enabled = !0,
    this.infoEntity.findByName("Message").element.text = t + "",
    window.onbeforeunload = !1)
}
,
Overlay.prototype.onInfoClose = function() {
    this.infoEntity.enabled = !1
}
,
Overlay.prototype.showPrepare = function() {
    this.prepareEntity.enabled = !0,
    this.prepareEntity.setLocalScale(.5, .5, .5),
    this.prepareEntity.tween(this.prepareEntity.getLocalScale()).to({
        x: 1.5,
        y: 1.5,
        z: 1.5
    }, .1, pc.SineOut).start()
}
,
Overlay.prototype.hidePrepare = function() {
    this.prepareEntity.enabled = !1
}
,
Overlay.prototype.showGameplay = function() {
    var t = this.entity.findByTag("Gameplay");
    for (var e in t) {
        var i = t[e];
        i && (i.enabled = !0)
    }
    this.hideDesktop()
}
,
Overlay.prototype.hideGameplay = function() {
    var t = this.entity.findByTag("Gameplay");
    for (var e in t) {
        var i = t[e];
        i && (i.enabled = !1)
    }
}
,
Overlay.prototype.hideAllGameplay = function() {
    this.hideGameplay();
    var t = this.entity.findByTag("OnlyGame");
    for (var e in t) {
        var i = t[e];
        i && (i.enabled = !1)
    }
}
,
Overlay.prototype.setPing = function(t) {
    this.ping = t
}
,
Overlay.prototype.updateStatsEntity = function(t) {
    if (Date.now() - this.lastStatUpdate < 1e3)
        return !1;
    var e = Math.floor(1e3 / (1e3 * t));
    this.statsEntity.element.text = e + "FPS - " + this.ping + "MS",
    this.lastStatUpdate = Date.now()
}
,
Overlay.prototype.now = function() {
    return this.app._time
}
,
Overlay.prototype.update = function(t) {
    this.updateCrosshair(t),
    this.updateExplosiveIndicator(),
    this.updateStatsEntity(t),
    this.timestamp += t
}
;
var Weapon = pc.createScript("weapon");
Weapon.attributes.add("type", {
    type: "string",
    enum: [{
        Rifle: "Rifle"
    }, {
        Shotgun: "Shotgun"
    }, {
        Sniper: "Sniper"
    }],
    default: "Rifle"
}),
Weapon.attributes.add("isAutomatic", {
    type: "boolean",
    default: !0
}),
Weapon.attributes.add("isRightHanded", {
    type: "boolean",
    default: !1
}),
Weapon.attributes.add("shootTime", {
    type: "number",
    default: .1
}),
Weapon.attributes.add("recoil", {
    type: "number"
}),
Weapon.attributes.add("spread", {
    type: "number",
    default: 500
}),
Weapon.attributes.add("focusSpread", {
    type: "number",
    default: 200
}),
Weapon.attributes.add("damage", {
    type: "number",
    default: 20
}),
Weapon.attributes.add("distanceMultiplier", {
    type: "number",
    default: 1
}),
Weapon.attributes.add("ammo", {
    type: "number",
    default: 20
}),
Weapon.attributes.add("capacity", {
    type: "number",
    default: 20
}),
Weapon.attributes.add("reloadingTime", {
    type: "number",
    default: 2.2
}),
Weapon.attributes.add("cameraShake", {
    type: "number",
    default: 10
}),
Weapon.attributes.add("focusFov", {
    type: "number",
    default: 45
}),
Weapon.attributes.add("barrelName", {
    type: "string"
}),
Weapon.attributes.add("magazineName", {
    type: "string"
}),
Weapon.attributes.add("sliderName", {
    type: "string"
}),
Weapon.attributes.add("sliderLimit", {
    type: "number",
    default: -220
}),
Weapon.attributes.add("hasSlider", {
    type: "boolean"
}),
Weapon.attributes.add("doodahEntity", {
    type: "entity"
}),
Weapon.attributes.add("doodahReference", {
    type: "entity"
}),
Weapon.attributes.add("modelEntity", {
    type: "entity"
}),
Weapon.attributes.add("armEntity", {
    type: "entity"
}),
Weapon.attributes.add("magazinePoint", {
    type: "entity"
}),
Weapon.attributes.add("barrelPoint", {
    type: "entity"
}),
Weapon.attributes.add("bulletPoint", {
    type: "entity"
}),
Weapon.attributes.add("muzzlePoint", {
    type: "entity"
}),
Weapon.attributes.add("handPoint", {
    type: "entity"
}),
Weapon.attributes.add("ammoEntity", {
    type: "entity"
}),
Weapon.attributes.add("scopeOverlay", {
    type: "entity"
}),
Weapon.prototype.initialize = function() {
    this.currentDoodahSpeed = 0,
    this.player = !1,
    this.locked = !1,
    this.doodahEntity && (this.doodahReference.setLocalPosition(this.entity.findByName("DoodahPoint").getLocalPosition()),
    this.accessory = this.doodahEntity.findByName("Model")),
    this.hasSlider && (this.slider = this.entity.findByName(this.sliderName),
    this.bounceZ = 0,
    this.sliderStartPosition = this.slider.getLocalPosition().clone()),
    this.magazineName && (this.magazine = this.entity.findByName(this.magazineName),
    this.magazine.reparent(this.magazinePoint)),
    this.barrelName && (this.barrel = this.entity.findByName(this.barrelName),
    this.barrel.reparent(this.barrelPoint)),
    this.app.on("Weapon:Lock", this.onLockChange, this)
}
,
Weapon.prototype.onLockChange = function(t) {
    this.locked = t
}
,
Weapon.prototype.prepare = function() {
    this.armEntity.setLocalPosition(this.handPoint.getLocalPosition().clone())
}
,
Weapon.prototype.hideArms = function() {
    this.armEntity.setLocalPosition(this.handPoint.getLocalPosition().clone()),
    this.armEntity.tween(this.armEntity.getLocalPosition()).to({
        x: -.3,
        y: -1.2,
        z: 0
    }, .2, pc.BackInOut).start()
}
,
Weapon.prototype.magazineThrow = function() {
    this.barrelPoint && (this.barrelPoint.tween(this.barrelPoint.getLocalEulerAngles()).rotate({
        x: 0,
        y: 0,
        z: -55
    }, .4, pc.BackInOut).start(),
    this.ammoEntity.setLocalPosition(-500, 0, 0),
    this.ammoEntity.tween(this.ammoEntity.getLocalPosition()).to({
        x: 0,
        y: 0,
        z: 0
    }, .2, pc.BackInOut).delay(.3).start(),
    setTimeout(function(t) {
        t.entity.sound.play("Bullet-Put"),
        t.entity.sound.play("Whoosh")
    }, 350, this)),
    this.magazinePoint.setLocalPosition(0, 0, 0),
    this.magazinePoint.setLocalEulerAngles(0, 0, 0),
    this.magazinePoint.tween(this.magazinePoint.getLocalPosition()).to({
        x: .5,
        y: -7,
        z: 0
    }, .4, pc.BackInOut).start(),
    this.magazinePoint.tween(this.magazinePoint.getLocalEulerAngles()).rotate({
        x: 0,
        y: 0,
        z: 30
    }, .3, pc.BackInOut).start(),
    this.entity.sound.play("Unload"),
    this.app.fire("Player:Shake", !0)
}
,
Weapon.prototype.magazineAttach = function() {
    this.barrelPoint && this.barrelPoint.tween(this.barrelPoint.getLocalEulerAngles()).rotate({
        x: 0,
        y: 0,
        z: 0
    }, .2, pc.BackInOut).start(),
    this.magazinePoint.tween(this.magazinePoint.getLocalPosition()).to({
        x: 0,
        y: 0,
        z: 0
    }, .2, pc.BackInOut).start(),
    this.magazinePoint.tween(this.magazinePoint.getLocalEulerAngles()).rotate({
        x: 0,
        y: 0,
        z: 0
    }, .2, pc.BackInOut).start();
    var t = this.handPoint.getLocalPosition().clone();
    this.armEntity.tween(this.armEntity.getLocalPosition()).to({
        x: t.x,
        y: t.y,
        z: t.z
    }, .2, pc.BackInOut).delay(.2).start(),
    this.entity.sound.play("Load"),
    this.app.fire("Player:Shake", !0)
}
,
Weapon.prototype.shoot = function() {
    this.entity.sound.slots.Fire.pitch = 1 - .1 * Math.random(),
    this.entity.sound.play("Fire"),
    this.bounceZ = this.sliderLimit,
    "Sniper" == this.entity.name && setTimeout(function(t) {
        t.entity.sound.play("Reload")
    }, 700, this)
}
,
Weapon.prototype.focus = function() {
    this.entity.sound.slots.Focus && (this.entity.sound.slots.Focus.pitch = 1 - .1 * Math.random(),
    this.entity.sound.play("Focus"))
}
,
Weapon.prototype.stopShooting = function() {
    this.isAutomatic && (this.entity.sound.stop("Fire"),
    this.entity.sound.play("Tail"))
}
,
Weapon.prototype.reload = function() {
    this.entity.sound.play("Reload"),
    this.bounceZ = this.sliderLimit
}
,
Weapon.prototype.updateDoodah = function() {
    if (!this.player)
        return !1;
    var t = .01 * this.player.rigidbody.linearVelocity.length();
    t = Math.max(t, .1);
    var e = this.doodahReference.getPosition()
      , i = e.clone().sub(this.doodahEntity.getPosition()).length()
      , a = .8 * Math.cos(.0095 * this.app._time) * this.currentDoodahSpeed * t;
    this.currentDoodahSpeed = i > .16 && t > .1 ? pc.math.lerp(this.currentDoodahSpeed, i, .5) : pc.math.lerp(this.currentDoodahSpeed, 0, .01),
    this.accessory && this.accessory.setLocalEulerAngles(0, 0, 500 * a),
    this.doodahReference.setLocalPosition(a, 0, 0),
    this.doodahEntity.lookAt(e)
}
,
Weapon.prototype.update = function(t) {
    if (this.locked)
        return !1;
    this.hasSlider && (this.slider.setLocalPosition(this.sliderStartPosition.x + this.bounceZ, this.sliderStartPosition.y, this.sliderStartPosition.z),
    this.bounceZ = pc.math.lerp(this.bounceZ, 0, .1)),
    this.doodahEntity && this.updateDoodah(t)
}
;
var EffectManager = pc.createScript("effectManager");
EffectManager.attributes.add("shootRay", {
    type: "entity"
}),
EffectManager.attributes.add("shootRayCount", {
    type: "number"
}),
EffectManager.attributes.add("impactEntity", {
    type: "entity"
}),
EffectManager.attributes.add("splashEntity", {
    type: "entity"
}),
EffectManager.attributes.add("hitEntity", {
    type: "entity"
}),
EffectManager.attributes.add("explosionSmokeEntity", {
    type: "entity"
}),
EffectManager.attributes.add("bulletEntity", {
    type: "entity"
}),
EffectManager.attributes.add("skullEntity", {
    type: "entity"
}),
EffectManager.attributes.add("bulletTranslate", {
    type: "vec3"
}),
EffectManager.attributes.add("bulletRotate", {
    type: "vec3"
}),
EffectManager.attributes.add("maxBulletTime", {
    type: "number",
    default: 2
}),
EffectManager.attributes.add("cameraEntity", {
    type: "entity"
}),
EffectManager.attributes.add("garbageEntity", {
    type: "entity"
}),
EffectManager.attributes.add("bulletHolder", {
    type: "entity"
}),
EffectManager.attributes.add("mapEntity", {
    type: "entity"
}),
EffectManager.attributes.add("networkEntity", {
    type: "entity"
}),
EffectManager.attributes.add("grenadeEntity", {
    type: "entity"
}),
EffectManager.attributes.add("throwPower", {
    type: "number",
    default: 1e3
}),
EffectManager.attributes.add("grenadeTime", {
    type: "number",
    default: 1.5
}),
EffectManager.attributes.add("explosionEntity", {
    type: "entity"
}),
EffectManager.attributes.add("loudSoundEntity", {
    type: "entity"
}),
EffectManager.attributes.add("impactSoundEntity", {
    type: "entity"
}),
EffectManager.attributes.add("traceEntity", {
    type: "entity"
}),
EffectManager.attributes.add("shurikenEntity", {
    type: "entity"
}),
EffectManager.attributes.add("explosionEffect", {
    type: "entity"
}),
EffectManager.attributes.add("killSphereEntity", {
    type: "entity"
}),
EffectManager.attributes.add("testBox", {
    type: "entity"
}),
EffectManager.attributes.add("breakable", {
    type: "string",
    array: !0
}),
EffectManager.attributes.add("impactable", {
    type: "string",
    array: !0
}),
EffectManager.prototype.initialize = function() {
    this.timestamp = 0,
    this.shootRays = [],
    this.impactParticles = [],
    this.sparkParticles = [],
    this.hitParticles = [],
    this.bullets = [],
    this.skullAnimation = !1,
    this.grenades = [],
    this.sparkIndex = 0,
    this.bulletIndex = 0,
    this.shootRayIndex = 0,
    this.shurikenSpread = 0,
    this.thunderTimer = !1,
    this.app.on("EffectManager:Fire", this.onFire, this),
    this.app.on("EffectManager:Bullet", this.onBulletThrow, this),
    this.app.on("EffectManager:Throw", this.onThrow, this),
    this.app.on("EffectManager:Hit", this.onHit, this),
    this.app.on("EffectManager:Skull", this.onSkullShow, this),
    this.app.on("EffectManager:KillSphere", this.onKillSphere, this),
    this.app.on("EffectManager:Shuriken", this.onShuriken, this),
    this.app.on("EffectManager:DealHit", this.dealHitEntity, this),
    this.app.on("Map:Loaded", this.onMapLoaded, this),
    this.app.on("Game:Finish", this.onGameFinish, this),
    this.impactBatching(),
    this.hitBatching(),
    this.shootRayBatching(),
    this.bulletBatching(),
    this.grenadeEntity.enabled = !1,
    this.splashEntity.splash1 = this.splashEntity.findByName("Splash1"),
    this.splashEntity.splash2 = this.splashEntity.findByName("Splash2"),
    this.lastSpark = Date.now(),
    this.lastSmoke = Date.now()
}
,
EffectManager.prototype.onKillSphere = function(t) {
    this.killSphereEntity.enabled = !0,
    this.killSphereEntity.setPosition(t),
    this.killSphereEntity.setLocalScale(.1, .1, .1);
    var e = this.killSphereEntity.model.meshInstances[0].material;
    e.opacity = 1;
    var i = this.killSphereEntity.tween(this.killSphereEntity.getLocalScale()).to({
        x: 15,
        y: 15,
        z: 15
    }, .3, pc.CircularOut);
    i.on("update", function(t) {
        e.opacity = pc.math.lerp(e.opacity, 0, .06),
        e.update()
    }),
    i.start(),
    clearTimeout(this.killSphereTimer),
    this.killSphereTimer = setTimeout(function(t) {
        t.killSphereEntity.enabled = !1
    }, 300, this)
}
,
EffectManager.prototype.onSkullShow = function(t) {
    var e = t.clone().add(new pc.Vec3(0,2,0));
    e.clone().add(new pc.Vec3(2,0,2));
    this.skullEntity.setLocalPosition(e),
    this.skullEntity.sprite.play("Fire"),
    this.skullAnimation && this.skullAnimation.stop(),
    this.skullAnimation = this.skullEntity.tween(this.skullEntity.getLocalPosition()).to({
        y: e.y + 1
    }, 1, pc.SineOut),
    this.skullAnimation.start()
}
,
EffectManager.prototype.onMapLoaded = function() {
    setTimeout(function(t) {
        t.updateLight()
    }, 5e3, this);
    var t = this.app.root.findByTag("Rain")
      , e = this.app.root.findByTag("Snow")
      , i = this.app.root.findByName("RainDrops");
    e.length > 0 ? i.enabled = !0 : t.length > 0 ? (i.enabled = !0,
    setTimeout(function(t) {
        t.thunder()
    }, 5e3, this)) : (i.enabled = !1,
    clearTimeout(this.thunderTimer))
}
,
EffectManager.prototype.thunder = function() {
    if (pc.settings && !0 === pc.settings.disableSpecialEffects)
        return !1;
    var t = 40 + 40 * Math.random();
    this.app.fire("Map:Thunder", !0),
    this.thunderTimer = setTimeout(function(t) {
        t.thunder()
    }, 1e3 * t, this)
}
,
EffectManager.prototype.updateLight = function() {
    var t = this.app.root.findByName("Light");
    t && t.light && (t.light.shadowUpdateMode = pc.SHADOWUPDATE_THISFRAME,
    t.light.updateShadow())
}
,
EffectManager.prototype.impactBatching = function() {
    for (var t = 0; t < this.shootRayCount; t++) {
        var e = this.impactEntity.clone();
        e.sprite1 = e.findByName("Sprite1").sprite,
        e.sprite2 = e.findByName("Sprite2").sprite,
        e.sprite3 = e.findByName("Sprite3").sprite,
        e.sprite4 = e.findByName("Sprite4").sprite,
        e.hole = e.findByName("Hole"),
        e.setPosition(Utils.nullVector),
        this.impactParticles.push(e),
        this.garbageEntity.addChild(e)
    }
}
,
EffectManager.prototype.hitBatching = function() {
    for (var t = 0; t < this.shootRayCount; t++) {
        var e = this.hitEntity.clone();
        e.sprite = e.findByName("Sprite").sprite,
        e.setPosition(Utils.nullVector),
        this.hitParticles.push(e),
        this.garbageEntity.addChild(e)
    }
}
,
EffectManager.prototype.shootRayBatching = function() {
    for (var t = 0; t < this.shootRayCount; t++) {
        var e = this.shootRay.clone();
        e.sprite1 = e.findByName("RaySmoke1").sprite,
        e.sprite2 = e.findByName("RaySmoke2").sprite,
        e.trace = e.findByName("Trace"),
        e.setPosition(Utils.nullVector),
        this.shootRays.push(e),
        this.garbageEntity.addChild(e)
    }
    this.shootRay.destroy()
}
,
EffectManager.prototype.bulletBatching = function() {
    for (var t = 0; t < this.shootRayCount; t++) {
        var e = this.bulletEntity.clone();
        e.setPosition(Utils.nullVector),
        this.bullets.push(e),
        this.bulletHolder.addChild(e)
    }
}
,
EffectManager.prototype.breakDamageRadius = function(t) {
    for (var e in this.breakable) {
        var i = this.breakable[e]
          , a = this.entity.root.findByTag(i);
        for (var s in a) {
            var n = a[s]
              , o = n.getPosition().clone();
            t.clone().sub(o).length() < 10 && n && n.parent && (this.entity.setPosition(n.getPosition().clone()),
            this.entity.sound.play(i),
            n && n.parent && n.parent.destroy())
        }
    }
}
,
EffectManager.prototype.checkEntityBreakable = function(t) {
    var e = t.tags.list();
    for (var i in this.breakable) {
        var a = this.breakable[i];
        t && e.indexOf(a) > -1 && t.parent && (this.entity.setPosition(t.getPosition().clone()),
        this.entity.sound.play(a),
        t && t.parent && t.parent.destroy())
    }
}
,
EffectManager.prototype.onThrow = function(t, e, i, a, s) {
    var n = this.throwPower;
    "Star" == t && (n *= 1.3);
    var o = i.scale(n)
      , r = this.grenadeEntity.clone();
    r.setPosition(e),
    r.enabled = !0,
    r.type = t,
    r.startTime = Date.now(),
    r.owner = a,
    r.hasSpell = s,
    r.self = this,
    r.exploded = !1,
    this.traceEntity.reparent(r),
    this.traceEntity.particlesystem && this.traceEntity.particlesystem.reset();
    try {
        this.traceEntity.particlesystem.play()
    } catch (t) {}
    r.collision.on("collisionstart", function(t) {
        var e = this.entity.self
          , i = !1;
        pc.isFinished || this.entity.sound.play("Collision"),
        t && t.contacts && t.contacts.length > 0 && (i = t.contacts[0].point),
        t.other && "Player" == t.other.name && Date.now() - this.entity.startTime > 50 && "Star" == this.entity.type ? pc.app.fire("Network:Hurt", this.entity.type, this.entity.owner) : t.other && this.entity.self.checkEntityBreakable(t.other),
        "Star" == this.entity.type && Date.now() - this.entity.startTime > 50 && (this.entity.rigidbody.linearVelocity.x = 0,
        this.entity.rigidbody.linearVelocity.y = 0,
        this.entity.rigidbody.linearVelocity.z = 0,
        this.entity.collision.enabled = !1,
        this.entity.rigidbody.enabled = !1,
        this.entity.star.script.rotate.enabled = !1,
        i && (Date.now() - e.lastSmoke > 700 && (e.explosionSmokeEntity.setLocalScale(2, 2, 2),
        e.explosionSmokeEntity.setPosition(i),
        e.explosionSmokeEntity.particlesystem.reset(),
        e.explosionSmokeEntity.particlesystem.play(),
        e.lastSmoke = Date.now()),
        this.entity.holder.setPosition(i),
        console.log("Point damage : ", t.other.name)),
        this.entity.sound.play("Stuck"),
        this.entity.sound.stop("Loop"))
    }),
    body = r.rigidbody.body,
    body.setCcdMotionThreshold(1),
    body.setCcdSweptSphereRadius(.2),
    r.rigidbody.applyImpulse(o),
    r.explode = function() {
        this && this.self.setExplosion(this)
    }
    ,
    this.garbageEntity.addChild(r),
    this.grenades.push(r),
    setTimeout(function(t) {
        t.traceEntity.reparent(t.garbageEntity)
    }, 1e3 * this.grenadeTime - 700, this),
    setTimeout(function(t, e) {
        e.explode()
    }, 1e3 * this.grenadeTime, this, r),
    this.app.fire("Overlay:Explosive", r)
}
,
EffectManager.prototype.setExplosion = function(t) {
    if (t.exploded)
        return !1;
    var e = t.getPosition().clone();
    Math.round(1 * Math.random()),
    t.type,
    t.ownerId;
    t.exploded = !0,
    "Grenade" == t.type && (this.loudSoundEntity.setPosition(e),
    this.loudSoundEntity.sound.play("Explosion-1"),
    this.explosionEntity.setPosition(e),
    this.explosionEntity.findByName("Sprite").sprite.play("Fire"),
    this.explosionSmokeEntity.setLocalScale(10, 10, 10),
    this.explosionSmokeEntity.setPosition(e),
    this.explosionSmokeEntity.particlesystem.reset(),
    this.explosionSmokeEntity.particlesystem.play()),
    this.app.fire("Player:Shake", !0),
    pc.isFinished || "Grenade" == t.type && (this.app.fire("Network:RadiusEffect", "Grenade", t.getPosition(), t.owner),
    t.hasSpell && this.app.fire("Spell:Wind", t.getPosition())),
    "Grenade" == t.type && (this.breakDamageRadius(t.getPosition()),
    this.lastSmoke = Date.now());
    for (var i = this.grenades.length; i--; )
        this.grenades[i]._guid == t._guid && this.grenades.splice(i, 1);
    t.destroy()
}
,
EffectManager.prototype.onGameFinish = function() {
    for (var t = this.grenades.length; t--; )
        this.grenades[t] && this.grenades[t].destroy();
    this.grenades = []
}
,
EffectManager.prototype.onBulletThrow = function(t, e) {
    var i = Math.round(30 * Math.random())
      , a = e.clone().add(new pc.Vec3(i,i,i))
      , s = this.bullets[this.bulletIndex];
    s.setPosition(t),
    s.setEulerAngles(a),
    s.time = 0,
    this.bulletIndex++,
    this.bulletIndex > this.shootRayCount - 1 && (this.bulletIndex = 0)
}
,
EffectManager.prototype.updateBullets = function(t) {
    for (var e = this.bullets.length; e--; )
        this.bullets[e].time > this.maxBulletTime ? this.bullets[e].setPosition(Utils.nullVector) : (this.bullets[e].time += t,
        this.bullets[e].rotateLocal(this.bulletRotate.x * t, this.bulletRotate.y * t, this.bulletRotate.z * t),
        this.bullets[e].translateLocal(this.bulletTranslate.x * t, this.bulletTranslate.y * t, this.bulletTranslate.z * t))
}
,
EffectManager.prototype.onShuriken = function(t, e, i, a, s) {
    var n = Math.floor(15 * Math.random() + 40)
      , o = e[this.shurikenSpread]
      , r = new pc.Vec3(o.x,o.y,o.z).sub(t.clone()).normalize().scale(100).add(t)
      , l = this.testRaycast(t, r)
      , p = r;
    l && (p = l.point);
    var h = this.shurikenEntity.clone();
    h.setLocalPosition(t),
    h.lookAt(p),
    h.enabled = !0,
    h.ray = h.findByName("Ray"),
    h.shurikenModel = h.findByName("Model"),
    s && (h.shurikenModel.enabled = !1),
    h.tween(h.getLocalPosition()).to({
        x: p.x,
        y: p.y,
        z: p.z
    }, .2, pc.Linear).start(),
    l && setTimeout(function(t, e, a) {
        t.ray.enabled = !1,
        a && e.dealHitEntity("Shuriken", a, n, i, !0)
    }, 50, h, this, l),
    setTimeout(function(t) {
        t.destroy()
    }, 1e3, h),
    this.garbageEntity.addChild(h),
    this.shurikenSpread++,
    this.shurikenSpread > 2 && (this.shurikenSpread = 0)
}
,
EffectManager.prototype.testRaycast = function(t, e, i, a, s) {
    i || (i = 0,
    a = 0,
    s = 0);
    var n = e.add(new pc.Vec3(i,a,s))
      , o = this.app.systems.rigidbody.raycastFirst(t, n);
    return o || !1
}
,
EffectManager.prototype.onHit = function(t, e, i, a, s) {
    var n = []
      , o = .1
      , r = 15;
    "Dash" == t && (r = 36,
    o = .2);
    for (var l = 0; l < r; l++) {
        var p = Math.cos(l / r) * o
          , h = Math.sin(l / r) * o
          , y = Math.cos(l / r) * o
          , c = this.testRaycast(e, i, p, h, y);
        c && n.push(c)
    }
    var d = !1;
    for (var f in n) {
        var u = n[f]
          , m = u.entity.tags.list();
        for (var g in this.breakable) {
            var E = this.breakable[g];
            m.indexOf(E) > -1 && !d && (d = u)
        }
    }
    !d && n.length > 0 && (d = n[0]),
    d && d.point && this.dealHitEntity(t, d, s, a)
}
,
EffectManager.prototype.dealHitEntity = function(t, e, i, a, s) {
    if (!e || !e.entity)
        return !1;
    var n = this.shootRayIndex
      , o = e.entity.tags.list()
      , r = pc.setFromNormal(e.normal)
      , l = 2 * Math.random() + 1;
    if (o.indexOf("Player") > -1) {
        var p = this.hitParticles[n];
        if (p.setPosition(e.point),
        p.setEulerAngles(r),
        p.setLocalScale(l, l, l),
        p.sprite.stop(),
        pc.controls.player.playerId == a && i > 0) {
            var h = e.entity
              , y = !1
              , c = e.point.clone().sub(h.getPosition().clone());
            h && h.script && h.script.enemy && (h.script.enemy.damage(a, i, c),
            "-1" !== h.script.enemy.playerId && (y = !0),
            s && h.script.enemy.dealSpell(t),
            y && this.app.fire("Hit:Point", h, i)),
            this.entity.setPosition(e.point),
            this.entity.sound.play("Impact-Iron"),
            y && p.sprite.play("Impact")
        }
    } else if (o.indexOf("Explosive") > -1)
        e.entity.explode();
    else {
        Math.round(180 * Math.random());
        var d = this.impactParticles[n];
        for (var f in d.setPosition(e.point),
        d.setEulerAngles(r),
        d.setLocalScale(l, l, l),
        d.sprite1.play("Impact"),
        d.sprite2.play("Impact"),
        d.sprite3.play("Impact"),
        d.sprite4.play("Impact"),
        this.breakable) {
            var u = this.breakable[f];
            o.indexOf(u) > -1 && (this.entity.setPosition(e.point),
            this.entity.sound.play(u),
            e.entity.parent && e.entity.parent.destroy())
        }
        if (Math.random() > .4 || "Melee" == t || "Shuriken" == t || "Dash" == t)
            for (var m in this.impactable) {
                var g = this.impactable[m];
                o.indexOf(g) > -1 && this.playMaterialImpact(g, e, t)
            }
        "Shuriken" == t ? (this.entity.setPosition(e.point),
        this.entity.sound.slots["Impact-Iron-Light"].pitch = .1 * Math.random() + 1,
        this.entity.sound.play("Impact-Iron-Light")) : "Melee" != t && "Dash" != t || (this.entity.setPosition(e.point),
        this.entity.sound.slots["Impact-Iron"].pitch = .1 * Math.random() + 1,
        this.entity.sound.play("Impact-Iron")),
        Date.now() - this.lastSmoke > 700 && (this.explosionSmokeEntity.setLocalScale(2, 2, 2),
        this.explosionSmokeEntity.setPosition(e.point),
        this.explosionSmokeEntity.particlesystem.reset(),
        this.explosionSmokeEntity.particlesystem.play(),
        this.lastSmoke = Date.now())
    }
}
,
EffectManager.prototype.onFire = function(t, e, i, a, s, n, o) {
    if (0 === this.shootRays.length)
        return !1;
    var r = this.shootRayIndex
      , l = (this.sparkIndex,
    this.app.systems.rigidbody.raycastFirst(t, e));
    if (l) {
        var p = 1;
        if (o) {
            var h = t.clone().sub(l.point.clone()).length();
            h > 10 && (p *= o),
            h > 30 && (p *= o),
            s *= p
        }
        var y = pc.setFromNormal(l.normal)
          , c = 2 * Math.random() + 1
          , d = l.entity.tags.list();
        if (d.indexOf("Player") > -1) {
            var f = this.hitParticles[r];
            if (f.setPosition(l.point),
            f.setEulerAngles(y),
            f.setLocalScale(c, c, c),
            f.sprite.stop(),
            l.entity && l.entity.script && l.entity.script.enemy)
                "-1" !== l.entity.script.enemy.playerId && f.sprite.play("Impact")
        } else if (d.indexOf("Water") > -1)
            this.entity.setPosition(l.point),
            this.entity.sound.play("Water-Splash"),
            this.splashEntity.setPosition(l.point),
            this.splashEntity.splash1.sprite.stop(),
            this.splashEntity.splash2.sprite.stop(),
            this.splashEntity.splash1.sprite.play("Fire"),
            this.splashEntity.splash2.sprite.play("Fire");
        else if (d.indexOf("Explosive") > -1)
            l.entity.explode();
        else {
            var u = Math.round(180 * Math.random())
              , m = this.impactParticles[r];
            if (m.setPosition(l.point),
            m.setEulerAngles(y),
            m.setLocalScale(c, c, c),
            m.sprite1.play("Impact"),
            m.sprite2.play("Impact"),
            m.sprite3.play("Impact"),
            m.sprite4.play("Impact"),
            "Shotgun" != n && (Math.random() > .4 || "Melee" == n))
                for (var g in this.impactable) {
                    var E = this.impactable[g];
                    d.indexOf(E) > -1 && this.playMaterialImpact(E, l, n)
                }
            for (var b in this.breakable) {
                var M = this.breakable[b];
                d.indexOf(M) > -1 && (this.entity.setPosition(l.point),
                this.entity.sound.play(M),
                l.entity.parent.destroy())
            }
            Date.now() - this.lastSmoke > 700 && (this.explosionSmokeEntity.setLocalScale(2, 2, 2),
            this.explosionSmokeEntity.setPosition(l.point),
            this.explosionSmokeEntity.particlesystem.reset(),
            this.explosionSmokeEntity.particlesystem.play(),
            this.lastSmoke = Date.now()),
            m.hole.setLocalScale(.17, .17, .17),
            m.hole.setLocalEulerAngles(0, u, 0)
        }
        if (pc.controls.player.playerId == a && l.entity.tags.list().indexOf("Player") > -1) {
            var S = l.entity
              , k = l.point.clone().sub(S.getPosition().clone());
            S && S.script && S.script.enemy && S.script.enemy.damage(a, s, k)
        }
    }
    if ("Melee" != n) {
        pc.controls.player.playerId != a && this.calculateRichotte(t, e, a, r);
        var x = this.shootRays[r];
        x.setPosition(i),
        x.lookAt(e),
        x.sprite1.stop(),
        x.sprite1.play("Fire"),
        x.sprite2.stop(),
        x.sprite2.play("Fire"),
        "Shotgun" == n ? (x.sprite1.opacity = .1,
        x.sprite1.speed = 1.2,
        x.sprite2.opacity = .1,
        x.sprite2.speed = 1.2) : "Sniper" == n ? (x.sprite1.opacity = .9,
        x.sprite1.speed = .5,
        x.sprite2.opacity = .9,
        x.sprite2.speed = .5) : s > 40 ? (x.sprite1.opacity = .3,
        x.sprite1.speed = .7,
        x.sprite2.opacity = .3,
        x.sprite2.speed = .7) : (x.sprite1.opacity = .1,
        x.sprite1.speed = 1.2,
        x.sprite2.opacity = .1,
        x.sprite2.speed = 1.2),
        x.trace.setLocalPosition(0, 0, -5),
        pc.controls.player.playerId == a ? x.trace.tween(x.trace.getLocalPosition()).to({
            x: 0,
            y: 0,
            z: -300
        }, 2, pc.Linear).start() : x.trace.tween(x.trace.getLocalPosition()).to({
            x: 0,
            y: 0,
            z: -300
        }, 1, pc.Linear).start()
    }
    this.shootRayIndex++,
    this.shootRayIndex > this.shootRayCount - 1 && (this.shootRayIndex = 0)
}
,
EffectManager.prototype.playMaterialImpact = function(t, e, i) {
    var a = Math.round(1 * Math.random()) + 1;
    this.impactSoundEntity.setPosition(e.point),
    this.impactSoundEntity.sound.play(t + "-" + a),
    Math.random() > .4 && "Melee" != i && this.impactSoundEntity.sound.play("Ricochet-" + a)
}
,
EffectManager.prototype.pointDamage = function(t, e, i, a, s) {
    if (pc.controls.player.playerId == i) {
        var n = e.clone().sub(t.getPosition().clone());
        t && t.script && t.script.enemy && (t.script.enemy.damage(i, a, n),
        this.app.fire("Network:PointEffect", pc.controls.player.playerId, s, e, i))
    }
}
,
EffectManager.prototype.calculateRichotte = function(t, e, i, a) {
    var s = pc.controls.entity.getPosition().clone()
      , n = Utils.closestPointLine({
        x: s.x,
        y: s.z
    }, {
        x: t.x,
        y: t.z
    }, {
        x: e.x,
        y: e.z
    });
    if (n && n.point) {
        var o = new pc.Vec3(n.point.x,s.y,n.point.y)
          , r = Math.random()
          , l = s.clone().sub(o).length();
        if (r > .5 && l < 3) {
            var p = "FlyBy-" + (Math.round(1 * Math.random()) + 2);
            this.entity.setPosition(o),
            this.entity.sound.play(p),
            this.app.fire("Overlay:Ricochet", o)
        }
    }
}
,
EffectManager.prototype.update = function(t) {
    this.updateBullets(t);
    var e = this.cameraEntity.getPosition();
    this.explosionEntity.lookAt(e),
    this.skullEntity.lookAt(e)
}
;
var WeaponManager = pc.createScript("weaponManager");
WeaponManager.attributes.add("defaultWeapon", {
    type: "string",
    default: "Scar"
}),
WeaponManager.attributes.add("armLeftEntity", {
    type: "entity"
}),
WeaponManager.attributes.add("armRightEntity", {
    type: "entity"
}),
WeaponManager.attributes.add("weaponHolder", {
    type: "entity"
}),
WeaponManager.attributes.add("muzzleEntity", {
    type: "entity"
}),
WeaponManager.attributes.add("flameSpeed", {
    type: "number",
    default: .1
}),
WeaponManager.attributes.add("maxFlameScale", {
    type: "number",
    default: 3
}),
WeaponManager.prototype.initialize = function() {
    this.currentWeapon = !1,
    this.currentWeaponEntity = !1,
    this.isShooting = 0,
    this.isAnimatedSkin = !1,
    this.videoTexture = !1,
    this.currentFlameScale = 0,
    this.currentFlameAngle = 0,
    this.movement = this.entity.script.movement,
    this.weaponSkins = {},
    this.currentCharm = "Default-Charm.glb",
    this.app.on("WeaponManager:Skins", this.setSkins, this),
    this.app.on("WeaponManager:Set", this.setWeapon, this),
    this.app.on("WeaponManager:SetSkin", this.setSkin, this),
    this.app.on("WeaponManager:SetCharm", this.setCharm, this),
    pc.session && pc.session.weapon ? this.setWeapon(pc.session.weapon) : this.setWeapon(this.defaultWeapon)
}
,
WeaponManager.prototype.setSkins = function(e) {
    this.weaponSkins = e,
    e && setTimeout(function(e) {
        pc.session && pc.session.weapon ? e.setWeapon(pc.session.weapon) : e.setWeapon(e.defaultWeapon)
    }, 500, this)
}
,
WeaponManager.prototype.setWeapon = function(e) {
    if (this.movement.isReloading > this.movement.timestamp)
        return !1;
    if (pc.isFinished)
        return !1;
    this.weaponHolder.findByTag("Weapon").forEach(function(e) {
        e.enabled = !1
    });
    var t = this.weaponHolder.findByName(e);
    t.enabled = !0,
    this.currentWeapon = t.script.weapon,
    this.currentWeapon.prepare(),
    this.currentWeaponEntity = t.findByName("Model"),
    this.setMuzzleParent(),
    this.setCosmetics(e),
    this.armLeftEntity.enabled = !this.currentWeapon.isRightHanded,
    this.armRightEntity.enabled = this.currentWeapon.isRightHanded,
    this.entity.script.movement.setCurrentWeapon(),
    this.app.fire("Network:Weapon", e),
    this.app.fire("Player:Inspect", !0),
    this.app.fire("Overlay:CircularSelect", e),
    this.app.fire("Overlay:Weapon", e)
}
,
WeaponManager.prototype.setCosmetics = function(e) {
    this.weaponSkins[e] && this.setSkin(this.weaponSkins[e]),
    this.setAccessory(this.currentCharm)
}
,
WeaponManager.prototype.setCharm = function(e) {
    this.currentCharm = e,
    this.setAccessory(e)
}
,
WeaponManager.prototype.createAnimatedSkin = function(e) {
    var t = this.app
      , a = e.replace(".jpg", ".mp4")
      , n = this.app.assets.find(a)
      , i = new pc.Texture(t.graphicsDevice,{
        format: pc.PIXELFORMAT_R5_G6_B5,
        autoMipmap: !1
    });
    i.minFilter = pc.FILTER_LINEAR,
    i.magFilter = pc.FILTER_LINEAR,
    i.addressU = pc.ADDRESS_CLAMP_TO_EDGE,
    i.addressV = pc.ADDRESS_CLAMP_TO_EDGE;
    var s = document.createElement("video");
    return s.addEventListener("canplay", function(e) {
        i.setSource(s)
    }),
    s.setAttribute("webkit-playsinline", "webkit-playsinline"),
    s.muted = !0,
    s.src = n.getFileUrl(),
    s.crossOrigin = "anonymous",
    s.loop = !0,
    s.play(),
    this.isAnimatedSkin = !0,
    this.videoTexture = i,
    i
}
,
WeaponManager.prototype.setSkin = function(e) {
    if (e && this.currentWeaponEntity) {
        var t = this.currentWeaponEntity.model.material.clone()
          , a = !1;
        e.search("Animated") > -1 ? (a = this.createAnimatedSkin(e),
        t.diffuseMap = a,
        t.update()) : (a = this.app.assets.find(e),
        this.app.assets.load(a),
        a.ready(function(e) {
            t.diffuseMap = a.resource,
            t.update()
        }));
        for (var n = this.currentWeaponEntity.model.meshInstances, i = 0; i < n.length; ++i) {
            n[i].material = t
        }
    }
}
,
WeaponManager.prototype.setAccessory = function(e) {
    if (e && this.currentWeaponEntity && this.currentWeapon.doodahEntity) {
        var t = this.app.assets.find(e)
          , a = this.currentWeapon.doodahEntity.findByName("Model");
        t && a && (a.model.asset = t)
    }
}
,
WeaponManager.prototype.setMuzzleParent = function() {
    this.muzzleEntity.reparent(this.currentWeapon.muzzlePoint)
}
,
WeaponManager.prototype.triggerShooting = function() {
    this.currentFlameScale = Math.random() * (this.maxFlameScale / 2) + this.maxFlameScale,
    this.currentFlameAngle = 360 * Math.random()
}
,
WeaponManager.prototype.setAnimation = function(e) {
    this.currentFlameScale = pc.math.lerp(this.currentFlameScale, .001, this.flameSpeed),
    this.currentFlameAngle = pc.math.lerpAngle(this.currentFlameAngle, .001, .1),
    this.muzzleEntity.setLocalScale(this.currentFlameScale, this.currentFlameScale, this.currentFlameScale),
    this.muzzleEntity.setLocalEulerAngles(0, 0, this.currentFlameAngle)
}
,
WeaponManager.prototype.update = function(e) {
    this.setAnimation(),
    this.isAnimatedSkin && this.videoTexture && this.videoTexture.upload()
}
;
var Sprite = pc.createScript("sprite");
Sprite.attributes.add("type", {
    type: "string",
    enum: [{
        blending: "blending"
    }, {
        "animated-2d": "animated-2d"
    }],
    default: "blending"
}),
Sprite.attributes.add("materialEntity", {
    type: "entity"
}),
Sprite.attributes.add("speed", {
    type: "number"
}),
Sprite.attributes.add("totalFrameCount", {
    type: "number"
}),
Sprite.prototype.initialize = function() {
    if ("blending" == this.type) {
        var t = this.entity.sprite.material.emissiveMap;
        this.entity.sprite.material.opacityMap = t,
        this.entity.sprite.material.blendType = pc.BLEND_ADDITIVEALPHA,
        this.entity.sprite.material.opacityMapChannel = "r",
        this.materialEntity && (this.materialEntity.model.model.meshInstances[0].material = this.entity.sprite.material),
        this.entity.script.destroy()
    } else if ("animated-2d" == this.type) {
        var e = this;
        this.currentSpriteFrame = 0,
        this.on("state", function(t) {
            e.currentSpriteFrame = 0,
            e.entity.element.spriteFrame = 0
        })
    }
}
,
Sprite.prototype.update = function(t) {
    "animated-2d" == this.type && (this.entity.element.spriteFrame = Math.floor(this.currentSpriteFrame % this.totalFrameCount),
    this.currentSpriteFrame += this.speed * t)
}
;
var Hitmarker = pc.createScript("hitmarker");
Hitmarker.attributes.add("hitPointEntity", {
    type: "entity"
}),
Hitmarker.attributes.add("hitPointHolder", {
    type: "entity"
}),
Hitmarker.attributes.add("crosshairEntity", {
    type: "entity"
}),
Hitmarker.attributes.add("distance", {
    type: "number",
    default: 100
}),
Hitmarker.attributes.add("spread", {
    type: "number",
    default: 20
}),
Hitmarker.attributes.add("speed", {
    type: "number",
    default: 1
}),
Hitmarker.attributes.add("duration", {
    type: "number",
    default: 1
}),
Hitmarker.attributes.add("rotateSpeed", {
    type: "number",
    default: 1
}),
Hitmarker.attributes.add("cameraEntity", {
    type: "entity"
}),
Hitmarker.attributes.add("screenEntity", {
    type: "entity"
}),
Hitmarker.attributes.add("hitmarkerEntity", {
    type: "entity"
}),
Hitmarker.attributes.add("defaultPitch", {
    type: "number",
    default: 1
}),
Hitmarker.attributes.add("hitColor", {
    type: "rgb"
}),
Hitmarker.prototype.initialize = function() {
    this.points = [],
    this.lastHitTime = Date.now(),
    this.lastHeadshot = Date.now(),
    this.hitPointEntity.enabled = !1,
    this.crosshairEntity.enabled = !1,
    this.app.on("Hit:Point", this.onHitPoint, this),
    this.app.on("Hit:Headshot", this.onHeadshot, this)
}
,
Hitmarker.prototype.onHeadshot = function(t, e) {
    if (Date.now() - this.lastHeadshot < 1e3)
        return !1;
    var i = this.crosshairEntity.clone();
    i.connectedEntity = t,
    i.time = 1,
    i.direction = Math.random();
    var a = Math.random() * this.spread - Math.random() * this.spread;
    i.setLocalPosition(a, a, 0);
    var r = i.findByName("Icon");
    r.setLocalScale(.2, .2, .2),
    r.tween(r.getLocalScale()).to({
        x: 2,
        y: 2,
        z: 2
    }, .4, pc.SineOut).start(),
    r.tween(r.getLocalPosition()).to({
        x: a,
        y: this.distance,
        z: 0
    }, this.duration, pc.SineOut).start(),
    r.tween(r.element).to({
        opacity: 0
    }, this.duration + .5, pc.SineOut).start(),
    this.points.push(i),
    this.hitPointHolder.addChild(i),
    this.screenEntity.sound.play("Headshot"),
    this.hitmarkerEntity.element.opacity = 1,
    this.hitmarkerEntity.setLocalScale(.3, .3, .3),
    this.hitmarkerEntity.tween(this.hitmarkerEntity.getLocalScale()).to({
        x: 1.2,
        y: 1.2,
        z: 1.2
    }, .25, pc.BackOut).start(),
    this.lastHeadshot = Date.now()
}
,
Hitmarker.prototype.onHitPoint = function(t, e) {
    var i = this.hitPointEntity.clone();
    i.connectedEntity = t,
    i.time = 1,
    i.direction = Math.random();
    var a = Math.random() * this.spread - Math.random() * this.spread;
    i.setLocalPosition(a, a, 0);
    var r = i.findByName("Number");
    r.element.text = e + "",
    r.element.color = this.hitColor,
    r.setLocalScale(.2, .2, .2),
    r.tween(r.getLocalScale()).to({
        x: 2,
        y: 2,
        z: 2
    }, .4, pc.SineOut).start(),
    r.tween(r.getLocalPosition()).to({
        x: a,
        y: this.distance,
        z: 0
    }, this.duration, pc.SineOut).start();
    var n = r.tween(r.element).to({
        opacity: 0
    }, this.duration + .5, pc.Linear);
    n.on("update", function(t) {
        r.element.outlineColor.a = pc.math.lerp(r.element.outlineColor.a, 0, .1)
    }),
    n.start(),
    setTimeout(function(t) {
        t && t.element && t.element.color && (t.element.color = pc.colors.white)
    }, 200, r),
    this.points.push(i),
    this.hitPointHolder.addChild(i),
    this.screenEntity.sound.play("Flesh"),
    this.screenEntity.sound.play("Hitmarker"),
    this.hitmarkerEntity.element.opacity = 1,
    this.hitmarkerEntity.setLocalScale(.5, .5, .5),
    this.hitmarkerEntity.tween(this.hitmarkerEntity.getLocalScale()).to({
        x: 1.2,
        y: 1.2,
        z: 1.2
    }, .15, pc.BackOut).start(),
    this.lastHitTime = Date.now()
}
,
Hitmarker.prototype.trackPoint = function(t, e) {
    if (!t)
        return !1;
    var i = t.connectedEntity.getPosition().clone()
      , a = new pc.Vec3;
    this.cameraEntity.camera.worldToScreen(i, a);
    var r = this.screenEntity.screen.scale
      , n = this.app.graphicsDevice;
    a.x > 0 && a.x < this.app.graphicsDevice.width && a.y > 0 && a.y < this.app.graphicsDevice.height && a.z > 0 ? (t.direction > .5 ? t.rotateLocal(0, 0, this.rotateSpeed * e) : t.rotateLocal(0, 0, -this.rotateSpeed * e),
    t.setLocalPosition(a.x / r, (n.height - a.y) / r, 0),
    t.enabled = !0) : t.enabled = !1
}
,
Hitmarker.prototype.updatePoints = function(t) {
    if (!this.points)
        return !1;
    if (this.points && this.points.length > 0)
        for (var e = this.points.length; e--; ) {
            var i = this.points[e];
            i && (i.time -= t * this.speed,
            i.time < 0 ? (i.destroy(),
            this.points.splice(e, 1)) : this.trackPoint(i, t))
        }
}
,
Hitmarker.prototype.update = function(t) {
    this.updatePoints(t),
    Date.now() - this.lastHitTime > 250 && (this.hitmarkerEntity.element.opacity = pc.math.lerp(this.hitmarkerEntity.element.opacity, 0, .2))
}
;
var Rotate = pc.createScript("rotate");
Rotate.attributes.add("axis", {
    type: "string",
    enum: [{
        x: "x"
    }, {
        y: "y"
    }, {
        z: "z"
    }]
}),
Rotate.attributes.add("speed", {
    type: "number"
}),
Rotate.attributes.add("waveStyle", {
    type: "boolean"
}),
Rotate.attributes.add("waveWidth", {
    type: "number"
}),
Rotate.attributes.add("children", {
    type: "boolean"
}),
Rotate.attributes.add("graphName", {
    type: "string"
}),
Rotate.prototype.initialize = function() {
    this.currentElement = this.entity,
    this.timestamp = 0,
    this.children && (this.currentElement = this.entity.findByName(this.graphName))
}
,
Rotate.prototype.update = function(t) {
    var e = this.speed * (60 * t);
    this.waveStyle && (e = Math.cos(this.timestamp * this.speed) * this.waveWidth,
    this.timestamp += 60 * t),
    this.currentElement ? ("x" == this.axis && this.currentElement.rotateLocal(e, 0, 0),
    "y" == this.axis && this.currentElement.rotateLocal(0, e, 0),
    "z" == this.axis && this.currentElement.rotateLocal(0, 0, e)) : this.children && (this.currentElement = this.entity.findByName(this.graphName))
}
;
var NetworkManager = pc.createScript("networkManager");
NetworkManager.attributes.add("isDebug", {
    type: "boolean",
    default: !0
}),
NetworkManager.attributes.add("URL", {
    type: "string"
}),
NetworkManager.attributes.add("testURL", {
    type: "string"
}),
NetworkManager.attributes.add("characterName", {
    type: "string",
    default: "Lilium"
}),
NetworkManager.attributes.add("enemyEntity", {
    type: "entity"
}),
NetworkManager.attributes.add("playerHolder", {
    type: "entity"
}),
NetworkManager.attributes.add("playerEntity", {
    type: "entity"
}),
NetworkManager.attributes.add("overlayEntity", {
    type: "entity"
}),
NetworkManager.attributes.add("menuCameraEntity", {
    type: "entity"
}),
NetworkManager.attributes.add("blackShadow", {
    type: "entity"
}),
NetworkManager.attributes.add("gameEntity", {
    type: "entity"
}),
NetworkManager.attributes.add("spectatorEntity", {
    type: "entity"
}),
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
    this.currentWeapon = "Scar",
    this.currentMode = "POINT",
    this.currentMap = "Sierra",
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
,
NetworkManager.prototype.setIssue = function() {
    "undefined" != typeof VERSION && this.app.fire("Overlay:Info", "This session is not available! Please refresh page and try again!")
}
,
NetworkManager.prototype.onRestart = function() {
    window.location.hash = "",
    window.location.reload()
}
,
NetworkManager.prototype.onMapLoaded = function() {
    this.setRespawn(),
    void 0 !== pc.nextObjectivePoint && this.app.fire("Mode:NextObjective", pc.nextObjectivePoint),
    window.onbeforeunload = function(e) {
        return "You will lost your progress in game if you leave now!"
    }
}
,
NetworkManager.prototype.setOptions = function(e) {
    e ? (this.URL = "wss://" + e.result.server,
    this.options.map = e.result.map,
    this.options.maxPlayer = e.result.max_player,
    this.isDebug || this.connect(this.URL),
    this.setOwnerInterface(e.is_owner)) : this.setOwnerInterface(!1)
}
,
NetworkManager.prototype.setOwnerInterface = function(e) {
    var t = this.app.root.findByTag("SessionOwner");
    for (var i in console.log(e),
    t) {
        t[i].enabled = e
    }
}
,
NetworkManager.prototype.getRoomId = function(e) {
    var t = window.location.hash.split("#");
    if (this.isSpectator = !1,
    t.length > 1) {
        var i = t[1].split(":");
        return i.length > 1 && "Spectate" == i[0] ? (this.isSpectator = !0,
        i[1]) : t[1]
    }
    return !1
}
,
NetworkManager.prototype.getKeys = function() {
    return {
        auth: "auth",
        info: "info",
        t: "tick",
        p: "position",
        s: "state",
        e: "event",
        da: "damage",
        k: "kill",
        h: "health",
        mode: "mode",
        ability: "ability",
        objective: "objective",
        point: "point",
        weapon: "weapon",
        throw: "throw",
        radius: "radius",
        board: "board",
        announce: "announce",
        overtime: "overtime",
        task: "task",
        unlock: "unlock",
        respawn: "respawn",
        chat: "chat",
        votes: "votes",
        finish: "finish",
        player: "player",
        left: "left",
        buy: "buy",
        hide: "hide",
        show: "show",
        card: "card",
        reward: "reward",
        character: "character",
        kick: "kick",
        spell: "spell",
        me: "me",
        token: "token",
        hit: "hit",
        report: "report",
        payload: "payload",
        charm: "charm",
        ping: "ping",
        team_set: "team_set",
        damage_point: "damage_point",
        notification: "notification",
        weapon_skins: "weaponSkins"
    }
}
,
NetworkManager.prototype.reconnect = function() {
    this.isDebug ? this.connect(this.testURL) : this.connect(this.URL)
}
,
NetworkManager.prototype.connect = function(e) {
    this.ws && (this.ws.close(),
    this.ws = !1,
    this.app.fire("Game:Finish", !0)),
    this.clearPlayers(),
    this.keys = this.getKeys(),
    this.roomId = this.getRoomId(),
    pc.isSpectator = this.isSpectator,
    this.roomId && (this.ws = new WebSocket(e + "/?" + this.roomId),
    this.ws.binaryType = "arraybuffer",
    this.ws.onopen = this.onOpen.bind(this),
    this.ws.onclose = this.onClose.bind(this),
    this.ws.onmessage = this.onMessage.bind(this))
}
,
NetworkManager.prototype.log = function(e) {
    this.isDebug && console.log(e)
}
,
NetworkManager.prototype.onOpen = function(e) {
    this.log("Network connection is open!"),
    this.app.fire("Overlay:InfoClose", !0)
}
,
NetworkManager.prototype.onClose = function(e) {
    this.app.fire("Overlay:Info", "Game disconnected, please refresh page!"),
    this.log("Network connection is close!")
}
,
NetworkManager.prototype.kick = function(e) {
    var t = e[0];
    this.app.fire("Overlay:Info", "You have been kicked. Reason : " + t),
    this.app.mouse.disablePointerLock(),
    this.app.fire("Player:Lock", !1),
    this.app.fire("Overlay:Pause", !1)
}
,
NetworkManager.prototype.onMessage = function(e) {
    var t = new Uint8Array(e.data);
    t = MessagePack.Buffer.from(t);
    var i = this.pack.decode(t);
    i && this.parse(i)
}
,
NetworkManager.prototype.send = function(e) {
    this.ws && this.ws.readyState == this.ws.OPEN && this.ws.send(this.pack.encode(e))
}
,
NetworkManager.prototype.parse = function(e) {
    if (0 === e.length)
        return !1;
    var t = e[0];
    Object.keys(this.keys).indexOf(t) > -1 && this[this.keys[t]](e.splice(1, e.length + 1))
}
,
NetworkManager.prototype.auth = function(e) {
    !0 === e[0] && (this.send([this.keys.auth, this.roomId, this.username, this.characterName, this.currentWeapon, this.options, this.hash, this.isSpectator]),
    this.skin = this.characterName,
    this.isSpectator ? (this.playerEntity.enabled = !1,
    this.overlayEntity.enabled = !1,
    this.spectatorEntity.enabled = !0) : (this.playerEntity.enabled = !0,
    this.overlayEntity.enabled = !0,
    this.spectatorEntity.enabled = !1),
    pc.session && pc.session.weapon && this.app.fire("WeaponManager:Set", pc.session.weapon))
}
,
NetworkManager.prototype.mode = function(e) {
    e[0] && (this.lastMode = this.currentMode + "",
    this.currentMode = e[0],
    pc.currentMode = this.currentMode,
    this.app.fire("Game:Mode", this.currentMode)),
    this.setModeState(this.lastMode, !1),
    this.setModeState(this.currentMode, !0);
    var t = this.app.root.findByName("Result");
    if (t) {
        var i = this.app.root.findByName("Chat");
        i && (i.setLocalPosition(0, 0, 0),
        i.reparent(this.app.root.findByName("ChatGame"))),
        t.destroy()
    }
    this.app.fire("Game:PreStart", !0),
    this.app.fire("Outline:Restart", !0);
    var r = e[1];
    if (console.log("Map load triggered!"),
    clearTimeout(this.mapTimer),
    this.mapTimer = setTimeout(function(e) {
        r ? e.app.fire("Map:Load", r) : e.app.fire("Map:Load", "Sierra")
    }, 100, this),
    pc.isFinished = !1,
    pc.isPauseActive = !1,
    this.app.fire("Game:Start", !0),
    this.app.fire("Player:Lock", !0),
    setTimeout(function(e) {
        e.app.fire("DOM:Update", !0)
    }, 500, this),
    Date.now() - this.lastGameStart > 1e5) {
        var a = this;
        this.app.fire("Player:Hide", !0),
        this.app.fire("Ads:Preroll", function() {
            a.app.fire("Player:Show", !0)
        })
    }
}
,
NetworkManager.prototype.setPlayerHide = function() {
    if (pc.isPauseActive = !0,
    !this.isMuted) {
        var e = Math.min(this.app.systems.sound.volume + .001, 1);
        this.app.systems.sound.volume = 0,
        this.currentVolume = e,
        this.isMuted = !0
    }
    this.send([this.keys.hide, !0])
}
,
NetworkManager.prototype.sendPing = function() {
    this.send([this.keys.ping, this.currentPing]),
    this.lastPingDate = Date.now()
}
,
NetworkManager.prototype.ping = function() {
    var e = Date.now() - this.lastPingDate;
    this.currentPing = e,
    this.app.fire("Overlay:Ping", e),
    setTimeout(function(e) {
        e.sendPing()
    }, 1e3, this)
}
,
NetworkManager.prototype.weaponSkins = function(e) {
    e && this.app.fire("WeaponManager:Skins", e[0])
}
,
NetworkManager.prototype.setPlayerShow = function() {
    if (pc.isDisplayingAds)
        return !1;
    this.isMuted && (this.currentVolume > 0 ? this.app.systems.sound.volume = this.currentVolume : this.app.systems.sound.volume = .25,
    this.isMuted = !1),
    pc.isPauseActive = !1,
    this.send([this.keys.show, !0])
}
,
NetworkManager.prototype.setModeState = function(e, t) {
    for (var i = this.app.root.findByTag("MODE-" + e), r = i.length; r--; )
        i[r] && (i[r].enabled = t)
}
,
NetworkManager.prototype.setRespawn = function() {
    this.send([this.keys.respawn, this.team])
}
,
NetworkManager.prototype.setWeapon = function(e) {
    this.send([this.keys.weapon, e])
}
,
NetworkManager.prototype.weapon = function(e) {
    if (e.length > 0) {
        var t = e[0]
          , i = e[1]
          , r = this.getPlayerById(t);
        r && r.script.enemy.setWeapon(i)
    }
}
,
NetworkManager.prototype.setThrow = function(e, t, i) {
    "Grenade" == e ? this.send([this.keys.throw, e, t.x, t.y, t.z, i.x, i.y, i.z]) : "Shuriken" == e && this.send([this.keys.throw, e, t.x, t.y, t.z, i[0], i[1], i[2]])
}
,
NetworkManager.prototype.throw = function(e) {
    if (e.length > 0) {
        var t = e[0]
          , i = e[1]
          , r = e[2]
          , a = e[3]
          , s = e[4]
          , o = e[5]
          , n = e[6]
          , p = e[7]
          , h = e[8]
          , c = new pc.Vec3(i,r,a);
        if ("Grenade" == t) {
            var y = new pc.Vec3(s,o,n);
            this.app.fire("EffectManager:Throw", t, c, y, !1, h)
        } else
            "Shuriken" == t && this.app.fire("EffectManager:Shuriken", c, [s, o, n], p, h, !1)
    }
}
,
NetworkManager.prototype.charm = function(e) {
    e.length > 0 && this.app.fire("WeaponManager:SetCharm", e[0])
}
,
NetworkManager.prototype.setCharacterSkin = function(e, t) {
    this.send([this.keys.character, e, t])
}
,
NetworkManager.prototype.character = function(e) {
    if (e.length > 0) {
        var t = this.getPlayerById(e[0])
          , i = e[1]
          , r = e[2];
        e[0] == this.playerId ? this.app.fire("Player:Dance", r) : t && t.script.enemy.setCharacterSkin(i, !1, r)
    }
}
,
NetworkManager.prototype.setRadiusEffect = function(e, t, i) {
    var r = Utils.encodeFloat(t.x)
      , a = Utils.encodeFloat(t.y)
      , s = Utils.encodeFloat(t.z)
      , o = i;
    o && this.send([this.keys.radius, e, r, a, s, o])
}
,
NetworkManager.prototype.setPointEffect = function(e, t, i, r) {
    var a = Utils.encodeFloat(i.x)
      , s = Utils.encodeFloat(i.y)
      , o = Utils.encodeFloat(i.z)
      , n = r;
    n && this.send([this.keys.damage_point, e, t, a, s, o, n])
}
,
NetworkManager.prototype.payload = function(e) {
    e.length > 0 && (this.app.fire("Objective:Payload", e[0]),
    this.payloadPercentage = e[0])
}
,
NetworkManager.prototype.overtime = function() {
    this.app.fire("Overlay:Announce", "Overtime", "", "Overtime", "Overtime-Icon"),
    this.app.fire("Game:Overtime", !0)
}
,
NetworkManager.prototype.setBuy = function() {
    this.send([this.keys.buy])
}
,
NetworkManager.prototype.buy = function(e) {
    this.app.fire("Overlay:Cards", e[0])
}
,
NetworkManager.prototype.setCard = function(e) {
    this.send([this.keys.card, e])
}
,
NetworkManager.prototype.setReward = function() {
    this.send([this.keys.reward, !0])
}
,
NetworkManager.prototype.setReport = function(e) {
    this.send([this.keys.report, e]),
    this.app.fire("View:Pause", "Thanks")
}
,
NetworkManager.prototype.setPlayerKick = function(e) {
    this.send([this.keys.kick, e]),
    this.app.fire("View:Pause", "Popup")
}
,
NetworkManager.prototype.setDealSpell = function(e) {
    this.send([this.keys.spell, e])
}
,
NetworkManager.prototype.show = function(e) {
    if (e.length > 0) {
        var t = this.getPlayerById(e[0]);
        t && t.script.enemy.showCharacter()
    }
}
,
NetworkManager.prototype.hide = function(e) {
    if (e.length > 0) {
        var t = this.getPlayerById(e[0]);
        t && t.script.enemy.hideCharacter()
    }
}
,
NetworkManager.prototype.setDamage = function(e, t, i, r) {
    if (e != this.playerId)
        return !1;
    var a = pc.controls.entity.getPosition()
      , s = a.x
      , o = a.y
      , n = a.z;
    this.send(["da", r, t, i, s, o, n])
}
,
NetworkManager.prototype.hit = function(e) {
    if (e.length > 0) {
        var t = this.getPlayerById(e[0])
          , i = e[1];
        this.app.fire("Hit:Point", t, i)
    }
}
,
NetworkManager.prototype.setHurt = function(e, t) {
    this.send(["hurt", e, t])
}
,
NetworkManager.prototype.setDrown = function(e, t) {
    this.send(["drown"])
}
,
NetworkManager.prototype.setPoint = function() {
    this.send(["point"])
}
,
NetworkManager.prototype.point = function(e) {
    if (e.length > 0) {
        var t = e[0];
        this.app.fire("Overlay:Point", "+" + t)
    }
}
,
NetworkManager.prototype.setGuard = function(e) {
    this.send(["guard", e]),
    e || this.app.fire("Analytics:Event", "Hacker", "VengeGuard"),
    this.lastGuardTime = Date.now()
}
,
NetworkManager.prototype.objective = function(e) {
    e.length > 0 && "POINT" == this.options.gameMode && (this.app.fire("Mode:NextObjective", e[0]),
    pc.nextObjectivePoint = e[0])
}
,
NetworkManager.prototype.finish = function(e) {
    if (this.app.fire("Game:Overtime", !1),
    e.length > 0) {
        var t = "none"
          , i = e[0];
        for (var r in i) {
            var a = i[r];
            a.id == this.playerId ? (a.isMe = !0,
            t = a.team) : a.isMe = !1
        }
        pc.stats = i,
        "FFA" == pc.currentMode || "POINT" == pc.currentMode ? !0 === i[0].isMe ? pc.isVictory = !0 : pc.isVictory = !1 : "PAYLOAD" == pc.currentMode && ("red" == t && this.payloadPercentage < .5 ? pc.isVictory = !0 : "blue" == t && this.payloadPercentage >= .5 ? pc.isVictory = !0 : pc.isVictory = !1);
        var s = "1.0.0";
        "undefined" != typeof VERSION && (s = VERSION);
        var o = "Result";
        Utils.isMobile() && (o = "Result-Mobile");
        var n = this.app.scenes.find(o);
        this.app.scenes.loadSceneHierarchy(n.url + "?v=" + s),
        window.onbeforeunload = !1
    }
}
,
NetworkManager.prototype.notification = function(e) {
    var t = e[0]
      , i = e[1];
    if ("kill" == t) {
        var r = i.reason
          , a = this.getPlayerScriptById(i.killer)
          , s = this.getPlayerScriptById(i.killed)
          , o = this.group != a.group ? pc.colors.enemy : pc.colors.friendly;
        this.app.fire("Overlay:Notification", "kill", {
            killer: a.username,
            killed: s.username,
            killedSkin: s.skin,
            killerSkin: a.skin,
            color: o,
            reason: r
        }, !1)
    }
}
,
NetworkManager.prototype.damage = function(e) {
    var t = this.getPlayerById(e[0]);
    if (t) {
        var i = t.getPosition();
        this.app.fire("Overlay:Damage", {
            x: i.x,
            y: i.y,
            z: i.z
        })
    }
}
,
NetworkManager.prototype.ability = function(e) {
    var t = this.getPlayerScriptById(e[0])
      , i = e[1];
    t && this.app.fire("Spell:Trigger", i, t.username)
}
,
NetworkManager.prototype.board = function(e) {
    if (e.length > 0) {
        var t = [];
        for (var i in e[0]) {
            var r = e[0][i];
            r.playerId == this.playerId ? r.isMe = !0 : r.isMe = !1,
            t.push(r)
        }
        this.stats = t,
        this.app.fire("Overlay:Leaderboard", t)
    }
}
,
NetworkManager.prototype.announce = function(e) {
    var t = e[0]
      , i = e[1]
      , r = e[2]
      , a = e[3]
      , s = this.getPlayerScriptById(i);
    t && (i == this.playerId && "affected" != t && this.app.fire("Player:Kill", r, a),
    "affected" == t && s && (this.app.fire("Overlay:Notification", "message", '[color="#58E6FA"]' + s.username + "[/color] affected by " + a, !1),
    s.applyAbilityAffect && s.applyAbilityAffect(a)),
    "objective" == t && s && "Capture" == a && this.app.fire("Overlay:Notification", "message", '[color="#58E6FA"]' + s.username + "[/color] captured point!", !1),
    "kill" == t && s && "Suicide" == a && this.app.fire("Overlay:Notification", "message", '[color="#58E6FA"]' + s.username + "[/color] suicided!", !1))
}
,
NetworkManager.prototype.task = function(e) {
    var t = e[0]
      , i = e[1]
      , r = e[2]
      , a = e[3]
      , s = t;
    "Tier1" == t && (s = "Tier 1"),
    "Tier2" == t && (s = "Tier 2"),
    "Tier3" == t && (s = "Tier 3"),
    this.app.fire("Overlay:Task", s, i, r, a)
}
,
NetworkManager.prototype.unlock = function(e) {
    var t = e[0]
      , i = e[1]
      , r = e[2]
      , a = i;
    if ("Tier1" == i && (a = "Tier 1"),
    "Tier2" == i && (a = "Tier 2"),
    "Tier3" == i && (a = "Tier 3"),
    "Tier4" == i && (a = "Tier 4"),
    t == this.playerId)
        this.app.fire("Overlay:Unlock", a, r);
    else {
        var s = this.getPlayerScriptById(t).username;
        this.app.fire("Overlay:Notification", "message", '[color="#58E6FA"]' + s + "[/color] unlocked " + i + " abilities!", !1)
    }
}
,
NetworkManager.prototype.kill = function(e) {
    var t = e[0]
      , i = e[1]
      , r = e[2]
      , a = this.getPlayerById(t)
      , s = this.getPlayerById(i);
    t == this.playerId ? this.app.fire("Player:Death", s, r) : a && a.script.enemy.death(r)
}
,
NetworkManager.prototype.health = function(e) {
    var t = e[0]
      , i = e[1]
      , r = this.getPlayerById(t);
    t == this.playerId ? this.app.fire("Player:Health", i) : r && r.script.enemy.setHealth(i)
}
,
NetworkManager.prototype.setPosition = function(e, t, i, r, a) {
    var s = Utils.encodeFloat(e)
      , o = Utils.encodeFloat(t)
      , n = Utils.encodeFloat(i)
      , p = Utils.encodeFloat(r)
      , h = Utils.encodeFloat(a);
    this.send(["p", s, o, n, p, h])
}
,
NetworkManager.prototype.votes = function(e) {
    if (e.length > 0) {
        var t = e[0];
        this.app.fire("Overlay:Votes", t),
        this.app.fire("Analytics:Event", "Game", "Vote")
    }
}
,
NetworkManager.prototype.setVote = function(e) {
    this.send(["vote", e])
}
,
NetworkManager.prototype.setEvent = function(e) {
    this.send(["e", e])
}
,
NetworkManager.prototype.event = function(e) {
    if (e.length > 0) {
        var t = this.getPlayerById(e[0]);
        if (t) {
            var i = e[1];
            t.script.enemy.triggerEvent(i)
        }
    }
}
,
NetworkManager.prototype.setState = function(e, t) {
    this.send(["s", e, t])
}
,
NetworkManager.prototype.sendChatMessage = function(e) {
    this.send(["chat", e])
}
,
NetworkManager.prototype.chat = function(e) {
    if (e.length > 0) {
        var t = e[0]
          , i = this.getPlayerScriptById(t)
          , r = e[1];
        "console" == t ? this.app.fire("Chat:Message", "Console", r) : t == this.playerId ? this.app.fire("Chat:Message", this.username, r, !0) : this.app.fire("Chat:Message", i.username, r)
    }
}
,
NetworkManager.prototype.state = function(e) {
    if (e.length > 0) {
        var t = this.getPlayerById(e[0]);
        if (t) {
            var i = e[1]
              , r = e[2];
            t.script.enemy.setState(i, r)
        }
    }
}
,
NetworkManager.prototype.respawn = function(e) {
    if (e && e.length > 0) {
        var t = e[0]
          , i = this.getPlayerById(t);
        t == this.playerId ? (this.app.fire("Player:AllowRespawn", !0),
        this.app.fire("Overlay:Transition", !0),
        clearTimeout(this.respawnTimer),
        this.respawnTimer = setTimeout(function(e) {
            e.app.fire("Player:Respawn", !0)
        }, 300, this)) : i && i.script.enemy.respawn()
    }
}
,
NetworkManager.prototype.info = function(e) {
    this.app.fire("Overlay:Info", e[0])
}
,
NetworkManager.prototype.team_set = function(e) {
    if (e.length > 0) {
        var t = e[0]
          , i = e[1]
          , r = this.getPlayerById(t);
        t == this.playerId ? (this.app.fire("Player:Team", i),
        pc.currentTeam = i,
        this.team = i) : r && r.script.enemy.setTeam(i)
    }
}
,
NetworkManager.prototype.me = function(e) {
    if (e.length > 0) {
        var t = e[0];
        this.playerId = t.playerId,
        this.group = t.group,
        this.username = t.username,
        this.playerEntity.script.player.playerId = this.playerId,
        this.playerEntity.script.player.group = this.group,
        this.playerEntity.username = this.username,
        pc.currentTeam = t.team
    }
}
,
NetworkManager.prototype.getPlayerById = function(e) {
    if (this.playerId == e)
        return this.playerEntity;
    for (var t = this.players.length; t--; )
        if (this.players[t].script && this.players[t].script.enemy && this.players[t].script.enemy.playerId == e)
            return this.players[t];
    return !1
}
,
NetworkManager.prototype.getPlayerScriptById = function(e) {
    if (this.playerId == e)
        return this;
    for (var t = this.players.length; t--; )
        if (this.players[t].script && this.players[t].script.enemy && this.players[t].script.enemy.playerId == e)
            return this.players[t].script.enemy;
    return !1
}
,
NetworkManager.prototype.removePlayerById = function(e) {
    if (this.playerId == e)
        return this;
    for (var t = this.players.length; t--; )
        this.players[t].script && this.players[t].script.enemy && this.players[t].script.enemy.playerId == e && this.players.splice(t, 1)
}
,
NetworkManager.prototype.left = function(e) {
    if (e.length > 0) {
        var t = this.getPlayerById(e[0]);
        if (t && t.script && t.script.enemy) {
            var i = t.script.enemy.username;
            this.removePlayerById(e[0]),
            this.app.fire("Overlay:Notification", "message", '[color="#58E6FA"]' + i + "[/color] left", !1),
            t.script.enemy.left()
        }
    }
}
,
NetworkManager.prototype.position = function(e) {
    if (e.length > 0) {
        var t = this.getPlayerById(e[0]);
        if (t) {
            var i = Utils.decodeFloat(e[1])
              , r = Utils.decodeFloat(e[2])
              , a = Utils.decodeFloat(e[3])
              , s = Utils.decodeFloat(e[4])
              , o = Utils.decodeFloat(e[5]);
            t.script.enemy.setPosition(i, r, a, s, o)
        }
    }
}
,
NetworkManager.prototype.player = function(e) {
    var t = e[0];
    if (t) {
        var i = t.username.replace("[", "[").replace("]", "]");
        "-1" != t.playerId && this.app.fire("Overlay:Notification", "message", '[color="#58E6FA"]' + i + "[/color] joined", !1),
        t.playerId != this.playerId && this.createPlayer(t)
    }
    this.app.fire("Game:PlayerJoin", !0)
}
,
NetworkManager.prototype.clearPlayers = function() {
    for (var e = this.players.length; e--; ) {
        var t = this.players[e];
        t && (t.destroy(),
        this.players.splice(e, 1))
    }
}
,
NetworkManager.prototype.createPlayer = function(e) {
    var t = this.enemyEntity.clone();
    t.enabled = !0,
    t.script.enemy.playerId = e.playerId,
    t.script.enemy.username = e.username,
    t.script.enemy.team = e.team,
    t.script.enemy.skin = e.skin,
    t.script.enemy.group = e.group,
    t.script.enemy.setUsername(e.username, e.team),
    t.script.enemy.weaponSkins = e.weaponSkins,
    t.script.enemy.setWeapon(e.weapon),
    t.script.enemy.setCharacterSkin(e.skin, e.heroSkin, e.dance),
    this.playerHolder.addChild(t),
    this.players.push(t)
}
,
NetworkManager.prototype.tick = function(e) {
    var t = parseInt(e[0])
      , i = t;
    0 === t && (pc.isFinished = !0),
    this.app.fire("Server:Tick", t, i),
    this.app.fire("VengeGuard:Check", !0),
    this.selfTick()
}
;

var Player = pc.createScript("player");
Player.attributes.add("playerId", {
    type: "string",
    default: -1
}),
Player.attributes.add("username", {
    type: "string",
    default: "none"
}),
Player.attributes.add("team", {
    type: "string",
    default: "none"
}),
Player.attributes.add("characterName", {
    type: "string",
    default: "Lilium"
}),
Player.attributes.add("characterHolder", {
    type: "entity"
}),
Player.attributes.add("characterEntity", {
    type: "entity"
}),
Player.attributes.add("characterCamera", {
    type: "entity"
}),
Player.attributes.add("characterCameraHolder", {
    type: "entity"
}),
Player.attributes.add("characterArmLeft", {
    type: "entity"
}),
Player.attributes.add("characterArmRight", {
    type: "entity"
}),
Player.attributes.add("meleeCenter", {
    type: "entity"
}),
Player.attributes.add("hammerEntity", {
    type: "entity"
}),
Player.attributes.add("katanaEntity", {
    type: "entity"
}),
Player.attributes.add("sex", {
    type: "string",
    default: "Female"
}),
Player.attributes.add("lowExposure", {
    type: "number",
    default: 4
}),
Player.attributes.add("throwCooldown", {
    type: "number",
    default: 8
}),
Player.attributes.add("dashCooldown", {
    type: "number",
    default: 10
}),
Player.attributes.add("weapons", {
    type: "string",
    array: !0
}),
Player.attributes.add("danceName", {
    type: "string",
    default: "Techno"
}),
Player.prototype.initialize = function() {
    this.currentDate = Date.now(),
    this.lastPositionUpdate = Date.now(),
    this.lastCircularMenu = Date.now() - 5e3,
    this.isEmotePlaying = !1,
    this.emoteTimeout = !1,
    this.emoteReminder = !1,
    this.allowEmoteCancelation = !1,
    this.lastWeapon = "Scar",
    this.killCount = 0,
    this.canBuy = !1,
    this.isCircularMenuActive = !1,
    this.animation = {
        lookX: 0,
        cameraShake: !1,
        cameraFov: !1
    },
    this.timers = {
        camera: !1
    },
    this.past = {},
    this.health = 100,
    this.cards = [],
    this.killedBy = !1,
    this.isDeath = !1,
    this.deathCount = 0,
    this.isCardSelection = !1,
    this.isRespawnAllowed = !1,
    this.lastRespawnDate = 0,
    this.characterCameraScale = 1,
    this.currentShootingState = !1,
    this.movement = this.entity.script.movement,
    this.interface = this.movement.interface,
    this.weaponManager = this.entity.script.weaponManager,
    this.app.on("Player:Health", this.setHealth, this),
    this.app.on("Player:Respawn", this.onRespawn, this),
    this.app.on("Player:Death", this.setDeath, this),
    this.app.on("Player:Kill", this.onKill, this),
    this.app.on("Player:Shake", this.shake, this),
    this.app.on("Player:PointerLock", this.onPointerLock, this),
    this.app.on("Player:Leave", this.onLeave, this),
    this.app.on("Player:AllowRespawn", this.onAllowRespawn, this),
    Utils.isMobile() && (this.app.on("Touch:Dance", this.onTouchEmote, this),
    this.app.on("Touch:BuyStart", this.onBuyStart, this),
    this.app.on("Touch:BuyEnd", this.onBuyEnd, this),
    this.app.on("Touch:BuyCard1", this.onBuyCard1, this),
    this.app.on("Touch:BuyCard2", this.onBuyCard2, this),
    this.app.on("Touch:BuyCard3", this.onBuyCard3, this),
    this.app.on("Touch:SetWeapon", this.onTouchWeapon, this)),
    this.app.on("Player:SetWeapon", this.onTouchWeapon, this),
    this.app.on("Game:Start", this.onStart, this),
    this.app.on("Game:Finish", this.onFinish, this),
    this.app.on("Overlay:Cards", this.onCards, this),
    this.app.on("Overlay:Unlock", this.onUnlock, this),
    this.app.on("Overlay:SetAbility", this.onAbilitySet, this),
    this.app.on("Overlay:WhiteShadow", this.setWhiteShadow, this),
    this.app.on("Player:Character", this.onCharacterSet, this),
    this.app.on("Player:Dance", this.onDanceSet, this),
    this.app.on("Player:Skin", this.onCharacterSkinSet, this)
}
,
Player.prototype.onCharacterSet = function(t) {
    this.characterName = t;
    var e = this.entity.findByName(this.characterName + "-Model")
      , a = this.entity.findByTag("Skin");
    for (var i in a) {
        a[i].enabled = !1
    }
    e.enabled = !0,
    this.characterEntity = e,
    this.danceName = this.characterName + "-Techno",
    this.characterArmLeft.model.asset = this.app.assets.find(t + "-RightArm"),
    this.characterArmRight.model.asset = this.app.assets.find(t + "-LeftArm");
    var s = this.meleeCenter.findByTag("Melee");
    for (var o in s) {
        s[o].enabled = !1
    }
    "Lilium" == t ? (this.hammerEntity.enabled = !0,
    this.throwCooldown = 10) : "Shin" == t && (this.katanaEntity.enabled = !0,
    this.throwCooldown = 3)
}
,
Player.prototype.onDanceSet = function(t) {
    var e = this.characterName
      , a = this.app.assets.find(e + "-" + t + "-Animation")
      , i = this.app.assets.find(e + "-" + t + "-Music.mp3");
    if (a) {
        this.app.assets.load(a);
        var s = this.characterEntity.animation.assets;
        s.push(a.id),
        this.characterEntity.animation.assets = s,
        this.entity.sound.slots.Emote.asset = i.id,
        this.danceName = e + "-" + t
    }
}
,
Player.prototype.onCharacterSkinSet = function(t) {
    var e = this.characterName + "-" + t + ".jpg";
    if (t && this.characterEntity) {
        for (var a = this.characterEntity.model.material.clone(), i = this.app.assets.find(e), s = this.characterEntity.model.meshInstances, o = 0; o < s.length; ++o) {
            s[o].material = a
        }
        this.app.assets.load(i),
        i.ready(function(t) {
            a.diffuseMap = i.resource,
            a.update()
        })
    }
}
,
Player.prototype.onAllowRespawn = function() {
    this.isRespawnAllowed = !0
}
,
Player.prototype.onStart = function() {
    pc.session && void 0 !== pc.session.character ? this.app.fire("Player:Character", pc.session.character) : this.app.fire("Player:Character", this.characterName),
    this.movement.setAmmoFull(),
    this.cards = [],
    this.killCount = 0,
    this.deathCount = 0,
    this.app.fire("Digit:KillCount", this.killCount),
    this.app.fire("Digit:DeathCount", this.deathCount),
    setTimeout(function(t) {
        t.fireNetworkEvent("connected", !0)
    }, 800, this)
}
,
Player.prototype.onFinish = function() {
    this.movement.disableMovement(),
    this.isCardSelection = !1,
    this.canBuy = !1
}
,
Player.prototype.onUnlock = function() {
    this.canBuy = !0
}
,
Player.prototype.onPointerLock = function() {
    this.app.fire("Overlay:Pause", !1),
    this.app.mouse.enablePointerLock()
}
,
Player.prototype.onLeave = function() {
    this.app.mouse.disablePointerLock(),
    Utils.isMobile() ? window.location.href = "https://beta-meta-42746.venge.io/?isMobile=yes&v=" + Math.random() : window.location.href = "index.html"
}
,
Player.prototype.onBuyStart = function() {
    this.buyAbility()
}
,
Player.prototype.onBuyCard1 = function() {
    this.app.fire("Overlay:SetAbility", 0),
    this.app.fire("Network:Card", 1),
    this.isCardSelection = !1
}
,
Player.prototype.onBuyCard2 = function() {
    this.app.fire("Overlay:SetAbility", 1),
    this.app.fire("Network:Card", 2),
    this.isCardSelection = !1
}
,
Player.prototype.onBuyCard3 = function() {
    this.app.fire("Overlay:SetAbility", 2),
    this.app.fire("Network:Card", 3),
    this.isCardSelection = !1
}
,
Player.prototype.onBuyEnd = function() {
    this.buyAbilityEnd()
}
,
Player.prototype.onTouchEmote = function() {
    this.emote()
}
,
Player.prototype.onCards = function() {
    this.isCardSelection = !0,
    this.movement.disableMovement(),
    this.app.fire("Overlay:Gameplay", !1),
    this.app.fire("Overlay:Transition", new pc.Color(1,1,1)),
    setTimeout(function(t) {
        t._onCards()
    }, 100, this)
}
,
Player.prototype.onTouchWeapon = function(t) {
    var e = t + "";
    "1" === e && this.setWeapon(this.weapons[0]),
    "2" === e && this.setWeapon(this.weapons[1]),
    "3" === e && this.setWeapon(this.weapons[2]),
    "4" === e && this.setWeapon(this.weapons[3])
}
,
Player.prototype._onCards = function() {
    this.entity.rigidbody.teleport(0, -50, 0, 0, 0, 0),
    this.entity.rigidbody.linearVelocity = new pc.Vec3(0,0,0),
    this.characterHolder.enabled = !0,
    this.characterCamera.script.blackWhite.enabled = !1,
    this.characterCamera.setLocalPosition(0, .95, 7),
    this.characterEntity.setLocalEulerAngles(0, -180, 0),
    this.characterCameraHolder.setLocalScale(0, 0, 0),
    this.characterCameraHolder.tween(this.characterCameraHolder.getLocalScale()).to({
        x: .5,
        y: .5,
        z: .5
    }, 1.5, pc.SineOut).start(),
    this.characterCameraHolder.tween(this.characterCameraHolder.getLocalEulerAngles()).rotate({
        x: -165,
        y: 0,
        z: 180
    }, 2, pc.SineOut).start(),
    setTimeout(function(t) {
        t.characterEntity.animation.play("Sit"),
        t.movement.lookEntity.enabled = !1
    }, 100, this)
}
,
Player.prototype.onAbilitySet = function(t) {
    this.cards.push(t),
    setTimeout(function(t) {
        t._onAbilitySet()
    }, 2e3, this)
}
,
Player.prototype._onAbilitySet = function() {
    this.movement.enableMovement(),
    this.characterCameraHolder.setLocalScale(1, 1, 1),
    this.characterCameraHolder.setLocalEulerAngles(0, 0, 0),
    this.characterHolder.enabled = !1,
    this.movement.lookEntity.enabled = !0,
    this.app.fire("Overlay:Gameplay", !0),
    this.app.fire("Player:Respawn", !0)
}
,
Player.prototype.setWhiteShadow = function(t) {
    t ? (this.animation.cameraFov = this.app.tween(this.movement.animation).to({
        fov: 20
    }, 1, pc.SineIn),
    this.animation.cameraShake = this.app.tween(pc.controls.animation).to({
        cameraBounce: .8
    }, .04, pc.Linear).yoyo(!0).repeat(10),
    this.animation.cameraShake.start(),
    this.animation.cameraFov.start()) : (this.animation.cameraShake && this.animation.cameraShake.stop(),
    this.animation.cameraFov && this.animation.cameraFov.stop())
}
,
Player.prototype.onKill = function(t, e) {
    this.emoteReminder || "Suicide" == e || "FirstBlood" == e,
    this.emoteReminder = !0,
    this.app.fire("Player:Frag", !0),
    "Capture" != e && "Suicide" != e && (this.killCount++,
    this.app.fire("Digit:KillCount", this.killCount)),
    setTimeout(function(t) {
        t.movement.inspect()
    }, 1e3, this)
}
,
Player.prototype.shake = function() {
    this.movement.shake()
}
,
Player.prototype.throw = function() {
    Math.random() > .2 ? this.app.fire("Player:Speak", "Throw", 2) : Math.random() > .2 && this.movement.playEffortSound()
}
,
Player.prototype.melee = function() {
    Math.random() > .2 ? this.app.fire("Player:Speak", "Throw", 2) : Math.random() > .2 && this.movement.playEffortSound()
}
,
Player.prototype.emote = function() {
    if (this.isEmotePlaying)
        return !1;
    if (this.emoteTimeout)
        return !1;
    var t = this.danceName;
    this.isEmotePlaying = !0,
    this.movement.disableMovement(),
    this.characterHolder.enabled = !0,
    this.characterEntity.setLocalPosition(0, -2.15, 0),
    this.characterEntity.animation.play(t + "-Animation"),
    this.characterEntity.animation.speed = 1,
    this.characterEntity.animation.loop = !0,
    this.entity.sound.play("Emote"),
    setTimeout(function(t) {
        t.movement.lookEntity.enabled = !1
    }, 100, this),
    this.characterCamera.script.blackWhite.enabled = !1,
    this.characterCamera.setLocalPosition(0, 1.215, -.115),
    this.characterCamera.tween(this.characterCamera.getLocalPosition()).to({
        x: 0,
        y: 3.015,
        z: 7
    }, 1, pc.SineOut).start(),
    this.characterCamera.setLocalEulerAngles(0, 0, 0),
    this.characterCamera.tween(this.characterCamera.getLocalEulerAngles()).rotate({
        x: -18,
        y: 0,
        z: 0
    }, .7, pc.BackOut).start(),
    this.fireNetworkEvent("emote", t),
    setTimeout(function(t) {
        t.allowEmoteCancelation = !0
    }, 1500, this),
    this.emoteTimeout = setTimeout(function(t) {
        t.finishEmote()
    }, 3e3, this)
}
,
Player.prototype.finishEmote = function() {
    if (!this.isEmotePlaying)
        return !1;
    this.isDeath || (this.onCameraReturn(),
    clearTimeout(this.emoteTimeout),
    setTimeout(function(t) {
        t.allowEmoteCancelation = !1,
        t.emoteTimeout = !1,
        t.isEmotePlaying = !1,
        t.movement.enableMovement()
    }, 400, this))
}
,
Player.prototype.setDeath = function(t, e) {
    if (this.killedBy = t,
    this.isDeath = !0,
    this.deathCount++,
    this.app.fire("Digit:DeathCount", this.deathCount),
    this.movement.death(),
    this.characterHolder.enabled = !0,
    this.characterEntity.setLocalEulerAngles(0, this.movement.lookX, 0),
    setTimeout(function(t) {
        t.movement.lookEntity.enabled = !1
    }, 100, this),
    this.characterEntity.setLocalPosition(0, -2.15, 0),
    this.characterEntity.animation.speed = 1,
    "Drown" == e ? (this.characterEntity.animation.play("Floating"),
    this.characterEntity.animation.speed = 3,
    this.characterEntity.animation.loop = !0,
    this.entity.sound.play("Splash"),
    this.characterEntity.setLocalPosition(0, -3.5, 0),
    this.characterEntity.tween(this.characterEntity.getLocalPosition()).to({
        x: 0,
        y: -6.5,
        z: 0
    }, 2, pc.Linear).start()) : (this.characterEntity.animation.play("Death"),
    this.characterEntity.animation.loop = !1),
    this.characterCamera.script.blackWhite.enabled = !0,
    this.characterCamera.setLocalPosition(0, 1.215, -.115),
    this.characterCamera.tween(this.characterCamera.getLocalPosition()).to({
        x: 0,
        y: 3.015,
        z: 7
    }, 1, pc.SineOut).start(),
    this.characterCamera.setLocalEulerAngles(0, 0, 0),
    this.characterCamera.tween(this.characterCamera.getLocalEulerAngles()).rotate({
        x: -18,
        y: 0,
        z: 0
    }, .7, pc.BackOut).start(),
    this.interface.hideGameplay(),
    this.killedBy && this.killedBy != this.entity) {
        var a = this.killedBy.script.enemy.username;
        this.app.fire("Overlay:Status", 'Following [color="#FF0000"]' + a + "[/color]")
    }
    this.app.fire("Player:StopSpeaking", !0),
    this.showCircularMenu(),
    "undefined" != typeof PokiSDK && PokiSDK.gameplayStop()
}
,
Player.prototype.setHealth = function(t) {
    t > this.health && (this.app.fire("Character:Sound", "Sigh", .1 * Math.random()),
    setTimeout(function(t) {
        t.app.fire("Player:Speak", "Heal", 1)
    }, 1e3, this)),
    this.health = t
}
,
Player.prototype.onCameraReturn = function(t) {
    if (t)
        return this.characterHolder.enabled = !1,
        this.movement.lookEntity.enabled = !0,
        !1;
    this.characterCamera.tween(this.characterCamera.getLocalPosition()).to({
        x: 0,
        y: 1.19,
        z: 0
    }, .4, pc.SineOut).start(),
    this.characterCamera.tween(this.characterCamera.getLocalEulerAngles()).rotate({
        x: 0,
        y: 0,
        z: 0
    }, .4, pc.BackOut).start(),
    this.timers.camera = setTimeout(function(t) {
        t.characterHolder.enabled = !1,
        t.movement.lookEntity.enabled = !0,
        t.movement.takeout()
    }, 400, this)
}
,
Player.prototype.getSpawnPoint = function() {
    var t = []
      , e = this.app.root.findByTag("SpawnPoint");
    this.app.root.findByTag("Player");
    for (var a in e) {
        var i, s = e[a], o = s.getPosition().clone(), r = s.getLocalEulerAngles().clone();
        i = this.entity.getPosition().clone().sub(o).length(),
        "TDM" != pc.currentMode && "PAYLOAD" != pc.currentMode || pc.currentTeam != s.name || t.push({
            score: i,
            point: o,
            angle: r
        }),
        "TDM" != pc.currentMode && "PAYLOAD" != pc.currentMode && t.push({
            score: i,
            point: o,
            angle: r
        })
    }
    return t.sort(function(t, e) {
        return e.score - t.score
    }),
    0 !== t.length && t[Math.round(3 * Math.random())]
}
,
Player.prototype.onRespawn = function(t) {
    if (pc.isFinished)
        return !1;
    if (!pc.isMapLoaded)
        return !1;
    if (!this.isRespawnAllowed && "undefined" != typeof VERSION)
        return !1;
    if (Date.now() - this.lastRespawnDate < 500)
        return !1;
    this.deathCount > 0 && this.app.fire("Analytics:GameplayStart", !0),
    this.isDeath = !1,
    this.isEmotePlaying = !1,
    this.movement.currentWeapon.entity.name != this.lastWeapon ? ("Shotgun" == this.movement.currentWeapon.entity.name ? this.app.fire("Player:Speak", "Shotgun", 1) : this.app.fire("Player:Speak", "Weapon-Selection", 2),
    this.lastWeapon = this.movement.currentWeapon.entity.name + "") : Math.random() > .8 && this.app.fire("Player:Speak", "Respawn", 3),
    this.onCameraReturn(!0),
    this.movement.enableMovement(),
    this.movement.setAmmoFull(),
    this.interface.showGameplay();
    var e = this.getSpawnPoint()
      , a = 3 * Math.random()
      , i = 3 * Math.random();
    if (e) {
        var s = e.point.add(new pc.Vec3(a,2.5,i))
          , o = e.angle;
        this.entity.rigidbody.linearVelocity = new pc.Vec3(0,0,0),
        this.entity.rigidbody.teleport(s.x, s.y, s.z, 0, 0, 0),
        180 == o.x && 180 == o.z ? this.movement.lookX = 90 - o.y : this.movement.lookX = o.y + 45
    }
    this.lastRespawnDate = Date.now()
}
,
Player.prototype.fireNetworkEvent = function(t) {
    this.app.fire("Network:Event", t)
}
,
Player.prototype.setStates = function() {
    this.movement.isForward != this.past.isForward && this.app.fire("Network:State", "w", this.movement.isForward),
    this.movement.isBackward != this.past.isBackward && this.app.fire("Network:State", "s", this.movement.isBackward),
    this.movement.isLeft != this.past.isLeft && this.app.fire("Network:State", "a", this.movement.isLeft),
    this.movement.isRight != this.past.isRight && this.app.fire("Network:State", "d", this.movement.isRight),
    this.past.isForward = this.movement.isForward,
    this.past.isBackward = this.movement.isBackward,
    this.past.isLeft = this.movement.isLeft,
    this.past.isRight = this.movement.isRight
}
,
Player.prototype.setPosition = function() {
    if (this.currentDate - this.lastPositionUpdate < 30)
        return !1;
    var t = this.entity.getPosition().clone()
      , e = this.movement.lookX % 360
      , a = this.movement.lookY % 360;
    this.app.fire("Network:Position", t.x, t.y, t.z, e, a),
    this.lastPositionUpdate = this.currentDate
}
,
Player.prototype.checkShooting = function() {
    var t = !1;
    this.movement.isReloading < this.movement.timestamp && this.movement.leftMouse && (t = !0),
    this.currentShootingState !== t && this.app.fire("Network:State", "f", t),
    this.currentShootingState = t
}
,
Player.prototype.setDeathAnimation = function() {
    if (!this.killedBy)
        return !1;
    var t = this.entity.getPosition()
      , e = this.killedBy.getPosition()
      , a = Utils.lookAt(e.x, e.z, t.x, t.z);
    this.characterCameraHolder.setLocalEulerAngles(0, a * pc.math.RAD_TO_DEG, 0)
}
,
Player.prototype.setBackRaycast = function() {
    var t = this.characterCamera.forward.scale(-100)
      , e = this.characterCamera.getPosition()
      , a = e.clone().add(t)
      , i = this.app.systems.rigidbody.raycastFirst(e, a)
      , s = 1e3;
    i && (s = i.entity.getPosition().clone().sub(e).length()),
    this.characterCameraScale = Math.min(1, s / 10),
    this.characterCameraHolder.setLocalScale(this.characterCameraScale, this.characterCameraScale, this.characterCameraScale)
}
,
Player.prototype.updateEmotePlaying = function() {
    this.setBackRaycast(),
    this.animation.lookX = pc.math.lerp(this.animation.lookX, this.movement.lookX, .05),
    this.characterEntity.setLocalEulerAngles(180, -this.animation.lookX, 180),
    this.characterCameraHolder.setLocalEulerAngles(this.movement.lookY, this.movement.lookX, 0),
    this.allowEmoteCancelation && (this.app.keyboard.isPressed(pc.KEY_W) || this.app.keyboard.isPressed(pc.KEY_S) || this.app.keyboard.isPressed(pc.KEY_D) || this.app.keyboard.isPressed(pc.KEY_A)) && this.finishEmote()
}
,
Player.prototype.buyAbility = function() {
    this.canBuy ? (this.app.fire("Overlay:WhiteShadow", !0),
    this.whiteShadowTimer = setTimeout(function(t) {
        t.canBuy = !1,
        pc.app.fire("Network:Buy"),
        setTimeout(function() {
            pc.app.fire("Overlay:WhiteShadow", !1)
        }, 500)
    }, 1e3, this)) : this.entity.sound.play("Error")
}
,
Player.prototype.buyAbilityEnd = function() {
    clearTimeout(this.whiteShadowTimer),
    this.app.fire("Overlay:WhiteShadow", !1)
}
,
Player.prototype.setKeyboard = function() {
    return !pc.isFinished && ("INPUT" != document.activeElement.tagName && (this.isCardSelection && (this.app.keyboard.wasPressed(pc.KEY_1) && this.onBuyCard1(),
    this.app.keyboard.wasPressed(pc.KEY_2) && this.onBuyCard2(),
    this.app.keyboard.wasPressed(pc.KEY_3) && this.onBuyCard3()),
    this.isDeath ? (this.isCircularMenuActive && (this.app.keyboard.wasPressed(pc.KEY_1) && this.setWeapon(this.weapons[0]),
    this.app.keyboard.wasPressed(pc.KEY_2) && this.setWeapon(this.weapons[1]),
    this.app.keyboard.wasPressed(pc.KEY_3) && this.setWeapon(this.weapons[2]),
    this.app.keyboard.wasPressed(pc.KEY_4) && this.setWeapon(this.weapons[3])),
    !1) : !this.movement.locked && (this.app.keyboard.wasPressed(pc.KEY_H) && this.emote(),
    this.app.keyboard.wasPressed(pc.KEY_B) && this.buyAbility(),
    this.app.keyboard.wasReleased(pc.KEY_B) && this.buyAbilityEnd(),
    this.app.keyboard.wasPressed(pc.KEY_TAB) && this.app.fire("Overlay:PlayerStats", !0),
    void (this.app.keyboard.wasReleased(pc.KEY_TAB) && this.app.fire("Overlay:PlayerStats", !1)))))
}
,
Player.prototype.setWeapon = function(t) {
    this.movement.disableZoom(),
    this.weaponManager.setWeapon(t)
}
,
Player.prototype.showCircularMenu = function(t) {
    return !this.isCircularMenuActive && (Date.now() - this.lastCircularMenu < 5e3 ? (this.entity.sound.play("Error"),
    !1) : (this.isCircularMenuActive = !0,
    this.lastCircularMenu = Date.now(),
    this.app.fire("Overlay:Circular", this.weapons),
    void setTimeout(function(t) {
        t.isCircularMenuActive = !1
    }, 3500, this)))
}
,
Player.prototype.update = function(t) {
    this.currentDate = Date.now(),
    this.setPosition(),
    this.setStates(),
    this.setKeyboard(),
    this.isEmotePlaying && this.updateEmotePlaying(),
    this.isDeath && this.setDeathAnimation()
}
;
var Enemy = pc.createScript("enemy");
Enemy.attributes.add("playerId", {
    type: "string",
    default: "0"
}),
Enemy.attributes.add("username", {
    type: "string",
    default: "none"
}),
Enemy.attributes.add("team", {
    type: "string",
    default: "none"
}),
Enemy.attributes.add("weapon", {
    type: "string",
    default: "Scar"
}),
Enemy.attributes.add("characterEntity", {
    type: "entity"
}),
Enemy.attributes.add("modelHolder", {
    type: "entity"
}),
Enemy.attributes.add("skins", {
    type: "entity",
    array: !0
}),
Enemy.attributes.add("headEntity", {
    type: "entity"
}),
Enemy.attributes.add("bodyEntity", {
    type: "entity"
}),
Enemy.attributes.add("weaponHolder", {
    type: "entity"
}),
Enemy.attributes.add("muzzlePoint", {
    type: "entity"
}),
Enemy.attributes.add("farPoint", {
    type: "entity"
}),
Enemy.attributes.add("meleePoint", {
    type: "entity"
}),
Enemy.attributes.add("meleeEntity", {
    type: "entity"
}),
Enemy.attributes.add("dashEntity", {
    type: "entity"
}),
Enemy.attributes.add("hammerEntity", {
    type: "entity"
}),
Enemy.attributes.add("katanaEntity", {
    type: "entity"
}),
Enemy.prototype.initialize = function() {
    this.lastDelta = 0,
    this.delta = .3,
    this.timestamp = 0,
    this.deltaTotal = .3,
    this.deltaCount = 1,
    this.lastDeltaDate = Date.now(),
    this.isActivated = !1,
    this.heroSkin = "Default",
    this.skinMaterial = !1,
    this.isActive = !0,
    this.isDashing = !1,
    this.isEmotePlaying = !1,
    this.headAngle = 52,
    this.bodyAngle = 62,
    this.spineFactorX = 1,
    this.spineFactorY = 0,
    this.spineFactorZ = -1,
    this.spineDirectionX = 0,
    this.spineDirectionY = -10,
    this.spineDirectionZ = 0,
    this.headAngleX = -90,
    this.headAngleY = 40,
    this.headAngleZ = 30,
    pc.testAngle = -10,
    pc.testAngleX = .5,
    pc.testAngleZ = .5,
    this.spineEntity = !1,
    this.sex = "Female",
    this.skin = "Lilium",
    this.currentAnimation = "none",
    this.lastDirection = "none",
    this.weaponSkins = {},
    this.health = 100,
    this.damageAngle = 0,
    this.currentPosition = new pc.Vec3(0,0,0),
    this.currentAngle = new pc.Vec3(0,0,0),
    this.nextPosition = new pc.Vec3(0,0,0),
    this.nextAngle = new pc.Vec3(0,0,0),
    this.tempAngle = new pc.Vec3(0,0,0),
    this.currentPosition.y = Utils.nullVector.y,
    this.nextPosition.y = Utils.nullVector.y,
    this.isDeath = !1,
    this.isJumping = !1,
    this.isShooting = 0,
    this.isForward = !1,
    this.isBackward = !1,
    this.isLeft = !1,
    this.isRight = !1,
    this.shootingState = !1,
    this.isShootingLocked = !1,
    this.lastDamage = Date.now(),
    this.timeout = {},
    this.currentWeapon = {},
    this.setWeapon("Scar", !1),
    this.farPoint.setLocalPosition(0, 0, 200),
    this.meleeEntity.enabled = !1,
    this.app.on("Player:Death", this.onPlayerDeath, this),
    this.app.on("Player:Respawn", this.onPlayerRespawn, this),
    this.app.on("Player:Ready", this.onPlayerReady, this),
    setTimeout(function(t) {
        t.setConnectionState()
    }, 1500, this),
    this.entity.on("destroy", this.onDestroy, this)
}
,
Enemy.prototype.onDestroy = function() {
    this.weaponHolder.destroy()
}
,
Enemy.prototype.onPlayerDeath = function() {
    this.entity && this.disableDamage()
}
,
Enemy.prototype.setUsername = function(t, i) {
    this.entity.script.label.enabled = !0,
    this.entity.script.label.setInitalize(),
    this.team = i,
    this.isActivated = "-1" == this.playerId,
    this.isActivated ? this.entity.script.label.setDestroy() : this.entity.script.label.setUsername(t, i)
}
,
Enemy.prototype.onPlayerRespawn = function() {
    this.entity && (this.disableDamage(),
    setTimeout(function(t) {
        t.enableDamage()
    }, 1e3, this))
}
,
Enemy.prototype.setWeapon = function(t) {
    if (this.isActivated)
        return !1;
    this.currentWeapon = this.app.root.findByName(t).script.weapon,
    this.currentWeapon.name = this.currentWeapon.entity.name;
    var i = this.entity.findByTag("Weapon");
    for (var e in i) {
        i[e].enabled = !1
    }
    var s = this.entity.findByName(t + "-Enemy");
    if (s && (s.enabled = !0,
    this.weaponEntity = s,
    this.weaponSkins && void 0 !== this.weaponSkins[t])) {
        var n = this.weaponSkins[t];
        n && this.setWeaponSkin(n)
    }
}
,
Enemy.prototype.setWeaponSkin = function(t) {
    if (t && this.weaponEntity) {
        var i = this.weaponEntity.model.material.clone()
          , e = this.app.assets.find(t)
          , s = this.weaponEntity.model.meshInstances;
        if (s) {
            for (var n = 0; n < s.length; ++n) {
                s[n].material = i
            }
            this.app.assets.load(e),
            e.ready(function(t) {
                i.diffuseMap = e.resource,
                i.update()
            })
        }
    }
}
,
Enemy.prototype.setCharacterSkin = function(t, i, e) {
    if (this.isActivated)
        return this.entity.collision.height = 1.5,
        this.modelHolder.enabled = !1,
        this.bodyEntity.enabled = !1,
        !1;
    this.entity.addComponent("rigidbody"),
    this.entity.rigidbody.type = pc.BODYTYPE_KINEMATIC,
    this.entity.rigidbody.enabled = !0,
    void 0 !== t && (this.skin = t);
    var s = this;
    for (var n in this.skins) {
        var a = this.skins[n];
        this.skin == a.name ? (a.enabled = !0,
        this.characterEntity = a) : a.enabled = !1
    }
    "Lilium" == this.skin ? (this.hammerEntity.enabled = !0,
    this.katanaEntity.enabled = !1) : "Shin" == this.skin && (this.hammerEntity.enabled = !1,
    this.katanaEntity.enabled = !0),
    e && this.setDanceAnimation(this.skin, e),
    i && (this.heroSkin = i),
    this.app.assets.find(this.skin + "-Character").ready(function() {
        s.loadCharacterParts()
    })
}
,
Enemy.prototype.setDanceAnimation = function(t, i) {
    var e = this.app.assets.find(t + "-" + i + "-Animation")
      , s = this.app.assets.find(t + "-" + i + "-Music.mp3");
    if (e) {
        this.app.assets.load(e);
        var n = this.characterEntity.animation.assets;
        n.push(e.id),
        this.characterEntity.animation.assets = n,
        this.entity.sound.slots.Emote.asset = s.id,
        this.danceName = t + "-" + i
    }
}
,
Enemy.prototype.loadCharacterParts = function() {
    var t = 90
      , i = -3.92
      , e = -180;
    "Lilium" == this.skin ? (this.headEntity = this.characterEntity.findByName("Character1_Head"),
    this.spineEntity = this.characterEntity.findByName("Character1_Spine2"),
    this.handEntity = this.characterEntity.findByName("Character1_RightHand"),
    this.headAngleX = 0,
    this.headAngleY = 52,
    this.headAngleZ = 0,
    this.spineFactorX = 1,
    this.spineFactorY = 0,
    this.spineFactorZ = -1,
    this.spineDirectionX = 0,
    this.spineDirectionY = -10,
    this.spineDirectionZ = 0,
    this.bodyAngle = 62,
    t = 90,
    i = -3.92,
    e = -180) : "Shin" == this.skin && (this.headEntity = this.characterEntity.findByName("Head"),
    this.spineEntity = this.characterEntity.findByName("Chest"),
    this.handEntity = this.characterEntity.findByName("Hand_R"),
    this.headAngleX = -90,
    this.headAngleY = 40,
    this.headAngleZ = 30,
    this.spineFactorX = -1,
    this.spineFactorY = -1,
    this.spineFactorZ = 0,
    this.spineDirectionX = 0,
    this.spineDirectionY = 0,
    this.spineDirectionZ = 0,
    this.bodyAngle = 70,
    t = 0,
    i = -10,
    e = -95),
    this.weaponHolder.setLocalEulerAngles(t, i, e),
    this.weaponHolder.setLocalScale(40, 40, 40),
    this.weaponHolder.reparent(this.handEntity),
    this.setHeroSkin(),
    setTimeout(function(t) {
        t.setAnimation("Idle")
    }, 100, this)
}
,
Enemy.prototype.setHeroSkin = function() {
    var t = this.skin + "-" + this.heroSkin + ".jpg";
    if (this.heroSkin && this.characterEntity) {
        for (var i = this.characterEntity.model.material.clone(), e = this.app.assets.find(t), s = this.characterEntity.model.meshInstances, n = 0; n < s.length; ++n) {
            s[n].material = i
        }
        this.app.assets.load(e),
        this.skinMaterial = i,
        e.ready(function(t) {
            i.emissive = new pc.Color(1,1,1,1),
            i.emissiveTint = !0,
            i.emissiveIntensity = 0,
            i.diffuseMap = e.resource,
            i.update()
        })
    }
}
,
Enemy.prototype.setAnimation = function(t, i) {
    this.currentAnimation != t && this.characterEntity && this.characterEntity.animation && (this.characterEntity.animation.play(t, i),
    this.currentAnimation = t)
}
,
Enemy.prototype.applyAbilityAffect = function(t) {
    this.entity.sound.play(t),
    this.lastDamage = Date.now(),
    this.entity.script.label.setAbility(t)
}
,
Enemy.prototype.setEmote = function() {
    var t = this.danceName;
    this.isEmotePlaying = !0,
    this.characterEntity.animation.speed = 1,
    this.characterEntity.animation.play(t + "-Animation"),
    this.entity.sound.play("Emote"),
    this.timeout.emote = setTimeout(function(t) {
        t.isEmotePlaying = !1
    }, 3e3, this)
}
,
Enemy.prototype.left = function() {
    clearTimeout(this.timeout.respawn),
    clearTimeout(this.timeout.death),
    clearTimeout(this.timeout.jump),
    clearTimeout(this.timeout.reload),
    this.entity.script.label.destroy(),
    this.entity.destroy()
}
,
Enemy.prototype.hideCharacter = function() {
    this.disableDamage(),
    this.characterEntity.enabled = !1
}
,
Enemy.prototype.showCharacter = function() {
    this.enableDamage(),
    this.characterEntity.enabled = !0
}
,
Enemy.prototype.death = function(t) {
    this.isDeath = !0,
    this.isForward = !1,
    this.isBackward = !1,
    this.isLeft = !1,
    this.isRight = !1,
    this.isJumping = !1,
    this.disableDamage(),
    "Drown" == t ? (this.entity.sound.play("Splash"),
    this.characterEntity.animation.speed = 4,
    this.characterEntity.setLocalPosition(0, -3.5, 0),
    this.setAnimation("Floating")) : (this.characterEntity.animation.speed = 1,
    this.characterEntity.setLocalPosition(0, -2, 0),
    this.setAnimation("Death")),
    this.app.fire("EffectManager:Skull", this.currentPosition),
    this.app.fire("EffectManager:KillSphere", this.currentPosition),
    this.nextAngle.y = this.damageAngle,
    this.currentAngle.y = this.damageAngle,
    this.timeout.death = setTimeout(function(t) {
        t && t.hideCharacter && t.hideCharacter()
    }, 2100, this)
}
,
Enemy.prototype.teleport = function() {
    this.currentPosition = this.nextPosition.clone(),
    this.entity.setPosition(this.currentPosition)
}
,
Enemy.prototype.respawn = function() {
    this.teleport(),
    this.characterEntity.animation.speed = 1,
    this.characterEntity.setLocalPosition(0, -2, 0),
    this.timeout.respawn = setTimeout(function(t) {
        t && (t.showCharacter(),
        t.setAnimation("Idle"),
        t.isDeath = !1)
    }, 800, this)
}
,
Enemy.prototype.dealSpell = function(t) {
    "Shuriken" == t && this.app.fire("Network:DealSpell", this.playerId)
}
,
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
    }
    this.app.fire("Network:Damage", t, i, s, this.playerId)
}
,
Enemy.prototype.onPlayerReady = function() {
    this.entity && this.entity.collision && (this.entity.collision.enabled = !0)
}
,
Enemy.prototype.disableDamage = function() {
    return !!this.entity.collision && (!this.isActivated && void (this.entity.collision.enabled = !1))
}
,
Enemy.prototype.enableDamage = function() {
    return !!this.entity.collision && (!this.isActivated && void (this.entity.collision.enabled = !0))
}
,
Enemy.prototype.setTeam = function(t) {
    this.team = t,
    this.entity.script.label.setTeam(t)
}
,
Enemy.prototype.setHealth = function(t) {
    this.health = t,
    this.entity.script.label.setHealth(this.health)
}
,
Enemy.prototype.shoot = function() {
    if (!this.currentWeapon)
        return !1;
    this.spreadNumber = 10;
    var t = this.muzzlePoint.getPosition()
      , i = this.farPoint.getPosition()
      , e = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber
      , s = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber
      , n = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber
      , a = i.clone().add(new pc.Vec3(e,s,n))
      , h = this.playerId
      , o = this.currentWeapon.name + "-Fire";
    this.entity.sound.slots[o].pitch = 1 - .1 * Math.random(),
    this.entity.sound.play(o),
    this.app.fire("EffectManager:Fire", t, a, t, h),
    this.isShootingLocked = !0
}
,
Enemy.prototype.setState = function(t, i) {
    if (!this.isActive)
        return !1;
    switch (t) {
    case "w":
        this.isForward = i;
        break;
    case "s":
        this.isBackward = i;
        break;
    case "a":
        this.isLeft = i;
        break;
    case "d":
        this.isRight = i;
        break;
    case "f":
        this.shootingState = i
    }
    this.setConnectionState(!0)
}
,
Enemy.prototype.triggerEvent = function(t) {
    if (!this.isActive)
        return !1;
    if (this.isDeath)
        return !1;
    switch (t) {
    case "r":
        this.reload();
        break;
    case "m":
        this.melee();
        break;
    case "j":
        this.jump();
        break;
    case "bj":
        this.bounceJump();
        break;
    case "dash":
        this.dash();
        break;
    case "emote":
        this.setEmote();
        break;
    case "watch-ads":
        this.app.fire("Overlay:WatchAds", this.playerId);
        break;
    case "l":
        this.land()
    }
}
,
Enemy.prototype.dash = function() {
    if (this.isDashing)
        return !1;
    "Shin" == this.skin && (this.isDashing = !0,
    this.entity.sound.play(this.skin + "-Dash"),
    this.entity.sound.play("Whoosh-High"),
    this.entity.sound.play("Buff-Attack-1"),
    this.characterEntity.animation.speed = 1,
    this.setAnimation("Shin-Dash"),
    this.dashEntity.enabled = !0,
    setTimeout(function(t) {
        t.dashEntity.enabled = !1
    }, 500, this),
    setTimeout(function(t) {
        t.isDashing = !1
    }, 1e3, this))
}
,
Enemy.prototype.reload = function() {
    this.timeout.reload = setTimeout(function(t) {
        t && t.entity && t.entity.sound.play(t.currentWeapon.entity.name + "-Reload")
    }, 1200, this)
}
,
Enemy.prototype.land = function() {
    this.isJumping = !1
}
,
Enemy.prototype.jump = function() {
    var t = Math.round(1 * Math.random()) + 1;
    this.isJumping = !0,
    this.characterEntity.animation.speed = 1,
    this.setAnimation("Jump-" + t);
    var i = this.skin + "-Jump-" + t;
    this.entity.sound.play(i),
    this.timeout.jump = setTimeout(function(t) {
        t.land()
    }, 2e3, this)
}
,
Enemy.prototype.melee = function() {
    var t = Math.round(1 * Math.random()) + 1
      , i = this.skin + "-Jump-" + t;
    this.entity.sound.play(i),
    this.currentAngle.x = this.currentAngle.x - 2,
    this.meleeEntity.enabled = !0,
    this.entity.sound.play("Whoosh"),
    this.entity.sound.play("Impact-Iron"),
    this.meleeEntity.setLocalEulerAngles(170.53, 21.25, 158.02),
    this.meleeEntity.tween(this.meleeEntity.getLocalEulerAngles()).rotate({
        x: 130.23,
        y: -78.41,
        z: -149.33
    }, .3, pc.BackOut).start();
    var e = this.muzzlePoint.getPosition()
      , s = this.meleePoint.getPosition()
      , n = Math.round(20 * Math.random()) + 80;
    this.app.fire("EffectManager:Hit", "Melee", e, s, this.playerId, n),
    setTimeout(function(t) {
        t.meleeEntity.enabled = !1
    }, 300, this)
}
,
Enemy.prototype.bounceJump = function() {
    var t = Math.round(1 * Math.random()) + 1;
    this.isJumping = !0,
    this.characterEntity.animation.speed = 1,
    this.setAnimation("Jump-" + t);
    this.entity.sound.play("Bounce-Jump")
}
,
Enemy.prototype.setDirection = function() {
    if (this.isDeath || this.isJumping || this.isEmotePlaying || this.isDashing)
        return !1;
    var t = "none";
    if (this.isForward && this.isLeft ? t = "Forward-Left" : this.isForward && this.isRight ? t = "Forward-Right" : this.isBackward && this.isLeft ? t = "Backward-Left" : this.isBackward && this.isRight ? t = "Backward-Right" : this.isForward ? t = "Forward" : this.isBackward ? t = "Backward" : this.isLeft ? t = "Left" : this.isRight && (t = "Right"),
    "none" != t) {
        var i = Math.min(Math.max(this.speed / pc.variables.enemySpeed, pc.variables.minEnemySpeed), pc.variables.maxEnemySpeed);
        "none" != this.lastDirection && this.setAnimation(this.lastDirection, .1),
        this.characterEntity.animation.speed = pc.math.lerp(this.characterEntity.animation.speed, i, .3),
        this.entity.sound.slots.Footsteps.isPlaying || this.entity.sound.play("Footsteps"),
        this.lastDirection = t
    } else
        this.entity.sound.stop("Footsteps"),
        this.setAnimation("Idle", .2)
}
,
Enemy.prototype.updateShooting = function() {
    this.shootingState && !this.isShootingLocked && (this.isShooting = this.currentWeapon.shootTime + this.timestamp),
    this.isShooting > this.timestamp && !this.isShootingLocked && this.shoot(),
    this.isShooting < this.timestamp && this.isShootingLocked && (this.isShootingLocked = !1)
}
,
Enemy.prototype.setPosition = function(t, i, e, s, n) {
    if (this.isDeath)
        return !1;
    this.nextPosition.x = t,
    this.nextPosition.y = i,
    this.nextPosition.z = e,
    this.nextAngle.x = n * pc.math.DEG_TO_RAD,
    this.nextAngle.y = s * pc.math.DEG_TO_RAD - 90,
    this.isActivated && this.entity.setPosition(t, i, e);
    var a = Date.now() - this.lastDeltaDate;
    a = a < 40 ? .3 : a < 200 ? .03 : a < 600 ? .01 : .4,
    this.lastDeltaDate = Date.now(),
    this.delta = pc.math.lerp(this.delta, a, .05)
}
,
Enemy.prototype.setConnectionState = function() {
    this.isActivated || (this.modelHolder.enabled = !0)
}
,
Enemy.prototype.setMovement = function(t) {
    if (this.speed = this.entity.getPosition().clone().sub(this.nextPosition.clone()).length(),
    this.speed > 20 && this.teleport(),
    this.tempAngle = this.tempAngle.lerp(this.tempAngle, Utils.zeroVector, .1),
    this.currentPosition = this.currentPosition.lerp(this.currentPosition, this.nextPosition, this.delta),
    this.currentAngle.x = pc.math.lerpAngle(this.currentAngle.x, this.nextAngle.x, this.delta),
    this.currentAngle.y = pc.math.lerpAngle(this.currentAngle.y, this.nextAngle.y, this.delta),
    this.entity.setPosition(this.currentPosition),
    !this.headEntity)
        return !1;
    this.headEntity && this.headEntity.setLocalEulerAngles(this.headAngleX, this.headAngleY, this.headAngleZ);
    var i = -this.currentAngle.x * pc.math.RAD_TO_DEG - this.tempAngle.x * pc.math.RAD_TO_DEG;
    this.spineEntity.setLocalEulerAngles(i * this.spineFactorX + this.spineDirectionX, i * this.spineFactorY + this.spineDirectionY, i * this.spineFactorZ + this.spineDirectionZ),
    this.bodyEntity.setLocalEulerAngles(-this.currentAngle.x * pc.math.RAD_TO_DEG, this.currentAngle.y * pc.math.RAD_TO_DEG - this.bodyAngle, 0),
    this.characterEntity.setLocalEulerAngles(0, this.currentAngle.y * pc.math.RAD_TO_DEG - this.tempAngle.y * pc.math.RAD_TO_DEG - this.bodyAngle, 0)
}
,
Enemy.prototype.update = function(t) {
    if (this.isActivated)
        return !1;
    this.setMovement(t),
    this.lastDelta += t;
    var i = this.lastDelta;
    i > pc.dt - .001 && (this.setDirection(),
    this.updateShooting(),
    this.timestamp += i,
    this.lastDelta = 0)
}
;
var MapManager = pc.createScript("mapManager");
MapManager.attributes.add("defaultMap", {
    type: "string"
}),
MapManager.attributes.add("mapHolder", {
    type: "entity"
}),
MapManager.attributes.add("autoLoad", {
    type: "boolean",
    default: !1
}),
MapManager.prototype.initialize = function() {
    this.autoLoad && this.loadMap(this.defaultMap),
    this.mapName = !1,
    this.mapTimer = !1,
    this.isLoaded = !1,
    this.isLoading = 0,
    this.app.on("Map:Load", this.loadMap, this),
    this.app.on("Map:Destroy", this.onDestroy, this),
    this.app.on("Map:Thunder", this.thunder, this),
    this.app.on("Game:PreStart", this.onPreStart, this),
    this.app.on("Game:Finish", this.onFinish, this),
    pc.isMapLoaded = !1,
    this.setRandomSounds()
}
,
MapManager.prototype.onPreStart = function() {
    this.isLoaded = !1
}
,
MapManager.prototype.onFinish = function() {
    this.isLoaded = !1
}
,
MapManager.prototype.onDestroy = function(t) {
    this.clearHolder(),
    this.mapHolder.destroy(),
    this.entity.destroy()
}
,
MapManager.prototype.loadMap = function(t) {
    var a = this;
    this.clearHolder(function() {
        a.setMap(t)
    })
}
,
MapManager.prototype.setMap = function(t) {
    if (this.isLoaded)
        return !1;
    console.log("Loading map : ", t),
    this.mapName = t;
    var a = this
      , e = this.app.scenes.find(t)
      , o = "1.0.0";
    "undefined" != typeof VERSION && (o = VERSION),
    this.isLoading = Date.now(),
    pc.isMapLoaded = !1,
    e && e.url && (this.app.scenes.loadSceneHierarchy(e.url + "?v=" + o, function(t, i) {
        i && (a.mapHolder.reparent(i),
        a.app.scenes.loadSceneSettings(e.url + "?v=" + o, function(t, a) {
            setTimeout(function() {
                pc.app.fire("Map:Loaded", !0)
            }, 1500),
            pc.isMapLoaded = !0
        })),
        t && console.log("[ERROR] ", t)
    }),
    this.isLoaded = !0)
}
,
MapManager.prototype.thunder = function() {
    if (Utils.isMobile())
        return !1;
    var t = this.app.scene.exposure + 1e-4;
    this.app.scene.exposure = t + 15,
    this.app.tween(this.app.scene).to({
        exposure: t
    }, .1, pc.Linear).delay(.15).start(),
    this.entity.sound.slots.Thunder.pitch = 1 + .2 * Math.random(),
    this.entity.sound.play("Thunder")
}
,
MapManager.prototype.setRandomSounds = function() {
    "Mistle" == this.mapName && this.entity.sound.play("Seagull"),
    setTimeout(function(t) {
        t.setRandomSounds()
    }, 1e3 * (50 + 90 * Math.random()), this)
}
,
MapManager.prototype.clearHolder = function(t) {
    var a = this.app.root.findByName("MapHolder");
    a && (a.on("destroy", function() {
        console.log("Destroy properly completed!"),
        t()
    }),
    a.destroy())
}
;
var PhysicsManager = pc.createScript("physicsManager");
PhysicsManager.attributes.add("mapHolder", {
    type: "entity"
}),
PhysicsManager.attributes.add("playerEntity", {
    type: "entity"
}),
PhysicsManager.prototype.initialize = function() {}
;
var Menu = pc.createScript("menu");
Menu.attributes.add("cameraEntity", {
    type: "entity"
}),
Menu.attributes.add("linkEntity", {
    type: "entity"
}),
Menu.attributes.add("header", {
    type: "entity"
}),
Menu.attributes.add("contentHolder", {
    type: "entity"
}),
Menu.attributes.add("shopIconEntity", {
    type: "entity"
}),
Menu.attributes.add("characterEntity", {
    type: "entity"
}),
Menu.attributes.add("characterHolder", {
    type: "entity"
}),
Menu.attributes.add("weaponName", {
    type: "entity"
}),
Menu.attributes.add("weaponEntity", {
    type: "entity"
}),
Menu.attributes.add("weaponIcon", {
    type: "entity"
}),
Menu.attributes.add("matchFoundBackground", {
    type: "entity"
}),
Menu.attributes.add("matchFoundText", {
    type: "entity"
}),
Menu.attributes.add("matchFoundRectangle", {
    type: "entity"
}),
Menu.attributes.add("matchFoundCenter", {
    type: "entity"
}),
Menu.attributes.add("matchFoundLoading", {
    type: "entity"
}),
Menu.attributes.add("characterIcon", {
    type: "entity"
}),
Menu.attributes.add("characterName", {
    type: "entity"
}),
Menu.attributes.add("meleeIcon", {
    type: "entity"
}),
Menu.attributes.add("throwIcon", {
    type: "entity"
}),
Menu.attributes.add("twitchName", {
    type: "entity"
}),
Menu.attributes.add("twitchButton", {
    type: "entity"
}),
Menu.attributes.add("youtubeName", {
    type: "entity"
}),
Menu.attributes.add("youtubeButton", {
    type: "entity"
}),
Menu.attributes.add("miniProfileEntity", {
    type: "entity"
}),
Menu.attributes.add("versionEntity", {
    type: "entity"
}),
Menu.attributes.add("updateEntity", {
    type: "entity"
}),
Menu.attributes.add("updateVersionEntity", {
    type: "entity"
}),
Menu.attributes.add("offerPopup", {
    type: "entity"
}),
Menu.attributes.add("mobileWaiting", {
    type: "entity"
}),
Menu.attributes.add("mobileFreeCoin", {
    type: "entity"
}),
Menu.attributes.add("mobileRedirection", {
    type: "entity"
}),
Menu.attributes.add("mobileUsernameChange", {
    type: "entity"
}),
Menu.prototype.initialize = function() {
    if (this.currentWidth = 0,
    this.currentHeight = 0,
    this.currentKey = !1,
    this.isMatchFound = !1,
    this.isConnected = !1,
    pc.session = {
        weapon: "Scar",
        character: "Lilium",
        hash: !1,
        username: !1
    },    
	this.app.on("Player:Weapon", this.onWeaponSelect, this),
    this.app.on("Player:Character", this.onCharacterSelect, this),
    this.app.on("Template:Profile", this.onProfileData, this),
    this.app.on("Game:Found", this.onMatchFound, this),
    this.app.on("Game:Connect", this.onConnect, this),
    this.app.on("Menu:Mute", this.setMute, this),
    this.app.on("Menu:SetHome", this.setHome, this),
    this.app.on("Menu:KeyChange", this.setKey, this),
    this.app.on("Menu:CloseMobile", this.onCloseMobile, this),
    this.app.on("Menu:BuyOffer", this.onOfferBuy, this),
    this.app.on("Menu:CloseOffer", this.onOfferClose, this),
    this.app.on("Buy:State", this.onMobileBuyState, this),
    this.app.on("Menu:Music", this.setMenuMusic, this),
    this.mobileUUID = !1,
    this.app.on("Account:CreateMobileUser", this.createMobileUser, this),
    this.app.on("Account:SaveUUID", this.onSaveUUID, this),
    this.app.on("Account:ChangeUsername", this.triggerChangeUsername, this),
    this.app.on("Account:ChangeStatus", this.onChangeStatus, this),
    this.app.on("Account:Reward", this.onAccountReward, this),
    this.app.on("Page:Menu", this.onPageChange, this),
    this.app.on("Tab:Settings", this.onSettings, this),
    this.setProfile(),
    this.app.fire("Menu:KeyboardConfiguration", !0),
    this.setBanner(),
    this.setMobileElements(),
    this.app.on("Sound:Play", this.onSoundPlay, this),
    this.attachCharacterEntity(),
    this.entity.on("destroy", this.onDestroy, this),
    "undefined" != typeof VERSION_CODE && (this.versionEntity.element.text = "v" + VERSION_CODE),
    window.addEventListener("resize", function() {
        "undefined" != typeof pc && pc.app.fire("DOM:Update", !0)
    }),
    window.oncontextmenu = function() {
        return !1
    }
    ,
    this.mobileRedirection && !pc.isMobile && (Utils.isIOS() ? this.mobileRedirection.enabled = !0 : this.mobileRedirection.enabled = !1),
    Utils.isMobile() && this.mobileFreeCoin.setLocalScale(1.2, 1.2, 1.2),
    pc.isMobile) {
        Utils.getItem("MobileUsernameChanged") && this.mobileUsernameChange.destroy();
        try {
            window.webkit.messageHandlers.iosListener.postMessage("request-uuid")
        } catch (e) {}
        "Offered" != Utils.getItem("MobileOffer") && (this.offerPopup.enabled = !0),
        this.offerAccepted = !1
    } else
        this.mobileUsernameChange.destroy();
    this.app.fire("Ads:Adblock", !0)
}
,
Menu.prototype.onMobileBuyState = function(e) {
    this.offerAccepted && ("error" == e ? this.app.fire("Alert:Menu", "An error occured on payment!") : "successful" == e ? (this.app.fire("Fetcher:MobilePayment", {
        token: "mobile-process",
        sku: "10000VG"
    }),
    this.onOfferClose(),
    Utils.setItem("MobileAds", "NoAds")) : "restored" == e && (this.app.fire("Fetcher:MobilePayment", {
        token: "mobile-process",
        sku: "10000VG"
    }),
    this.onOfferClose(),
    Utils.setItem("MobileAds", "NoAds")))
}
,
Menu.prototype.onOfferClose = function() {
    this.offerPopup.enabled = !1,
    Utils.setItem("MobileOffer", "Offered")
}
,
Menu.prototype.onOfferBuy = function() {
    this.offerAccepted = 1,
    window.webkit.messageHandlers.iosListener.postMessage("buy:10000VG")
}
,
Menu.prototype.onAccountReward = function() {
    this.app.fire("Ads:BannerDestroy", "venge-io_728x90", "728x90"),
    this.app.systems.sound.volume = 0,
    this.app.fire("Ads:RewardAds", function() {
        pc.app.fire("Ads:BannerSet", "venge-io_728x90", "728x90"),
        pc.app.fire("Fetcher:Reward", !0),
        pc.app.systems.sound.volume = .25
    }, function() {
        pc.app.fire("Ads:BannerSet", "venge-io_728x90", "728x90"),
        pc.app.fire("Alert:Menu", "Please disable adblock to enable rewards!"),
        pc.app.systems.sound.volume = .25
    }),
    this.app.fire("Analytics:Event", "RewardAds", "FromMenu")
}
,
Menu.prototype.setMenuMusic = function(e) {
    this.entity && this.entity.sound
}
,
Menu.prototype.onSaveUUID = function() {
    this.mobileUUID && (Utils.setItem("MobileHash", this.mobileUUID),
    setTimeout(function(e) {
        e.mobileWaiting.enabled = !1,
        window.location.reload(!0)
    }, 1e3, this))
}
,
Menu.prototype.createMobileUser = function(e) {
    var t = Utils.getItem("Hash");
    !Utils.isMobile() || t && "undefined" != t || (this.app.fire("Fetcher:MobileAccount", {
        username: "mobile_" + e,
        password: "pass_" + e
    }),
    this.mobileWaiting.enabled = !0,
    this.mobileUUID = e)
}
,
Menu.prototype.triggerChangeUsername = function() {
    var e = prompt("Enter new username", "");
    null !== e && this.app.fire("Fetcher:MobileUsername", {
        username: e
    })
}
,
Menu.prototype.onChangeStatus = function(e) {
    this.app.fire("Fetcher:MiniProfile", !0),
    Utils.setItem("MobileUsernameChanged", !0)
}
,
Menu.prototype.setMobileElements = function() {
    if (Utils.isMobile()) {
        var e = this.app.root.findByTag("DesktopOnly");
        for (var t in e) {
            e[t].enabled = !1
        }
        this.header.setLocalScale(1.2, 1.2, 1.2),
        this.contentHolder.setLocalPosition(0, -90, 0),
        this.contentHolder.setLocalScale(1.2, 1.2, 1.2),
        this.shopIconEntity.setLocalPosition(40, 0, 0)
    }
}
,
Menu.prototype.onCloseMobile = function() {
    this.mobileRedirection.enabled = !1
}
,
Menu.prototype.attachCharacterEntity = function() {
    var e = "Character1_RightHand";
    "Lilium" == pc.session.character ? e = "Character1_RightHand" : "Shin" == pc.session.character && (e = "Hand_R");
    var t = this.characterEntity.findByName(e);
    t && (this.weaponEntity = this.characterEntity.findByName("Weapon"),
    this.weaponEntity.setLocalScale(100, 100, 100),
    this.weaponEntity.reparent(t)),
    this.app.fire("Player:Weapon", pc.session.weapon)
}
,
Menu.prototype.onPageChange = function() {
    setTimeout(function(e) {
        e.app.fire("DOM:Update", !0)
    }, 100, this)
}
,
Menu.prototype.onSettings = function(e) {
    "Keyboard" == e && setTimeout(function(e) {
        e.setKeyboardTable()
    }, 100, this)
}
,
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
,
Menu.prototype.setKey = function(e) {
    this.setKeyboardTable(e)
}
,
Menu.prototype.defineKey = function(e) {
    e.key;
    var t = Utils.getItem("KeyConfiguration");
    t = t ? JSON.parse(t) : {},
    this.currentKey && (t[this.currentKey] = e.key),
    Utils.setItem("KeyConfiguration", JSON.stringify(t)),
    this.setKeyboardTable(),
    this.app.fire("Menu:KeyboardConfiguration", !0),
    this.currentKey = !1
}
,
Menu.prototype.setHome = function(e) {
    return !this.isConnected && (!!this.youtubeName && ("undefined" != typeof VERSION_CODE && (VERSION_CODE == e.version || pc.isMobile || (this.updateEntity.enabled = !0,
    this.updateVersionEntity.element.text = e.version)),
    !!this.twitchButton && (e.display_name && Math.random() > .2 ? (this.youtubeButton.enabled = !1,
    this.twitchButton.enabled = !0,
    this.twitchName.element.text = e.display_name,
    this.twitchButton.element.width = this.twitchName.element.calculatedWidth + 50,
    this.twitchButton.script.button.triggerFunction = 'window.open("https://www.twitch.tv/' + e.username + '");') : (this.twitchButton.enabled = !1,
    this.youtubeButton.enabled = !0,
    this.youtubeName.element.text = e.youtuber.name,
    this.youtubeButton.element.width = this.youtubeName.element.calculatedWidth + 50,
    this.youtubeButton.script.button.triggerFunction = 'window.open("' + e.youtuber.link + '");'),
    void (e.server && this.app.fire("RoomManager:SetServer", e.server)))))
}
,
Menu.prototype.setMute = function() {
    this.entity.sound.stop("Loop")
}
,
Menu.prototype.setProfile = function() {
    var e = Utils.getItem("Hash");
    void 0 !== e && (pc.session.hash = e),
    window.location.href.search("create-account") > -1 && setTimeout(function() {
        pc.app.fire("Page:Menu", "Account"),
        setTimeout(function() {
            pc.app.fire("Tab:Login", "Create Account")
        }, 10)
    }, 50)
}
,
Menu.prototype.onProfileData = function(e) {
    if (this.isMatchFound)
        return !1;
    e && (pc.session.hash = e.hash,
    pc.session.username = e.username,
    Utils.setItem("Hash", e.hash),
    e.username && this.miniProfileEntity && this.miniProfileEntity.element && (this.miniProfileEntity.element.width = 415 + 3.5 * e.username.length))
}
,
Menu.prototype.onDestroy = function(e) {
    this.app.off("Sound:Play"),
    this.app.off("Player:Weapon")
}
,
Menu.prototype.onSoundPlay = function(e) {
    this.entity && this.entity.enabled && this.entity.sound.play(e)
}
,
Menu.prototype.onMatchFound = function() {
    this.isMatchFound = !0,
    this.app.scene.layers.getLayerByName("Lightroom").enabled = !1,
    this.app.scene.layers.getLayerByName("Lightroom-Top").enabled = !1,
    clearTimeout(this.bannerTimeout),
    this.app.fire("Ads:BannerDestroy", "venge-io_728x90", "728x90"),
    this.app.fire("DOM:Clear", !0),
    this.app.off("Player:Character"),
    this.app.fire("Popup:Close", !0),
    this.matchFoundBackground.enabled = !0,
    this.matchFoundBackground.tween(this.matchFoundBackground.element).to({
        opacity: 1
    }, 1, pc.Linear).start(),
    // this.matchFoundRectangle.element.opacity = 1,
    // this.matchFoundRectangle.setLocalScale(20, 1, 1),
    // this.matchFoundRectangle.tween(this.matchFoundRectangle.getLocalScale()).to({
    //     x: 1,
    //     y: 1,
    //     z: 1
    // }, .5, pc.Linear).start(),
    // this.matchFoundRectangle.tween(this.matchFoundRectangle.element).to({
    //     opacity: .1
    // }, .5, pc.Linear).start(),
    this.matchFoundBackground.element.opacity = 0,
    this.matchFoundText.element.opacity = 0,
    this.matchFoundCenter.setLocalScale(3, 3, 3),
    this.matchFoundCenter.tween(this.matchFoundCenter.getLocalScale()).to({
        x: 1.2,
        y: 1.2,
        z: 1.2
    }, .5, pc.QuarticOut).start(),
    this.matchFoundBackground.tween(this.matchFoundCenter.element).to({
        opacity: 1
    }, .5, pc.Linear).start(),
    this.matchFoundText.tween(this.matchFoundText.element).to({
        opacity: 1
    }, .5, pc.QuarticOut).start(),
    setTimeout(function(e) {
        e.matchFoundLoading.enabled = !0,
        e.matchFoundRectangle.tween(e.matchFoundRectangle.element).to({
            opacity: 0
        }, .5, pc.Linear).start(),
        e.matchFoundText.tween(e.matchFoundText.element).to({
            opacity: 0
        }, .5, pc.Linear).start(),
        setTimeout(function() {
            pc.app.fire("Game:Connect", !0)
        }, 2000)
    }, 1150, this)
}
,
Menu.prototype.onConnect = function() {
    var e = this.app.scenes.find("Prototype")
      , t = this.app.root
      , n = "1.0.0";
    "undefined" != typeof VERSION && (n = VERSION),
    this.isConnected = !0,
    this.app.root.findByName("MenuHolder").destroy(),
    this.app.scenes.loadSceneHierarchy(e.url + "?v=" + n, function(e, n) {
        n.reparent(t)
    })
}
,
Menu.prototype.onWeaponSelect = function(e) {
    var t = this.weaponEntity.findByTag("Weapon")
      , n = this.app.assets.find(e + "-Thumbnail-White.png");
    for (var i in t) {
        t[i].enabled = !1
    }
    this.weaponEntity.findByName(e).enabled = !0,
    this.weaponIcon.element.textureAsset = n,
    this.weaponName.element.text = e.toLowerCase(),
    this.entity.sound.play("Whoosh"),
    pc.session.weapon = e
}
,
Menu.prototype.onCharacterSelect = function(e) {
    var t = this.characterHolder.findByTag("Character")
      , n = this.app.assets.find(e + "-Thumbnail-3");
    for (var i in t) {
        t[i].enabled = !1
    }
    var a = this.characterHolder.findByName(e);
    a.enabled = !0,
    this.characterEntity = a,
    this.characterIcon.element.textureAsset = n,
    this.characterName.element.text = e.toLowerCase(),
    this.entity.sound.play("Whoosh"),
    "Lilium" == e ? (this.meleeIcon.element.textureAsset = this.app.assets.find("Lilium-Melee.png"),
    this.throwIcon.element.textureAsset = this.app.assets.find("Grenade-Icon.png")) : "Shin" == e && (this.meleeIcon.element.textureAsset = this.app.assets.find("Shin-Melee.png"),
    this.throwIcon.element.textureAsset = this.app.assets.find("Star-Icon.png")),
    pc.session.character = e,
    this.attachCharacterEntity()
}
,
Menu.prototype.checkScreenSize = function() {
    if (window.innerWidth != this.currentWidth || window.innerHeight != this.currentHeight) {
        var e = this.entity.findByTag("ScreenSize");
        for (var t in e) {
            var n = e[t];
            n.element.width = window.innerWidth,
            n.element.height = window.innerHeight
        }
        this.currentWidth = window.innerWidth,
        this.currentHeight = window.innerHeight
    }
}
,
Menu.prototype.setBanner = function() {
    Utils.isMobile() ? this.app.fire("Ads:BannerSet", "venge-io_320x50", "320x50") : this.app.fire("Ads:BannerSet", "venge-io_728x90", "728x90")
}
,
Menu.prototype.update = function(e) {
    this.checkScreenSize()
}
;
Object.assign(pc, function() {
    var t = function(t) {
        pc.PostEffect.call(this, t);
        var e = {
            aPosition: pc.SEMANTIC_POSITION
        }
          , i = ["attribute vec2 aPosition;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "    gl_Position = vec4(aPosition, 0.0, 1.0);", "    vUv0 = (aPosition.xy + 1.0) * 0.5;", "}"].join("\n")
          , c = ["precision " + t.precision + " float;", "", "uniform sampler2D uColorBuffer;", "varying vec2 vUv0;", "", "void main() {", "    vec4 color = texture2D(uColorBuffer, vUv0);", "    float gray = dot(color.rgb, vec3(0.199, 0.587, 0.114));", "    gl_FragColor = vec4(vec3(gray), 1.0);", "}"].join("\n");
        this.blackWhiteShader = new pc.Shader(t,{
            attributes: e,
            vshader: i,
            fshader: c
        })
    };
    return (t.prototype = Object.create(pc.PostEffect.prototype)).constructor = t,
    Object.assign(t.prototype, {
        render: function(t, e, i) {
            var c = this.device;
            c.scope.resolve("uColorBuffer").setValue(t.colorBuffer),
            pc.drawFullscreenQuad(c, e, this.vertexBuffer, this.blackWhiteShader, i)
        }
    }),
    {
        BlackWhiteEffect: t
    }
}());
var BlackWhite = pc.createScript("blackWhite");
BlackWhite.prototype.initialize = function() {
    this.effect = new pc.BlackWhiteEffect(this.app.graphicsDevice),
    this.effect.offset = this.offset,
    this.effect.darkness = this.darkness,
    this.on("attr", function(t, e) {
        this.effect[t] = e
    }, this);
    var t = this.entity.camera.postEffects;
    t.addEffect(this.effect),
    this.on("state", function(e) {
        e ? t.addEffect(this.effect) : t.removeEffect(this.effect)
    }),
    this.on("destroy", function() {
        t.removeEffect(this.effect)
    })
}
;
var Variables = pc.createScript("variables");
Variables.attributes.add("redTeamColor", {
    type: "rgb"
}),
Variables.attributes.add("blueTeamColor", {
    type: "rgb"
}),
Variables.attributes.add("enemyColor", {
    type: "rgb"
}),
Variables.attributes.add("friendlyColor", {
    type: "rgb"
}),
Variables.attributes.add("meColor", {
    type: "rgb"
}),
Variables.attributes.add("lowHealth", {
    type: "rgb"
}),
Variables.attributes.add("health", {
    type: "rgb"
}),
Variables.attributes.add("grayColor", {
    type: "rgb"
}),
Variables.attributes.add("captureColor", {
    type: "rgb"
}),
Variables.attributes.add("blackColor", {
    type: "rgb"
}),
Variables.attributes.add("purpleColor", {
    type: "rgb"
}),
Variables.attributes.add("whiteColor", {
    type: "rgb"
}),
Variables.attributes.add("explosive", {
    type: "rgb"
}),
Variables.attributes.add("danger", {
    type: "rgb"
}),
Variables.attributes.add("activeColor", {
    type: "rgb"
}),
Variables.attributes.add("enemySpeed", {
    type: "number"
}),
Variables.attributes.add("maxEnemySpeed", {
    type: "number"
}),
Variables.attributes.add("minEnemySpeed", {
    type: "number"
}),
Variables.attributes.add("minEnemyVelocity", {
    type: "number"
}),
Variables.prototype.initialize = function() {
    pc.colors = {},
    pc.colors.lowHealth = this.lowHealth,
    pc.colors.health = this.health,
    pc.colors.capture = this.captureColor,
    pc.colors.black = this.blackColor,
    pc.colors.purple = this.purpleColor,
    pc.colors.white = this.whiteColor,
    pc.colors.gray = this.grayColor,
    pc.colors.transparent = new pc.Color(0,0,0,0),
    pc.colors.redTeam = this.redTeamColor,
    pc.colors.blueTeam = this.blueTeamColor,
    pc.colors.enemy = this.enemyColor,
    pc.colors.friendly = this.friendlyColor,
    pc.colors.me = this.meColor,
    pc.colors.active = this.activeColor,
    pc.colors.danger = this.danger,
    pc.colors.explosive = this.explosive,
    pc.variables = {},
    pc.variables.enemySpeed = this.enemySpeed,
    pc.variables.minEnemySpeed = this.minEnemySpeed,
    pc.variables.maxEnemySpeed = this.maxEnemySpeed,
    pc.variables.minEnemyVelocity = this.minEnemyVelocity
}
;
var Label = pc.createScript("label");
Label.attributes.add("headPoint", {
    type: "entity"
}),
Label.attributes.add("labelEntity", {
    type: "entity"
}),
Label.attributes.add("spectatorLabelEntity", {
    type: "entity"
}),
Label.attributes.add("screenEntity", {
    type: "entity"
}),
Label.attributes.add("spectatorScreenEntity", {
    type: "entity"
}),
Label.attributes.add("labelHolder", {
    type: "entity"
}),
Label.attributes.add("spectatorLabelHolder", {
    type: "entity"
}),
Label.attributes.add("abilityEntity", {
    type: "entity"
}),
Label.attributes.add("spectatorCameraEntity", {
    type: "entity"
}),
Label.prototype.initialize = function() {
    this.isInitalized = !1,
    this.team = "none",
    this.isEnabled = !0,
    this.app.on("Game:Mode", this.onGameMode, this),
    this.app.on("Game:Finish", this.onGameFinish, this),
    this.app.on("Player:Respawn", this.onPlayerRespawn, this),
    this.app.on("Player:Death", this.onPlayerDeath, this)
}
,
Label.prototype.onGameMode = function() {
    this.isEnabled = !0
}
,
Label.prototype.onGameFinish = function() {
    this.isEnabled = !1
}
,
Label.prototype.onPlayerRespawn = function() {
    this.isEnabled = !0
}
,
Label.prototype.onPlayerDeath = function() {
    this.isEnabled = !1
}
,
Label.prototype.setInitalize = function() {
    pc.isSpectator ? (this.labelEntity = this.spectatorLabelEntity.clone(),
    this.screenEntity = this.spectatorScreenEntity,
    this.labelHolder = this.spectatorLabelHolder) : this.labelEntity = this.labelEntity.clone(),
    this.healthBarEntity = this.labelEntity.findByName("HealthBar"),
    this.whiteBarEntity = this.labelEntity.findByName("WhiteBar"),
    this.abilityEntity = this.labelEntity.findByName("Ability"),
    this.abilityEntity.enabled = !1,
    this.labelHolder.addChild(this.labelEntity),
    this.player = this.entity.script.enemy,
    this.isVisible = !1,
    this.abilityTimer = !1,
    this.currentCamera = this.app.systems.camera.cameras[0],
    pc.isSpectator && (this.currentCamera = this.spectatorCameraEntity.camera),
    this.isInitalized = !0
}
,
Label.prototype.setDestroy = function() {
    this.app.off("Game:Mode", this.onGameMode),
    this.labelEntity.destroy(),
    this.destroy()
}
,
Label.prototype.setUsername = function(t, e) {
    this.labelEntity.findByName("Username").element.text = t,
    this.team = e,
    this.updateTeamColor()
}
,
Label.prototype.setTeam = function(t) {
    this.team = t,
    this.updateTeamColor()
}
,
Label.prototype.updateTeamColor = function() {
    if (!(this.healthBarEntity && this.healthBarEntity.element && this.healthBarEntity.element.color))
        return !1;
    this.team != pc.currentTeam || "PAYLOAD" != pc.currentMode && "TDM" != pc.currentMode ? this.healthBarEntity.element.color = pc.colors.enemy : this.healthBarEntity.element.color = pc.colors.health
}
,
Label.prototype.setAbility = function(t) {
    var e = this.app.assets.find(t + "-32x.png");
    e && (this.abilityEntity.enabled = !0,
    this.abilityEntity.element.textureAsset = e,
    clearTimeout(this.abilityTimer),
    this.abilityTimer = setTimeout(function(t) {
        t.abilityEntity.enabled = !1
    }, 5e3, this))
}
,
Label.prototype.destroy = function() {
    this.labelEntity.destroy()
}
,
Label.prototype.setHealth = function(t) {
    var e = .01 * this.player.health;
    e = Math.max(e, 0),
    e = Math.min(e, 1),
    this.healthBarEntity.setLocalScale(e, 1, 1),
    this.whiteBarEntity.element.opacity = .8,
    this.whiteBarEntity.tween(this.whiteBarEntity.getLocalScale()).to({
        x: e,
        y: 1,
        z: 1
    }, .8, pc.Linear).start(),
    this.whiteBarEntity.tween(this.whiteBarEntity.element).to({
        opacity: 0
    }, .8, pc.BackInOut).start()
}
,
Label.prototype.checkVisibility = function() {
    var t = this.app.systems.camera.cameras[0]
      , e = this.app.systems.rigidbody.raycastFirst(this.entity.getPosition(), t.getPosition());
    e && e.entity && "Player" == e.entity.name ? this.isVisible = !0 : this.isVisible = !1
}
,
Label.prototype.update = function(t) {
    if (!this.isInitalized)
        return !1;
    if (!this.isEnabled)
        return this.labelEntity && (this.labelEntity.enabled = !1),
        !1;
    if (!pc.isSpectator) {
        if (this.player.isDeath)
            return this.labelEntity.enabled = !1,
            !1;
        if (Date.now() - this.player.lastDamage > 1500) {
            if (pc.currentTeam != this.team || "PAYLOAD" != pc.currentMode && "TDM" != pc.currentMode)
                return this.labelEntity.enabled = !1,
                !1;
            this.labelEntity.enabled = !0
        }
    }
    this.updateTeamColor();
    var e = new pc.Vec3
      , i = this.currentCamera
      , a = this.app.graphicsDevice.maxPixelRatio
      , s = this.screenEntity.screen.scale
      , n = this.app.graphicsDevice;
    i.worldToScreen(this.headPoint.getPosition(), e),
    e.x *= a,
    e.y *= a,
    e.x > 0 && e.x < this.app.graphicsDevice.width && e.y > 0 && e.y < this.app.graphicsDevice.height && e.z > 0 ? (this.labelEntity.setLocalPosition(e.x / s, (n.height - e.y) / s, 0),
    this.labelEntity.enabled = !0) : this.labelEntity.enabled = !1
}
;
var Result = pc.createScript("result");
Result.attributes.add("topLine", {
    type: "entity"
}),
Result.attributes.add("bottomLine", {
    type: "entity"
}),
Result.attributes.add("resultMessage", {
    type: "entity"
}),
Result.attributes.add("resultMessageOpacity", {
    type: "entity"
}),
Result.attributes.add("resultHolder", {
    type: "entity"
}),
Result.attributes.add("cloudEntity", {
    type: "entity"
}),
Result.attributes.add("cloudNoiseEntity", {
    type: "entity"
}),
Result.attributes.add("scoresEntity", {
    type: "entity"
}),
Result.attributes.add("resultTitleEntity", {
    type: "entity"
}),
Result.attributes.add("barEntity", {
    type: "entity"
}),
Result.attributes.add("headerEntity", {
    type: "entity"
}),
Result.attributes.add("headerBackgroundEntity", {
    type: "entity"
}),
Result.attributes.add("rowEntity", {
    type: "entity"
}),
Result.attributes.add("statsHolder", {
    type: "entity"
}),
Result.attributes.add("backgroundEntity", {
    type: "entity"
}),
Result.attributes.add("chatEntity", {
    type: "entity"
}),
Result.attributes.add("timerEntity", {
    type: "entity"
}),
Result.attributes.add("mapEntity", {
    type: "entity"
}),
Result.attributes.add("mapHolder", {
    type: "entity"
}),
Result.attributes.add("skillEntity", {
    type: "entity"
}),
Result.attributes.add("skillHolder", {
    type: "entity"
}),
Result.attributes.add("voteBar", {
    type: "entity"
}),
Result.attributes.add("voteCount", {
    type: "entity"
}),
Result.attributes.add("rewardButton", {
    type: "entity"
}),
Result.attributes.add("bannerEntity", {
    type: "entity"
}),
Result.attributes.add("rewardCountEntity", {
    type: "entity"
}),
Result.attributes.add("rewardLost", {
    type: "entity"
}),
Result.attributes.add("teamRedColor", {
    type: "rgb"
}),
Result.attributes.add("teamBlueColor", {
    type: "rgb"
}),
Result.attributes.add("teamNoneColor", {
    type: "rgb"
}),
Result.attributes.add("meColor", {
    type: "rgb"
}),
Result.attributes.add("lightColor", {
    type: "rgb"
}),
Result.attributes.add("victoryColor", {
    type: "rgb"
}),
Result.attributes.add("defeatColor", {
    type: "rgb"
}),
Result.attributes.add("victoryBgColor", {
    type: "rgb"
}),
Result.attributes.add("defeatBgColor", {
    type: "rgb"
}),
Result.attributes.add("padding", {
    type: "number"
}),
Result.attributes.add("maxTime", {
    type: "number",
    default: 35
}),
Result.attributes.add("maxScore", {
    type: "number",
    default: 400
}),
Result.prototype.initialize = function() {
    for (var t in this.players = [],
    this.rankOpacity = 0,
    this.mapEntities = [],
    this.time = this.maxTime,
    this.tick(),
    this.rowEntity.enabled = !1,
    this.resultHolder.enabled = !0,
    this.scoresEntity.enabled = !1,
    !0 === pc.isSpectator ? this.showMessage("OVER") : pc.isVictory ? this.showMessage("VICTORY") : this.showMessage("DEFEAT"),
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
,
Result.prototype.setBanner = function() {
    Utils.isMobile() ? this.app.fire("Ads:BannerSet", "venge-io_320x50_2", "320x50") : this.app.fire("Ads:BannerSet", "venge-io_728x90_2", "728x90")
}
,
Result.prototype.destroyBanner = function() {
    this.app.fire("Ads:BannerDestroy", "venge-io_728x90_2", "728x90"),
    this.app.fire("Ads:BannerDestroy", "venge-io_320x50_2", "320x50"),
    this.bannerEntity && this.bannerEntity.destroy()
}
,
Result.prototype.onDestroy = function() {
    clearTimeout(this.rewardButtonTimer),
    this.destroyBanner()
}
,
Result.prototype.onPreroll = function() {
    if (!this.rewardButton.enabled)
        return !1;
    this.app.fire("Result:DestroyBanner", !0),
    this.app.fire("Network:Chat", "Requested 2X reward!"),
    this.app.fire("Analytics:Event", "Ads", "Request2X");
    this.app.fire("Player:Hide", !0),
    this.app.fire("Ads:RewardAds", function(t) {
        t ? (pc.app.fire("Network:Reward", !0),
        pc.app.fire("Alert:Overlay", "Your reward doubled!")) : pc.app.fire("Alert:Overlay", "Reward is not available!"),
        pc.app.fire("Player:Show", !0)
    }, function() {
        pc.app.fire("Alert:Overlay", "Please disable adblock!"),
        pc.app.fire("Player:Show", !0)
    })
}
,
Result.prototype.onStateChange = function(t) {
    t ? (this.app.on("Overlay:Votes", this.onVotes, this),
    this.app.on("Overlay:WatchAds", this.onWatchAds, this),
    this.setVoteEntities(["Sierra", "Xibalba", "Mistle"])) : (this.app.off("Overlay:Votes"),
    this.app.off("Overlay:WatchAds"))
}
,
Result.prototype.setSkillPoint = function() {
    if (this.currentSkillIndex > this.skills.length - 1)
        return !1;
    var t = this.skills[this.currentSkillIndex]
      , e = t.name
      , i = t.score
      , s = 1 * i / this.maxScore;
    s = Math.min(1, s);
    var a = this.skillEntity.clone();
    if (!a || !a.element || !a.element.height)
        return !1;
    var n = -this.skillPoints.length * (a.element.height + this.padding);
    a.enabled = !0,
    a.findByName("Name").element.text = e,
    a.setLocalPosition(-15, n, 0),
    a.tween(a.getLocalPosition()).to({
        x: 0,
        y: n,
        z: 0
    }, .5, pc.BackOut).start();
    var o = a.findByName("Fill");
    o.tween(o.getLocalScale()).to({
        x: s,
        y: 1,
        z: 1
    }, .7, pc.Linear).start(),
    a.findByName("Point").script.count.next = i,
    this.skillPoints.push(a),
    this.skillHolder.addChild(a),
    this.currentSkillIndex++,
    this.entity.sound.play("Data-Increase"),
    setTimeout(function(t) {
        t.setSkillPoint()
    }, 500, this)
}
,
Result.prototype.tick = function() {
    if (!this.timerEntity || !this.timerEntity.element || !this.timerEntity.element.text)
        return !1;
    var t = Math.max(this.time, 0);
    t >= 0 && t <= 5 ? (this.timerEntity.element.text = 'GET READY - [color="#ffc703"]' + t + "[/color]",
    this.time > -1 && this.entity.sound.play("Count")) : this.timerEntity.element.text = 'NEXT GAME : [color="#ffc703"]' + t + "[/color]";
    var e = this.time - 10;
    e = Math.max(e, 0),
    this.time--,
    t >= 0 && setTimeout(function(t) {
        t.tick()
    }, 1e3, this)
}
,
Result.prototype.clearVoteEntities = function() {
    for (var t = this.mapEntities.length; t--; )
        this.mapEntities[t].destroy();
    this.mapEntities = [],
    this.mapEntity.enabled = !1,
    this.cloudNoiseEntity.tween(this.cloudNoiseEntity.getLocalEulerAngles()).rotate({
        x: 0,
        y: 0,
        z: -170
    }, this.maxTime, pc.Linear).start(),
    this.barEntity.tween(this.barEntity.element).to({
        width: 1400
    }, this.maxTime, pc.Linear).start()
}
,
Result.prototype.setVoteEntities = function(t) {
    for (var e in this.clearVoteEntities(),
    t) {
        var i = t[e]
          , s = this.app.assets.find(i + "-Thumbnail")
          , a = this.mapEntity.clone();
        a.name = i + "-Map",
        a.enabled = !0,
        a.setLocalPosition(0, -this.mapEntities.length * (a.element.height + this.padding), 0),
        a.findByName("Name").element.text = i,
        a.findByName("Picture").element.textureAsset = s,
        a.findByName("VoteButton").script.button.triggerFunction = 'result.vote("' + i + '");',
        this.mapHolder.addChild(a),
        this.mapEntities.push(a)
    }
}
,
Result.prototype.vote = function(t) {
    this.app.fire("Network:Vote", t);
    var e = this.app.root.findByTag("Vote-Button");
    for (var i in e) {
        e[i].enabled = !1
    }
}
,
Result.prototype.onVotes = function(t) {
    var e = 0;
    for (var i in t) {
        var s = t[i]
          , a = this.app.root.findByName(i + "-Map");
        a && (a.findByName("VoteCount").element.text = s + "",
        a.findByName("Status").element.color = pc.colors.active),
        e += parseInt(s)
    }
    var n = 1 * e / this.players.length;
    this.voteBar.tween(this.voteBar.getLocalScale()).to({
        x: n,
        y: 1,
        z: 1
    }, .4, pc.Linear).start(),
    this.voteCount.element.text = e + " / " + this.players.length,
    this.entity.sound.play("Vote")
}
,
Result.prototype.showScoreTable = function(t) {
    for (var e in this.scoresEntity.enabled = !0,
    this.clearStats(),
    t) {
        var i = t[e];
        this.createPlayerRow(i, parseInt(e) + 1)
    }
    this.backgroundEntity.tween(this.backgroundEntity.element).to({
        opacity: .9
    }, 5, pc.Linear).start(),
    this.headerEntity.element.width = 2e3,
    this.headerEntity.tween(this.headerEntity.element).to({
        width: 1e3
    }, .8, pc.BackOut).start();
    var s = this.app.root.findByName("Chat");
    s && (s.setLocalPosition(0, 0, 0),
    s.reparent(this.app.root.findByName("ChatHolder"))),
    setTimeout(function(t) {
        t.app.fire("DOM:Update", !0)
    }, 100, this),
    setTimeout(function(t) {}, 800, this)
}
,
Result.prototype.clearStats = function() {
    for (var t = this.players.length; t--; )
        this.players[t].destroy();
    this.rankOpacity = 1
}
,
Result.prototype.createPlayerRow = function(t, e) {
    var i = this.rowEntity.clone();
    if (!(i && i.element && i.element.height))
        return !1;
    var s = -this.players.length * (this.padding + i.element.height);
    i.enabled = !0,
    i.setLocalPosition(-800, s, 0),
    i.findByName("Username").element.text = t.username,
    i.findByName("Kill").element.text = t.kill.toString(),
    i.findByName("Death").element.text = t.death.toString(),
    i.findByName("Assist").element.text = t.assist.toString(),
    i.findByName("Headshot").element.text = t.headshot.toString(),
    i.findByName("Objective").element.text = t.totalCardPoint.toString(),
    t.reward > 0 ? i.findByName("Reward").element.text = "+" + t.reward.toString() : i.findByName("Reward").enabled = !1,
    i.findByName("Score").element.text = t.score.toString(),
    (u = this.app.assets.find("Tier-" + t.tier + ".png")) && (i.findByName("Tier").element.textureAsset = u),
    i.findByName("Status").element.color = 1 == e ? this.victoryColor : this.defeatColor,
    t.isMe ? i.findByName("You").enabled = !0 : i.findByName("You").enabled = !1,
    i.findByName("Rank").element.text = e,
    i.findByName("Rank").element.opacity = this.rankOpacity;
    var a = i.findByName("Follow");
    a && a.script && a.script.button && (a.script.button.fireFunction = "Follow:User@" + t.username),
    this.rankOpacity -= .4;
    var n = this.players.length % 2 + 2;
    1 === e ? (n = 1,
    i.element.opacity = .15) : i.element.opacity = this.players.length % 2 ? .08 : .05;
    var o = i.findByName("Badges")
      , r = i.findByName("Badges").findByName("Icon");
    for (var l in t.achievements) {
        var p = t.achievements[l]
          , h = this.app.assets.find(p + "-Icon.png")
          , y = r.clone();
        y.enabled = !0,
        y.setLocalPosition(34 * parseInt(l), 0, 0),
        y.element.textureAsset = h,
        o.addChild(y)
    }
    var u = this.app.assets.find(t.skin + "-Thumbnail-" + n);
    i.findByName("PlayerPicture").element.textureAsset = u,
    i.tween(i.getLocalPosition()).to({
        x: 0,
        y: s,
        z: 0
    }, .5, pc.BackOut).delay(.1 * e).start(),
    this.statsHolder.addChild(i),
    this.players.push(i),
    setTimeout(function(t) {
        t.entity.sound.slots.Whoosh.pitch = 1 + .1 * Math.random(),
        t.entity.sound.play("Whoosh")
    }, 100 * e, this)
}
,
Result.prototype.showMessage = function(t) {
    this.resultMessage.element.text = t,
    this.resultMessageOpacity.element.text = t,
    this.resultTitleEntity.element.text = t,
    "VICTORY" == t ? (this.backgroundEntity.element.color = this.victoryBgColor,
    this.headerBackgroundEntity.element.color = this.victoryColor,
    this.topLine.element.color = this.victoryColor,
    this.bottomLine.element.color = this.victoryColor,
    this.resultMessage.element.color = this.victoryColor,
    this.entity.sound.play("Victory-Result")) : (this.backgroundEntity.element.color = this.defeatBgColor,
    this.headerBackgroundEntity.element.color = this.defeatColor,
    this.topLine.element.color = this.defeatColor,
    this.bottomLine.element.color = this.defeatColor,
    this.resultMessage.element.color = this.defeatColor,
    this.entity.sound.play("Defeat-Result")),
    this.cloudEntity.tween(this.cloudEntity.getLocalEulerAngles()).rotate({
        x: 0,
        y: 0,
        z: -20
    }, 4, pc.CubicOut).start(),
    this.cloudEntity.tween(this.cloudEntity.getLocalScale()).to({
        x: 3,
        y: 3,
        z: 3
    }, 4, pc.CubicOut).start(),
    this.cloudEntity.element.opacity = .15,
    this.cloudEntity.tween(this.cloudEntity.element).to({
        opacity: 0
    }, 4, pc.Linear).start(),
    this.resultMessage.setLocalScale(.1, .1, .1),
    this.resultMessage.tween(this.resultMessage.getLocalScale()).to({
        x: 1,
        y: 1,
        z: 1
    }, .5, pc.Linear).start(),
    this.resultHolder.element.height = 100,
    this.resultHolder.tween(this.resultHolder.element).to({
        height: 300
    }, .5, pc.ExponentialInOut).start(),
    this.resultMessageOpacity.tween(this.resultMessageOpacity.element).to({
        opacity: 0
    }, .4, pc.Linear).start(),
    this.resultMessageOpacity.setLocalScale(.1, .1, .1),
    this.resultMessageOpacity.tween(this.resultMessageOpacity.getLocalScale()).to({
        x: 2,
        y: 2,
        z: 2
    }, .5, pc.Linear).start(),
    setTimeout(function(t) {
        t.resultMessage.tween(t.resultMessage.getLocalScale()).to({
            x: 1.2,
            y: 1.2,
            z: 1.2
        }, 1.3, pc.Linear).start(),
        t.resultHolder.tween(t.resultHolder.element).to({
            height: 340
        }, 1.3, pc.Linear).start()
    }, 500, this),
    this.resultMessage.element.opacity = 0,
    this.resultMessage.element.spacing = .8,
    this.resultMessage.tween(this.resultMessage.element).to({
        opacity: 1,
        spacing: 1.3
    }, 1.5, pc.BackOut).start(),
    this.topLine.element.opacity = 0,
    this.topLine.tween(this.topLine.element).to({
        opacity: 1
    }, .5, pc.Linear).start(),
    this.topLine.setLocalScale(.1, .5, 1),
    this.topLine.tween(this.topLine.getLocalScale()).to({
        x: 1,
        y: 1,
        z: 1
    }, .5, pc.ExponentialInOut).start(),
    this.bottomLine.element.opacity = 0,
    this.bottomLine.tween(this.bottomLine.element).to({
        opacity: 1
    }, .5, pc.Linear).start(),
    this.bottomLine.setLocalScale(.1, .5, 1),
    this.bottomLine.tween(this.bottomLine.getLocalScale()).to({
        x: 1,
        y: 1,
        z: 1
    }, .5, pc.ExponentialInOut).start(),
    setTimeout(function(t) {
        t.resultMessage.tween(t.resultMessage.getLocalScale()).to({
            x: 2,
            y: 2,
            z: 2
        }, .8, pc.QuadraticOut).start(),
        t.resultMessage.tween(t.resultMessage.element).to({
            opacity: 0,
            spacing: 1
        }, .8, pc.BackOut).start(),
        t.topLine.tween(t.topLine.element).to({
            opacity: 0
        }, .2, pc.Linear).start(),
        t.topLine.tween(t.topLine.getLocalScale()).to({
            x: .1,
            y: .5,
            z: 1
        }, .5, pc.BackOut).start(),
        t.bottomLine.tween(t.bottomLine.element).to({
            opacity: 0
        }, .2, pc.Linear).start(),
        t.bottomLine.tween(t.bottomLine.getLocalScale()).to({
            x: .1,
            y: .5,
            z: 1
        }, .5, pc.BackOut).start()
    }, 1800, this)
}
,
Result.prototype.onWatchAds = function(t) {
    console.log("Watching ads... : ", t)
}
,
Result.prototype.watchAds = function() {
    this.app.fire("Network:Event", "watch-ads")
}
;
// Thumbnail.js
var Thumbnail = pc.createScript('thumbnail');

Thumbnail.attributes.add('model', {
    type: 'entity'
});
Thumbnail.attributes.add('textures', {
    type: 'asset',
    assetType: 'texture',
    array: true
});

Thumbnail.prototype.initialize = function() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.currentTextureIndex = 0;

    this.canvas.width = 512;
    this.canvas.height = 512;

    this.index = 0;
    this.currentName = 'thumbnail.png';

    //this.nextTexture();
}
;

Thumbnail.prototype.slug = function(string) {
    var a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    var b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    var p = new RegExp(a.split('').join('|'),'g');

    return string.toString().replace(/\s+/g, '-')// Replace spaces with -
    .replace(p, c=>b.charAt(a.indexOf(c)))// Replace special characters
    .replace(/&/g, '-and-')// Replace & with 'and'
    .replace(/[^\w\-]+/g, '')// Remove all non-word characters
    .replace(/\-\-+/g, '-')// Replace multiple - with single -
    .replace(/^-+/, '')// Trim - from start of text
    .replace(/-+$/, '');
}
;

Thumbnail.prototype.update = function() {
    if (this.app.keyboard.wasPressed(pc.KEY_Z)) {
        this.currentName = this.slug(this.model.name);
        this.capture();
    }

    /*
    if(this.app.keyboard.wasPressed(pc.KEY_Z)){
        var name = this.textures[this.currentTextureIndex - 1].name;
            name = name.split('.')[0];
        
        this.currentName = this.slug(name);
        this.capture();
        this.nextTexture();
    }
    */
}
;

Thumbnail.prototype.nextTexture = function() {
    var material = this.model.model.material.clone();
    var texture = this.textures[this.currentTextureIndex];
    var meshInstances = this.model.model.meshInstances;

    for (var i = 0; i < meshInstances.length; ++i) {
        var mesh = meshInstances[i];
        mesh.material = material;
    }

    this.app.assets.load(texture);

    texture.ready(function(asset) {
        material.diffuseMap = texture.resource;
        material.update();
    });

    this.currentTextureIndex++;
}
;

Thumbnail.prototype.capture = function() {
    var texture = new pc.Texture(this.app.graphicsDevice,{
        mipmaps: false
    });

    texture.minFilter = pc.FILTER_LINEAR;
    texture.magFilter = pc.FILTER_LINEAR;
    texture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
    texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE;

    var self = this;
    var lastCaptureIndex = this.captured;
    var image = new Image();
    image.src = pc.app.graphicsDevice.canvas.toDataURL('image/png');
    image.onload = function() {
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.context.drawImage(image, -window.innerWidth / 2 + 256, -window.innerHeight / 2 + 262);

        var canvasImage = new Image();
        canvasImage.src = self.canvas.toDataURL('image/png');
        canvasImage.onload = function() {
            self.download(canvasImage.src, self.currentName);
        }
        ;
    }
    ;

    this.captured++;
}
;

Thumbnail.prototype.download = function(image, name) {
    var a = document.createElement('a');
    a.href = image;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
;

var Input = pc.createScript("input");
Input.attributes.add("placeholder", {
    type: "string"
}),
Input.attributes.add("type", {
    type: "string",
    enum: [{
        Text: "text"
    }, {
        Email: "email"
    }, {
        Password: "password"
    }],
    default: "text"
}),
Input.attributes.add("maxLength", {
    type: "number",
    default: 64
}),
Input.attributes.add("fontSize", {
    type: "number",
    default: 1
}),
Input.attributes.add("padding", {
    type: "number",
    default: 1
}),
Input.attributes.add("scaleUnit", {
    type: "string",
    enum: [{
        "Viewport Width": "vw"
    }, {
        "Viewport Height": "vh"
    }, {
        Pixel: "px"
    }],
    default: "vw"
}),
Input.attributes.add("color", {
    type: "rgb"
}),
Input.attributes.add("disableTab", {
    type: "boolean"
}),
Input.attributes.add("whitePlaceholder", {
    type: "boolean"
}),
Input.attributes.add("fontFamily", {
    type: "string",
    default: "Arial, sans-serif"
}),
Input.attributes.add("storeValue", {
    type: "boolean"
}),
Input.attributes.add("focusEntity", {
    type: "entity"
}),
Input.attributes.add("sleepValue", {
    type: "string"
}),
Input.attributes.add("blurFunction", {
    type: "string"
}),
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
}
,
Input.prototype.onBlurFunction = function() {
    var t = this.blurFunction.split(", ");
    if (t.length > 0)
        for (var e in t) {
            var i = t[e].split("@")
              , n = i[0];
            if (i.length > 1) {
                var s = i[1];
                this.app.fire(n, s)
            } else
                this.app.fire(n)
        }
}
,
Input.prototype.onDOMClear = function() {
    this.entity.destroy()
}
,
Input.prototype.onDestroy = function() {
    this.isDestroyed = !0,
    this.element.remove()
}
,
Input.prototype.store = function() {
    this.storeValue = !0,
    this.onChange()
}
,
Input.prototype.onFocus = function() {
    this.focusEntity.enabled = !0
}
,
Input.prototype.onBlur = function() {
    this.focusEntity.enabled = !1
}
,
Input.prototype.onChange = function() {
    this.storeValue && Utils.setItem(this.entity._guid, this.getValue())
}
,
Input.prototype.onDomUpdate = function() {
    this._updateStyle()
}
,
Input.prototype.updateStyle = function() {
    if (this.currentWidth == window.innerWidth && this.currentHeight == window.innerHeight)
        return !1;
    this._updateStyle(),
    this.currentWidth = window.innerWidth,
    this.currentHeight = window.innerHeight
}
,
Input.prototype._updateStyle = function() {
    if (this.isDestroyed)
        return !1;
    var t = this;
    if (t.entity && t.entity.element && t.entity.element.screenCorners) {
        var e = t.entity.element.screenCorners
          , i = 1 / t.app.graphicsDevice.maxPixelRatio;
        t.element.style.left = e[0].x * i + "px",
        t.element.style.bottom = e[0].y * i + "px",
        t.element.style.width = (e[2].x - e[0].x) * i + "px",
        t.element.style.height = (e[2].y - e[0].y) * i + "px"
    }
}
,
Input.prototype.setResultValue = function(t) {
    if (!t)
        return !1;
    var e = t.result;
    this.element ? (this.element.value = e,
    this.sleepValue = !1) : this.sleepValue = e
}
,
Input.prototype.setValue = function(t) {
    this.element ? (this.element.value = t,
    this.sleepValue = !1) : this.sleepValue = t
}
,
Input.prototype.getValue = function() {
    if (this.element)
        return this.element.value
}
,
Input.prototype.focus = function() {
    this.element && this.element.focus()
}
,
Input.prototype.blur = function() {
    this.element && this.element.blur()
}
;
var Chat = pc.createScript("chat");
Chat.attributes.add("inputEntity", {
    type: "entity"
}),
Chat.attributes.add("messageEntity", {
    type: "entity"
}),
Chat.attributes.add("messageHolder", {
    type: "entity"
}),
Chat.attributes.add("consoleColor", {
    type: "rgb"
}),
Chat.attributes.add("meColor", {
    type: "rgb"
}),
Chat.attributes.add("whiteColor", {
    type: "rgb"
}),
Chat.attributes.add("padding", {
    type: "number",
    default: 2
}),
Chat.attributes.add("timeLimit", {
    type: "number",
    default: 5
}),
Chat.attributes.add("messageLimit", {
    type: "number",
    default: 4
}),
Chat.prototype.initialize = function() {
    this.isFocused = !1,
    this.displayed = !1,
    this.messages = [],
    this.messageEntity.enabled = !1,
    this.app.on("Chat:Message", this.onMessage, this),
    this.app.on("Map:Loaded", this.onMapLoaded, this)
}
,
Chat.prototype.onMapLoaded = function() {
    if (!this.displayed)
        return !1;
    //this.app.fire("Chat:Message", "Console", "Press TAB to see other players scores!"),
    this.displayed = !0
}
,
Chat.prototype.nextMessage = function() {
    var t = this.messages.length;
    if (t > 0)
        for (var e = 0; t--; )
            this.messages[t].setLocalPosition(0, (this.messages.length - t) * this.padding + e, 0),
            e += this.messages[t].element.height;
    if (this.messages.length > this.messageLimit) {
        var s = this.messages[0];
        clearTimeout(s.messageTimeout),
        this.messages.splice(0, 1),
        s.destroy()
    }
}
,
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
}
,
Chat.prototype.sendMessage = function() {
    if (!this.inputEntity.enabled)
        return !1;
    var t = this.inputEntity.script.input.getValue();
    this.app.fire("Network:Chat", t),
    this.inputEntity.script.input.setValue(""),
    this.blur(),
    this.lastMessageDate = Date.now()
}
,
Chat.prototype.onEnter = function() {
    this.isFocused ? this.sendMessage() : this.focus()
}
,
Chat.prototype.focus = function() {
    this.entity.enabled && (this.inputEntity.script.input.focus(),
    this.isFocused = !0,
    this.app.fire("Player:Lock", !1))
}
,
Chat.prototype.blur = function() {
    this.inputEntity.script.input.blur(),
    this.isFocused = !1,
    this.app.fire("Player:Lock", !0)
}
,
Chat.prototype.update = function() {
    this.app.keyboard.wasPressed(pc.KEY_ENTER) && this.onEnter(),
    this.app.keyboard.wasPressed(pc.KEY_ESCAPE) && this.blur()
}
;
var Speaking = pc.createScript("speaking");
Speaking.attributes.add("subtitles", {
    type: "string",
    array: !0
}),
Speaking.prototype.initialize = function() {
    this.characterName = "Lilium",
    this.lastPlayTime = Date.now(),
    this.currentIndex = 0,
    this.lastPlayedSound = !1,
    this.app.on("Player:Speak", this.onPlay, this),
    this.app.on("Player:StopSpeaking", this.onStop, this),
    this.app.on("Player:Character", this.onCharacterSet, this)
}
,
Speaking.prototype.onCharacterSet = function(t) {
    this.characterName = t
}
,
Speaking.prototype.onStop = function() {
    this.entity.sound.stop()
}
,
Speaking.prototype.onPlay = function(t, e) {
    if (Date.now() - this.lastPlayTime < 2e3)
        return !1;
    this.play(t, e),
    this.lastPlayTime = Date.now()
}
,
Speaking.prototype.play = function(t, e) {
    this.currentIndex > e && (this.currentIndex = 0);
    var i = this.currentIndex + 1
      , a = this.characterName + "-" + t + "-" + i
      , n = Object.keys(pc.app.root.findByName("Speaking").sound.slots).indexOf(a);
    this.entity.sound.play(a),
    this.app.fire("Overlay:Subtitle", this.subtitles[n]),
    this.currentIndex++,
    this.lastPlayedSound = a
}
;
var Count = pc.createScript("count");
Count.attributes.add("leftPad", {
    type: "string"
}),
Count.attributes.add("rightPad", {
    type: "string"
}),
Count.attributes.add("next", {
    type: "number"
}),
Count.prototype.initialize = function() {
    this.currentNumber = 0
}
,
Count.prototype.update = function(t) {
    var e = Math.round(this.currentNumber);
    this.entity.element.text = this.leftPad + e + this.rightPad,
    this.currentNumber = pc.math.lerp(this.currentNumber, this.next, .1)
}
;
var Terrain = pc.createScript("terrain");
Terrain.attributes.add("map", {
    type: "asset",
    assetType: "texture"
}),
Terrain.attributes.add("red", {
    type: "asset",
    assetType: "texture"
}),
Terrain.attributes.add("green", {
    type: "asset",
    assetType: "texture"
}),
Terrain.attributes.add("blue", {
    type: "asset",
    assetType: "texture"
}),
Terrain.attributes.add("redScale", {
    type: "vec2",
    default: [1, 1]
}),
Terrain.attributes.add("greenScale", {
    type: "vec2",
    default: [1, 1]
}),
Terrain.attributes.add("blueScale", {
    type: "vec2",
    default: [1, 1]
}),
Terrain.prototype.initialize = function() {
    var e = this.entity.model.model.meshInstances[0].material;
    this.shader = "",
    this.shader += "#ifdef MAPCOLOR\n",
    this.shader += "uniform vec3 material_diffuse;\n",
    this.shader += "#endif\n",
    this.shader += "\n",
    this.shader += "#ifdef MAPTEXTURE\n",
    this.shader += "uniform sampler2D texture_diffuseMap;\n",
    this.shader += "#endif\n",
    this.shader += "\n",
    this.shader += "uniform sampler2D mapTexture;\n",
    this.shader += "uniform sampler2D redTexture;\n",
    this.shader += "uniform sampler2D blueTexture;\n",
    this.shader += "uniform sampler2D greenTexture;\n",
    this.shader += "\n",
    this.shader += "uniform vec2 redScale;\n",
    this.shader += "uniform vec2 blueScale;\n",
    this.shader += "uniform vec2 greenScale;\n",
    this.shader += "\n",
    this.shader += "void getAlbedo() {\n",
    this.shader += "    dAlbedo = vec3(1.0);\n",
    this.shader += "    \n",
    this.shader += "    vec3 baseTexture = texture2DSRGB(mapTexture, $UV).$CH;\n",
    this.shader += "    \n",
    this.shader += "    vec3 red   = texture2DSRGB(redTexture, $UV * redScale).$CH;\n",
    this.shader += "    vec3 blue  = texture2DSRGB(blueTexture, $UV * blueScale).$CH;\n",
    this.shader += "    vec3 green = texture2DSRGB(greenTexture, $UV * greenScale).$CH;\n",
    this.shader += "    \n",
    this.shader += "    dAlbedo = red * baseTexture.r + green * baseTexture.g + blue * baseTexture.b;\n",
    this.shader += "    \n",
    this.shader += "    #ifdef MAPVERTEX\n",
    this.shader += "        dAlbedo *= gammaCorrectInput(saturate(vVertexColor.$VC));\n",
    this.shader += "    #endif\n",
    this.shader += "}\n",
    e.setParameter("mapTexture", this.map.resource),
    e.setParameter("blueTexture", this.blue.resource),
    e.setParameter("redTexture", this.red.resource),
    e.setParameter("greenTexture", this.green.resource),
    e.setParameter("redScale", [this.redScale.x, this.redScale.y]),
    e.setParameter("greenScale", [this.greenScale.x, this.greenScale.y]),
    e.setParameter("blueScale", [this.blueScale.x, this.blueScale.y]),
    e.chunks.diffusePS = this.shader,
    e.update(),
    this.entity.script.destroy()
}
;
Object.assign(pc, function() {
    var e = function(e) {
        pc.PostEffect.call(this, e);
        var t = {
            aPosition: pc.SEMANTIC_POSITION
        }
          , o = ["attribute vec2 aPosition;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "    gl_Position = vec4(aPosition, 0.0, 1.0);", "    vUv0 = (aPosition.xy + 1.0) * 0.5;", "}"].join("\n")
          , i = ["precision " + e.precision + " float;", "", "uniform sampler2D uColorBuffer;", "varying vec2 vUv0;", "const float radius = 2.;", "const float depth = 0.3;", "uniform vec2 mouse;", "uniform vec2 res;", "", "void main() {", "vec2 uv = gl_FragCoord.xy/res.xy;", "uv.y = uv.y;", "vec2 center = mouse.xy/res.xy;", "vec2 dc = uv - center;", "float ax = dc.x*dc.x*10. + dc.y*dc.y*10.;", "float dx = ax*depth/radius * (ax/radius - 1.);", "float f = ax > radius ? ax : ax + dx;", "vec2 ma = center + (uv-center)*f/ax;", "    gl_FragColor = vec4(texture2D(uColorBuffer, ma).rgb, 1.); ", "}"].join("\n");
        this.zoomShader = new pc.Shader(e,{
            attributes: t,
            vshader: o,
            fshader: i
        })
    };
    return (e.prototype = Object.create(pc.PostEffect.prototype)).constructor = e,
    Object.assign(e.prototype, {
        render: function(e, t, o) {
            var i = this.device
              , r = i.scope
              , c = pc.app.graphicsDevice.maxPixelRatio
              , s = window.innerWidth / 2 * c
              , a = window.innerHeight / 2 * c
              , f = window.innerWidth * c
              , n = window.innerHeight * c
              , v = new Float32Array([s, a])
              , u = new Float32Array([f, n]);
            r.resolve("uColorBuffer").setValue(e.colorBuffer),
            r.resolve("mouse").setValue(v),
            r.resolve("res").setValue(u),
            pc.drawFullscreenQuad(i, t, this.vertexBuffer, this.zoomShader, o)
        }
    }),
    {
        ZoomEffect: e
    }
}());
var Zoom = pc.createScript("zoom");
Zoom.prototype.initialize = function() {
    this.effect = new pc.ZoomEffect(this.app.graphicsDevice),
    this.effect.offset = this.offset,
    this.effect.darkness = this.darkness,
    this.on("attr", function(e, t) {
        this.effect[e] = t
    }, this);
    var e = this.entity.camera.postEffects;
    e.addEffect(this.effect),
    this.on("state", function(t) {
        t ? e.addEffect(this.effect) : e.removeEffect(this.effect)
    }),
    this.on("destroy", function() {
        e.removeEffect(this.effect)
    })
}
;
var Waterfall = pc.createScript("waterfall");
Waterfall.attributes.add("noise_1", {
    type: "asset",
    assetType: "texture"
}),
Waterfall.attributes.add("noise_2", {
    type: "asset",
    assetType: "texture"
}),
Waterfall.attributes.add("top_light_color", {
    type: "rgba"
}),
Waterfall.attributes.add("top_dark_color", {
    type: "rgba"
}),
Waterfall.attributes.add("bot_light_color", {
    type: "rgba"
}),
Waterfall.attributes.add("bot_dark_color", {
    type: "rgba"
}),
Waterfall.attributes.add("speed", {
    type: "number",
    default: 1.1
}),
Waterfall.attributes.add("opacitySpeed", {
    type: "number",
    default: 1.1
}),
Waterfall.prototype.initialize = function() {
    if (this.app.touch)
        return this.entity.enabled = !1,
        !1;
    this.isLoaded = !1,
    this.shader = "",
    this.shader += "#ifdef MAPCOLOR\n",
    this.shader += "uniform vec3 material_emissive;\n",
    this.shader += "#endif\n",
    this.shader += "\n",
    this.shader += "#ifdef MAPTEXTURE\n",
    this.shader += "uniform sampler2D texture_emissiveMap;\n",
    this.shader += "#endif\n",
    this.shader += "\n",
    this.shader += "uniform sampler2D noise_tex;\n",
    this.shader += "uniform sampler2D displ_tex;\n",
    this.shader += "uniform vec4 top_light_color;\n",
    this.shader += "uniform vec4 top_dark_color;\n",
    this.shader += "uniform vec4 bot_light_color;\n",
    this.shader += "uniform vec4 bot_dark_color;\n",
    this.shader += "const float displ_amount = 0.02;\n",
    this.shader += "const float bottom_foam_threshold = 0.48;\n",
    this.shader += "uniform float TIME;\n",
    this.shader += "\n",
    this.shader += "vec3 getEmission() {\n",
    this.shader += "    vec3 emission = vec3(1.0);\n",
    this.shader += "    vec2 displ = texture(displ_tex, $UV - TIME / 8.0).xy;\n",
    this.shader += "    displ = ((displ * 2.0) - 1.0) * displ_amount;\n",
    this.shader += "    \n",
    this.shader += "    float noise =  texture(noise_tex, vec2($UV.x, $UV.y / 3.0 - TIME / 4.0) + displ).x;\n",
    this.shader += "    noise =  floor(noise * 4.0) / 4.0;\n",
    this.shader += "    \n",
    this.shader += "    vec4 col = mix(mix(top_dark_color, bot_dark_color, $UV.y), mix(top_light_color, bot_light_color, $UV.y), noise);\n",
    this.shader += "    col = mix(vec4(1,1,1,1), col, step($UV.y + displ.y, bottom_foam_threshold));\n",
    this.shader += "    \n",
    this.shader += "    emission*= col.xyz;\n",
    this.shader += "    \n",
    this.shader += "    #ifdef MAPVERTEX\n",
    this.shader += "        emission *= gammaCorrectInput(saturate(vVertexColor.$VC));\n",
    this.shader += "    #endif\n",
    this.shader += "    return emission;\n",
    this.shader += "}\n";
    var t = this
      , e = this.app.assets.find("Waterfall.glb");
    e.ready(function(e) {
        t.onLoad()
    }),
    this.app.assets.load(e),
    this.app.on("Game:Settings", this.onSettingsChange, this),
    this.onSettingsChange()
}
,
Waterfall.prototype.onSettingsChange = function() {
    pc.settings && !0 === pc.settings.disableSpecialEffects && (this.entity.enabled = !1)
}
,
Waterfall.prototype.onLoad = function() {
    var t = this.entity.model.model;
    this.material = t.meshInstances[0].material,
    this.material.setParameter("noise_tex", this.noise_1.resource),
    this.material.setParameter("displ_tex", this.noise_2.resource),
    this.material.setParameter("top_light_color", this.top_light_color.data),
    this.material.setParameter("top_dark_color", this.top_dark_color.data),
    this.material.setParameter("bot_light_color", this.bot_light_color.data),
    this.material.setParameter("bot_dark_color", this.bot_dark_color.data),
    this.material.chunks.emissivePS = this.shader,
    this.isLoaded = !0
}
,
Waterfall.prototype.update = function(t) {
    if (this.isLoaded) {
        var e = this.app._time * this.speed * .001;
        this.material.setParameter("TIME", e),
        this.material.opacityMapOffset.y = -e * this.opacitySpeed % 1,
        this.material.update()
    }
}
;
var Button = pc.createScript("button");
Button.attributes.add("connected", {
    type: "entity"
}),
Button.attributes.add("triggerFunction", {
    type: "string"
}),
Button.attributes.add("pressFunction", {
    type: "string"
}),
Button.attributes.add("leaveFunction", {
    type: "string"
}),
Button.attributes.add("fireFunction", {
    type: "string"
}),
Button.attributes.add("fireArgs", {
    type: "string"
}),
Button.attributes.add("playSound", {
    type: "boolean",
    default: !0
}),
Button.attributes.add("waitResolve", {
    type: "boolean"
}),
Button.attributes.add("destroyOnFunction", {
    type: "boolean"
}),
Button.prototype.initialize = function() {
    this.spinner = !1,
    this.text = !1,
    Utils.isMobile() ? (this.entity.element.on("touchstart", this.onPress, this),
    this.entity.element.on("touchend", this.onLeave, this)) : (this.entity.element.on("mouseenter", this.onHover, this),
    this.entity.element.on("mouseleave", this.onLeave, this),
    this.entity.element.on("mousedown", this.onPress, this)),
    this.entity.findByName("Spinner") && (this.spinner = this.entity.findByName("Spinner"),
    this.spinner.enabled = !1),
    this.entity.findByName("Text") && (this.text = this.entity.findByName("Text"),
    this.text.enabled = !0),
    this.app.on("Button:" + this.entity.name, this.onState, this)
}
,
Button.prototype.onState = function(t) {
    this.entity.button.active = t
}
,
Button.prototype.onHover = function(t) {
    document.body.style.cursor = "pointer",
    this.playSound && this.app.fire("Sound:Play", "Primary-Hover")
}
,
Button.prototype.onLeave = function(t) {
    document.body.style.cursor = "default";
    var e = this.leaveFunction.split(", ");
    if (e.length > 0)
        for (var i in e) {
            var n = e[i].split("@")
              , s = n[0];
            if (n.length > 1) {
                var o = n[1];
                this.app.fire(s, o)
            } else
                this.app.fire(s)
        }
}
,
Button.prototype.loading = function() {
    if (!this.entity.enabled)
        return !1;
    this.spinner.enabled = !0,
    this.text.enabled = !1,
    this.entity.button && (this.entity.button.active = !1)
}
,
Button.prototype.resolve = function() {
    if (!this.entity.enabled)
        return !1;
    this.spinner.enabled = !1,
    this.text.enabled = !0,
    this.entity.button && (this.entity.button.active = !0)
}
,
Button.prototype.onPress = function(t) {
    if (pc.isButtonLocked)
        return !1;
    if (this.entity.button && !this.entity.button.active)
        return !1;
    var e = this.pressFunction.split(", ");
    if (e.length > 0)
        for (var i in e) {
            var n = e[i].split("@")
              , s = n[0];
            if (n.length > 1) {
                var o = n[1];
                this.app.fire(s, o)
            } else
                this.app.fire(s)
        }
    setTimeout(function(t, e) {
        t.onPressFire(e)
    }, 100, this, t)
}
,
Button.prototype.onPressFire = function(event) {
    if (this.playSound && this.app.fire("Sound:Play", "Primary-Click"),
    this.waitResolve && (this.spinner && (this.spinner.enabled = !0,
    this.text.enabled = !1),
    this.entity.button.active = !1),
    this.connected) {
        var connectedEntity = this.connected
          , self = this.entity;
        eval("connectedEntity.script." + this.triggerFunction)
    } else if (this.fireFunction)
        if (this.fireArgs)
            this.app.fire(this.fireFunction, this.fireArgs);
        else {
            var fireFunction = this.fireFunction.split(", ");
            if (fireFunction.length > 0)
                for (var successIndex in fireFunction) {
                    var successFunction = fireFunction[successIndex]
                      , parts = successFunction.split("@")
                      , key = parts[0];
                    if (parts.length > 1) {
                        var value = parts[1];
                        this.app.fire(key, value)
                    } else
                        this.app.fire(key)
                }
        }
    else
        eval(this.triggerFunction);
    this.destroyOnFunction && this.entity.destroy()
}
;
var Point = pc.createScript("point");
Point.attributes.add("playerEntity", {
    type: "entity"
}),
Point.attributes.add("radius", {
    type: "number",
    default: 5
}),
Point.attributes.add("labelEntity", {
    type: "entity"
}),
Point.attributes.add("labelTime", {
    type: "entity"
}),
Point.attributes.add("screenEntity", {
    type: "entity"
}),
Point.attributes.add("objectiveBackground", {
    type: "entity"
}),
Point.attributes.add("objectiveTime", {
    type: "entity"
}),
Point.attributes.add("maxTime", {
    type: "number",
    default: 30
}),
Point.prototype.initialize = function() {
    this.activePlayer = !1,
    this.distance = 100,
    this.wasInside = !1,
    this.time = parseInt(this.maxTime + ""),
    this.app.on("Mode:NextObjective", this.onNextObjective, this),
    this.app.on("Server:Tick", this.setTick, this),
    this.app.on("Game:Finish", this.onFinish, this),
    this.app.on("Objective:Inside", this.onInside, this),
    this.on("state", this.onStateChange)
}
,
Point.prototype.onInside = function(t) {
    t ? (this.objectiveBackground.element.color = pc.colors.capture,
    this.objectiveBackground.element.opacity = .5) : (this.objectiveBackground.element.color = pc.colors.black,
    this.objectiveBackground.element.opacity = .15,
    this.wasInside = !1)
}
,
Point.prototype.onStateChange = function(t) {
    t ? this.app.on("Objective:Inside", this.onInside, this) : this.app.off("Objective:Inside")
}
,
Point.prototype.onFinish = function() {
    this.labelEntity.enabled = !1,
    this.entity.enabled = !1
}
,
Point.prototype.setTick = function() {
    this.time--,
    this.objectiveTime.element.text = this.time + "",
    this.labelTime.element.text = this.time + "",
    this.time <= 0 && (this.time = this.maxTime)
}
,
Point.prototype.onNextObjective = function(t) {
    var i = this.app.root.findByTag("Objective")[t];
    if (i) {
        var e = i.getPosition().clone();
        this.entity.setPosition(e)
    }
}
,
Point.prototype.update = function() {
    if (this.distance < this.radius + 5)
        return this.labelEntity.enabled = !1,
        !1;
    var t = new pc.Vec3
      , i = this.app.systems.camera.cameras[0]
      , e = this.app.graphicsDevice.maxPixelRatio
      , n = this.screenEntity.screen.scale
      , s = this.app.graphicsDevice
      , a = this.entity.getPosition().add(new pc.Vec3(0,5,0));
    if (!i)
        return !1;
    i.worldToScreen(a, t),
    t.x *= e,
    t.y *= e,
    t.x > 0 && t.x < this.app.graphicsDevice.width && t.y > 0 && t.y < this.app.graphicsDevice.height && t.z > 0 ? (this.labelEntity.setLocalPosition(t.x / n, (s.height - t.y) / n, 0),
    this.labelEntity.enabled = !0) : this.labelEntity.enabled = !1
}
;
var wrapper;
"undefined" != typeof VERSION && (pc.Asset.prototype.getFileUrl = function() {
    var e = this.getPreferredFile();
    if (!e || !e.url)
        return null;
    var t = e.url;
    return this.registry && this.registry.prefix && !ABSOLUTE_URL.test(t) && (t = this.registry.prefix + t),
    t + "?v=" + VERSION
}
),
window.addEventListener("keydown", function(e) {
    32 == e.keyCode && e.target == document.body && e.preventDefault(),
    9 != e.which || e.target != document.body && !pc.isMapLoaded || (console.log("prevent default"),
    e.preventDefault())
}),
window.addEventListener("keyup", function(e) {
    32 == e.keyCode && e.target == document.body && e.preventDefault(),
    9 == e.which && e.target == document.body && e.preventDefault()
}),
window.location && window.location.href.search("isMobile") > -1 ? pc.isMobile = !0 : pc.isMobile = !1,
pc.script.createLoadingScreen(function(e) {
    var t, a;
    t = ["body {", "-webkit-touch-callout: none;", "  -webkit-user-select: none;", "   -khtml-user-select: none;", "     -moz-user-select: moz-none;", "      -ms-user-select: none;", "       -o-user-select: none;", "          user-select: none;", "-webkit-touch-callout: default;", "  -webkit-user-select: text;", "   -khtml-user-select: text;", "     -moz-user-select: text;", "      -ms-user-select: text;", "       -o-user-select: text;", "          user-select: text;", "}", "*:not(input):not(textarea){", "    -webkit-user-select: none;", "    -webkit-touch-callout: none;", "}", "input:disabled, textarea:disabled, ", "input:disabled::placeholder, textarea:disabled::placeholder{", "    -webkit-text-fill-color: currentcolor;", "    opacity: 1;", "}", "#application-splash-wrapper {", "    position: absolute;", "    top: 0;", "    left: 0;", "    height: 100%;", "    width: 100%;", "    background-color: #222427;", "}", "#application-splash {", "    position: absolute;", "    top: calc(50% - 28px);", "    width: 350px;", "    left: calc(50% - 175px);", "}", "#application-splash img {", "    width: 100%;", "}", "#footer {", "    position: fixed;", "    bottom: 1vh;", "    color: #666;", "    text-align: center;", "    font-size: 1vw;", "    font-family: monospace;", "    right: 1vw;", "}", "#description {", "    position: absolute;", "    bottom: 6vh;", "    left: 50%;", "    padding: 10px 5px;", "    transform: translate(-50%, 0%);", "    text-align: center;", "    background-color: rgba(255, 255, 255, 0.05);", "    color: #fff;", "    width: 400px;", "    border-radius: 5px;", "    font-size: 16px;", "}", "#progress-bar-container {", "    margin-top: 20px;", "    height: 3px;", "    width: calc(100% - 20px);", "    background-color: #1d292c;", "}", "#animated-loading-image-1 {", "    height: 40vh;", "    left: -100px;", "    bottom: 0px;", "    position: absolute;", "    animation-name: loading-image-1;", "    animation-duration: 6s;", "}", "@keyframes loading-image-1 {", "    from { opacity : 0; left : 0px; }", "    to { opacity : 1; left : 30px; }", "}", "#animated-loading-image-2 {", "    height: 20vh;", "    right: -500px;", "    bottom: 0px;", "    position: absolute;", "    animation-name: loading-image-2;", "    animation-duration: 6s;", "    animation-delay: 2s;", "}", "@keyframes loading-image-2 {", "    from { opacity : 0; right : -300px; }", "    to { opacity : 1; right : 30px; }", "}", "#progress-bar {", "    width: 0%;", "    height: 100%;", "    background-color: #ffffff;", "    box-shadow: 0px 0px 5px #ffffff;", "}", "@media (max-width: 480px) {", "    #application-splash {", "        width: 170px;", "        left: calc(50% - 85px);", "    }", "}", ".cls-1 {", "   stroke-dasharray: 1000;", "   stroke-dashoffset: 1000;", "   stroke-width: 3;", "   animation: dash 8s linear normal infinite;", "}", "@keyframes dash {", "   from {", "       stroke-dashoffset: 1000;", "   }", "   to {", "       stroke-dashoffset: 0;", "   }", "}"].join("\n"),
    (a = document.createElement("style")).type = "text/css",
    a.styleSheet ? a.styleSheet.cssText = t : a.appendChild(document.createTextNode(t)),
    document.head.appendChild(a),
    function() {
        (wrapper = document.createElement("div")).id = "application-splash-wrapper",
        document.body.appendChild(wrapper);
        var e = document.createElement("div");
        e.id = "application-splash",
        wrapper.appendChild(e);
        var t = ["Press [B] to buy ability cards in game!", "Mistle map has a different game mode, try it out!", "Stay in green area to get score!", "Unlock ability cards with frag and objective scores!"]
          , a = document.createElement("div");
        a.innerText = "🧐 Tip : " + t[Math.floor(Math.random() * t.length)],
        a.id = "description",
        wrapper.appendChild(a);
        var o = document.createElement("div");
        o.id = "logo",
        o.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 519.31 91.33"><defs><style>.cls-1{fill:none;stroke:#fff;stroke-miterlimit:10;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><polygon class="cls-1" points="0.51 1.2 2.35 90.83 42.1 90.83 96.85 1.2 64.59 1.2 30.04 59.81 29.72 1.2 0.51 1.2"/><path class="cls-1" d="M121.29,1.2,187.44.62s6.19-.77,5.54,3.46-4.56,12.71-4.56,12.71-.65,2.94-6.84,2.94H134.33l-6.52,16h42a2.74,2.74,0,0,1,1.3,3.26c-.65,2.28-5.87,16.62-5.87,16.62h-44l-7.17,16.62h54.1L160.4,90.83H89.68s-14.66-.72-9.78-17l23.14-59S107.6,2.23,121.29,1.2Z"/><path class="cls-1" d="M209,.62,234,.56S237,.5,238.28,4.41s15,41.6,15,41.6L271.52,1.2H302.8L270.22,90.83h-29L224.59,45.69,206.67,90.83H174.73Z"/><path class="cls-1" d="M333.76.62,400.57.56s11.08-1.69,13,12.65l-7.17,18.25H373.68l3.42-11.73-30.63-.66-20.2,53.45h31.61l4.89-13.36-9.46-19.23H402.2L388.51,78.71s-5.87,12.12-20.2,12.12H299.87S286.51,88.16,293,70.56l22.48-57S322.68.41,333.76.62Z"/><path class="cls-1" d="M447.07,1.17,513.22.59s6.19-.77,5.54,3.46-4.56,12.71-4.56,12.71-.66,2.93-6.85,2.93H460.1l-6.52,16h42a2.74,2.74,0,0,1,1.31,3.26c-.66,2.28-5.87,16.62-5.87,16.62h-44L439.9,72.16H494L486.17,90.8H415.46s-14.67-.72-9.78-17l23.14-59S433.38,2.2,447.07,1.17Z"/></g></g></svg>',
        e.appendChild(o);
        var i = "DEV";
        "undefined" != typeof VERSION_CODE && (i = VERSION_CODE);
        var n = document.createElement("div");
        n.id = "footer",
        n.innerHTML = "v" + i,
        e.appendChild(n),
        e.appendChild(o);
        var r = document.createElement("div");
        r.id = "progress-bar-container",
        e.appendChild(r);
        var s = document.createElement("div");
        s.id = "progress-bar",
        r.appendChild(s),
        "undefined" != typeof PokiSDK && PokiSDK.gameLoadingStart()
    }(),
    e.on("preload:start", function() {
        var e = new Image;
        e.src = pc.app.assets.find("Shin-Thumbnail-3").getFileUrl(),
        e.id = "animated-loading-image-1",
        wrapper.appendChild(e)
    }),
    e.on("preload:end", function() {
        e.off("preload:progress")
    }),
    e.on("preload:progress", function(e) {
        var t = document.getElementById("progress-bar");
        if (t && (e = Math.min(1, Math.max(0, e)),
        t.style.width = 100 * e + "%"),
        "undefined" != typeof PokiSDK) {
            var a = {};
            a.percentageDone = e,
            a.kbLoaded = 100 * e,
            a.kbTotal = 100,
            a.fileNameLoaded = "game.json",
            a.filesLoaded = 1,
            a.filesTotal = 1,
            PokiSDK.gameLoadingProgress(a)
        }
    }),
    e.on("start", function() {
        var e = document.getElementById("application-splash-wrapper");
        e && e.parentElement && e.parentElement.removeChild(e),
        "undefined" != typeof PokiSDK && PokiSDK.gameLoadingFinished()
    })
});
var SpellManager = pc.createScript("spellManager");
SpellManager.attributes.add("playerEntity", {
    type: "entity"
}),
SpellManager.attributes.add("cameraEntity", {
    type: "entity"
}),
SpellManager.attributes.add("electricityEntity", {
    type: "entity"
}),
SpellManager.attributes.add("sparkEntity", {
    type: "entity"
}),
SpellManager.attributes.add("armLeftEntity", {
    type: "entity"
}),
SpellManager.attributes.add("armRightEntity", {
    type: "entity"
}),
SpellManager.attributes.add("iceEntity", {
    type: "entity"
}),
SpellManager.attributes.add("iceTexture", {
    type: "asset",
    assetType: "texture"
}),
SpellManager.attributes.add("venomEntity", {
    type: "entity"
}),
SpellManager.attributes.add("windEntity", {
    type: "entity"
}),
SpellManager.prototype.initialize = function() {
    var e = this.app.scene.fogColor
      , t = this.app.scene.fogDensity
      , i = this.app.scene.skyboxIntensity;
    this.currentSpell = !1,
    this.characterName = "Lilium",
    this.isReducedApplied = !1,
    this.isVenomActive = !1,
    this.isFrostBombActive = !1,
    this.midnightCurseTimer = !1,
    this.defaultFog = this.app.scene.fog + "",
    this.defaultFogColor = e,
    this.defaultDensity = t,
    this.defaultSkyboxIntensity = i,
    this.app.on("Spell:Trigger", this.onSpellTrigger, this),
    this.app.on("Effect:Trigger", this.onEffectTrigger, this),
    this.app.on("Game:Start", this.onGameStart, this),
    this.app.on("Game:Finish", this.onGameFinish, this),
    this.app.on("Player:Respawn", this.onRespawn, this),
    this.app.on("Player:Death", this.onSpellCancel, this),
    this.app.on("Player:Character", this.onCharacterSet, this),
    this.spellCount = 0,
    this.isActiveSpell = !1,
    this.activeSpells = [],
    this.weaponMaterial = !1,
    this.player = this.playerEntity.script.player
}
,
SpellManager.prototype.onCharacterSet = function(e) {
    this.characterName = e
}
,
SpellManager.prototype.onGameStart = function() {
    "Lilium" == this.characterName ? this.player.throwCooldown = 10 : "Shin" == this.characterName && (this.player.throwCooldown = 3),
    this.isReducedApplied = !1
}
,
SpellManager.prototype.onRespawn = function() {
    this.app.scene.fogColor = this.defaultFogColor,
    this.app.scene.fogDensity = 1e-4
}
,
SpellManager.prototype.onEffectTrigger = function(e) {
    if ("Wind" == e) {
        var t = 1.367
          , i = .878;
        this.cameraEntity.camera.fov > 75 && (t = 1.972,
        i = 1.266),
        this.windEntity.setLocalScale(t, i, i),
        this.windEntity.enabled = !0,
        setTimeout(function(e) {
            e.windEntity.enabled = !1
        }, 300, this)
    }
}
,
SpellManager.prototype.applySparkySpells = function() {
    this.sparkEntity.enabled = !0,
    this.activeSpells.push("GrenadeSpell"),
    this.currentSpell = "SparkySpells",
    this.entity.sound.play("Negative-Effect-02"),
    this.entity.sound.play("Ice-Loop"),
    setTimeout(function(e) {
        e.cancelSparkySpells()
    }, 4500, this)
}
,
SpellManager.prototype.cancelSparkySpells = function() {
    var e = this;
    e.entity.sound.stop("Ice-Loop"),
    e.entity.sound.play("Magic-Whoosh-1"),
    setTimeout(function() {
        e.sparkEntity.enabled = !1
    }, 700),
    e.activeSpells.splice(e.activeSpells.indexOf("GrenadeSpell"), 1)
}
,
SpellManager.prototype.applyMidnightCurse = function() {
    this.entity.sound.play("Wolf-Howl"),
    this.entity.sound.play("Negative-Effect-01"),
    this.entity.sound.play("Shadow-Loop-2"),
    this.app.fire("Player:StopSpeaking", !0),
    this.currentSpell = "MidnightCurse",
    this.activeSpells.push("GrenadeSpell"),
    this.app.scene.fogColor = pc.colors.purple,
    this.app.scene.fogDensity = .01,
    this.app.tween(this.app.scene).to({
        fogDensity: .3,
        skyboxIntensity: .3
    }, .3, pc.Linear).start(),
    clearTimeout(this.midnightCurseTimer),
    this.midnightCurseTimer = setTimeout(function(e) {
        e.cancelMidnightCurse()
    }, 1e4, this)
}
,
SpellManager.prototype.cancelMidnightCurse = function() {
    var e = this;
    e.app.tween(e.app.scene).to({
        fogDensity: 1e-4,
        skyboxIntensity: e.defaultSkyboxIntensity
    }, .3, pc.Linear).delay(.2).start(),
    e.entity.sound.play("Magic-Whoosh-1"),
    setTimeout(function() {
        e.entity.sound.stop("Shadow-Loop-2"),
        e.activeSpells.splice(e.activeSpells.indexOf("GrenadeSpell"), 1)
    }, 1e3)
}
,
SpellManager.prototype.applyMuscleShock = function() {
    if (this.player.isDeath)
        return this.spellCount = 0,
        this.activeSpells.splice(this.activeSpells.indexOf("GrenadeSpell"), 1),
        !1;
    if (this.spellCount > 4 || pc.isFinished)
        return this.spellCount = 0,
        this.isActiveSpell = !1,
        this.activeSpells.splice(this.activeSpells.indexOf("GrenadeSpell"), 1),
        !1;
    var e = Math.round(2 * Math.random()) + 1
      , t = Math.round(500 * Math.random()) - Math.round(500 * Math.random())
      , i = -Math.round(400 * Math.random())
      , a = 180 * Math.random();
    this.currentSpell = "MuscleShock",
    this.activeSpells.push("GrenadeSpell"),
    this.entity.sound.play("Electric-Shock-" + e),
    this.player.finishEmote(),
    this.player.movement.disableMovement(),
    this.app.tween(pc.controls.animation).to({
        cameraBounce: .8
    }, .04, pc.Linear).yoyo(!0).repeat(7).start(),
    this.app.tween(this.player.movement.animation).to({
        bounceAngle: 3
    }, .03, pc.Linear).yoyo(!0).repeat(7).start(),
    this.app.fire("Player:StopSpeaking", !0),
    this.app.fire("Network:Hurt", !0),
    this.electricityEntity.enabled = !0,
    this.electricityEntity.setLocalPosition(t, i, 0),
    this.electricityEntity.setLocalEulerAngles(0, 0, a),
    setTimeout(function(e) {
        e.player.movement.enableMovement()
    }, 400 * Math.random() + 100, this),
    setTimeout(function(e) {
        e.electricityEntity.enabled = !1
    }, 150, this),
    setTimeout(function(e) {
        e.applyMuscleShock()
    }, 600, this),
    this.spellCount++
}
,
SpellManager.prototype.applyVenom = function() {
    if (this.player.isDeath)
        return this.activeSpells.splice(this.activeSpells.indexOf("GrenadeSpell"), 1),
        !1;
    if (this.isVenomActive)
        return !1;
    this.venomEntity.enabled = !0,
    this.venomEntity.sprite.opacity = .2,
    this.venomTween = this.app.tween(this.venomEntity.sprite).to({
        opacity: .45
    }, 2, pc.BackIn),
    this.venomTween.start(),
    this.entity.sound.play("Venom"),
    this.entity.sound.play("Negative-Effect-01"),
    this.entity.sound.play("Heart-Beat"),
    this.isVenomActive = !1,
    this.app.fire("Network:Hurt", !0),
    this.player.movement.slowMovement(1.5),
    this.activeSpells.push("GrenadeSpell"),
    setTimeout(function(e) {
        e.cancelVenom()
    }, 2500, this)
}
,
SpellManager.prototype.cancelVenom = function() {
    this.venomTween && this.venomTween.stop(),
    this.venomTween = this.app.tween(this.venomEntity.sprite).to({
        opacity: 0
    }, .5, pc.BackIn),
    this.venomTween.start(),
    this.app.fire("Player:StopSpeaking", !0),
    this.player.movement.fastMovement(),
    this.entity.sound.play("Magic-Whoosh-1"),
    this.entity.sound.stop("Heart-Beat"),
    this.isVenomActive = !1,
    setTimeout(function(e) {
        e.venomEntity.enabled = !1
    }, 700, this)
}
,
SpellManager.prototype.applyFrostBomb = function() {
    if (this.player.isDeath)
        return this.activeSpells.splice(this.activeSpells.indexOf("GrenadeSpell"), 1),
        !1;
    if (this.isFrostBombActive)
        return !1;
    var e = this
      , t = 1.7;
    this.cameraEntity.camera.fov > 75 && (t = 2.5),
    this.iceEntity.enabled = !0,
    this.iceEntity.setLocalScale(t, t, t),
    this.iceMaterial = this.iceEntity.model.meshInstances[0].material,
    this.iceMaterial.opacity = 0,
    this.isFrostBombActive = !0,
    this.iceTween = this.app.tween(this.iceMaterial).to({
        opacity: 1
    }, 1, pc.Linear),
    this.iceTween.on("update", function(t) {
        e.iceMaterial.update()
    }),
    this.iceTween.start(),
    this.entity.sound.play("Ice-Start"),
    this.app.fire("Player:StopSpeaking", !0),
    this.player.movement.disableMovement(),
    this.player.movement.mouseLocked = !0,
    this.weaponEntity = this.player.weaponManager.currentWeaponEntity,
    this.weaponMaterial = this.weaponEntity.model.meshInstances[0].material,
    this.weaponMaterial.emissiveMap = this.iceTexture.resource,
    this.weaponMaterial.update(),
    this.armLeftEntity && this.armLeftEntity.model && this.armLeftEntity.model.meshInstances.length > 0 && (this.armsEntityMaterial = this.armLeftEntity.model.meshInstances[0].material,
    this.armsEntityMaterial.emissiveMap = this.iceTexture.resource,
    this.armsEntityMaterial.update()),
    this.app.fire("Network:Hurt", !0),
    this.app.fire("Weapon:Lock", !0),
    setTimeout(function(e) {
        e.cancelFrostBomb()
    }, 2e3, this),
    this.activeSpells.push("GrenadeSpell")
}
,
SpellManager.prototype.cancelFrostBomb = function() {
    var e = this;
    this.entity.sound.play("Ice-Break"),
    this.entity.sound.play("Magic-Whoosh-1"),
    this.isFrostBombActive = !1,
    this.iceMaterial = this.iceEntity.model.meshInstances[0].material,
    this.iceTween && this.iceTween.stop(),
    this.iceTween = this.app.tween(this.iceMaterial).to({
        opacity: 0
    }, .3, pc.Linear),
    this.iceTween.on("update", function(t) {
        e.iceMaterial.update()
    }),
    this.iceTween.start(),
    this.player.movement.enableMovement(),
    this.player.movement.mouseLocked = !1,
    this.app.fire("Weapon:Lock", !1),
    this.weaponMaterial && (this.weaponMaterial.emissiveMap = !1,
    this.weaponMaterial.update(),
    this.armsEntityMaterial && (this.armsEntityMaterial.emissiveMap = !1,
    this.armsEntityMaterial.update())),
    setTimeout(function(e) {
        e.iceEntity.enabled = !1
    }, 300, this)
}
,
SpellManager.prototype.cancelMuscleShock = function() {}
,
SpellManager.prototype.applyReduce = function() {
    this.isReducedApplied || ("Lilium" == this.characterName ? this.player.throwCooldown = 7 : "Shin" == this.characterName && (this.player.throwCooldown = 2),
    this.isReducedApplied = !0,
    this.app.fire("Overlay:Announce", "Reduce", "Throw cooldown time reduced", !1, "Reduce-Icon"))
}
,
SpellManager.prototype.onSpellCancel = function() {
    "MidnightCurse" == this.currentSpell && this.cancelMidnightCurse(),
    "MuscleShock" == this.currentSpell && this.cancelMuscleShock(),
    "SparkySpells" == this.currentSpell && this.cancelSparkySpells(),
    "FrostBomb" == this.currentSpell && this.cancelFrostBomb(),
    "Venom" == this.currentSpell && this.cancelVenom()
}
,
SpellManager.prototype.onSpellTrigger = function(e, t) {
    if (this.activeSpells.indexOf(e) > -1)
        return !1;
    "MidnightCurse" == e && (this.applyMidnightCurse(),
    this.app.fire("Overlay:Announce", "Midnight Curse", "by " + t, !1, "MidnightCurse-Icon")),
    "FrostBomb" == e && (this.applyFrostBomb(),
    this.app.fire("Overlay:Announce", "Frost Bomb", "by " + t, !1, "FrostBomb-Icon")),
    "MuscleShock" == e && (this.applyMuscleShock(),
    this.app.fire("Overlay:Announce", "Muscle Shock", "by " + t, !1, "MuscleShock-Icon")),
    "SparkySpells" == e && (this.applySparkySpells(),
    this.app.fire("Overlay:Announce", "Sparky Sprites", "by " + t, !1, "SparkySpells-Icon")),
    "Venom" == e && (this.applyVenom(),
    this.app.fire("Overlay:Announce", "Venom", "by " + t, !1, "Venom-Icon")),
    "Reduce" == e && this.applyReduce()
}
,
SpellManager.prototype.update = function(e) {}
;
var Tab = pc.createScript("tab");
Tab.attributes.add("menu", {
    type: "string",
    array: !0
}),
Tab.attributes.add("page", {
    type: "entity",
    array: !0
}),
Tab.attributes.add("align", {
    type: "string",
    enum: [{
        Vertical: "Vertical"
    }, {
        Horizontal: "Horizontal"
    }],
    default: "Vertical"
}),
Tab.attributes.add("buttonEntity", {
    type: "entity"
}),
Tab.attributes.add("buttonHolder", {
    type: "entity"
}),
Tab.attributes.add("onlyTabs", {
    type: "boolean",
    default: !1
}),
Tab.prototype.initialize = function() {
    for (var t in this.menuItems = [],
    this.buttonEntity.enabled = !1,
    this.menu) {
        var e = this.menu[t]
          , a = this.buttonEntity.element.width
          , n = this.buttonEntity.element.height
          , i = this.buttonEntity.clone();
        i.enabled = !0,
        i.findByName("Text").element.text = e,
        i.script.button.fireArgs = e,
        i.element.opacity = 0,
        i.name = e,
        "Vertical" == this.align ? i.setLocalPosition(0, -parseInt(t) * n, 0) : i.setLocalPosition(parseInt(t) * a, 0, 0),
        this.menuItems.push(i),
        this.buttonHolder.addChild(i)
    }
    this.app.on("Tab:" + this.entity.name, this.onTabChange, this),
    this.on("state", this.onStateChange, this),
    this.onTabChange(this.menu[0])
}
,
Tab.prototype.onStateChange = function(t) {
    !0 === t && this.onTabChange(this.menu[0])
}
,
Tab.prototype.onTabChange = function(t) {
    for (var e in this.page) {
        var a = this.page[e];
        a && this.menuItems.length != this.page.length && (a.name == t ? a.enabled = !0 : a.enabled = !1)
    }
    for (var n in this.menuItems) {
        var i = this.menuItems[n];
        if (this.onlyTabs)
            i.name == t ? i.element.opacity = 1 : i.element.opacity = 0;
        else {
            var s = this.page[n];
            i.name == t ? (i.element.opacity = 1,
            s.enabled = !0) : (i.element.opacity = 0,
            s.enabled = !1)
        }
    }
    this.app.fire("Tab:" + this.entity.name + ":Changed", t)
}
;
var Page = pc.createScript("page");
Page.attributes.add("activeOpacity", {
    type: "number",
    default: .05
}),
Page.attributes.add("defaultOpacity", {
    type: "number",
    default: 0
}),
Page.attributes.add("activePage", {
    type: "string"
}),
Page.prototype.initialize = function() {
    this.app.on("Page:" + this.entity.name, this.setPage, this),
    this.activePage && this.app.fire("Page:" + this.entity.name, this.activePage)
}
,
Page.prototype.setPage = function(t) {
    var e = this.entity.findByTag("Page")
      , a = this.entity.findByTag("Menu");
    for (var i in e) {
        var n = e[i]
          , p = a[i];
        n.name == t ? (n.enabled = !0,
        p.element.opacity = this.activeOpacity) : (n.enabled = !1,
        p.element.opacity = this.defaultOpacity)
    }
}
;
var Cookie = pc.createScript("cookie");
Cookie.attributes.add("key", {
    type: "string"
}),
Cookie.attributes.add("onGet", {
    type: "string"
}),
Cookie.prototype.initialize = function() {
    this.onGet && this.getCookie(),
    this.app.on("Cookie:" + this.entity.name, this.setCookie, this)
}
,
Cookie.prototype.setCookie = function(t) {
    var i = JSON.stringify(t);
    Utils.setItem(this.key, i)
}
,
Cookie.prototype.getCookie = function() {
    var t = Utils.getItem(this.key);
    if (t) {
        var i = JSON.parse(t);
        i && this.app.fire(this.onGet, i)
    }
}
;
var Fetcher = pc.createScript("fetcher");
Fetcher.attributes.add("auto", {
    type: "boolean",
    default: !0
}),
Fetcher.attributes.add("URL", {
    type: "string"
}),
Fetcher.attributes.add("data", {
    type: "string"
}),
Fetcher.attributes.add("loading", {
    type: "string"
}),
Fetcher.attributes.add("success", {
    type: "string"
}),
Fetcher.attributes.add("error", {
    type: "string"
}),
Fetcher.prototype.initialize = function() {
    this.auto && (this.onFetch(),
    this.on("state", function(t) {
        this.enabled && this.onFetch()
    }, this)),
    this.app.on("Fetcher:" + this.entity.name, this.onFetch, this)
}
,
Fetcher.prototype.onResult = function(t) {
    t ? t.success ? this.onSuccess(t) : this.onError(t) : this.onError("An error occured!")
}
,
Fetcher.prototype.onLoading = function() {
    var t = this.loading.split(", ");
    if (t.length > 0)
        for (var e in t) {
            var r = t[e]
              , i = r.split("@");
            if (i.length > 1) {
                var s = i[0]
                  , o = i[1];
                this.app.fire(s, o)
            } else
                this.app.fire(r, !0)
        }
}
,
Fetcher.prototype.onSuccess = function(t) {
    var e = this.success.split(", ");
    if (e.length > 0)
        for (var r in e) {
            var i = e[r]
              , s = i.split("@");
            if (s.length > 1) {
                var o = s[0]
                  , n = s[1];
                this.app.fire(o, n)
            } else
                this.app.fire(i, t)
        }
}
,
Fetcher.prototype.onError = function(t) {
    if (this.error) {
        var e = this.error.split(", ");
        if (e.length > 0)
            for (var r in e) {
                var i = e[r]
                  , s = i.split("@");
                if (s.length > 1) {
                    var o = s[0]
                      , n = s[1];
                    this.app.fire(o, n)
                } else
                    this.app.fire(i, t)
            }
    }
}
,
Fetcher.prototype.getRoomId = function(t) {
    var e = window.location.hash.split("#");
    return e.length > 1 && e[1]
}
,
Fetcher.prototype.getSession = function() {
    var t = Utils.getItem("Hash");
    return t || ""
}
,
Fetcher.prototype.preprocess = function(t) {
    var e = t;
    return e = (e = (e = e.replace("$hash", this.getRoomId())).replace("$session", this.getSession())).replace("$is_mobile", pc.isMobile)
}
,
Fetcher.prototype.onFetch = function(t) {
    t && (this.data = t);
    var e = this.preprocess(this.URL);
    this.onLoading(),
    this.fetch(e, this.data, this.onResult.bind(this))
}
,
Fetcher.prototype.fetch = function(t, e, r) {
    var i = "string" == typeof e ? e : Object.keys(e).map(function(t) {
        return encodeURIComponent(t) + "=" + encodeURIComponent(e[t])
    }).join("&")
      , s = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
    s.open("POST", t),
    s.onreadystatechange = function() {
        s.readyState > 3 && 200 == s.status && r(JSON.parse(s.responseText))
    }
    ,
    s.withCredentials = !0,
    s.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
    s.send(i)
}
;
var Form = pc.createScript("form");
Form.attributes.add("inputs", {
    type: "entity",
    array: !0
}),
Form.attributes.add("keys", {
    type: "string",
    array: !0
}),
Form.attributes.add("onSubmit", {
    type: "string"
}),
Form.prototype.initialize = function() {
    this.app.on("Form:" + this.entity.name, this.onFormSubmit, this)
}
,
Form.prototype.onFormSubmit = function() {
    var t = {};
    for (var i in this.keys) {
        t[this.keys[i]] = this.inputs[i].script.input.getValue()
    }
    this.app.fire("Fetcher:" + this.entity.name, t),
    this.app.fire(this.onSubmit, !0)
}
,
Form.prototype.update = function() {
    this.app.keyboard.wasPressed(pc.KEY_ENTER) && this.app.fire("Form:" + this.entity.name, !0)
}
;
var Table = pc.createScript("table");
Table.attributes.add("labels", {
    type: "string",
    array: !0
}),
Table.attributes.add("keys", {
    type: "string",
    array: !0
}),
Table.attributes.add("buttons", {
    type: "string",
    array: !0
}),
Table.attributes.add("color", {
    type: "rgb"
}),
Table.attributes.add("rowColor", {
    type: "rgb"
}),
Table.attributes.add("headerColor", {
    type: "rgb"
}),
Table.prototype.initialize = function() {
    this.isDestroyed = !1,
    this.rows = [],
    this._onInit(),
    this.on("state", function(t) {
        this.entity.enabled ? this._onInit() : this.container.remove()
    }, this),
    this.on("destroy", this.onDestroy, this),
    this.app.on("DOM:Clear", this.onDOMClear, this),
    this.app.on("DOM:Update", this.onDomUpdate, this),
    this.app.on("Table:" + this.entity.name, this.onSet, this)
}
,
Table.prototype.onDOMClear = function() {
    this.entity.enabled = !1
}
,
Table.prototype.onDestroy = function() {
    this.app.off("DOM:Update"),
    this.isDestroyed = !0,
    this.container && this.container.remove()
}
,
Table.prototype.onDomUpdate = function() {
    this.updateStyle()
}
,
Table.prototype._onInit = function() {
    this.container = document.createElement("div"),
    this.container.style.width = this.entity.element.width + "px",
    this.container.style.height = this.entity.element.height + "px";
    var t = "";
    t += "table { border-collapse: collapse; }",
    t += "table, td { font-size:14px; }",
    t += "table, td:first-child, th:last-child { width: 10px; }",
    t += "table, td:last-child, th:last-child { width: 50px; }",
    t += "table, button { margin-right:5px; padding: 0.3vw; float:left }",
    t += "table, th, td { padding:10px; }",
    t += "table, .verification { height:16px; float:left; margin-right: 5px; }",
    t += "table, tr:nth-child(even) { background-color:" + ("rgba(" + 255 * this.rowColor.r + ", " + 255 * this.rowColor.g + ", " + 255 * this.rowColor.b + ", 0.1)") + "; }",
    t += "table, tr th { text-align:left; font-size:12px; background-color:" + ("rgba(" + 255 * this.headerColor.r + ", " + 255 * this.headerColor.g + ", " + 255 * this.headerColor.b + ", 0.1)") + "; }";
    var e = document.createElement("style");
    e.innerHTML = t,
    e.id = "table-style",
    this.container.appendChild(e),
    this.table = document.createElement("table"),
    this.table.style.width = "100%",
    this.table.style.color = this.color,
    this.container.appendChild(this.table),
    this.container.style.position = "absolute",
    this.container.style.overflow = "scroll",
    this.container.style.overflowX = "hidden",
    document.body.appendChild(this.container);
    var i = document.createElement("tr");
    for (var n in this.table.appendChild(i),
    this.labels) {
        var a = this.labels[n]
          , r = document.createElement("th");
        r.innerHTML = a,
        0 === a.length && (r.style.width = "32px"),
        i.appendChild(r)
    }
    this.updateStyle()
}
,
Table.prototype.createThumbnail = function(t, e) {
    var i = t.thumbnail;
    if (this.app.assets.find(i)) {
        var n = document.createElement("img");
        n.src = this.app.assets.find(i).getFileUrl(),
        n.width = 128,
        e.appendChild(n)
    }
}
,
Table.prototype.createButtons = function(t, e, i) {
    if (t[e] && t[e].match(/\$button\[(.*?)\]/)) {
        var n = t[e].match(/\$button\[(.*?)\]/)
          , a = parseInt(n[1])
          , r = (s = this.buttons[a].split("="))[1].split("@");
        (o = document.createElement("button")).innerText = s[0],
        o.trigger = r[0],
        o._key = r[1],
        o._value = t[r[1]],
        o.onclick = function() {
            var t = {};
            t[this._key] = this._value,
            pc.app.fire(this.trigger, t)
        }
        ,
        i.appendChild(o)
    } else
        for (var a in this.buttons) {
            var s, o;
            r = (s = this.buttons[a].split("="))[1].split("@");
            (o = document.createElement("button")).innerText = s[0],
            o.trigger = r[0],
            o._key = r[1],
            o._value = t[r[1]],
            o.onclick = function() {
                var t = {};
                t[this._key] = this._value,
                pc.app.fire(this.trigger, t)
            }
            ,
            i.appendChild(o)
        }
}
,
Table.prototype.clear = function() {
    for (var t = this.rows.length; t--; )
        this.rows[t].remove()
}
,
Table.prototype.onSet = function(t) {
    this.clear();
    var e = this.app.assets.find("Verified-Icon.png");
    for (var i in t = t.result) {
        var n = t[i]
          , a = document.createElement("tr");
        for (var r in this.keys) {
            var s = this.keys[r]
              , o = document.createElement("td");
            if (s.search("\\$verified") > -1) {
                var l = ""
                  , h = s.replace("$verified", "").trim();
                "1" == n.verified && (l = '<img src="' + e.getFileUrl() + '" class="verification">'),
                o.innerHTML = l + " " + n[h]
            } else
                "$thumbnail" == s ? this.createThumbnail(n, o) : "$button" == s || "$button" == n[s] || n[s] && n[s].length > 0 && n[s].search("\\$button") > -1 ? this.createButtons(n, s, o) : "$index" == s ? o.innerText = parseInt(i) + 1 : o.innerHTML = n[s];
            a.appendChild(o)
        }
        this.table.appendChild(a),
        this.rows.push(a)
    }
}
,
Table.prototype.updateStyle = function() {
    try {
        this._updateStyle()
    } catch (t) {}
}
,
Table.prototype._updateStyle = function() {
    if (this.isDestroyed)
        return !1;
    if (this.entity.enabled && this.entity.element && this.entity.element.screenCorners) {
        var t = this.entity.element.screenCorners
          , e = 1 / this.app.graphicsDevice.maxPixelRatio;
        this.container.style.left = t[0].x * e + "px",
        this.container.style.bottom = t[0].y * e + "px",
        this.container.style.position = "absolute",
        this.container.style.display = "block",
        this.container.style.zIndex = 1e3;
        var i = (t[2].x - t[0].x) * e / this.entity.element.width
          , n = (t[2].y - t[0].y) * e / this.entity.element.height;
        this.container.style.transform = "scale(" + i + ", " + n + ")",
        this.container.style.transformOrigin = "left bottom"
    }
}
;
var Visibility = pc.createScript("visibility");
Visibility.attributes.add("visible", {
    type: "boolean",
    default: !0
}),
Visibility.attributes.add("query", {
    type: "string",
    default: "success == true"
}),
Visibility.attributes.add("hideLater", {
    type: "boolean"
}),
Visibility.prototype.initialize = function() {
    this.app.on("Show:" + this.entity.name, this.onShow, this),
    this.app.on("Hide:" + this.entity.name, this.onHide, this),
    this.visible,
    this.entity.on("state", this.onStateChange, this)
}
,
Visibility.prototype.onShow = function() {
    this.entity.enabled = !0
}
,
Visibility.prototype.onHide = function() {
    this.entity.enabled = !1
}
,
Visibility.prototype.onStateChange = function(t) {}
,
Visibility.prototype.trigger = function(t) {
    try {
        this._trigger(t)
    } catch (t) {
        this.entity.enabled = !1
    }
}
,
Visibility.prototype._trigger = function(data) {
    if (this.query && data) {
        var query = eval("data." + this.query);
        query ? (this.entity.enabled = !0,
        this.hideLater && setTimeout(function(t) {
            t.entity.enabled = !1
        }, 3e3, this)) : this.entity.enabled = !1
    } else
        this.entity.enabled = !1
}
;
var Template = pc.createScript("template");
Template.attributes.add("autoRefresh", {
    type: "boolean",
    default: !1
}),
Template.attributes.add("onInit", {
    type: "string"
}),
Template.prototype.initialize = function() {
    this.app.on("Template:" + this.entity.name, this.onUpdate, this),
    this.onInit && (this.onInitTrigger(),
    this.onUpdate())
}
,
Template.prototype.onInitTrigger = function(e) {
    var t = this.onInit.split(", ");
    if (t.length > 0)
        for (var r in t) {
            var i = t[r]
              , a = i.split("@");
            if (a.length > 1) {
                var n = a[0]
                  , s = a[1];
                this.app.fire(n, s)
            } else
                this.app.fire(i, e)
        }
}
,
Template.prototype.limit = function(e) {
    return e.slice(0, 16)
}
,
Template.prototype.count = function(e) {
    var t = new Date(e).getTime() - (new Date).getTime();
    Math.floor(t / 864e5);
    return Math.floor(t % 864e5 / 36e5) + " hours " + Math.floor(t % 36e5 / 6e4) + " minutes " + Math.floor(t % 6e4 / 1e3) + " seconds "
}
,
Template.prototype.preprocess = function(e, t) {
    var r = t.split(" | ");
    return r.length > 1 ? this[r[1]](e) : e
}
,
Template.prototype.render = function(data, text) {
    for (var regex = /\{\{(.*?)\}\}/gm, str = text, m; null !== (m = regex.exec(text)); ) {
        m.index === regex.lastIndex && regex.lastIndex++;
        var content = m[1]
          , variable = m[1];
        variable = variable.split(" | "),
        variable = variable[0];
        try {
            var value = this.preprocess(eval("data." + variable), content);
            str = value ? str.replace(m[0], value) : str.replace(m[0], "")
        } catch (e) {}
    }
    return str
}
,
Template.prototype.getAsset = function(e, t) {
    var r = e[t]
      , i = this.app.assets.find(r);
    if (void 0 !== r && i)
        return i
}
,
Template.prototype.refreshComponents = function(e) {
    var t = this.entity.findByTag("Dynamic");
    for (var r in t) {
        var i = t[r];
        i && i.script && i.script.visibility && i.script.visibility.trigger(e),
        i && i.script && i.script.bar && i.script.bar.setValue(e)
    }
}
,
Template.prototype.onUpdate = function(e) {
    this.refreshComponents(e);
    for (var t = this.entity.findByTag("Dynamic"), r = t.length; r--; ) {
        var i = t[r];
        if (i && i.enabled) {
            if (i.element.type == pc.ELEMENTTYPE_TEXT) {
                var a = i.element.text;
                i.element.source ? i.element.text = i.element.source + "" : i.element.source = a,
                i.element.text = this.render(e, i.element.text)
            }
            if (i.element.type == pc.ELEMENTTYPE_IMAGE) {
                var n = i.element.textureAsset
                  , s = this.getAsset(e, i.name);
                if (i.element.sourceImage = n,
                i.element.sourceImage) {
                    var o = i.element.sourceImage;
                    i.element.textureAsset = o
                } else
                    i.element.sourceImage = n;
                s && (i.element.textureAsset = s)
            }
        }
    }
    this.autoRefresh && (clearTimeout(this.timer),
    this.timer = setTimeout(function(t) {
        t.onUpdate(e)
    }, 1e3, this))
}
;
var View = pc.createScript("view");
View.attributes.add("items", {
    type: "entity",
    array: !0
}),
View.attributes.add("defaultView", {
    type: "string"
}),
View.prototype.initialize = function() {
    this.app.on("View:" + this.entity.name, this.onViewChange, this),
    this.defaultView && this.app.fire("View:" + this.entity.name, this.defaultView)
}
,
View.prototype.onViewChange = function(e) {
    for (var i in this.items) {
        var t = this.items[i];
        e == t.name ? t.enabled = !0 : t.enabled = !1
    }
}
;
var Check = pc.createScript("check");
Check.attributes.add("query", {
    type: "string"
}),
Check.attributes.add("success", {
    type: "string"
}),
Check.attributes.add("fail", {
    type: "string"
}),
Check.prototype.initialize = function() {
    this.app.on("Check:" + this.entity.name, this.onCheck, this)
}
,
Check.prototype.onCheck = function(data) {
    var query = eval("data." + this.query);
    query ? this.onSuccess(data) : this.onError(data)
}
,
Check.prototype.onSuccess = function(t) {
    var e = this.success.split(", ");
    if (e.length > 0)
        for (var i in e) {
            var r = e[i]
              , a = r.split("@");
            if (a.length > 1) {
                var s = a[0]
                  , h = a[1];
                this.app.fire(s, h)
            } else
                this.app.fire(r, t)
        }
}
,
Check.prototype.onError = function(t) {
    var e = this.fail.split(", ");
    if (e.length > 0)
        for (var i in e) {
            var r = e[i]
              , a = r.split("@");
            if (a.length > 1) {
                var s = a[0]
                  , h = a[1];
                this.app.fire(s, h)
            } else
                this.app.fire(r, t)
        }
}
;
var Bar = pc.createScript("bar");
Bar.attributes.add("key", {
    type: "string"
}),
Bar.attributes.add("start", {
    type: "string"
}),
Bar.attributes.add("isParticle", {
    type: "boolean",
    default: !1,
    description: "Do you want to enable particle (sprite animation)? Dependents on Sprite.js"
}),
Bar.attributes.add("particleType", {
    type: "string",
    enum: [{
        onEnd: "onEnd"
    }, {
        onDuring: "onDuring"
    }],
    default: "onEnd"
}),
Bar.attributes.add("isAnimated", {
    type: "boolean",
    default: !0,
    description: "Do you want to animate the bar fill?"
}),
Bar.attributes.add("animationDuration", {
    type: "number",
    default: 1,
    description: "Duration of the animation. Default is 1."
}),
Bar.attributes.add("isFillColorChange", {
    type: "boolean",
    default: !1,
    description: "Do you want to enable bar color change, based on its fill status?"
}),
Bar.attributes.add("lowFillColor", {
    type: "rgb",
    description: "Set a color for low levels of bar, 0 to 0.33 local scale"
}),
Bar.attributes.add("midFillColor", {
    type: "rgb",
    description: "Set a color for mid levels of bar, 0.33 to 0.66 local scale"
}),
Bar.attributes.add("highFillColor", {
    type: "rgb",
    description: "Set a color for high levels of bar, 0.66 to 1 local scale"
}),
Bar.prototype.initialize = function() {}
,
Bar.prototype.setValue = function(t) {
    var a = t[this.key];
    this.isParticle,
    this.particleType;
    t[this.start] && this.entity.setLocalScale(t[this.start], 1, 1),
    a > 0 ? this.isAnimated ? this.entity.tween(this.entity.getLocalScale()).to({
        x: a
    }, this.animationDuration, pc.SineOut).start().on("complete", function() {}) : this.entity.setLocalScale(a, 1, 1) : this.entity.setLocalScale(.001, 1, 1)
}
;
var Popup = pc.createScript("popup");
Popup.attributes.add("title", {
    type: "string",
    default: "Popup Title"
}),
Popup.attributes.add("description", {
    type: "string",
    default: "Select one of them!"
}),
Popup.attributes.add("onSelect", {
    type: "string"
}),
Popup.attributes.add("headerColor", {
    type: "rgb"
}),
Popup.attributes.add("headerTextColor", {
    type: "rgb"
}),
Popup.attributes.add("itemNames", {
    type: "string",
    array: !0
}),
Popup.attributes.add("itemImages", {
    type: "asset",
    array: !0,
    assetType: "texture"
}),
Popup.prototype.initialize = function() {
    this.on("state", function(t) {
        this.entity.enabled || (this.wrapper && this.wrapper.remove(),
        pc.isButtonLocked = !1)
    }, this),
    this.on("destroy", this._onDestroy, this),
    this.app.on("Popup:" + this.entity.name, this.onSet, this),
    this.app.on("Popup:Close", this.onClose, this)
}
,
Popup.prototype.onClose = function(t) {
    this.entity.enabled && (this.entity.enabled = !1),
    this.wrapper && this.wrapper.remove()
}
,
Popup.prototype.onSet = function(t) {
    if (t) {
        if (this.onSelect) {
            var e = this.onSelect.split(", ");
            if (e.length > 0)
                for (var i in e) {
                    var o = e[i].split("@");
                    if (o.length > 1) {
                        var n = o[0]
                          , r = o[1];
                        this.app.fire(n, r)
                    } else
                        this.app.fire(o[0], t)
                }
        }
        setTimeout(function(t) {
            t.entity.enabled && (t.entity.enabled = !1),
            t.wrapper && t.wrapper.remove()
        }, 100, this)
    } else
        this._onInit()
}
,
Popup.prototype._onDestroy = function() {
    pc.isButtonLocked = !1
}
,
Popup.prototype.getItems = function() {
    var t = [];
    for (var e in this.itemNames) {
        var i = this.itemNames[e]
          , o = "";
        if (this.itemImages[e]) {
            var n = this.itemImages[e].getFileUrl();
            o = '<div class="item" ',
            o += "onclick=\"pc.app.fire('Popup:" + this.entity.name + "', '" + i + "')\">",
            o += '<img src="' + n + '">',
            o += '<span class="label">' + i + "</span>",
            o += "</div>"
        } else {
            var r = i.match(/(.*?)\((.*?)\)/)
              , s = i
              , a = "";
            r && r.length > 0 && (s = r[1].trim(),
            a = r[2]),
            o = '<div class="list-item" ',
            o += "onclick=\"pc.app.fire('Popup:" + this.entity.name + "', '" + s + "')\">",
            o += '<span class="label">' + s + "<small>" + a + "</small></span>",
            o += "</div>"
        }
        t.push(o)
    }
    return t.join("")
}
,
Popup.prototype._onInit = function() {
    this.entity.enabled = !0;
    var t = document.getElementById("shadow");
    if (t && t.remove(),
    pc.isButtonLocked = !0,
    this.wrapper = document.createElement("div"),
    this.wrapper.id = "shadow",
    this.container = document.createElement("div"),
    this.container.id = "popup",
    this.container.style.width = this.entity.element.width + "px",
    this.container.style.height = this.entity.element.height + "px",
    this.wrapper.appendChild(this.container),
    document.body.appendChild(this.wrapper),
    !document.getElementById("popup-style")) {
        var e = "rgb(" + 255 * this.headerColor.r + ", " + 255 * this.headerColor.g + ", " + 255 * this.headerColor.b + ")"
          , i = "rgb(" + 255 * this.headerTextColor.r + ", " + 255 * this.headerTextColor.g + ", " + 255 * this.headerTextColor.b + ")"
          , o = .8;
        Utils.isMobile() && (o = 3);
        var n = "";
        n += "#shadow {",
        n += "        background-color:rgba(0, 0, 0, 0.5);",
        n += "        width : 100%; ",
        n += "        height : 100%; ",
        n += "        left:0px; ",
        n += "        right:0px; ",
        n += "        position:fixed; ",
        n += "        z-index:10000; ",
        n += "}",
        n += "#popup { background-color:#ffffff; overflow:hidden; }",
        n += "#header {",
        n += "        background-color:" + e + ";",
        n += "        color : " + i + "; ",
        n += "        box-shadow: 0px 0.2vw 0.5vw #ccc; ",
        n += "        text-align: center; ",
        n += "        padding:0.8vw 0px;",
        n += "        font-size:1vw;",
        n += "}",
        n += "#footer {",
        n += "        background-color:rgba(0, 0, 0, 0.6);",
        n += "        color : #fff; ",
        n += "        text-align: center; ",
        n += "        padding:0.5vw 0px; ",
        n += "        font-size:0.8vw; ",
        n += "        position:absolute; ",
        n += "        bottom:0px; ",
        n += "        left:0px; ",
        n += "        box-sizing:border-box; ",
        n += "}",
        n += "#content {",
        n += "        display: flex;",
        n += "        flex-wrap: wrap;",
        n += "        padding: 0.5vw;",
        n += "        box-sizing: border-box;",
        n += "        height: calc(100% - 2.5vw);",
        n += "}",
        n += ".list-item {",
        n += "        width: 100%;",
        n += "        border-bottom: solid 1px #ddd;",
        n += "        padding: 1.5vw;",
        n += "        position:relative;",
        n += "        transition:all 0.1s;",
        n += "        cursor:pointer;",
        n += "        overflow:hidden;",
        n += "        box-sizing: border-box;",
        n += "}",
        n += ".list-item:last-child {",
        n += "        border-bottom: none;",
        n += "}",
        n += ".list-item:hover {",
        n += "        background:" + e + ";",
        n += "        transform:scale(1.05, 1.05);",
        n += "        color:#fff;",
        n += "}",
        n += ".list-item small {",
        n += "        font-size:0.7vw;",
        n += "        margin-left:1vw;",
        n += "}",
        n += ".item {",
        n += "        width: calc(50% - 0.8vw);",
        n += "        border: solid 1px #ddd;",
        n += "        margin: 0.4vw;",
        n += "        box-shadow: 0px 0px 0.5vw #ddd;",
        n += "        position:relative;",
        n += "        transition:all 0.1s;",
        n += "        cursor:pointer;",
        n += "        border-radius:0.4vw;",
        n += "        overflow:hidden;",
        n += "        box-sizing: border-box;",
        n += "}",
        n += ".item:hover {",
        n += "        background:" + e + ";",
        n += "        transform:scale(1.05, 1.05);",
        n += "}",
        n += ".item img{",
        n += "        width: 100%;",
        n += "        margin-left: auto;",
        n += "        margin-right: auto;",
        n += "        display:block;",
        n += "}",
        n += ".item .label{",
        n += "        width: 100%;",
        n += "        background:rgba(0, 0, 0, 0.75);",
        n += "        padding: 0.5vw;",
        n += "        font-size: " + o + "vw;",
        n += "        color: #fff;",
        n += "        text-align: center;",
        n += "        position: absolute;",
        n += "        left: 0px;",
        n += "        bottom: 0px;",
        n += "        box-sizing: border-box;",
        n += "}";
        var r = document.createElement("style");
        r.innerHTML = n,
        r.id = "popup-style",
        document.body.appendChild(r)
    }
    this.header = document.createElement("div"),
    this.header.id = "header",
    this.header.style.width = "100%",
    this.header.style.height = "1vw",
    this.header.innerText = this.title,
    this.container.appendChild(this.header),
    this.content = document.createElement("div"),
    this.content.id = "content",
    this.content.style.width = "100%",
    this.content.innerHTML = this.getItems(),
    this.container.appendChild(this.content),
    this.container.style.position = "absolute",
    this.container.style.overflow = "hidden",
    this.updateStyle()
}
,
Popup.prototype.updateStyle = function() {
    if (this.entity.element.screenCorners && this.entity.enabled && this.wrapper) {
        var t = this.entity.element.screenCorners
          , e = 1 / this.app.graphicsDevice.maxPixelRatio;
        this.container.style.left = t[0].x * e + "px",
        this.container.style.bottom = t[0].y * e + "px",
        this.container.style.position = "absolute",
        this.container.style.display = "block",
        this.container.style.zIndex = 1e3;
        var i = (t[2].x - t[0].x) * e / this.entity.element.width
          , o = (t[2].y - t[0].y) * e / this.entity.element.height;
        this.container.style.transform = "scale(" + i + ", " + o + ")",
        this.container.style.transformOrigin = "left bottom"
    }
}
;
var Alert = pc.createScript("alert");
Alert.attributes.add("alertEntity", {
    type: "entity"
}),
Alert.attributes.add("alertMessage", {
    type: "entity"
}),
Alert.prototype.initialize = function() {
    this.app.on("Confirm:" + this.entity.name, this.onAlert, this),
    this.app.on("Alert:" + this.entity.name, this.onAlert, this),
    this.app.on("Alert:Close", this.onAlertClose, this),
    this.entity.on("destroy", this.onDestroy, this)
}
,
Alert.prototype.onDestroy = function() {
    this.app.off("Alert:" + this.entity.name),
    this.app.off("Alert:Close")
}
,
Alert.prototype.onAlert = function(t) {
    this.app.scene.layers.getLayerByName("Lightroom").enabled = !1,
    this.app.scene.layers.getLayerByName("Lightroom-Top").enabled = !1;
    var e = document.querySelectorAll("table, input");
    e.length > 0 && e.forEach(function(t) {
        var e = t.style.display;
        t.currentDisplay = e,
        t.style.display = "none"
    }),
    setTimeout(function(e) {
        e._onAlert(t)
    }, 100, this)
}
,
Alert.prototype._onAlert = function(t) {
    var e = t;
    "object" == typeof t && (e = t.message),
    this.alertEntity.enabled = !0,
    this.alertMessage.element.text = e,
    this.entity.sound.play("Error")
}
,
Alert.prototype.onAlertClose = function(t) {
    this.alertEntity.enabled = !1,
    this.app.scene.layers.getLayerByName("Lightroom").enabled = !0,
    this.app.scene.layers.getLayerByName("Lightroom-Top").enabled = !0;
    var e = document.querySelectorAll("table, input");
    e.length > 0 && e.forEach(function(t) {
        var e = t.currentDisplay;
        t.style.display = e
    })
}
;
var SpellWind = pc.createScript("spellWind");
SpellWind.attributes.add("material", {
    type: "asset",
    assetType: "material"
}),
SpellWind.attributes.add("scaleSpeed", {
    type: "number",
    default: 5
}),
SpellWind.attributes.add("opacityDelay", {
    type: "number",
    default: .1
}),
SpellWind.attributes.add("time", {
    type: "number",
    default: 1.5
}),
SpellWind.prototype.initialize = function() {
    this.scale = 0,
    this.timestamp = 10,
    this.app.on("Spell:Wind", this.onSet, this)
}
,
SpellWind.prototype.onSet = function(t) {
    this.scale = .1,
    this.timestamp = 0,
    this.material.resource.opacity = 1,
    this.entity.setLocalPosition(t),
    this.app.tween(this.material.resource).to({
        opacity: 0
    }, .5, pc.Linear).delay(this.opacityDelay).start(),
    this.entity.enabled = !0,
    this.entity.sound.play("Cast")
}
,
SpellWind.prototype.update = function(t) {
    this.entity.rotateLocal(0, -1500 * t, 0),
    this.scale += t * this.scaleSpeed,
    this.timestamp += t,
    this.entity.setLocalScale(this.scale, this.scale, this.scale),
    this.material.resource.update(),
    this.timestamp > this.time && (this.entity.enabled = !1)
}
;
var RoomManager = pc.createScript("roomManager");
RoomManager.attributes.add("isDebug", {
    type: "boolean",
    default: !0
}),
RoomManager.attributes.add("isMobile", {
    type: "boolean",
    default: !1
}),
RoomManager.attributes.add("URL", {
    type: "string"
}),
RoomManager.attributes.add("testURL", {
    type: "string"
}),
RoomManager.attributes.add("serverCode", {
    type: "string",
    default: "1.0.0"
}),
RoomManager.attributes.add("sessionLink", {
    type: "entity"
}),
RoomManager.attributes.add("playersEntity", {
    type: "entity"
}),
RoomManager.attributes.add("playerCountEntity", {
    type: "entity"
}),
RoomManager.attributes.add("invitePlayers", {
    type: "entity"
}),
RoomManager.attributes.add("inviteCountEntity", {
    type: "entity"
}),
RoomManager.attributes.add("matchCountEntity", {
    type: "entity"
}),
RoomManager.attributes.add("matchTimeEntity", {
    type: "entity"
}),
RoomManager.attributes.add("matchEstEntity", {
    type: "entity"
}),
RoomManager.attributes.add("matchmakingEntity", {
    type: "entity"
}),
RoomManager.attributes.add("friendEntity", {
    type: "entity"
}),
RoomManager.attributes.add("friendHolder", {
    type: "entity"
}),
RoomManager.attributes.add("friendWaiting", {
    type: "entity"
}),
RoomManager.attributes.add("lockIconOwner", {
    type: "entity"
}),
RoomManager.attributes.add("lockIconPlayer", {
    type: "entity"
}),
RoomManager.attributes.add("matchmakingTitle", {
    type: "entity"
}),
RoomManager.attributes.add("matchmakingCancel", {
    type: "entity"
}),
RoomManager.attributes.add("lockTextOwner", {
    type: "entity"
}),
RoomManager.attributes.add("lockTextPlayer", {
    type: "entity"
}),
RoomManager.prototype.initialize = function() {
    "undefined" != typeof VERSION && (this.isDebug = !1),
    this.currentUsernames = [],
    this.currentMap = "Sierra",
    this.currentServer = "EU",
    this.lastTickTime = Date.now(),
    this.lastSelfTime = Date.now(),
    this.setRoomSettings(),
    this.friends = [],
    this.isSpectator = !1,
    this.isStarted = !1,
    this.waitingForInfo = !1,
    this.time = 0,
    this.totalTime = 0,
    this.ws = !1,
    this.maxPlayers = 4,
    this.username = "none",
    this.pack = MessagePack.initialize(4194304),
    this.isMatchmaking = !1,
    this.isMatchmakingStarted = !1,
    window.onhashchange = this.reconnect.bind(this),
    this.reconnect(),
    this.app.on("RoomManager:Preroll", this.onPreroll, this),
    this.app.on("RoomManager:Copy", this.onCopy, this),
    this.app.on("RoomManager:Match", this.onMatchSet, this),
    this.app.on("RoomManager:Matchmaking", this.matchmaking, this),
    this.app.on("RoomManager:Hash", this.onHashSet, this),
    this.app.on("RoomManager:Leave", this.onLeave, this),
    this.app.on("RoomManager:Private", this.onPrivateChange, this),
    this.app.on("RoomManager:Start", this.onStart, this),
    this.app.on("RoomManager:Map", this.onMapSelection, this),
    this.app.on("RoomManager:SetServer", this.onServerSelection, this),
    this.app.on("RoomManager:Rematchmaking", this.rematchmaking, this),
    this.app.on("Game:Found", this.onGameFound, this),
    this.app.on("Template:Profile", this.setProfile, this),
    this.app.on("Server:Tick", this.onServerTick, this),
    this.app.on("RoomManager:CreateInvite", this.onCreateInvite, this),
    this.timer = setInterval(function(t) {
        !0 === t.isMatchmakingStarted && (t.time > -1 && (t.time > 15 && (t.matchEstEntity.element.text = Utils.mmss(50)),
        t.time > 50 && (t.matchEstEntity.element.text = Utils.mmss(120)),
        t.matchTimeEntity.element.text = Utils.mmss(t.totalTime),
        t.totalTime++,
        t.time++),
        t.time > 20 && t.rematchmaking())
    }, 1e3, this),
    this.app.on(atob("TmV0d29yazpHdWFyZA=="), this.onSelfTime, this)
}
,
RoomManager.prototype.setProfile = function(t) {
    this.setSession()
}
,
RoomManager.prototype.onServerSelection = function(t) {
    Utils.getItem("Server") ? this.currentServer = JSON.parse(Utils.getItem("Server")) : this.currentServer = t,
    this.setRoomSettings()
}
,
RoomManager.prototype.onMapSelection = function(t) {
    this.currentMap = t,
    this.setRoomSettings()
}
,
RoomManager.prototype.setRoomSettings = function() {
    this.app.fire("Template:QuickMatch", {
        currentMap: this.currentMap,
        currentServer: this.currentServer,
		max_player: this.maxPlayers
    }),
    pc.currentMap = this.currentMap
}
,
RoomManager.prototype.onCreateInvite = function() {
    this.app.fire("Analytics:Event", "Invite", "Create"),
    this.app.fire("Fetcher:Invite", {
        map: this.currentMap,
        version: this.serverCode,
        max_player: this.maxPlayers,
        country: this.currentServer
    })
}
,
RoomManager.prototype.onPreroll = function() {
    this.app.fire("Menu:Mute", !0);
    var t = this;
    this.app.fire("Ads:Preroll", function() {
        t.startMatchmaking()
    })
}
,
RoomManager.prototype.onServerTick = function() {
    this.lastTickTime,
    this.lastSelfTime,
    this.lastTickTime = Date.now()
}
,
RoomManager.prototype.onSelfTime = function() {
    this.lastSelfTime = Date.now()
}
,
RoomManager.prototype.startMatchmaking = function() {
    this.isMatchmakingStarted = !0,
    this.app.fire("RoomManager:Matchmaking", !0),
    this.app.fire("Fetcher:Match", {
        country: this.currentServer,
        version: this.serverCode,
        map: this.currentMap,
        max_player: this.maxPlayers,
        is_mobile: pc.isMobile ? 1 : 0
    }),
    this.app.fire("Analytics:Event", "Matchmaking", "Start")
}
,
RoomManager.prototype.onCopy = function() {
    Utils.copyToClipboard(this.sessionLink.script.input.getValue()),
    this.app.fire("Alert:Menu", "Link copied!"),
    this.app.fire("Analytics:Event", "Invite", "LinkCopy")
}
,
RoomManager.prototype.onMatchSet = function(t) {
    this.isMatchmaking = !0,
    this.onHashSet(t)
}
,
RoomManager.prototype.onHashSet = function(t) {
    if (t) {
        var e = t.result.split("#");
        window.location.hash = "#" + e[1]
    }
}
,
RoomManager.prototype.onLeave = function(t) {
    this.ws && (this.ws.close(),
    this.ws = !1),
    window.location.hash = "",
    this.isMatchmaking = !1,
    this.waitingForInfo = !1,
    this.isMatchmakingStarted = !1,
    this.app.fire("View:Match", "QuickMatch"),
    t ? this.app.fire("Analytics:Event", "Room", "Rematchmaking") : (this.app.fire("Alert:Menu", {
        message: "Session is canceled."
    }),
    this.app.fire("Analytics:Event", "Invite", "Cancel")),
    this.matchmakingEntity.enabled = !1,
    this.friendWaiting.enabled = !1
}
,
RoomManager.prototype.getRoomId = function(t) {
    var e = window.location.hash.split("#");
    if (this.isSpectator = !1,
    e.length > 1) {
        var i = e[1].split(":");
        return i.length > 1 && "Spectate" == i[0] ? (this.isSpectator = !0,
        i[1]) : e[1]
    }
    return !1
}
,
RoomManager.prototype.setSession = function() {
    pc.session && pc.session.hash ? (this.hash = pc.session.hash,
    pc.session.username && (this.username = pc.session.username)) : this.hash = !1
}
,
RoomManager.prototype.reconnect = function() {
    this.setSession(),
    this.isDebug ? this.connect(this.testURL) : this.connect(this.URL)
}
,
RoomManager.prototype.getKeys = function() {
    return {
        auth: "auth",
        room: "room",
        leave: "leave",
        private: "private",
        matchmaking: "matchmaking",
        rematchmaking: "rematchmaking",
        start: "start"
    }
}
,
RoomManager.prototype.connect = function(t) {
    if (this.ws && (this.ws.close(),
    this.ws = !1),
    this.keys = this.getKeys(),
    this.roomId = this.getRoomId(),
    this.isSpectator)
        return console.log("User is spectator!"),
        setTimeout(function(t) {
            t.start()
        }, 500, this),
        !1;
    this.roomId && (this.ws = new WebSocket(t + "/?" + this.roomId),
    this.ws.binaryType = "arraybuffer",
    this.ws.onopen = this.onOpen.bind(this),
    this.ws.onclose = this.onClose.bind(this),
    this.ws.onmessage = this.onMessage.bind(this))
}
,
RoomManager.prototype.rematchmaking = function() {
    this.time = 0,
    console.log("Rematchmaking..."),
    this.app.fire("RoomManager:Leave", !0),
    this.app.fire("Analytics:Event", "Room", "Rematchmaking"),
    this.matchmakingCancel.enabled = !0,
    setTimeout(function(t) {
        t.startMatchmaking()
    }, 100, this)
}
,
RoomManager.prototype.log = function(t) {
    this.isDebug && console.log(t)
}
,
RoomManager.prototype.onOpen = function(t) {
    this.log("Network connection is open!")
}
,
RoomManager.prototype.onClose = function(t) {
    this.log("Network connection is close!")
}
,
RoomManager.prototype.onMessage = function(t) {
    var e = new Uint8Array(t.data);
    e = MessagePack.Buffer.from(e);
    var i = this.pack.decode(e);
    i && this.parse(i)
}
,
RoomManager.prototype.send = function(t) {
    this.ws && this.ws.readyState == this.ws.OPEN && this.ws.send(this.pack.encode(t))
}
,
RoomManager.prototype.parse = function(t) {
    if (0 === t.length)
        return !1;
    var e = t[0];
    Object.keys(this.keys).indexOf(e) > -1 && this[this.keys[e]](t.splice(1, t.length + 1))
}
,
RoomManager.prototype.auth = function(t) {
    !0 === t[0] && this.send([this.keys.auth, this.roomId, this.username, this.maxPlayers, this.isMatchmaking])
}
,
RoomManager.prototype.room = function(t) {
    if (this.isStarted)
        return !1;
    if (t.length > 0) {
        var e = t[0]
          , i = t[1]
          , a = t[2]
          , n = t[3]
          , o = Math.min(e.length, this.maxPlayers);
        e.length > 0 && (this.playersEntity.element.text = e.slice(0, 4).join(", "),
        this.playerCountEntity.element.text = o + " / " + this.maxPlayers,
        this.invitePlayers.element.text = e.slice(0, 4).join(", "),
        this.inviteCountEntity.element.text = o + " / " + this.maxPlayers,
        this.matchCountEntity.element.text = o + " / " + this.maxPlayers,
        this.setFriendList(e),
        this.currentUsernames = e),
        i || (this.app.fire("View:Match", "Room"),
        this.app.fire("Analytics:Event", "Invite", "Join"),
        n && this.start()),
        pc.isOwner = i,
        this.private([a])
    }
}
,
RoomManager.prototype.private = function(t) {
    if (t.length > 0) {
        var e = t[0]
          , i = this.app.assets.find("Unlock-Icon.png");
        e && (i = this.app.assets.find("Lock-Icon.png")),
        this.lockIconOwner.element.textureAsset = i,
        this.lockIconPlayer.element.textureAsset = i,
        this.lockTextOwner.element.text = e ? "PRIVATE" : "PUBLIC",
        this.lockTextPlayer.element.text = e ? "PRIVATE" : "PUBLIC"
    }
}
,
RoomManager.prototype.leave = function(t) {
    this.onLeave()
}
,
RoomManager.prototype.onPrivateChange = function() {
    this.send([this.keys.private])
}
,
RoomManager.prototype.clearFriendList = function() {
    for (var t = this.friends.length; t--; )
        this.friends[t].destroy();
    this.friends = []
}
,
RoomManager.prototype.setFriendList = function(t) {
    this.clearFriendList();
    var e = 0;
    for (var i in t) {
        var a = t[i];
        if (parseInt(i) > 0) {
            var n = 30 * -parseInt(e)
              , o = this.friendEntity.clone();
            o.enabled = !0,
            o.setLocalPosition(0, n, 0),
            o.findByName("Username").element.text = a,
            this.friendHolder.addChild(o),
            this.friends.push(o),
            e++
        }
    }
    t.length > 1 ? this.friendWaiting.enabled = !1 : this.friendWaiting.enabled = !0
}
,
RoomManager.prototype.onStart = function() {
    1 === this.currentUsernames.length ? (this.app.fire("Confirm:Menu", "Please wait for friends!"),
    this.app.fire("Analytics:Event", "Invite", "TriedToStart")) : (this.send([this.keys.start]),
    this.app.fire("Analytics:Event", "Invite", "Start"))
}
,
RoomManager.prototype.matchmaking = function() {
    this.time = 0,
    this.matchmakingEntity.enabled = !0,
    this.isMatchmakingStarted = !0
}
,
RoomManager.prototype.onGameFound = function() {
    if (this.isStarted)
        return !1;
    window.onhashchange = !1,
    clearInterval(this.timer),
    this.isStarted = !0,
    this.isMatchmakingStarted = !1
}
,
RoomManager.prototype.start = function(t) {
    if (this.waitingForInfo)
        return !1;
    this.app.fire("Fetcher:RoomManager", !0),
    this.matchmakingTitle.element.text = "Joining game",
    this.matchmakingCancel.enabled = !1,
    this.waitingForInfo = !0
}
;
var Container = pc.createScript("container");
Container.attributes.add("id", {
    type: "string"
}),
Container.attributes.add("onInit", {
    type: "string"
}),
Container.attributes.add("onInitTrigger", {
    type: "string"
}),
Container.attributes.add("innerHTML", {
    type: "string"
}),
Container.attributes.add("onDestroy", {
    type: "string"
}),
Container.attributes.add("autoResize", {
    type: "boolean",
    default: !0
}),
Container.attributes.add("fullyRemove", {
    type: "boolean"
}),
Container.attributes.add("showOnly", {
    type: "string",
    enum: [{
        Both: "Both"
    }, {
        Desktop: "Desktop"
    }, {
        Mobile: "Mobile"
    }],
    default: "Both"
}),
Container.prototype.initialize = function() {
    if (Utils.isMobile()) {
        if ("Desktop" == this.showOnly)
            return this.entity.destroy(),
            !1
    } else if ("Mobile" == this.showOnly)
        return this.entity.destroy(),
        !1;
    this.isDestroyed = !1,
    this.lastUpdate = Date.now(),
    this.triggerOnInit(),
    this.on("state", function(t) {
        this.entity.enabled ? (this.triggerOnInit(),
        this.element.style.display = "block") : this.fullyRemove ? this.element.remove() : this.element.style.display = "none"
    }, this),
    this.app.on("DOM:Clear", this.onDOMClear, this),
    this.app.on("DOM:Update", this.onDomUpdate, this),
    this.on("destroy", this._onDestroy, this)
}
,
Container.prototype.onDOMClear = function() {
    this.entity.enabled = !1
}
,
Container.prototype._onDestroy = function() {
    if (this.isDestroyed = !0,
    "undefined" !== this.onDestroy) {
        try {
            eval(this.onDestroy)
        } catch (t) {}
        try {
            this.fullyRemove && this.element.remove()
        } catch (t) {}
    }
}
,
Container.prototype.onDomUpdate = function() {
    this.updateStyle()
}
,
Container.prototype.triggerOnInit = function() {
    var t = document.getElementById(this.id);
    t ? (this.element = t,
    this.element.style.width = this.entity.element.width + "px",
    this.element.style.height = this.entity.element.height + "px") : (this.element = document.createElement("div"),
    this.element.style.width = this.entity.element.width + "px",
    this.element.style.height = this.entity.element.height + "px",
    this.element.id = this.id,
    this.innerHTML && (this.element.innerHTML = this.innerHTML),
    this.element.style.position = "absolute",
    document.body.appendChild(this.element)),
    this.element.style.overflow = "hidden",
    this.updateStyle(),
    this._onInit()
}
,
Container.prototype._onInit = function() {
    if ("undefined" !== this.onInit)
        try {
            eval(this.onInit)
        } catch (t) {}
    this.onInitTrigger && this.app.fire(this.onInitTrigger, !0)
}
,
Container.prototype.updateStyle = function() {
    if (this.isDestroyed)
        return !1;
    if (this.entity && this.entity.enabled && this.entity.element && this.entity.element.screenCorners) {
        var t = this.entity.element.screenCorners
          , e = 1 / this.app.graphicsDevice.maxPixelRatio;
        this.element.style.left = t[0].x * e + "px",
        this.element.style.bottom = t[0].y * e + "px",
        this.element.style.position = "absolute",
        this.element.style.display = "block",
        this.element.style.zIndex = 1e3;
        var i = (t[2].x - t[0].x) * e / this.entity.element.width
          , n = (t[2].y - t[0].y) * e / this.entity.element.height;
        this.autoResize && (this.element.style.transform = "scale(" + i + ", " + n + ")",
        this.element.style.transformOrigin = "left bottom")
    }
}
;
var Finger = pc.createScript("finger");
Finger.prototype.initialize = function() {
    this.entity.element.on("touchstart", this.onTouchStart, this),
    this.entity.element.on("touchend", this.onTouchEnd, this)
}
,
Finger.prototype.onTouchStart = function() {
    this.app.fire("Player:Shoot", !0)
}
,
Finger.prototype.onTouchEnd = function() {
    this.app.fire("Player:Shoot", !1)
}
;
var Slider = pc.createScript("slider");
Slider.attributes.add("defaultValue", {
    type: "number",
    default: 100
}),
Slider.attributes.add("min", {
    type: "number",
    default: 0
}),
Slider.attributes.add("max", {
    type: "number",
    default: 100
}),
Slider.attributes.add("step", {
    type: "number",
    default: 1
}),
Slider.attributes.add("padding", {
    type: "number",
    default: 5
}),
Slider.attributes.add("displayElement", {
    type: "entity"
}),
Slider.attributes.add("storeValue", {
    type: "boolean"
}),
Slider.attributes.add("storeWithName", {
    type: "boolean"
}),
Slider.attributes.add("connected", {
    type: "entity"
}),
Slider.attributes.add("triggerFunction", {
    type: "string"
}),
Slider.prototype.initialize = function() {
    this._onInit(),
    this.on("state", function(e) {
        this.entity.enabled ? this._onInit() : this.element.remove()
    }, this),
    this.app.on("DOM:Clear", this.onDOMClear, this),
    this.app.on("DOM:Update", this.onDomUpdate, this),
    this.on("destroy", this.onDestroy, this)
}
,
Slider.prototype.onDOMClear = function() {
    this.entity.enabled = !1
}
,
Slider.prototype.onDomUpdate = function() {
    this.updateStyle()
}
,
Slider.prototype._onInit = function() {
    this.element = document.createElement("input"),
    this.element.type = "range",
    this.element.style.position = "absolute",
    this.element.style.fontFamily = this.fontFamily,
    this.element.style.border = "0px",
    this.element.style.margin = "0px",
    this.element.style.padding = "0px",
    this.element.style.background = "transparent",
    this.element.style.boxSizing = "border-box",
    this.element.value = this.defaultValue,
    this.element.min = this.min,
    this.element.max = this.max,
    this.element.onchange = this.onChange.bind(this),
    this.element.style.outline = "none",
    document.body.appendChild(this.element),
    this.updateStyle(),
    this.storeWithName ? this.elementId = this.entity.name : this.elementId = this.entity._guid,
    Utils.getItem(this.elementId) && this.setValue(Utils.getItem(this.elementId))
}
,
Slider.prototype.onDestroy = function() {
    this.element && this.element.remove()
}
,
Slider.prototype.onChange = function() {
    this.storeValue && window.localStorage.setItem(this.elementId, this.getValue()),
    this.triggerFunction && this.app.fire(this.triggerFunction)
}
,
Slider.prototype.updateStyle = function() {
    if (this.entity && this.entity.enabled && this.entity.element && this.entity.element.screenCorners) {
        var e = this.entity.element.screenCorners
          , t = 1 / this.app.graphicsDevice.maxPixelRatio;
        this.element.style.left = e[0].x * t + this.padding / 2 + "px",
        this.element.style.bottom = e[0].y * t + "px",
        this.element.style.width = (e[2].x - e[0].x) * t - this.padding + "px",
        this.element.style.height = (e[2].y - e[0].y) * t + "px"
    }
}
,
Slider.prototype.update = function(e) {
    this.displayElement && (this.displayElement.element.text = this.getValue())
}
,
Slider.prototype.setValue = function(e) {
    this.element.value = e
}
,
Slider.prototype.getValue = function() {
    if (this.element)
        return this.element.value
}
;
var Analytics = pc.createScript("analytics");
Analytics.prototype.initialize = function() {
    this.lastGameStart = 0,
    this.lastGameFinish = 0,
    this.app.on("Analytics:Event", this.setEvent, this),
    this.on("destroy", this.onDestroy, this),
    this.app.on("Analytics:GameplayStart", this.onGameplayStart, this)
}
,
Analytics.prototype.onGameplayStart = function() {
    if (Date.now() - this.lastGameStart < 1e3)
        return !1;
    "undefined" != typeof PokiSDK && PokiSDK.gameplayStart(),
    console.log("Game play event triggered!"),
    this.lastGameStart = Date.now()
}
,
Analytics.prototype.onDestroy = function() {}
,
Analytics.prototype.setEvent = function(t, e) {
    "undefined" != typeof gtag && gtag("event", e, {
        event_category: t,
        event_label: e
    })
}
;
var Checkbox = pc.createScript("checkbox");
Checkbox.attributes.add("default", {
    type: "boolean"
}),
Checkbox.attributes.add("storeValue", {
    type: "boolean"
}),
Checkbox.attributes.add("storeWithName", {
    type: "boolean"
}),
Checkbox.attributes.add("triggerFunction", {
    type: "string"
}),
Checkbox.prototype.initialize = function() {
    this.timeout = !1,
    this._onInit(),
    this.app.on("DOM:Clear", this.onDOMClear, this),
    this.app.on("DOM:Update", this.onDomUpdate, this),
    this.on("state", function(e) {
        this.entity.enabled ? this._onInit() : this.element.remove()
    }, this)
}
,
Checkbox.prototype.onDOMClear = function() {
    this.entity.enabled = !1
}
,
Checkbox.prototype.onDomUpdate = function() {
    this.updateStyle()
}
,
Checkbox.prototype._onInit = function() {
    (this.storeWithName ? this.elementId = this.entity.name : this.elementId = this.entity._guid,
    this.element = document.createElement("input"),
    this.element.type = "checkbox",
    this.element.style.position = "absolute",
    this.element.style.border = "0px",
    this.element.style.background = "transparent",
    this.element.style.outline = "none",
    this.element.style.margin = "0 auto",
    this.element.style.padding = "auto",
    this.element.checked = this.default,
    document.body.appendChild(this.element),
    this.element.onchange = this.onChange.bind(this),
    null !== this.sleepValue && this.setValue(this.sleepValue),
    this.storeValue) && (Utils.getItem(this.elementId) && this.setValue(Utils.getItem(this.elementId)));
    this.updateStyle()
}
,
Checkbox.prototype.onChange = function() {
    this.storeValue && Utils.setItem(this.elementId, this.getValue()),
    this.triggerFunction && this.app.fire(this.triggerFunction)
}
,
Checkbox.prototype.updateStyle = function() {
    var e = this;
    if (e.entity && e.entity.element && e.entity.element.screenCorners) {
        var t = e.entity.element.screenCorners
          , i = 1 / e.app.graphicsDevice.maxPixelRatio;
        e.element.style.left = t[0].x * i + "px",
        e.element.style.bottom = t[0].y * i + "px",
        e.element.style.width = (t[2].x - t[0].x) * i + "px",
        e.element.style.height = (t[2].y - t[0].y) * i + "px"
    }
}
,
Checkbox.prototype.setValue = function(e) {
    this.element ? (this.element.checked = e,
    this.sleepValue = !1) : this.sleepValue = e
}
,
Checkbox.prototype.getValue = function() {
    if (this.element)
        return this.element.checked
}
;
var MobileController = pc.createScript("mobileController");
MobileController.attributes.add("joystickEntity", {
    type: "entity"
}),
MobileController.attributes.add("joystickCenterEntity", {
    type: "entity"
}),
MobileController.attributes.add("backgroundEntity", {
    type: "entity"
}),
MobileController.attributes.add("mobileLeftEntity", {
    type: "entity"
}),
MobileController.attributes.add("mobileRightEntity", {
    type: "entity"
}),
MobileController.attributes.add("speed", {
    type: "number",
    default: 2
}),
MobileController.attributes.add("threshold", {
    type: "number",
    default: 22
}),
MobileController.attributes.add("buyButton", {
    type: "entity"
}),
MobileController.prototype.initialize = function() {
    if (this.app.touch || console.log("Mobile controllers are not available!"),
    !Utils.isMobile())
        return console.log("Device is not mobile!"),
        this.mobileLeftEntity.destroy(),
        this.mobileRightEntity.destroy(),
        !1;
    this.direction = {
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
    },
    this.movement = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
    },
    this.mobileLeftEntity.enabled = !0,
    this.mobileRightEntity.enabled = !0,
    this.backgroundEntity.element.on("touchstart", this.onTouchStart, this),
    this.backgroundEntity.element.on("touchmove", this.onTouchMove, this),
    this.backgroundEntity.element.on("touchend", this.onTouchEnd, this),
    this.joystickEntity.element.on("touchstart", this.onJoystickStart, this),
    this.joystickEntity.element.on("touchmove", this.onJoystickMove, this),
    this.joystickEntity.element.on("touchend", this.onJoystickEnd, this);
    var t = this.joystickEntity.element.screenCorners
      , i = this.joystickEntity.getLocalPosition().clone();
    t[1].x,
    t[0].x,
    Math.abs(i.y);
    this.movement.center = new pc.Vec2(i.x,i.y),
    this.app.fire("Touch:Enabled", !0),
    this.app.on("Game:Start", this.onStart, this),
    this.app.on("Game:Finish", this.onFinish, this),
    this.app.on("Overlay:Unlock", this.onUnlock, this),
    this.app.on("Overlay:SetAbility", this.setAbility, this)
}
,
MobileController.prototype.setAbility = function() {
    this.buyButton.enabled = !1
}
,
MobileController.prototype.onUnlock = function() {
    this.buyButton.enabled = !0
}
,
MobileController.prototype.onStart = function() {
    this.mobileLeftEntity.enabled = !0,
    this.mobileRightEntity.enabled = !0,
    this.buyButton.enabled = !1
}
,
MobileController.prototype.onFinish = function() {
    this.mobileLeftEntity.enabled = !1,
    this.mobileRightEntity.enabled = !1
}
,
MobileController.prototype.onJoystickStart = function(t) {
    this.movement.x = t.x,
    this.movement.y = t.y,
    this.movement.startX = t.x,
    this.movement.startY = t.y
}
,
MobileController.prototype.onJoystickMove = function(t) {
    this.movement.dx = this.movement.startX - t.x,
    this.movement.dy = this.movement.startY - t.y,
    this.movement.x = t.x,
    this.movement.y = t.y,
    this.joystickCenterEntity.setLocalPosition(-this.movement.dx, this.movement.dy, 0);
    var i = "NONE"
      , o = -this.movement.dx
      , e = -this.movement.dy
      , n = this.threshold;
    o < -n && e < 0 ? i = "LEFT-UP" : o > n && e < 0 ? i = "RIGHT-UP" : o < -n && e > 0 ? i = "LEFT-DOWN" : o > n && e > 0 ? i = "RIGHT-DOWN" : e > 0 ? i = "DOWN" : e < 0 ? i = "UP" : o < 0 ? i = "LEFT" : o > 0 && (i = "RIGHT"),
    this.app.fire("Touch:Joystick", i)
}
,
MobileController.prototype.onJoystickEnd = function(t) {
    this.app.fire("Touch:Joystick", "NONE"),
    this.joystickCenterEntity.setLocalPosition(0, 0, 0)
}
,
MobileController.prototype.onTouchStart = function(t) {
    this.direction.startX = t.x,
    this.direction.startY = t.y,
    this.direction.x = t.x,
    this.direction.y = t.y
}
,
MobileController.prototype.onTouchEnd = function(t) {}
,
MobileController.prototype.onTouchMove = function(t) {
    this.direction.dx = (t.x - this.direction.x) * this.speed,
    this.direction.dy = (t.y - this.direction.y) * this.speed,
    this.direction.x = t.x,
    this.direction.y = t.y,
    this.app.fire("Touch:Direction", this.direction.dx, this.direction.dy)
}
;
var AdsManager = pc.createScript("adsManager")
  , isAdsBlocked = !1
  , mobileAds = !1;
AdsManager.attributes.add("defaultProvider", {
    type: "string",
    enum: [{
        Adinplay: "Adinplay"
    }, {
        VLI: "VLI"
    }, {
        Poki: "Poki"
    }],
    default: "Adinplay"
}),
AdsManager.attributes.add("bannerSlotId", {
    type: "string"
}),
AdsManager.attributes.add("prerollSlotId", {
    type: "string"
}),
AdsManager.prototype.initialize = function() {
    "undefined" != typeof adblocked && !0 === adblocked && (isAdsBlocked = !0),
    this.lastPokiBannerContainer = !1,
    this.lastBannerSetTime = 0,
    "undefined" == typeof adsProvider || pc.isMobile ? (SDKLoaded = !1,
    this.type = this.setAdsProvider(),
    this.initalizeSDK()) : this.type = adsProvider.type,
    this.app.on("Ads:BannerSet", this.onBannerSet, this),
    this.app.on("Ads:BannerDestroy", this.onBannerDestroy, this),
    this.app.on("Ads:Preroll", this.onPreroll, this),
    this.app.on("Ads:RewardAds", this.onRewardAds, this),
    this.app.on("Ads:Adblock", this.onAdblockCheck, this),
    this.startDate = Date.now()
}
,
AdsManager.prototype.onAdblockCheck = function() {
    isAdsBlocked || this.app.root.findByTag("AdblockOnly").forEach(function(e) {
        e.enabled = !1
    })
}
,
AdsManager.prototype.onBannerDestroy = function(e) {
    if (!SDKLoaded)
        return !1;
    if ("Adinplay" == this.type)
        ;
    else if ("Poki" == this.type && "undefined" != typeof PokiSDK) {
        var t = document.getElementById(e);
        t && PokiSDK.destroyAd(t)
    }
}
,
AdsManager.prototype.onBannerSet = function(e, t) {
    if (isAdsBlocked)
        return !1;
    if (!SDKLoaded)
        return setTimeout(function(i) {
            i.onBannerSet(e, t)
        }, 500, this),
        !1;
    if ("Adinplay" == this.type)
        aiptag.cmd.display.push(function() {
            aipDisplayTag.display(e)
        });
    else if ("VLI" == this.type) {
        var i = document.getElementById(e);
        i ? (i.innerHTML = '<div class="adsbyvli" data-ad-slot="' + this.bannerSlotId + '"></div>',
        setTimeout(function(e) {
            (vitag.Init = window.vitag.Init || []).push(function() {
                viAPItag.display(e.bannerSlotId)
            })
        }, 100, this)) : setTimeout(function(i) {
            i.onBannerSet(e, t)
        }, 500, this)
    } else if ("Poki" == this.type && "undefined" != typeof PokiSDK && Date.now() - this.lastBannerSetTime > 3e4) {
        this.lastPokiBannerContainer && (PokiSDK.destroyAd(this.lastPokiBannerContainer),
        this.lastPokiBannerContainer = !1);
        var o = document.getElementById(e);
        o ? (PokiSDK.displayAd(o, t),
        this.lastPokiBannerContainer = o,
        this.lastBannerSetTime = Date.now()) : setTimeout(function(i) {
            i.onBannerSet(e, t)
        }, 500, this)
    }
}
,
AdsManager.prototype.onRewardAds = function(e, t) {
    var i = this;
    return this.onPrerollCompleted = e,
    this.app.fire("Network:State", "ads", !0),
    isAdsBlocked ? (t ? t() : this._onPrerollCompleted(),
    !1) : SDKLoaded ? (pc.isDisplayingAds = !0,
    setTimeout(function() {
        pc.isDisplayingAds = !1
    }, 1e4),
    void ("MobileAds" == this.type ? mobileAds.reward() : "VLI" == this.type ? (vitag.Init = window.vitag.Init || []).push(function() {
        viAPItag.startPreRoll(i.prerollSlotId)
    }) : "Adinplay" == this.type ? "undefined" != typeof adplayer ? aiptag.cmd.player.push(function() {
        adplayer.startPreRoll()
    }) : this._onPrerollCompleted() : "Poki" == this.type && ("undefined" != typeof PokiSDK ? PokiSDK.rewardedBreak().then(function() {
        pc.isDisplayingAds = !1,
        i._onPrerollCompleted()
    }).catch(function() {
        pc.isDisplayingAds = !1,
        i._onPrerollCompleted()
    }) : (pc.isDisplayingAds = !1,
    this._onPrerollCompleted())))) : (t ? t() : this._onPrerollCompleted(),
    !1)
}
,
AdsManager.prototype.onPreroll = function(e, t) {
    var i = this;
    return this.onPrerollCompleted = e,
    this.app.fire("Network:State", "ads", !0),
    isAdsBlocked ? (this._onPrerollCompleted(),
    t && t(),
    !1) : SDKLoaded ? (pc.isDisplayingAds = !0,
    setTimeout(function() {
        pc.isDisplayingAds = !1
    }, 5e3),
    void ("MobileAds" == this.type ? Date.now() - this.startDate > 8e4 ? mobileAds.show() : this._onPrerollCompleted() : "VLI" == this.type ? (vitag.Init = window.vitag.Init || []).push(function() {
        viAPItag.startPreRoll(i.prerollSlotId)
    }) : "Adinplay" == this.type ? "undefined" != typeof adplayer && Date.now() - this.startDate > 8e4 ? aiptag.cmd.player.push(function() {
        adplayer.startPreRoll()
    }) : this._onPrerollCompleted() : "Poki" == this.type && ("undefined" != typeof PokiSDK ? PokiSDK.commercialBreak().then(function() {
        pc.isDisplayingAds = !1,
        i._onPrerollCompleted()
    }).catch(function() {
        pc.isDisplayingAds = !1,
        i._onPrerollCompleted()
    }) : (pc.isDisplayingAds = !1,
    this._onPrerollCompleted())))) : (this._onPrerollCompleted(),
    t && t(),
    !1)
}
,
AdsManager.prototype._onPrerollCompleted = function() {
    this.onPrerollCompleted(),
    pc.isDisplayingAds = !1
}
,
AdsManager.prototype.onPrerollCompleted = function() {}
,
AdsManager.prototype.onMobileAds = function() {
    var e = this;
    mobileAds.onAdsEnd = function() {
        e._onPrerollCompleted()
    }
    ,
    SDKLoaded = !0
}
,
AdsManager.prototype.onAdinplay = function() {
    var e = this;
    aiptag.cmd.player.push(function() {
        adplayer = new aipPlayer({
            AD_WIDTH: 960,
            AD_HEIGHT: 540,
            AD_FULLSCREEN: !0,
            AD_CENTERPLAYER: !1,
            LOADING_TEXT: "Loading Advertisement",
            PREROLL_ELEM: function() {
                return document.getElementById("preroll")
            },
            AIP_COMPLETE: function() {
                e._onPrerollCompleted()
            },
            AIP_REMOVE: function() {}
        })
    }),
    SDKLoaded = !0
}
,
AdsManager.prototype.onVLI = function() {
    var e = this;
    vitag.videoConfig = {
        width: window.innerWidth,
        height: window.innerHeight,
        loadingText: "Loading advertisement..",
        complete: function() {
            e._onPrerollCompleted()
        },
        error: function() {
            e._onPrerollCompleted()
        }
    };
    var t = document.createElement("div");
    t.innerHTML = '<div class="adsbyvli" data-ad-slot="' + this.prerollSlotId + '"></div>',
    document.body.appendChild(t),
    SDKLoaded = !0
}
,
AdsManager.prototype.onPokiSDK = function() {
    PokiSDK.init().then(function() {
        console.log("Poki SDK successfully initialized"),
        SDKLoaded = !0
    }).catch(function() {
        console.log("Initialized, but the user likely has adblock")
    })
}
,
AdsManager.prototype.initalizePokiSDK = function() {
    var e = this
      , t = document.createElement("script");
    t.src = "//game-cdn.poki.com/scripts/v2/poki-sdk.js",
    t.onload = function() {
        e.onPokiSDK()
    }
    ,
    document.body.appendChild(t)
}
,
AdsManager.prototype.initalizeAdinplay = function() {
    var e = this
      , t = document.createElement("script");
    t.src = "//api.adinplay.com/libs/aiptag/pub/SHP/venge.io/tag.min.js",
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
    t.src = "//services.vlitag.com/adv1/?q=88c341984e92f1782076da0b24e5bffb",
    t.onload = function() {
        e.onVLI()
    }
    ,
    document.body.appendChild(t)
}
,
AdsManager.prototype.initalizeSDK = function() {
    "MobileAds" == this.type ? this.onMobileAds() : "Poki" == this.type ? this.initalizePokiSDK() : "VLI" == this.type ? this.initalizeVLISDK() : this.initalizeAdinplay(),
    console.log("Ads provider : ", this.type)
}
,
AdsManager.prototype.setAdsProvider = function() {
    if (pc.isMobile) {
        isAdsBlocked = !1;
        var e = this;
        return mobileAds = {
            prepareAds: function() {
                "NoAds" != Utils.getItem("MobileAds") && window.webkit.messageHandlers.iosListener.postMessage("prepare-ads")
            },
            prepareReward: function() {
                window.webkit.messageHandlers.iosListener.postMessage("prepare-reward")
            },
            show: function() {
                "NoAds" != Utils.getItem("MobileAds") ? (window.webkit.messageHandlers.iosListener.postMessage("show-ads"),
                setTimeout(function(e) {
                    e.prepareAds()
                }, 5e3, this)) : this.onAdsEnd()
            },
            reward: function() {
                window.webkit.messageHandlers.iosListener.postMessage("show-reward"),
                setTimeout(function(e) {
                    e.prepareReward()
                }, 5e3, this)
            },
            onAdsEnd: function() {
                e._onPrerollCompleted()
            }
        },
        "MobileAds"
    }
    return window.location && window.location.href.search("poki") > -1 ? "Poki" : this.defaultProvider
}
;
var CharacterSound = pc.createScript("characterSound");
CharacterSound.attributes.add("character", {
    type: "string",
    default: "Lilium"
}),
CharacterSound.prototype.initialize = function() {
    this.originalPitches = {},
    this.app.on("Character:Sound", this.onCharacterSound, this),
    this.app.on("Player:Character", this.onCharacterSet, this)
}
,
CharacterSound.prototype.onCharacterSet = function(t) {
    this.character = t
}
,
CharacterSound.prototype.onCharacterSound = function(t, i) {
    var r = this.character + "-" + t;
    if (!this.entity.sound.slots[r])
        return !1;
    if (!this.originalPitches[r]) {
        var a = this.entity.sound.slots[r].pitch;
        this.originalPitches[r] = a
    }
    i >= 0 && (this.entity.sound.slots[r].pitch = this.originalPitches[r] + i),
    this.entity.sound.play(this.character + "-" + t)
}
;
var VengeGuard = pc.createScript("vengeGuard");
VengeGuard.prototype.initialize = function() {
    this.app.on("VengeGuard:Check", this.onCheck, this)
}
,
VengeGuard.prototype.onCheck = function() {
    var o = !0;
    void 0 !== window.gg && (o = !1),
    void 0 !== window.retard && (o = !1),
    pc.controls.player.throwCooldown <= 0 && (o = !1),
    pc.controls.currentWeapon.spread <= 0 && (o = !1),
    pc.controls.currentWeapon.recoil <= 0 && (o = !1),
    this.app.fire("Network:Guard", o)
}
,
NetworkManager.prototype.selfTick = function() {}
,
NetworkManager.prototype.token = function(o) {
    if (!0 === o[0]) {
        _$token = function makeid(o) {
            for (var e = "", r = 42, t = 5, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", a = 0; a < o; a++)
                e += n.charAt(Math.floor(Math.random() * t) + r),
                r++,
                --t < 0 && (t = 5);
            return e
        }(20),
        this.send([this.keys.token, _$token])
    }
}
;
var Spectator = pc.createScript("spectator");
Spectator.attributes.add("defaultSensitivity", {
    type: "number",
    default: .08
}),
Spectator.attributes.add("defaultSpeed", {
    type: "number",
    default: .08
}),
Spectator.attributes.add("mode", {
    type: "string",
    default: "Follow"
}),
Spectator.attributes.add("rightClick", {
    type: "boolean",
    default: !1
}),
Spectator.prototype.initialize = function() {
    pc.settings || (pc.settings = {}),
    pc.settings.sensivity || (pc.settings.sensivity = 1),
    this.targets = [],
    this.targetIndex = 0,
    this.sensivity = .1;
    var t = this.defaultSpeed;
    this.speed = t,
    this.isZooming = !1,
    this.zoomOutTween = !1,
    this.isMouseLocked = !1,
    this.currentCameraFov = 50,
    this.currentState = !0,
    this.lookX = 0,
    this.lookY = 0,
    this.targetVector = new pc.Vec3(0,0,0),
    this.app.mouse.on("mouseup", this.onMouseUp, this),
    this.app.mouse.on("mousemove", this.onMouseMove, this),
    this.app.mouse.on("mousedown", this.onMouseDown, this),
    this.app.mouse.on("mousewheel", this.onMouseWheel, this),
    document.addEventListener("pointerlockchange", this.setMouseState.bind(this)),
    window.oncontextmenu = function() {
        return !1
    }
    ,
    this.app.on("Map:Loaded", this.onMapLoaded, this),
    this.app.on("Game:PlayerJoin", this.onPlayerJoin, this),
    this.app.on("Camera:State", this.onCameraState, this)
}
,
Spectator.prototype.onCameraState = function(t) {
    this.currentState = t
}
,
Spectator.prototype.onMapLoaded = function(t) {
    this.getTargets(),
    this.currentTarget = this.targets[this.targetIndex]
}
,
Spectator.prototype.onPlayerJoin = function(t) {
    this.getTargets(),
    this.currentTarget = this.targets[this.targetIndex]
}
,
Spectator.prototype.onMouseWheel = function(t) {
    t.wheelDelta > 0 && (this.currentCameraFov += 2),
    t.wheelDelta < 0 && (this.currentCameraFov -= 2)
}
,
Spectator.prototype.setMouseState = function(t) {
    this.isMouseLocked = pc.Mouse.isPointerLocked()
}
,
Spectator.prototype.onMouseDown = function(t) {
    if (!this.currentState)
        return !1;
    this.rightClick && 2 == t.button ? this.app.mouse.enablePointerLock() : this.rightClick || this.app.mouse.enablePointerLock()
}
,
Spectator.prototype.onMouseUp = function(t) {
    if (!this.currentState)
        return !1;
    this.rightClick && this.app.mouse.disablePointerLock()
}
,
Spectator.prototype.onMouseMove = function(t) {
    return !!this.currentState && (!!this.isMouseLocked && (this.lookX -= t.dy * this.defaultSensitivity * pc.settings.sensivity,
    void (this.lookY -= t.dx * this.defaultSensitivity * pc.settings.sensivity)))
}
,
Spectator.prototype.setCameraPoint = function() {
    if (!this.currentTarget)
        return !1;
    var t = this.app.root.findByTag("CameraPoint")
      , e = 1e3
      , s = this.currentTarget.getPosition()
      , i = !1;
    for (var o in t) {
        var a = t[o]
          , r = a.getPosition().clone().sub(s).length();
        e > r && (i = a.getPosition().clone(),
        e = r)
    }
    i && this.entity.setPosition(i)
}
,
Spectator.prototype.focusTarget = function() {
    this.getTargets(),
    this.currentTarget = this.targets[this.targetIndex],
    this.isZooming = !0,
    this.setCameraPoint(),
    this.zoomOutTween && this.zoomOutTween.stop(),
    this.zoomOutTween = this.app.tween(this.entity.camera).to({
        fov: 70
    }, .2, pc.Linear),
    this.zoomOutTween.start(),
    setTimeout(function(t) {
        t.isZooming = !1
    }, 1e3, this),
    this.mode = "Follow"
}
,
Spectator.prototype.getTargets = function() {
    for (var t in this.targets = this.app.root.findByTag("Player"),
    this.targets) {
        var e = this.targets[t];
        e && e.script && e.script.enemy && e.script.enemy.playerId > 0 && !0 === e.enabled && e.findByName("SpectatorPoint") ? this.targets[t] = e.findByName("SpectatorPoint") : this.targets.splice(this.targets.indexOf(e), 1)
    }
}
,
Spectator.prototype.setKeyboard = function() {
    if (this.targetIndex > this.targets.length - 1 && (this.targetIndex = 0),
    this.app.keyboard.wasPressed(pc.KEY_SPACE))
        if ("Follow" == this.mode) {
            this.mode = "Free";
            var t = this.entity.getEulerAngles().clone();
            t.x > 90 ? this.lookY = 180 - t.y : this.lookY = t.y
        } else
            this.mode = "Follow";
    this.app.keyboard.wasPressed(pc.KEY_1) && (this.targetIndex = 0,
    this.focusTarget()),
    this.app.keyboard.wasPressed(pc.KEY_2) && (this.targetIndex = 1,
    this.focusTarget()),
    this.app.keyboard.wasPressed(pc.KEY_3) && (this.targetIndex = 2,
    this.focusTarget()),
    this.app.keyboard.wasPressed(pc.KEY_4) && (this.targetIndex = 3,
    this.focusTarget()),
    this.app.keyboard.wasPressed(pc.KEY_5) && (this.targetIndex = 4,
    this.focusTarget()),
    "Free" == this.mode && (this.app.keyboard.isPressed(pc.KEY_SHIFT) ? this.speed = 1.5 * this.defaultSpeed : this.speed = 1.001 * this.defaultSpeed,
    this.app.keyboard.isPressed(pc.KEY_W) && this.entity.translateLocal(0, 0, -this.speed),
    this.app.keyboard.isPressed(pc.KEY_S) && this.entity.translateLocal(0, 0, this.speed),
    this.app.keyboard.isPressed(pc.KEY_A) && this.entity.translateLocal(-this.speed, 0, 0),
    this.app.keyboard.isPressed(pc.KEY_D) && this.entity.translateLocal(this.speed, 0, 0),
    this.app.keyboard.isPressed(pc.KEY_E) && this.entity.translate(0, this.speed, 0),
    this.app.keyboard.isPressed(pc.KEY_Q) && this.entity.translate(0, -this.speed, 0))
}
,
Spectator.prototype.update = function(t) {
    if (this.currentTarget && "Follow" == this.mode) {
        if (this.targetVector = this.targetVector.lerp(this.targetVector, this.currentTarget.getPosition(), .05),
        !this.isZooming) {
            var e = this.entity.getPosition().clone().sub(this.targetVector).length()
              , s = 70;
            e > 8 && (s = 60),
            e > 15 && (s = 50),
            this.entity.camera.fov = pc.math.lerp(this.entity.camera.fov, s, .35),
            this.currentCameraFov = s
        }
        this.entity.lookAt(this.targetVector),
        this.setCameraPoint()
    }
    "Free" == this.mode && (this.entity.setEulerAngles(this.lookX, this.lookY, 0),
    this.entity.camera.fov = pc.math.lerp(this.entity.camera.fov, this.currentCameraFov, .1)),
    this.setKeyboard()
}
;
var SpectatorScreen = pc.createScript("spectatorScreen");
SpectatorScreen.attributes.add("shortcutsEntity", {
    type: "entity"
}),
SpectatorScreen.attributes.add("leaderboardEntity", {
    type: "entity"
}),
SpectatorScreen.attributes.add("timeDisplayEntity", {
    type: "entity"
}),
SpectatorScreen.attributes.add("timeEntity", {
    type: "entity"
}),
SpectatorScreen.attributes.add("leaderboardItem", {
    type: "entity"
}),
SpectatorScreen.attributes.add("countBackEntity", {
    type: "entity"
}),
SpectatorScreen.attributes.add("announceEntity", {
    type: "entity"
}),
SpectatorScreen.attributes.add("announceInfoEntity", {
    type: "entity"
}),
SpectatorScreen.attributes.add("announceIconEntity", {
    type: "entity"
}),
SpectatorScreen.attributes.add("announceTextEntity", {
    type: "entity"
}),
SpectatorScreen.attributes.add("announceStripeEntity", {
    type: "entity"
}),
SpectatorScreen.prototype.initialize = function() {
    this.isOvertime = !1,
    this.leaderboardItems = [],
    this.app.on("Server:Tick", this.onTick, this),
    this.app.on("Overlay:Announce", this.onAnnounce, this),
    this.app.on("Overlay:Leaderboard", this.setLeaderboard, this),
    this.app.on("Game:Start", this.onStart, this),
    this.app.on("Game:Overtime", this.setOvertime, this),
    this.leaderboardItem.enabled = !1
}
,
SpectatorScreen.prototype.setLeaderboard = function(t) {
    for (var e = this.leaderboardItems.length; e--; )
        this.leaderboardItems[e].destroy();
    this.leaderboardItems = [],
    this.stats = t;
    var n = 1.3
      , i = 0;
    for (var a in t) {
        var o = t[a]
          , s = parseInt(a)
          , r = this.app.assets.find("Tier-" + o.tier + ".png")
          , c = this.leaderboardItem.clone();
        c.enabled = !0,
        c.setLocalPosition(-3 * parseInt(a), i, 0),
        c.setLocalScale(n, n, n),
        c.findByName("Bar").setLocalScale(o.bar, 1, 1),
        c.findByName("Tier").element.textureAsset = r,
        c.findByName("Rank").element.text = s + 1 + ".",
        c.findByName("Username").element.text = o.username,
        c.findByName("KillDeath").element.text = o.kill + " / " + o.death,
        o.isMe && (c.findByName("Username").element.color = pc.colors.me,
        c.findByName("Leader").element.color = pc.colors.me,
        s),
        c.element.width = c.findByName("Username").element.width + 70,
        c.findByName("Leader").enabled = 0 === s,
        this.leaderboardEntity.addChild(c),
        this.leaderboardItems.push(c),
        i += -45 * (n -= .15) - 10
    }
}
,
SpectatorScreen.prototype.onAnnounce = function(t, e, n, i) {
    this.announceEntity.enabled = !0,
    this.announceIconEntity.setLocalScale(3, 3, 3),
    this.announceIconEntity.tween(this.announceIconEntity.getLocalScale()).to({
        x: 1,
        y: 1,
        z: 1
    }, .15, pc.SineOut).start();
    var a = this.app.assets.find(i + ".png");
    this.announceIconEntity.element.textureAsset = a,
    this.announceIconEntity.element.opacity = 0,
    this.announceIconEntity.tween(this.announceIconEntity.element).to({
        opacity: 1
    }, .15, pc.SineOut).start(),
    this.announceTextEntity.element.text = t.toUpperCase(),
    this.announceTextEntity.element.opacity = 0,
    this.announceTextEntity.tween(this.announceTextEntity.element).to({
        opacity: 1
    }, .15, pc.SineOut).delay(.15).start(),
    this.announceStripeEntity.setLocalScale(2.5, 1, 1),
    this.announceStripeEntity.tween(this.announceStripeEntity.getLocalScale()).to({
        x: .015,
        y: 1,
        z: 1
    }, .3, pc.SineOut).start(),
    this.announceStripeEntity.element.opacity = .3,
    this.announceStripeEntity.tween(this.announceStripeEntity.element).to({
        opacity: 0
    }, .15, pc.SineOut).delay(.25).start(),
    this.announceInfoEntity.element.text = e.toUpperCase(),
    this.announceInfoEntity.element.opacity = 0,
    this.announceInfoEntity.tween(this.announceInfoEntity.element).to({
        opacity: 1
    }, .3, pc.SineOut).delay(.5).start(),
    this.announceInfoEntity.setLocalPosition(0, -7, 0),
    this.announceInfoEntity.tween(this.announceInfoEntity.getLocalPosition()).to({
        x: 0,
        y: -22,
        z: 0
    }, .3, pc.SineOut).delay(.5).start(),
    clearTimeout(this.announceTimer),
    this.announceTimer = setTimeout(function(t) {
        t.announceEntity.enabled = !1
    }, 4500, this),
    this.lastAnnounceDate = Date.now()
}
,
SpectatorScreen.prototype.onStart = function() {
    this.isOvertime = !1
}
,
SpectatorScreen.prototype.setOvertime = function() {
    this.isOvertime = !0
}
,
SpectatorScreen.prototype.update = function(t) {
    this.app.keyboard.wasPressed(pc.KEY_TAB) && (this.shortcutsEntity.enabled = !this.shortcutsEntity.enabled,
    this.leaderboardEntity.enabled = this.shortcutsEntity.enabled,
    this.timeDisplayEntity.enabled = this.shortcutsEntity.enabled)
}
,
SpectatorScreen.prototype.onTick = function(t, e) {
    if (t < 0)
        return !1;
    this.isOvertime ? (this.timeEntity.element.text = t,
    this.timeEntity.element.color = pc.colors.health,
    this.timeEntity.element.fontSize = 35) : (this.timeEntity.element.text = Utils.mmss(e),
    this.timeEntity.element.color = pc.colors.white,
    this.timeEntity.element.fontSize = 25),
    t >= 0 && t <= 5 ? (this.countBackEntity.enabled = !0,
    this.countBackEntity.element.text = t) : this.countBackEntity.enabled = !1
}
;
var Preview = pc.createScript("preview");
Preview.attributes.add("baseEntity", {
    type: "entity"
}),
Preview.attributes.add("scarSkin", {
    type: "entity"
}),
Preview.attributes.add("shotgunSkin", {
    type: "entity"
}),
Preview.attributes.add("sniperSkin", {
    type: "entity"
}),
Preview.attributes.add("tec9Skin", {
    type: "entity"
}),
Preview.attributes.add("characterPreview", {
    type: "entity"
}),
Preview.attributes.add("cubePreview", {
    type: "entity"
}),
Preview.attributes.add("crateEntity", {
    type: "entity"
}),
Preview.attributes.add("coinsEntity", {
    type: "entity"
}),
Preview.attributes.add("confettiEntity", {
    type: "entity"
}),
Preview.attributes.add("shineEntity", {
    type: "entity"
}),
Preview.attributes.add("crateOpenEffect", {
    type: "entity"
}),
Preview.attributes.add("itemPreview", {
    type: "entity"
}),
Preview.attributes.add("liliumEntity", {
    type: "entity"
}),
Preview.attributes.add("shinEntity", {
    type: "entity"
}),
Preview.attributes.add("rotateLabelEntity", {
    type: "entity"
}),
Preview.attributes.add("itemName", {
    type: "entity"
}),
Preview.attributes.add("itemLabel", {
    type: "entity"
}),
Preview.attributes.add("itemThumbnail", {
    type: "entity"
}),
Preview.attributes.add("rarityElement", {
    type: "entity"
}),
Preview.attributes.add("backgroundEntity", {
    type: "entity"
}),
Preview.prototype.initialize = function() {
    this.isDragging = !1,
    this.isStatic = !1,
    this.lookAngle = 0,
    this.state = !0,
    this.animation = {
        lidAxis: 0
    },
    this.backgroundEntity.element.on("mousedown", this.onMouseDown, this),
    this.backgroundEntity.element.on("mousemove", this.onMouseMove, this),
    this.backgroundEntity.element.on("mouseup", this.onMouseUp, this),
    this.app.on("Preview:Set", this.onSet, this),
    this.app.on("Preview:Buy", this.onBuy, this),
    this.app.on("Preview:Open", this.onOpen, this),
    this.app.on("Preview:Equip", this.onEquip, this),
    this.app.on("Game:Found", this.onGameFound, this),
    this.on("state", this.onStateChange, this)
}
,
Preview.prototype.onGameFound = function() {
    this.entity.sound.stop("Emote")
}
,
Preview.prototype.onEquip = function() {
    this.entity.sound.play("Equip"),
    this.lookAngle = 0,
    this.baseEntity.setLocalScale(1.1, 1.1, 1.1),
    this.baseEntity.tween(this.baseEntity.getLocalScale()).to({
        x: 1,
        y: 1,
        z: 1
    }, .15, pc.BackOut).start()
}
,
Preview.prototype.onOpen = function(t) {
    this.itemPreview.enabled = !1,
    this.entity.sound.play("Device-Start"),
    this.baseEntity.setLocalEulerAngles(0, -1, 0),
    this.baseEntity.tween(this.baseEntity.getLocalEulerAngles()).to({
        x: 0,
        y: 1,
        z: 0
    }, .05, pc.Linear).yoyo(!0).repeat(8).start(),
    this.crateOpenEffect.enabled = !0,
    setTimeout(function(t) {
        t.openCrate()
    }, 700, this),
    this.baseEntity.setLocalScale(1, 1, 1),
    this.baseEntity.tween(this.baseEntity.getLocalScale()).to({
        x: 1.2,
        y: 1.2,
        z: 1.2
    }, .7, pc.Linear).start();
    var e = this.app.assets.find(t.thumbnail);
    e && (this.itemLabel.element.color = this.getColor(t.color),
    this.itemName.element.text = t.name,
    this.itemThumbnail.element.textureAsset = e,
    this.rarityElement.element.text = t.rarity)
}
,
Preview.prototype.getColor = function(t) {
    return Utils.hex2RGB("#" + t)
}
,
Preview.prototype.openCrate = function() {
    this.lookAngle = 0,
    this.crateOpenEffect.enabled = !1,
    this.confettiEntity.sprite.play("Fire"),
    this.entity.sound.play("Buy"),
    this.entity.sound.play("Successful"),
    this.baseEntity.setLocalScale(1, 1, 1),
    this.baseEntity.tween(this.baseEntity.getLocalScale()).to({
        x: 1.2,
        y: 1.2,
        z: 1.2
    }, .2, pc.BackOut).start(),
    setTimeout(function(t) {
        t.baseEntity.tween(t.baseEntity.getLocalScale()).to({
            x: 1,
            y: 1,
            z: 1
        }, .15, pc.BackOut).start()
    }, 200, this),
    this.crateEntity.tween(this.crateEntity.getLocalEulerAngles()).rotate({
        x: 20,
        y: 0,
        z: 0
    }, .3, pc.BackOut).delay(.2).start(),
    this.lidEntity && (this.animation.lidAxis = 0,
    this.app.tween(this.animation).rotate({
        lidAxis: -65
    }, .3, pc.BackOut).start()),
    this.itemPreview.enabled = !0,
    this.itemPreview.setLocalScale(.3, .3, .3),
    this.itemPreview.tween(this.itemPreview.getLocalScale()).rotate({
        x: 1,
        y: 1,
        z: 1
    }, .25, pc.BackOut).delay(.2).start()
}
,
Preview.prototype.onBuy = function() {
    this.lookAngle = 0,
    this.app.tween(this).to({
        lookAngle: 360
    }, .8, pc.QuadraticOut).start(),
    this.confettiEntity.sprite.play("Fire"),
    this.entity.sound.play("Buy"),
    this.entity.sound.play("Successful"),
    this.baseEntity.setLocalScale(1.1, 1.1, 1.1),
    this.baseEntity.tween(this.baseEntity.getLocalScale()).to({
        x: 1,
        y: 1,
        z: 1
    }, .15, pc.BackOut).start()
}
,
Preview.prototype.onStateChange = function(t) {
    this.state = t,
    !1 === t && this.entity.sound.stop("Emote")
}
,
Preview.prototype.onMouseDown = function(t) {
    if (!this.state)
        return !1;
    this.isDragging = !0
}
,
Preview.prototype.onMouseMove = function(t) {
    if (!this.state)
        return !1;
    this.isDragging && (this.lookAngle += .1 * t.dx * 10)
}
,
Preview.prototype.onMouseUp = function(t) {
    if (!this.state)
        return !1;
    this.isDragging = !1
}
,
Preview.prototype.setSkin = function(t, e) {
    var i = e;
    if (e && t) {
        for (var n = t.model.material.clone(), s = this.app.assets.find(i), a = t.model.meshInstances, o = 0; o < a.length; ++o) {
            a[o].material = n
        }
        this.app.assets.load(s),
        s.ready(function(t) {
            n.diffuseMap = s.resource,
            n.update()
        })
    }
}
,
Preview.prototype.setAnimation = function(t, e, i) {
    var n = e + "-" + i + "-Animation"
      , s = this.app.assets.find(n)
      , a = this.app.assets.find(e + "-" + i + "-Music.mp3")
      , o = this;
    this.app.assets.load(s),
    s.ready(function() {
        if (s) {
            var r = t.animation.assets;
            r.push(s.id),
            t.animation.assets = r,
            o.entity.sound.slots.Emote.asset = a.id,
            o.entity.sound.play("Emote"),
            t.animation.play(n),
            o.danceName = e + "-" + i
        }
    })
}
,
Preview.prototype.loadCubeModel = function(t, e) {
    var i = this.app.assets.find(e);
    i && (t.model.asset = i)
}
,
Preview.prototype.onSet = function(t, e) {
    this.entity.sound.stop("Emote"),
    this.shineEntity.enabled = !1,
    this.itemPreview.enabled = !1,
    this.rotateLabelEntity.enabled = !0,
    this.isStatic = !1,
    this.entity.findByTag("Class").forEach(function(t) {
        t.enabled = !1
    }),
    "ScarSkin" == e && (this.scarSkin.enabled = !0,
    this.setSkin(this.scarSkin, t.filename)),
    "ShotgunSkin" == e && (this.shotgunSkin.enabled = !0,
    this.setSkin(this.shotgunSkin, t.filename)),
    "SniperSkin" == e && (this.sniperSkin.enabled = !0,
    this.setSkin(this.sniperSkin, t.filename)),
    "Tec9Skin" == e && (this.tec9Skin.enabled = !0,
    this.setSkin(this.tec9Skin, t.filename)),
    "LiliumDance" == e && (this.liliumEntity.enabled = !0,
    this.setAnimation(this.liliumEntity, "Lilium", t.filename)),
    "ShinDance" == e && (this.shinEntity.enabled = !0,
    this.setAnimation(this.shinEntity, "Shin", t.filename)),
    "HeroSkin" == e && (this.characterPreview.enabled = !0),
    "Charm" == e && (this.cubePreview.enabled = !0,
    this.loadCubeModel(this.cubePreview, t.filename)),
    "VirtualCoin" == e && (this.rotateLabelEntity.enabled = !1,
    this.coinsEntity.enabled = !0,
    this.shineEntity.enabled = !0,
    this.isStatic = !0,
    this.baseEntity.setLocalEulerAngles(0, 0, 0)),
    "Crate" == e ? (this.crateEntity.enabled = !0,
    this.shineEntity.enabled = !0,
    this.rotateLabelEntity.enabled = !1,
    this.lidEntity = this.crateEntity.findByName("Lid"),
    this.crateEntity.setLocalEulerAngles(0, 0, 0),
    this.animation.lidAxis = 0,
    this.isOpening = !0,
    this.isStatic = !0,
    this.baseEntity.setLocalEulerAngles(0, 0, 0)) : this.isOpening = !1
}
,
Preview.prototype.update = function(t) {
    if (!this.state)
        return !1;
    var e = this.lookAngle % 360;
    return this.isOpening ? (this.lidEntity && this.lidEntity.setLocalEulerAngles(this.animation.lidAxis, 0, 0),
    !1) : !this.isStatic && (this.isDragging || (this.lookAngle -= 10 * t),
    void this.baseEntity.setLocalEulerAngles(0, e, 0))
}
;
var Shop = pc.createScript("shop");
Shop.attributes.add("shopType", {
    type: "string"
}),
Shop.attributes.add("itemEntity", {
    type: "entity"
}),
Shop.attributes.add("smallItemEntity", {
    type: "entity"
}),
Shop.attributes.add("itemHolder", {
    type: "entity"
}),
Shop.attributes.add("itemPriceEntity", {
    type: "entity"
}),
Shop.attributes.add("itemRarityColor", {
    type: "entity"
}),
Shop.attributes.add("itemRarityText", {
    type: "entity"
}),
Shop.attributes.add("itemTitle", {
    type: "entity"
}),
Shop.attributes.add("itemOwner", {
    type: "entity"
}),
Shop.attributes.add("itemBackground", {
    type: "entity"
}),
Shop.attributes.add("itemUnlockButton", {
    type: "entity"
}),
Shop.attributes.add("raritiesEntity", {
    type: "entity"
}),
Shop.attributes.add("raritiesItem", {
    type: "entity"
}),
Shop.attributes.add("buyPriceEntity", {
    type: "entity"
}),
Shop.attributes.add("creatorCode", {
    type: "entity"
}),
Shop.attributes.add("creatorCodeForm", {
    type: "entity"
}),
Shop.attributes.add("showcaseDisplay", {
    type: "entity"
}),
Shop.attributes.add("unlockButton", {
    type: "entity"
}),
Shop.attributes.add("buyButton", {
    type: "entity"
}),
Shop.attributes.add("equipButton", {
    type: "entity"
}),
Shop.attributes.add("equipText", {
    type: "entity"
}),
Shop.attributes.add("equipedIcon", {
    type: "entity"
}),
Shop.attributes.add("loadingEntity", {
    type: "entity"
}),
Shop.attributes.add("tabTitleEntity", {
    type: "entity"
}),
Shop.attributes.add("previewEntity", {
    type: "entity"
}),
Shop.attributes.add("transactionPriceEntity", {
    type: "entity"
}),
Shop.attributes.add("height", {
    type: "number"
}),
Shop.attributes.add("smallHeight", {
    type: "number"
}),
Shop.attributes.add("greenColor", {
    type: "rgb"
}),
Shop.attributes.add("grayColor", {
    type: "rgb"
}),
Shop.attributes.add("commonColor", {
    type: "rgb"
}),
Shop.attributes.add("uncommonColor", {
    type: "rgb"
}),
Shop.attributes.add("rareColor", {
    type: "rgb"
}),
Shop.attributes.add("legendaryColor", {
    type: "rgb"
}),
Shop.attributes.add("mythicalColor", {
    type: "rgb"
}),
Shop.attributes.add("commonPercentage", {
    type: "string"
}),
Shop.attributes.add("uncommonPercentage", {
    type: "string"
}),
Shop.attributes.add("rarePercentage", {
    type: "string"
}),
Shop.attributes.add("legendaryPercentage", {
    type: "string"
}),
Shop.attributes.add("mythicalPercentage", {
    type: "string"
}),
Shop.prototype.initialize = function() {
    this.items = [],
    this.currentItemIndex = 0,
    this.currentTab = "Offers",
    this.buyTimeout = !1,
    this.lastSelectedSKU = "750VG",
    this.rarities = [],
    this.transactionToken = !1,
    this.currentQuantity = 750,
    this.contentCreatorCode = "",
    this.app.on("Shop:TransactionToken", this.onTransactionToken, this),
    this.app.on("Shop:Buy", this.onShopBuy, this),
    this.app.on("Shop:CreatorCode", this.setCreatorCode, this),
    this.app.on("Shop:SetItems", this.setShopItems, this),
    this.app.on("Shop:Select", this.onItemSelect, this),
    this.app.on("Shop:Preview", this.setPreview, this),
    this.app.on("Shop:Bought", this.onBuy, this),
    this.app.on("Shop:Equip", this.onEquip, this),
    this.app.on("Shop:Equiped", this.onEquiped, this),
    this.app.on("Shop:Transaction", this.onTransaction, this),
    this.app.on("Buy:State", this.onMobileBuyState, this),
    this.app.on("Shop:Unlock", this.onItemUnlock, this),
    this.app.on("Tab:Shop:Changed", this.onTabChange, this),
    this.itemEntity.enabled = !1,
    this.smallItemEntity.enabled = !1,
    this.previewEntity.enabled = !0,
    this.on("state", this.onStateChange, this)
}
,
Shop.prototype.onMobileBuyState = function(t) {
    "error" == t ? this.app.fire("Alert:Menu", "An error occured on payment!") : "successful" == t ? this.app.fire("Fetcher:MobilePayment", {
        token: "mobile-process",
        sku: this.lastSelectedSKU
    }) : "restored" == t && this.app.fire("Fetcher:MobilePayment", {
        token: "mobile-process",
        sku: this.lastSelectedSKU
    })
}
,
Shop.prototype.setCreatorCode = function(t) {
    this.contentCreatorCode = t.code,
    this.creatorCode.enabled = !0,
    this.creatorCode.element.text = "Code : " + t.creator,
    this.creatorCodeForm.enabled = !1
}
,
Shop.prototype.onShopBuy = function(t) {
    this.transactionToken = !1,
    this.buyButton.enabled = !1,
    this.app.fire("Fetcher:TransactionToken", {
        quantity: this.currentQuantity,
        content_creator: this.contentCreatorCode
    })
}
,
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
,
Shop.prototype.onTabChange = function(t) {
    var e = t + "";
    "Offers" == t && (e = "Featured"),
    this.tabTitleEntity.element.text = e,
    this.currentItemIndex = 0,
    this.currentTab = t,
    this.getItemList()
}
,
Shop.prototype.getItemList = function(t) {
    "Crates" == this.currentTab ? this.app.fire("Fetcher:Crates") : "Offers" == this.currentTab || "Featured" == this.currentTab ? this.app.fire("Fetcher:Offers") : "Buy VG" == this.currentTab ? (this.shopType = "VirtualCoin",
    this.app.fire("Fetcher:BuyVG")) : "Inventory" == this.currentTab && (this.app.fire("Page:Menu", "Account"),
    pc.session && void 0 !== pc.session.hash && setTimeout(function() {
        pc.app.fire("Tab:Profile", "Inventory")
    }, 100))
}
,
Shop.prototype.onTransaction = function(t) {
    var e = this.transactionPriceEntity;
    e.setLocalPosition(0, 0, 0),
    e.element.text = "-" + t + " VG",
    e.element.opacity = 1,
    e.tween(e.getLocalPosition()).to({
        x: 0,
        y: 50,
        z: 0
    }, .4, pc.BackOut).start(),
    e.tween(e.element).to({
        opacity: 0
    }, .4, pc.Linear).start()
}
,
Shop.prototype.onStateChange = function(t) {
    this.previewEntity.enabled = t
}
,
Shop.prototype.onBuy = function(t) {
    this.getItemList(),
    "Offers" == this.currentTab ? (this.app.fire("Preview:Buy", !0),
    this.shopType = "Offers") : "Crates" == this.currentTab ? (this.app.fire("Preview:Open", t.item),
    this.shopType = "Crates") : "Buy VG" == this.currentTab && this.app.fire("Preview:Open", t.item),
    this.app.fire("Shop:Transaction", t.price)
}
,
Shop.prototype.onEquip = function(t) {
    this.app.fire("Fetcher:Equip", {
        id: t
    })
}
,
Shop.prototype.onEquiped = function(t) {
    this.getItemList(),
    this.app.fire("Preview:Equip", !0)
}
,
Shop.prototype.onItemSelect = function(t) {
    this.currentItemIndex = t;
    for (var e = this.items.length; e--; )
        this.items[e].element.opacity = .8,
        this.items[e].selection.enabled = !1;
    var i = this.items[this.currentItemIndex];
    i && (i.element.opacity = 1,
    i.selection.enabled = !0,
    this.setPreview(i),
    this.app.fire("Preview:Set", i, i.type))
}
,
Shop.prototype.onItemUnlock = function() {
    if (this.buyTimeout)
        return !1;
    var t = this.items[this.currentItemIndex];
    "Offers" == this.shopType ? this.app.fire("Fetcher:OfferBuy", {
        offer_id: t.item_id
    }) : (this.app.fire("Fetcher:OfferBuy", {
        offer_id: t.item_id
    }),
    this.buyTimeout = !0,
    setTimeout(function(t) {
        t.buyTimeout = !1
    }, 1500, this))
}
,
Shop.prototype.showRarities = function(t) {
    for (var e = this.rarities.length; e--; )
        this.rarities[e] && this.rarities[e].destroy();
    for (var i in this.rarities = [],
    t) {
        var o = t[i];
        o = o.toLowerCase();
        var n = this.raritiesItem.clone();
        n.enabled = !0,
        n.element.color = this[o + "Color"],
        n.findByName("Text").element.text = o.toUpperCase() + " (%" + this[o + "Percentage"] + ")",
        n.setLocalPosition(10, 20 * -parseInt(i) - 10, 0),
        this.raritiesEntity.addChild(n),
        this.rarities.push(n)
    }
}
,
Shop.prototype.setPreview = function(t) {
    this.itemPriceEntity.element.text = t.price,
    this.itemRarityColor.element.color = this.getRarityColor(t.rarity),
    this.itemRarityText.element.text = t.rarity,
    this.itemTitle.element.text = t.name + "",
    this.itemOwner.element.text = t.owner + "",
    this.itemBackground.element.color = this.getColor(t.color),
    this.itemRarityColor.enabled = !0,
    this.creatorCodeForm.enabled = !1,
    this.raritiesEntity.enabled = !1,
    this.showcaseDisplay.enabled = !1,
    "Crate" == t.type ? (this.buyButton.enabled = !1,
    this.unlockButton.enabled = !0,
    this.equipButton.enabled = !1,
    this.raritiesEntity.enabled = !0,
    this.showRarities(t.rarity.split(", "))) : "VirtualCoin" == t.type ? (this.unlockButton.enabled = !1,
    this.equipButton.enabled = !1,
    this.buyButton.enabled = !0,
    this.itemRarityColor.enabled = !1,
    "" !== this.contentCreatorCode || Utils.isMobile() || (this.creatorCodeForm.enabled = !0),
    this.buyPriceEntity.element.text = t.price,
    this.currentQuantity = t.quantity) : t.unlocked ? (this.buyButton.enabled = !1,
    this.unlockButton.enabled = !1,
    this.equipButton.enabled = !0,
    t.equiped ? (this.equipText.element.text = "EQUIPED",
    this.equipedIcon.enabled = !0,
    this.equipButton.element.color = this.greenColor) : (this.equipText.element.text = "EQUIP",
    this.equipedIcon.enabled = !1,
    this.equipButton.element.color = this.grayColor),
    this.equipButton.script.button.pressFunction = "Shop:Equip@" + t.item_id) : (this.buyButton.enabled = !1,
    this.equipButton.enabled = !1,
    "1" == t.is_showcase ? (this.unlockButton.enabled = !1,
    this.showcaseDisplay.enabled = !0) : (this.unlockButton.enabled = !0,
    this.showcaseDisplay.enabled = !1))
}
,
Shop.prototype.setShopItems = function(t) {
    if (!t.success)
        return !1;
    this.clearItems();
    var e = t.items;
    for (var i in e) {
        var o = e[i];
        this.addShopItem(o, parseInt(i))
    }
    this.app.fire("Shop:Select", this.currentItemIndex)
}
,
Shop.prototype.clearItems = function() {
    for (var t = this.items.length; t--; )
        this.items[t].destroy();
    this.items = []
}
,
Shop.prototype.getRarityColor = function(t) {
    var e = this.commonColor;
    return "Common" == t && (e = this.commonColor),
    "Uncommon" == t && (e = this.uncommonColor),
    "Rare" == t && (e = this.rareColor),
    "Legendary" == t && (e = this.legendaryColor),
    "Mythical" == t && (e = this.mythicalColor),
    e
}
,
Shop.prototype.getColor = function(t) {
    return Utils.hex2RGB("#" + t)
}
,
Shop.prototype.addShopItem = function(t, e, i) {
    var o = !1
      , n = this.height;
    "VirtualCoin" == this.shopType ? (o = this.smallItemEntity.clone(),
    n = this.smallHeight) : o = this.itemEntity.clone(),
    o.enabled = !0,
    o.setLocalPosition(0, -n * e, 0),
    o.element.color = this.getColor(t.color);
    var s = this.app.assets.find(t.icon);
    s && (o.findByName("Icon").element.textureAsset = s),
    o.findByName("ItemName").element.text = t.name;
    var r = "Scar-Thumbnail-White.png";
    if ("ScarSkin" == t.type && (r = "Scar-Thumbnail-White.png"),
    "ShotgunSkin" == t.type && (r = "Shotgun-Thumbnail-White.png"),
    "SniperSkin" == t.type && (r = "Sniper-Thumbnail-White.png"),
    "Tec9Skin" == t.type && (r = "Tec-9-Thumbnail-White.png"),
    "LiliumDance" == t.type && (r = "Dance-Icon.png"),
    "ShinDance" == t.type && (r = "Dance-Icon.png"),
    "WeaponAccessory" == t.type && (r = "KeyChain-Icon.png"),
    "Crate" == t.type && (r = "Loot-Icon.png"),
    "Offers" == this.shopType) {
        var a = this.app.assets.find(r);
        a && (o.findByName("ClassIcon").element.textureAsset = a),
        o.findByName("TimeLeft").element.text = t.offer_end_time
    }
    o.rarity = t.rarity,
    o.price = t.price,
    o.color = t.color,
    o.name = t.name,
    o.owner = t.owner,
    o.type = t.type,
    o.filename = t.filename,
    o.unlocked = t.unlocked,
    o.equiped = t.equiped,
    o.item_id = t.id,
    o.quantity = t.quantity ? t.quantity : 0,
    o.is_showcase = t.is_showcase,
    o.script.button.pressFunction = "Shop:Select@" + e,
    o.element.opacity = .8,
    o.selection = o.findByName("Selection"),
    o.selection.enabled = !1,
    this.itemHolder.addChild(o),
    this.items.push(o)
}
;
var Coins = pc.createScript("coins");
Coins.attributes.add("coinEntity", {
    type: "entity"
}),
Coins.attributes.add("fallPoint", {
    type: "entity"
}),
Coins.attributes.add("gargabeEntity", {
    type: "entity"
}),
Coins.attributes.add("stackEntity1", {
    type: "entity"
}),
Coins.attributes.add("stackEntity2", {
    type: "entity"
}),
Coins.attributes.add("stackEntity3", {
    type: "entity"
}),
Coins.attributes.add("stackEntity4", {
    type: "entity"
}),
Coins.attributes.add("shineEntity1", {
    type: "entity"
}),
Coins.attributes.add("shineEntity2", {
    type: "entity"
}),
Coins.prototype.initialize = function() {
    this.coins = [],
    this.timeouts = [],
    this.app.on("Preview:Set", this.onCoinFall, this)
}
,
Coins.prototype.clearEntities = function() {
    for (var t = this.coins.length; t--; )
        this.coins[t] && this.coins[t].destroy()
}
,
Coins.prototype.onCoinFall = function(t) {
    this.clearEntities(),
    this.stackEntity1.enabled = !1,
    this.stackEntity2.enabled = !1,
    this.stackEntity3.enabled = !1,
    this.stackEntity4.enabled = !1;
    var i = 5
      , n = 80
      , e = .8;
    for (var s in "750" == t.quantity && (i = 5,
    n = 90,
    e = .8,
    this.shineEntity1.element.opacity = .1,
    this.shineEntity2.element.opacity = .2),
    "1500" == t.quantity && (i = 10,
    n = 80,
    e = .85,
    this.stackEntity1.enabled = !0,
    this.shineEntity1.element.opacity = .12,
    this.shineEntity2.element.opacity = .22),
    "5000" == t.quantity && (i = 20,
    n = 80,
    e = .9,
    this.stackEntity1.enabled = !0,
    this.stackEntity2.enabled = !0,
    this.shineEntity1.element.opacity = .15,
    this.shineEntity2.element.opacity = .25),
    "10000" == t.quantity && (i = 30,
    n = 70,
    e = 1,
    this.stackEntity1.enabled = !0,
    this.stackEntity2.enabled = !0,
    this.shineEntity1.element.opacity = .2,
    this.shineEntity2.element.opacity = .3),
    "25000" == t.quantity && (i = 40,
    n = 60,
    e = 1.1,
    this.stackEntity1.enabled = !0,
    this.stackEntity2.enabled = !0,
    this.shineEntity1.element.opacity = .3,
    this.shineEntity2.element.opacity = .4),
    "50000" == t.quantity && (i = 50,
    n = 60,
    e = 1.2,
    this.stackEntity1.enabled = !0,
    this.stackEntity2.enabled = !0,
    this.stackEntity3.enabled = !0,
    this.shineEntity1.element.opacity = .4,
    this.shineEntity2.element.opacity = .7),
    "100000" == t.quantity && (i = 70,
    n = 50,
    e = 1.25,
    this.stackEntity1.enabled = !0,
    this.stackEntity2.enabled = !0,
    this.stackEntity3.enabled = !0,
    this.stackEntity4.enabled = !0,
    this.shineEntity1.element.opacity = .5,
    this.shineEntity2.element.opacity = .8),
    this.entity.sound.slots.Ability.pitch = e,
    this.entity.sound.play("Ability"),
    this.timeouts) {
        var a = this.timeouts[s];
        a && clearTimeout(a)
    }
    this.timeouts = [];
    for (var y = 0; y < i; y++) {
        var o = Math.random();
        this.timeouts.push(setTimeout(function(t) {
            t.createCoin()
        }, n * y * o, this))
    }
}
,
Coins.prototype.createCoin = function() {
    var t = this.fallPoint.getPosition().clone()
      , i = .8 * Math.random() - .8 * Math.random()
      , n = .8 * Math.random()
      , e = .8 * Math.random() - .8 * Math.random()
      , s = 20 * Math.random()
      , a = 20 * Math.random()
      , y = 20 * Math.random()
      , o = this.coinEntity.clone();
    o.enabled = !0,
    o.rigidbody.applyForce(0, -5, 0),
    o.rigidbody.teleport(t.x + i, t.y + n, t.z + e, s, a, y),
    setTimeout(function(t) {
        t.entity.sound.slots.Coin.pitch = .8 + .25 * Math.random(),
        t.entity.sound.play("Coin")
    }, 270, this),
    this.entity.addChild(o),
    this.coins.push(o)
}
;
var Miniplay = pc.createScript("miniplay");
Miniplay.attributes.add("URL", {
    type: "string"
}),
Miniplay.attributes.add("key", {
    type: "string"
}),
Miniplay.prototype.initialize = function() {
    var i = document.referrer;
    if (i && (i.search("lechuck") > -1 || i.search("miniplay") > -1 || i.search("minijuegos") > -1)) {
        var e = this
          , t = document.createElement("script");
        t.src = this.URL,
        t.onload = function() {
            e.initalizeAPI()
        }
        ,
        document.body.appendChild(t),
        this.isReady = !1,
        this.app.on("Miniplay:Save", this.onSave, this)
    }
}
,
Miniplay.prototype.initalizeAPI = function() {
    this.lechuck = new LeChuckAPI({}),
    this.isReady = !0,
    console.log("[DEBUG] LeChuck API has been initalized!", this.key)
}
,
Miniplay.prototype.onSave = function(i, e) {
    this.isReady && this.lechuck.stat.put(function(i) {
        console.log("[DEBUG] Response", i)
    }, i, e)
}
;
var Objective = pc.createScript("objective");
Objective.attributes.add("mode", {
    type: "string"
}),
Objective.attributes.add("playerEntity", {
    type: "entity"
}),
Objective.attributes.add("radius", {
    type: "number",
    default: 5
}),
Objective.attributes.add("screenEntity", {
    type: "entity"
}),
Objective.attributes.add("labelEntity", {
    type: "entity"
}),
Objective.attributes.add("labelIcon", {
    type: "entity"
}),
Objective.attributes.add("labelTime", {
    type: "entity"
}),
Objective.attributes.add("icon", {
    type: "asset",
    assetType: "texture"
}),
Objective.prototype.initialize = function() {
    this.distance = 100,
    this.labelIcon.element.textureAsset = this.icon,
    this.objectiveMaterial = this.app.assets.find("Objective-Material").resource,
    this.nextCapture(),
    this.app.on("Game:Finish", this.onFinish, this),
    this.on("state", this.onStateChange.bind(this))
}
,
Objective.prototype.onStateChange = function(t) {
    !0 === t ? this.nextCapture() : clearTimeout(this.nextCaptureTimer)
}
,
Objective.prototype.onFinish = function() {
    this.labelEntity.enabled = !1
}
,
Objective.prototype.nextCapture = function() {
    if (this.mode != pc.currentMode)
        return !1;
    this.distance = this.playerEntity.getPosition().sub(this.entity.getPosition()).length(),
    this.distance < this.radius ? (this.app.fire("Objective:Inside", !0),
    this.app.fire("Network:Point", !0),
    this.objectiveMaterial.emissiveIntensity = 10,
    this.objectiveMaterial.update(),
    this.wasInside || this.entity.sound.play("Deep-Whoosh"),
    this.wasInside = !0) : (this.app.fire("Objective:Inside", !1),
    this.wasInside = !1,
    this.objectiveMaterial.emissiveIntensity = 1,
    this.objectiveMaterial.update()),
    this.nextCaptureTimer = setTimeout(function(t) {
        t.nextCapture()
    }, 800, this)
}
,
Objective.prototype.update = function(t) {
    if (this.distance < this.radius + 5)
        return this.labelEntity.enabled = !1,
        !1;
    var e = new pc.Vec3
      , i = this.app.systems.camera.cameras[0]
      , s = this.app.graphicsDevice.maxPixelRatio
      , a = this.screenEntity.screen.scale
      , n = this.app.graphicsDevice
      , r = this.entity.getPosition().add(new pc.Vec3(0,5,0));
    if (!i)
        return !1;
    i.worldToScreen(r, e),
    e.x *= s,
    e.y *= s,
    e.x > 0 && e.x < this.app.graphicsDevice.width && e.y > 0 && e.y < this.app.graphicsDevice.height && e.z > 0 ? (this.labelEntity.setLocalPosition(e.x / a, (n.height - e.y) / a, 0),
    this.labelEntity.enabled = !0) : this.labelEntity.enabled = !1
}
;
var Payload = pc.createScript("payload");
Payload.attributes.add("startIndex", {
    type: "number",
    default: 28
}),
Payload.attributes.add("baseEntity", {
    type: "entity"
}),
Payload.attributes.add("cartEntity", {
    type: "entity"
}),
Payload.attributes.add("speed", {
    type: "number",
    default: .01
}),
Payload.attributes.add("turnSpeed", {
    type: "number",
    default: .01
}),
Payload.attributes.add("rotationSpeed", {
    type: "number",
    default: .05
}),
Payload.attributes.add("wheelSpeed", {
    type: "number",
    default: .05
}),
Payload.attributes.add("threshold", {
    type: "number",
    default: .1
}),
Payload.attributes.add("payloadIcon", {
    type: "entity"
}),
Payload.attributes.add("redBarEntity", {
    type: "entity"
}),
Payload.attributes.add("blueBarEntity", {
    type: "entity"
}),
Payload.attributes.add("redPercentageEntity", {
    type: "entity"
}),
Payload.attributes.add("bluePercentageEntity", {
    type: "entity"
}),
Payload.prototype.initialize = function() {
    this.entity.sound.data.positional = !0,
    this.entity.sound.data.slots = this.entity.sound.slots,
    this.percentage = 0,
    this.index = -1,
    this.nextPoint = new pc.Vec3(0,0,0),
    this.lerpPoint = new pc.Vec3(0,0,0),
    this.wheelsBack = !1,
    this.wheelsFront = !1,
    this.setWheels(),
    this.cartEntity.tween(this.cartEntity.getLocalEulerAngles()).rotate({
        x: -1
    }, .4, pc.Linear).yoyo(!0).loop(!0).start(),
    this.app.on("Map:Loaded", this.onMapLoaded, this),
    this.app.on("Objective:Payload", this.setNextNumber, this),
    this.app.on("Objective:Inside", this.onInside, this),
    this.on("state", this.onStateChange)
}
,
Payload.prototype.onInside = function(t) {}
,
Payload.prototype.onStateChange = function(t) {
    t ? this.app.on("Objective:Inside", this.onInside, this) : this.app.off("Objective:Inside")
}
,
Payload.prototype.setWheels = function() {
    var t = this
      , e = this.app.assets.find("MineCart.glb");
    e.ready(function() {
        setTimeout(function() {
            t.wheelsBack = t.cartEntity.findByName("Wheels_Back"),
            t.wheelsFront = t.cartEntity.findByName("Wheels_Front")
        }, 100)
    }),
    this.app.assets.load(e)
}
,
Payload.prototype.onMapLoaded = function() {
    "PAYLOAD" == pc.currentMode && this.getPointsInOrder()
}
,
Payload.prototype.getPointsInOrder = function() {
    this.app.root.findByTag("StartPoint"),
    this.app.root.findByTag("EndPoint");
    this.points = this.app.root.findByTag("Point"),
    this.index = Math.floor(.5 * this.points.length),
    this.entity.setPosition(this.points[this.index].getPosition().clone()),
    this.checkNextPoint()
}
,
Payload.prototype.setNextNumber = function(t) {
    if (!(this.points && this.points.length > 0))
        return !1;
    this.index = Math.floor(t * this.points.length),
    this.nextPoint = this.points[this.index].getPosition().clone(),
    this.percentage = 0,
    this.redBarEntity.setLocalScale(t, 1, 1),
    this.blueBarEntity.setLocalScale(1 - t, 1, 1),
    this.redPercentageEntity.element.text = Math.floor(100 * t) + "%",
    this.bluePercentageEntity.element.text = Math.floor(100 * (1 - t)) + "%",
    this.payloadIcon.setLocalPosition(200 * (t - .5), 5.011, 0)
}
,
Payload.prototype.checkNextPoint = function() {
    this.nextPoint = this.points[this.index].getPosition().clone(),
    this.index++,
    this.percentage = 0
}
,
Payload.prototype.update = function(t) {
    var e = this.entity.getPosition().clone().sub(this.nextPoint.clone()).length()
      , i = this.entity.getPosition().clone();
    this.lerpPoint = this.lerpPoint.lerp(this.lerpPoint, this.nextPoint, this.turnSpeed);
    var n = this.entity.getPosition().lerp(i, this.lerpPoint, this.rotationSpeed)
      , s = i.x * (1 - this.percentage) + this.nextPoint.x * this.percentage
      , o = i.y * (1 - this.percentage) + this.nextPoint.y * this.percentage
      , a = i.z * (1 - this.percentage) + this.nextPoint.z * this.percentage;
    e > 15 ? this.entity.setPosition(this.nextPoint.x, this.nextPoint.y, this.nextPoint.z) : this.entity.setPosition(s, o, a),
    e < this.threshold && this.index,
    this.wheelsBack && this.wheelsFront && e > .5 && (this.wheelsBack.rotateLocal(0, this.wheelSpeed * t, 0),
    this.wheelsFront.rotateLocal(0, this.wheelSpeed * t, 0),
    this.baseEntity.lookAt(n)),
    this.percentage = this.speed
}
;
var Outline = pc.createScript("outline");
Outline.attributes.add("color", {
    type: "rgba"
}),
Outline.attributes.add("thickness", {
    type: "number",
    default: 1,
    min: 1,
    max: 10,
    precision: 0,
    title: "Thickness"
}),
Outline.attributes.add("currentEntity", {
    type: "entity"
}),
Outline.attributes.add("outlineCamera", {
    type: "entity"
}),
Outline.prototype.initialize = function() {
    this.vec = new pc.Vec3,
    this.prepare(),
    this.outlines = [],
    this.app.on("Outline:Add", this.onAdd, this),
    this.app.on("Outline:Remove", this.onRemove, this),
    this.app.on("Outline:Restart", this.onRestart, this),
    this.app.on("Game:Settings", this.onSettingsChange, this);
    var e = this.entity.camera.postEffects
      , t = this;
    this.on("state", function(t) {
        t ? e.addEffect(this.effect) : e.removeEffect(this.effect)
    }),
    this.on("destroy", function() {
        e.removeEffect(this.effect),
        t.outlineCamera.destroy()
    }),
    this.onSettingsChange()
}
,
Outline.prototype.onSettingsChange = function() {
    pc.settings && !0 === pc.settings.disableSpecialEffects && (this.entity.script.destroy("outline"),
    this.app.scene.layers.getLayerByName("OutlineLayer").enabled = !1)
}
,
Outline.prototype.onAdd = function(e, t) {
    if (e && e.model && -1 === e.model.layers.indexOf(this.outlineLayer.id)) {
        var i = e.model.layers.slice();
        i.push(this.outlineLayer.id),
        e.model.layers = i,
        this.outlines.push(e),
        t || (clearTimeout(e.outlineTimeout),
        e.outlineTimeout = setTimeout(function(e, t) {
            e.onRemove(t)
        }, 1500, this, e))
    }
}
,
Outline.prototype.onRemove = function(e) {
    if (!(e && e.model && e.model.layers))
        return !1;
    var t = e.model.layers.indexOf(this.outlineLayer.id);
    if (e && e.model && t > -1) {
        var i = e.model.layers.slice();
        i.splice(t, 1),
        e.model.layers = i;
        var s = this.outlines.indexOf(e);
        s > -1 && this.outlines.splice(s, 1)
    }
}
,
Outline.prototype.onRestart = function() {
    for (var e = this.outlines.length; e--; )
        this.onRemove(this.outlines[e]);
    this.outlines = []
}
,
Outline.prototype.prepare = function() {
    this.texture = new pc.Texture(this.app.graphicsDevice,{
        width: .5 * this.app.graphicsDevice.width,
        height: .5 * this.app.graphicsDevice.height,
        format: pc.PIXELFORMAT_R8_G8_B8_A8,
        autoMipmap: !0,
        minFilter: pc.FILTER_LINEAR,
        magFilter: pc.FILTER_LINEAR
    }),
    this.renderTarget = new pc.RenderTarget(this.app.graphicsDevice,this.texture,{}),
    this.worldLayer = this.app.scene.layers.getLayerByName("World"),
    this.outlineLayer = this.app.scene.layers.getLayerByName("OutlineLayer"),
    this.outlineLayer.renderTarget = this.renderTarget,
    this.effect = new pc.OutlineEffect(this.app.graphicsDevice,this.thickness),
    this.effect.color = new pc.Color(0,0,1,1),
    this.effect.texture = this.texture,
    this.entity.camera.postEffects.addEffect(this.effect)
}
,
Outline.prototype.update = function(e) {
    this.entity != this.outlineCamera && (this.outlineCamera.camera.fov = this.entity.camera.fov)
}
;
Object.assign(pc, function() {
    var e = function(e, t) {
        pc.PostEffect.call(this, e),
        this.shader = new pc.Shader(e,{
            attributes: {
                aPosition: pc.SEMANTIC_POSITION
            },
            vshader: ["attribute vec2 aPosition;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "    gl_Position = vec4(aPosition, 0.0, 1.0);", "    vUv0 = (aPosition.xy + 1.0) * 0.5;", "}"].join("\n"),
            fshader: ["precision " + e.precision + " float;", "", "#define THICKNESS " + t.toFixed(0), "uniform float uWidth;", "uniform float uHeight;", "uniform vec4 uOutlineCol;", "uniform sampler2D uColorBuffer;", "uniform sampler2D uOutlineTex;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "    vec4 texel1 = texture2D(uColorBuffer, vUv0);", "    float sample0 = texture2D(uOutlineTex, vUv0).a;", "    float outline = 0.0;", "    if (sample0==0.0)", "    {", "        for (int x=-THICKNESS;x<=THICKNESS;x++)", "        {", "            for (int y=-THICKNESS;y<=THICKNESS;y++)", "            {    ", "                float sample=texture2D(uOutlineTex, vUv0+vec2(float(x)/uWidth, float(y)/uHeight)).a;", "                if (sample>0.0)", "                {", "                    outline=1.0;", "                }", "            }", "        } ", "    }", "    gl_FragColor = mix(texel1, uOutlineCol, outline * uOutlineCol.a);", "}"].join("\n")
        }),
        this.color = new pc.Color(1,1,1,1),
        this.texture = new pc.Texture(e),
        this.texture.name = "pe-outline"
    };
    return (e.prototype = Object.create(pc.PostEffect.prototype)).constructor = e,
    Object.assign(e.prototype, {
        render: function(e, t, o) {
            var i = this.device
              , u = i.scope;
            u.resolve("uWidth").setValue(e.width),
            u.resolve("uHeight").setValue(e.height),
            u.resolve("uOutlineCol").setValue([1, 1, 1, .5]),
            u.resolve("uColorBuffer").setValue(e.colorBuffer),
            u.resolve("uOutlineTex").setValue(this.texture),
            pc.drawFullscreenQuad(i, t, this.vertexBuffer, this.shader, o)
        }
    }),
    {
        OutlineEffect: e
    }
}());
var River = pc.createScript("river");
River.attributes.add("material", {
    type: "asset",
    assetType: "material"
}),
River.attributes.add("speed", {
    type: "number",
    default: .1
}),
River.prototype.initialize = function() {
    this.material.resource.emissiveMapTiling.x = 5,
    this.material.resource.emissiveMapTiling.y = 2.5,
    this.app.on("Game:Settings", this.onSettingsChange, this),
    this.disabled = !1,
    this.onSettingsChange()
}
,
River.prototype.update = function(e) {
    this.disabled || (this.material.resource.diffuseMapOffset.x = .005 * Math.cos(pc.app._time / 500),
    this.material.resource.diffuseMapOffset.y = .003 * Math.sin(pc.app._time / 200),
    this.material.resource.emissiveMapOffset.x += this.speed * e,
    this.material.resource.update())
}
,
River.prototype.onSettingsChange = function() {
    pc.settings && !0 === pc.settings.disableSpecialEffects ? this.disabled = !1 : this.disabled = !0
}
;
var Settings = pc.createScript("settings");
Settings.prototype.initialize = function() {
    pc.settings = {
        sensivity: 1,
        adsSensivity: 1,
        pixelRatio: 1,
        disableSpecialEffects: !1,
        fpsCounter: !1,
        hideChat: !1,
        hideArms: !1
    },
    this.app.on("Menu:Settings", this.setSettings, this),
    this.app.on("Menu:KeyboardConfiguration", this.setKeyboardConfiguration, this),
    this.setKeyboardConfiguration(),
    this.setSettings()
}
,
Settings.prototype.getSetting = function(t) {
    var e = Utils.getItem(t);
    return e || !1
}
,
Settings.prototype.setKeyboardConfiguration = function() {
    var t = Utils.getItem("KeyConfiguration");
    if (t)
        for (var e in t = JSON.parse(t)) {
            var i = t[e];
            pc["KEY_" + e] = i
        }
}
,
Settings.prototype.setSettings = function() {
    var t = this.getSetting("Sensivity");
    t > 0 && (pc.settings.sensivity = t / 100);
    var e = this.getSetting("ADSSensivity");
    e > 0 && (pc.settings.adsSensivity = e / 100);
    var i = this.getSetting("FOV");
    i > 0 && (pc.settings.fov = parseInt(i));
    var s = this.getSetting("Quality");
    s > 0 ? (pc.settings.resolution = parseInt(s) / 100,
    this.app.graphicsDevice.maxPixelRatio = .9 * pc.settings.resolution) : "undefined" != typeof mobileAds && pc.isMobile ? this.app.graphicsDevice.maxPixelRatio = 1.5 : this.app.graphicsDevice.maxPixelRatio = .95;
    var n = parseInt(this.getSetting("Volume"));
    n > -1 ? (pc.settings.volume = parseInt(n) / 100,
    pc.app.systems.sound.volume = .25 * pc.settings.volume) : pc.app.systems.sound.volume = .25;
    var a = this.getSetting("InvertMouse");
    pc.settings.invertAxis = "true" === a,
    "true" === this.getSetting("DisableMenuMusic") ? (pc.settings.disableMenuMusic = !0,
    this.app.fire("Menu:Music", !1)) : (pc.settings.disableMenuMusic = !1,
    this.app.fire("Menu:Music", !0));
    var p = this.getSetting("FPSCounter");
    pc.settings.fpsCounter = "true" === p;
    var g = this.getSetting("DisableSpecialEffects");
    pc.settings.disableSpecialEffects = "true" === g;
    var r = this.getSetting("HideChat");
    pc.settings.hideChat = "true" === r;
    var o = this.getSetting("HideArms");
    pc.settings.hideArms = "true" === o,
    this.app.root.findByTag("KeyBinding").forEach(function(t) {
        t.element.text = keyboardMap[pc["KEY_" + t.element.text]]
    }),
    this.app.fire("Game:Settings", pc.settings)
}
;
var TransformTool = pc.createScript("transformTool");
TransformTool.attributes.add("cameraEntity", {
    type: "entity"
}),
TransformTool.attributes.add("axisX", {
    type: "entity"
}),
TransformTool.attributes.add("axisY", {
    type: "entity"
}),
TransformTool.attributes.add("axisZ", {
    type: "entity"
}),
TransformTool.attributes.add("currentEntity", {
    type: "entity"
}),
TransformTool.prototype.initialize = function() {
    this.mode = "Translate",
    this.lastDt = 0,
    this.mouseX = 0,
    this.mouseY = 0,
    this.deltaMouseX = 0,
    this.deltaMouseY = 0,
    this.lockAxis = !1,
    this.app.mouse.on("mousedown", this.onMouseDown, this),
    this.app.mouse.on("mousemove", this.onMouseMove, this),
    this.app.mouse.on("mouseup", this.onMouseUp, this),
    this.app.fire("Outline:Add", this.currentEntity, !0)
}
,
TransformTool.prototype.doRaycast = function() {
    var t = this.app.graphicsDevice.maxPixelRatio
      , i = this.mouseX / t
      , s = this.mouseY / t
      , o = this.cameraEntity.getPosition()
      , e = this.cameraEntity.camera.screenToWorld(i, s, this.cameraEntity.camera.farClip)
      , a = this.app.systems.rigidbody.raycastAll(o, e)
      , n = this.app.systems.rigidbody.raycastFirst(o, e);
    if (a) {
        var r = !1;
        for (var h in a) {
            var p = a[h];
            p.entity.tags.list().indexOf("Tool") > -1 && (r = p)
        }
        r || (r = n),
        r && this.doAction(r)
    }
}
,
TransformTool.prototype.doAction = function(t) {
    var i = !1;
    t.entity == this.axisX && (this.lockAxis = "X",
    i = !0),
    t.entity == this.axisY && (this.lockAxis = "Y",
    i = !0),
    t.entity == this.axisZ && (this.lockAxis = "Z",
    i = !0),
    i || (this.app.fire("Outline:Remove", this.currentEntity, !0),
    t.entity.parent && (this.currentEntity = t.entity.parent,
    t.entity.rigidbody.type = pc.BODYTYPE_KINEMATIC),
    this.app.fire("Outline:Add", this.currentEntity, !0)),
    this.lockAxis ? (this.app.mouse.enablePointerLock(),
    this.app.fire("Camera:State", !1)) : (this.app.mouse.disablePointerLock(),
    this.app.fire("Camera:State", !0))
}
,
TransformTool.prototype.onMouseDown = function(t) {
    this.mouseX = t.x,
    this.mouseY = t.y,
    0 === t.button && this.doRaycast()
}
,
TransformTool.prototype.onMouseMove = function(t) {
    this.deltaMouseX = t.dx,
    this.deltaMouseY = t.dy,
    this.updateTransform(this.lastDt)
}
,
TransformTool.prototype.updateTransform = function(t) {
    var i = this.deltaMouseX
      , s = this.deltaMouseY;
    "Translate" == this.mode && this.lockAxis && (this.axisX.enabled = !1,
    this.axisY.enabled = !1,
    this.axisZ.enabled = !1,
    "X" == this.lockAxis && (this.currentEntity.translate(i * t, 0, 0),
    this.axisX.enabled = !0),
    "Y" == this.lockAxis && (this.currentEntity.translate(0, -s * t, 0),
    this.axisY.enabled = !0),
    "Z" == this.lockAxis && (this.currentEntity.translate(0, 0, -i * t),
    this.axisZ.enabled = !0))
}
,
TransformTool.prototype.onMouseUp = function(t) {
    this.app.mouse.disablePointerLock(),
    this.app.fire("Camera:State", !0),
    this.lockAxis = !1,
    this.axisX.enabled = !0,
    this.axisY.enabled = !0,
    this.axisZ.enabled = !0
}
,
TransformTool.prototype.updateTool = function(t) {
    this.entity.setPosition(this.currentEntity.getPosition().clone())
}
,
TransformTool.prototype.update = function(t) {
    this.updateTool(),
    this.lastDt = t
}
;
var FlagShader = pc.createScript("flagShader");
FlagShader.attributes.add("texture", {
    type: "asset",
    assetType: "texture"
}),
FlagShader.prototype.initialize = function() {
    var e = this.app.assets.find("FlagVertex")
      , t = this.app.assets.find("FlagFragment")
      , a = this.app.graphicsDevice
      , i = e.resource
      , r = "precision " + a.precision + " float;\n";
    r += t.resource;
    var s = {
        attributes: {
            aPosition: pc.gfx.SEMANTIC_POSITION,
            aUv0: pc.gfx.SEMANTIC_TEXCOORD0
        },
        vshader: i,
        fshader: r
    }
      , p = new pc.Shader(this.app.graphicsDevice,s);
    this.material = new pc.Material,
    this.material.setShader(p),
    this.material.setParameter("uDiffuseMap", this.texture.resource),
    this.material.setParameter("fog_color_Flag", [1, 1, 1, 1]),
    this.material.setParameter("fog_density_Flag", .005),
    this.material.update(),
    this.timestamp = 0,
    this.entity.model.meshInstances[0].material = this.material
}
,
FlagShader.prototype.update = function(e) {
    this.material.setParameter("uTime", this.timestamp),
    this.timestamp += 2 * e
}
;
var Digit = pc.createScript("digit");
Digit.attributes.add("backgroundEntity", {
    type: "entity"
}),
Digit.prototype.initialize = function() {
    if (this.backgroundColor = new pc.Color(1,1,1),
    this.defaultBackgroundColor = !1,
    this.backgroundEntity) {
        var t = this.backgroundEntity.element.color
          , i = new pc.Color(t.r,t.g,t.b,t.a);
        this.backgroundColor = i,
        this.defaultBackgroundColor = i
    }
    this.app.on("Digit:" + this.entity.name, this.onDigitChange, this)
}
,
Digit.prototype.onDigitChange = function(t) {
    this.entity.element.text = "" + t,
    this.entity.setLocalScale(1, 1, 1);
    var i = this
      , o = this.entity.tween(this.entity.getLocalScale()).to({
        x: 4,
        y: 4,
        z: 4
    }, .3, pc.BackInOut);
    if (o.on("complete", function() {
        i.entity.setLocalScale(1, 1, 1)
    }),
    o.start(),
    this.backgroundEntity && this.defaultBackgroundColor) {
        this.backgroundEntity.element.color = pc.colors.white;
        var n = this.app.tween(this.backgroundColor).to(this.defaultBackgroundColor, .5, pc.Linear);
        n.on("update", function() {
            i.backgroundEntity.element.color = i.backgroundColor
        }),
        n.start()
    }
}
,
Digit.prototype.update = function(t) {}
;
var ElementAnimation = pc.createScript("elementAnimation");
ElementAnimation.attributes.add("animation", {
    type: "string",
    enum: [{
        Attention: "Attention"
    }, {
        Flash: "Flash"
    }, {
        Pulse: "Pulse"
    }, {
        ShakeX: "ShakeX"
    }, {
        ShakeY: "ShakeY"
    }, {
        PickMe: "PickMe"
    }, {
        LowRise: "LowRise"
    }, {
        Beat: "Beat"
    }]
}),
ElementAnimation.attributes.add("loop", {
    type: "boolean",
    default: !1
}),
ElementAnimation.attributes.add("playSound", {
    type: "boolean",
    default: !1
}),
ElementAnimation.prototype.initialize = function() {
    this.playAnimation()
}
,
ElementAnimation.prototype.playAnimation = function() {
    var t = this
      , e = this.getTweens();
    if (e.length > 0)
        for (var i in this.loop && e[0].on("complete", function() {
            t.playAnimation()
        }),
        e) {
            e[i].start()
        }
}
,
ElementAnimation.prototype.getTweens = function() {
    var t = [];
    return "Attention" == this.animation && (this.entity.setLocalScale(1, 1, 1),
    this.entity.setLocalEulerAngles(0, 0, 0),
    t.push(this.entity.tween(this.entity.getLocalScale()).to({
        x: 1.3,
        y: 1.3,
        z: 1.3
    }, .6, pc.QuinticInOut).yoyo(!0).repeat(2)),
    t.push(this.entity.tween(this.entity.getLocalEulerAngles()).rotate({
        z: 8
    }, .15, pc.CubicOut).yoyo(!0).repeat(4)),
    t.push(this.entity.tween(this.entity.getLocalEulerAngles()).rotate({
        z: -8
    }, .15, pc.CubicOut).delay(.15).yoyo(!0).repeat(4))),
    "Flash" == this.animation && (this.entity.element.opacity = 1,
    t.push(this.entity.tween(this.entity.element).to({
        opacity: .3
    }, .2, pc.Linear).delay(.4).yoyo(!0).repeat(4))),
    "Beat" == this.animation && (this.entity.element.opacity = 1,
    this.entity.timer = 0,
    this.entity.setLocalScale(1, 1, 1),
    t.push(this.entity.tween(this.entity).to({
        timer: 1
    }, .35, pc.Linear).delay(2)),
    t.push(this.entity.tween(this.entity.getLocalScale()).to({
        x: 1.5,
        y: 1.5,
        z: 1.5
    }, .35, pc.Linear)),
    t.push(this.entity.tween(this.entity.element).to({
        opacity: 0
    }, .35, pc.Linear)),
    this.playSound && this.entity.sound.play("Sound")),
    "Pulse" == this.animation && (this.entity.setLocalScale(1, 1, 1),
    t.push(this.entity.tween(this.entity.getLocalScale()).to({
        x: 1.3,
        y: 1.15,
        z: 1.3
    }, .175, pc.Linear).delay(.4).yoyo(!0).repeat(4))),
    "ShakeX" == this.animation && (this.entity.setLocalPosition(1, 1, 1),
    t.push(this.entity.tween(this.entity.getLocalPosition()).rotate({
        x: 10
    }, .1, pc.CubicOut).yoyo(!0).repeat(4)),
    t.push(this.entity.tween(this.entity.getLocalPosition()).rotate({
        x: -10
    }, .1, pc.CubicOut).delay(.4).yoyo(!0).repeat(4))),
    "ShakeY" == this.animation && (this.entity.setLocalPosition(1, 1, 1),
    t.push(this.entity.tween(this.entity.getLocalPosition()).rotate({
        y: 5
    }, .1, pc.CubicOut).yoyo(!0).repeat(4)),
    t.push(this.entity.tween(this.entity.getLocalPosition()).rotate({
        y: -5
    }, .1, pc.CubicOut).delay(.4).yoyo(!0).repeat(4))),
    "PickMe" == this.animation && (this.entity.setLocalScale(1, 1, 1),
    this.entity.setLocalPosition(1, 1, 1),
    t.push(this.entity.tween(this.entity.getLocalScale()).to({
        x: 1.2,
        y: 1.2,
        z: 1.2
    }, .3, pc.BackOut).yoyo(!0).repeat(2)),
    t.push(this.entity.tween(this.entity.getLocalPosition()).to({
        y: 5
    }, .3, pc.BackIn).yoyo(!0).repeat(2))),
    "LowRise" == this.animation && (this.entity.setLocalPosition(1, 1, 1),
    this.entity.setLocalScale(1, 1, 1),
    t.push(this.entity.tween(this.entity.getLocalScale()).to({
        x: 2,
        y: 2,
        z: 2
    }, .8, pc.QuadraticInOut).yoyo(!0).repeat(2)),
    t.push(this.entity.tween(this.entity.getLocalPosition()).to({
        x: -30
    }, .4, pc.SineInOut).yoyo(!0).repeat(2)),
    t.push(this.entity.tween(this.entity.getLocalPosition()).to({
        x: 30
    }, .4, pc.SineInOut).delay(.8).yoyo(!0).repeat(2))),
    t
}
,
ElementAnimation.prototype.update = function(t) {}
;
