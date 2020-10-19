var a = ["readText", "Idling", "setTitle", "menu", "logger", "Client", "Enable", "nexi-client", "win32", "showMessageBox", "v8-compile-cache", "no-user-gesture-required", "will-prevent-unload", "Alt+F4", "file", "AMD", "total", "high-dpi-support", "Quit has been used", "response", " D3D11OND12", "Please don't play any matches until the download is complete", "d3d9", "url", "unknown", "Alright!", "set", "includes", "quit", "substring", "openDevTools", "ESC", "commandLine", "update-downloaded", "checking-for-update", "getURL", "disable-accelerated-video-decode", "Looking for a Game", "indexOf", "cpus", "checkForUpdatesAndNotify", "loadFile", "workAreaSize", "game", "d3d11ond12", "register", "social.venge.io", "info", "electron-updater", "loadURL", "Join", "social", "update-available", "autoplay-policy", "Version is up-to-date", "Ctrl+F5", "Please enter your Invite link here", "then", "bytesPerSecond", "In a Game", "transports", "Would you like to spectate or play?", "isSimpleFullScreen", "enable-zero-copy", "Play", "https://venge.io/#00000", "showMessageBoxSync", "Settings", "electron", "webContents", "preventDefault", "model", "transferred", " - Downloaded ", "Later", "utilities_D3D11OND12", "dom-ready", "disable-frame-rate-limit", "close", "appendSwitch", "split", "download-progress", "relaunch", "quitAndInstall", "Linkbox has been opened", "enable-quic", "log", "disable-gpu-vsync", "spectate", "electron-store", "In Menu", "NeXi-Client V", "Disable", "get", "electron-localshortcut", "findIndex", "User saw New Version message", "length", "utilities_RPC", "A new version has been downloaded. Want to update the client now?", "use-angle", "New Version of NeXi-Client has been found", "Checking for updates...", "update-not-available", " Discord RPC", "/index.html#Spectate:", "new-window", "/index.html", "utilities_FPS", "750116161890287657", "electron-log", "level", "now", "General", "executeJavaScript", "enable-webgl2-compute-context", "question", "input", "searching for game", "openExternal", "/index.html#", "Loading...", "venge.io/#"];
! function(e, t) {
    ! function(t) {
        for (; --t;) e.push(e.shift())
    }(++t)
}(a, 453);
var b = function(e, t) {
        return a[e -= 0]
    },
    C = b;
require(C("0x31"));
const {
    app: app,
    shell: shell,
    clipboard: clipboard,
    dialog: dialog,
    BrowserWindow: BrowserWindow,
    screen: screen
} = require(C("0x6b")), discord = require("discord-rpc"), Store = require(C("0x5")), config = new Store, OS = require("os"), prompt = require("electron-prompt");

function init() {
    var e = C;
    createInitWindow("file:///" + __dirname + e("0x17"), !0, 1.2, !0), autoUpdater[e("0x4f")]()
}

function createInitWindow(e, t, n, a) {
    var o = C;
    const {
        width: i,
        height: x
    } = screen.getPrimaryDisplay()[o("0x51")];
    var r = new BrowserWindow({
        width: i * (n + 1.7),
        height: x * (n + 2.5),
        show: !0
    });
    r.setSimpleFullScreen(t), r[o("0x58")](e), r.removeMenu(), config.get(o("0xe")) && a && function() {
        var e = o,
            t = {
                a: e("0x28"),
                b: e("0x62"),
                c: "Spectating a Match",
                d: e("0x4c"),
                e: e("0x6"),
                f: e("0x25")
            };
        const n = new(discord[e("0x2c")])({
            transport: "ipc"
        });
        n.login({
            clientId: e("0x19")
        });
        var a = Date[e("0x1c")]();

        function i(t) {
            var o = e;
            n.setActivity({
                largeImageKey: o("0x2e"),
                largeImageText: o("0x7") + app.getVersion(),
                startTimestamp: a,
                details: "" + t
            })
        }
        n.once("connected", () => {
            i(t.f), setInterval(() => {
                ! function() {
                    var e = b;
                    let n = null;
                    switch (c(r[e("0x6c")][e("0x4a")]())) {
                        case e("0x2a"):
                            n = t.e;
                            break;
                        case "game":
                            n = t.b;
                            break;
                        case "spectate":
                            n = t.c;
                            break;
                        case e("0x22"):
                            n = t.d;
                            break;
                        default:
                            n = t.a
                    }
                    i(n)
                }()
            }, 1e3)
        })
    }();
    const l = require(o("0xa"));

    function c(e) {
        var t = o;
        if (-1 != e.indexOf(t("0x55"))) return t("0x5a");
        if (0 == e.includes("index.html")) return t("0x3f");
        switch ((e = e[t("0x77")]("/"))[e.length - 1][t("0x44")]("index.html" [t("0xd")])[t("0xd")]) {
            case 0:
                return "menu";
            case 1:
                return t("0x22");
            case 6:
                return t("0x52");
            case 15:
                return t("0x4");
            default:
                return "weird thing should die"
        }
    }
    l[o("0x54")](r, "F1", () => {
        var e = o;
        if (a) r[e("0x50")]("./index.html");
        else {
            let t = r[e("0x6c")][e("0x4a")]();
            r[e("0x58")](t)
        }
    }), a && l[o("0x54")](r, "F2", () => {
        var e = o;
        console[e("0x2")](e("0x0")),
            function() {
                var t = e;

                function n(e) {
                    var t = b;
                    return prompt({
                        title: e,
                        label: t("0x5f"),
                        value: o,
                        inputAttrs: {
                            type: t("0x3e")
                        },
                        type: t("0x21")
                    })
                }

                function a(e, t) {
                    var n = b;
                    let a = e[n("0x77")]("#"),
                        o = a[a.length - 1];
                    t ? r[n("0x58")](__dirname + n("0x15") + o) : r[n("0x58")](__dirname + n("0x24") + o)
                }
                let o = clipboard[t("0x27")]();
                if (-1 === o[t("0x4d")](t("0x26"))) {
                    o = t("0x68");
                    var i = dialog[t("0x69")](r, {
                        type: t("0x20"),
                        buttons: [t("0x67"), "Spectate"],
                        title: t("0x59"),
                        message: t("0x64"),
                        defaultId: 0,
                        cancelId: 3
                    });
                    0 === i ? n(t("0x67"))[t("0x60")](e => {
                        a(e, !1)
                    }) : 1 === i && n("Spectate")[t("0x60")](e => {
                        a(e, !0)
                    })
                } else 0 === i ? a(o, !1) : 1 === i && a(o, !0)
            }()
    }), l.register(r, o("0x34"), () => {
        var e = o;
        console[e("0x2")](e("0x39")), a ? app[e("0x43")]() : r[e("0x75")]()
    }), l[o("0x54")](r, o("0x5e"), () => {
        r[o("0x6c")].reloadIgnoringCache()
    }), l[o("0x54")](r, "F12", () => {
        var e = o;
        r[e("0x6c")][e("0x45")]()
    }), l.register(r, "F11", () => {
        var e = o;
        r.setSimpleFullScreen(!r[e("0x65")]())
    }), l.register(r, o("0x46"), () => {
        var e = o;
        r[e("0x6c")][e("0x1e")]("\n                  document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;\n                  document.exitPointerLock();\n\t\t")
    }), l[o("0x54")](r, "F10", () => {
        ! function() {
            var e = b;
            0 === dialog[e("0x69")](r, {
                type: e("0x20"),
                buttons: [e("0x1d")],
                title: e("0x6a"),
                message: "",
                defaultId: 0,
                cancelId: 2
            }) && function() {
                var t = e;
                if (config[t("0x9")](t("0x18"), !0)) var n = t("0x2d");
                else n = t("0x8"); if (config.get(t("0x72"), !0)) var a = t("0x8");
                else a = t("0x2d"); if (config.get(t("0xe"), !0)) var o = t("0x8");
                else o = t("0x2d");
                const i = dialog[t("0x69")](r, {
                    type: t("0x20"),
                    buttons: [n + " Frame Rate Limit Cap", a + t("0x3b"), o + t("0x14")],
                    title: t("0x6a"),
                    message: "",
                    defaultId: 0,
                    cancelId: 3
                });
                0 === i && (config[t("0x9")](t("0x18"), !0) ? config[t("0x41")](t("0x18"), !1) : config[t("0x41")](t("0x18"), !0), app[t("0x79")](), app.quit()), 1 === i && (config[t("0x9")](t("0x72"), !0) ? config[t("0x41")](t("0x72"), !1) : config[t("0x41")](t("0x72"), !0), app.relaunch(), app[t("0x43")]()), 2 === i && (config[t("0x9")](t("0xe"), !0) ? config[t("0x41")](t("0xe"), !1) : config[t("0x41")]("utilities_RPC", !0), app[t("0x79")](), app[t("0x43")]())
            }()
        }()
    }), r[o("0x6c")].on(o("0x33"), e => e.preventDefault()), r[o("0x6c")].on(o("0x73"), e => {
        var t = o;
        r[t("0x29")](t("0x7") + app.getVersion()), e.preventDefault()
    }), r[o("0x6c")].on(o("0x16"), (e, t) => {
        var n = o;
        switch (c(t)) {
            case n("0x5a"):
                e[n("0x6d")](), createInitWindow(t, !1, .75, !1);
                break;
            case n("0x3f"):
                e[n("0x6d")](), shell[n("0x23")](t)
        }
    })
}
null == config[C("0x9")](C("0x18")) && config.set(C("0x18"), !0), null == config[C("0x9")](C("0x72")) && config[C("0x41")](C("0x72"), !0), null == config.get(C("0xe")) && config.set(C("0xe"), !0), config[C("0x9")](C("0x18")) && (-1 != OS[C("0x4e")]()[C("0xb")](e => e[C("0x6e")][C("0x42")](C("0x36"))) && app.commandLine[C("0x76")](C("0x66")), app[C("0x47")][C("0x76")](C("0x74"))), config[C("0x9")](C("0x72")) ? (app.commandLine.appendSwitch(C("0x10"), C("0x53")), app[C("0x47")].appendSwitch(C("0x1f"))) : app[C("0x47")].appendSwitch("use-angle", C("0x3d")), app[C("0x47")][C("0x76")](C("0x1")), app[C("0x47")][C("0x76")]("ignore-gpu-blacklist"), app[C("0x47")][C("0x76")](C("0x3")), app[C("0x47")][C("0x76")]("enable-pointer-lock-options"), app[C("0x47")][C("0x76")](C("0x4b"), !1), app[C("0x47")][C("0x76")](C("0x5c"), C("0x32")), app[C("0x47")][C("0x76")](C("0x1")), app.commandLine.appendSwitch(C("0x38"), 1);
const {
    autoUpdater: autoUpdater
} = require(C("0x57"));
autoUpdater.logger = require(C("0x1a")), autoUpdater[C("0x2b")][C("0x63")][C("0x35")][C("0x1b")] = C("0x56"), autoUpdater.on(C("0x49"), () => {
    var e = C;
    console[e("0x2")](e("0x12"))
}), autoUpdater.on(C("0x5b"), () => {
    var e = C;
    dialog[e("0x30")]({
        type: e("0x56"),
        buttons: [e("0x40")],
        title: "NeXi-Client Update",
        message: e("0x11"),
        detail: e("0x3c")
    })[e("0x60")](t => {
        var n = e;
        0 === t.response && console[n("0x2")](n("0xc"))
    })
}), autoUpdater.on(C("0x13"), () => {
    var e = C;
    console[e("0x2")](e("0x5d"))
}), autoUpdater.on(C("0x78"), e => {
    var t = C;
    console[t("0x2")]("Download Speed: " + e[t("0x61")] + t("0x70") + e[t("0x6f")] + "/" + e[t("0x37")])
}), autoUpdater.on(C("0x48"), (e, t) => {
    var n = C;
    const a = {
        type: n("0x56"),
        buttons: ["Restart", n("0x71")],
        title: "Application Update",
        message: n("0x2f") === process.platform ? e : t,
        detail: n("0xf")
    };
    dialog[n("0x30")](a)[n("0x60")](e => {
        var t = n;
        0 === e[t("0x3a")] && autoUpdater[t("0x7a")]()
    })
}), autoUpdater.on("error", e => {
    console[C("0x2")](e)
}), app.on("ready", init);
