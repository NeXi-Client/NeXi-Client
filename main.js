require("v8-compile-cache");
const {
    app: app,
    shell: shell,
    clipboard: clipboard,
    dialog: dialog,
    BrowserWindow: BrowserWindow,
    screen: screen
} = require("electron"), discord = require("discord-rpc"), Store = require("electron-store"), config = new Store, OS = require("os"), prompt = require("electron-prompt");

function init() {
    createInitWindow(`file:///${__dirname}/index.html`, !0, 1.2, !0), autoUpdater.checkForUpdatesAndNotify()
}

function createInitWindow(e, t, n, i) {
    const {
        width: o,
        height: a
    } = screen.getPrimaryDisplay().workAreaSize;
    var l = new BrowserWindow({
        width: o * (n + 1.7),
        height: a * (n + 2.5),
        show: !0
    });
    l.setSimpleFullScreen(t), l.loadURL(e), l.removeMenu(), config.get("utilities_RPC") && i && function() {
        var e = {
            a: "Idling",
            b: "In a Game",
            c: "Spectating a Match",
            d: "Looking for a Game",
            e: "In Menu",
            f: "Loading..."
        };
        const t = new discord.Client({
            transport: "ipc"
        });
        t.login({
            clientId: "750116161890287657"
        });
        var n = Date.now();

        function i(e) {
            t.setActivity({
                largeImageKey: "nexi-client",
                largeImageText: `NeXi-Client V${app.getVersion()}`,
                startTimestamp: n,
                details: `${e}`
            })
        }
        t.once("connected", () => {
            i(e.f), setInterval(() => {
                ! function() {
                    let t = l.webContents.getURL(),
                        n = null;
                    switch (r(t)) {
                        case "menu":
                            n = e.e;
                            break;
                        case "game":
                            n = e.b;
                            break;
                        case "spectate":
                            n = e.c;
                            break;
                        case "searching for game":
                            n = e.d;
                            break;
                        default:
                            n = e.a
                    }
                    i(n)
                }()
            }, 1e3)
        })
    }();
    const s = require("electron-localshortcut");

    function r(e) {
        if (-1 != e.indexOf("social.venge.io")) return "social";
        if (0 == e.includes("index.html")) return "unknown";
        switch ((e = e.split("/"))[e.length - 1].substring("index.html".length).length) {
            case 0:
                return "menu";
            case 1:
                return "searching for game";
            case 6:
                return "game";
            case 15:
                return "spectate";
            default:
                return "weird thing should die"
        }
    }
    s.register(l, "F1", () => {
        if (i) l.loadFile("./index.html");
        else {
            let e = l.webContents.getURL();
            l.loadURL(e)
        }
    }), i && s.register(l, "F2", () => {
        console.log("Linkbox has been opened"),
            function() {
                function e(e) {
                    var t = prompt({
                        title: e,
                        label: "Please enter your Invite link here",
                        value: n,
                        inputAttrs: {
                            type: "url"
                        },
                        type: "input"
                    });
                    return t
                }

                function t(e, t) {
                    let n = e,
                        i = n.split("#"),
                        o = i[i.length - 1];
                    t ? l.loadURL(`${__dirname}/index.html#Spectate:${o}`) : l.loadURL(`${__dirname}/index.html#${o}`)
                }
                let n = clipboard.readText();
                if (-1 === n.indexOf("venge.io/#")) {
                    n = "https://venge.io/#00000";
                    var i = dialog.showMessageBoxSync(l, {
                        type: "question",
                        buttons: ["Play", "Spectate"],
                        title: "Join",
                        message: "Would you like to spectate or play?",
                        defaultId: 0,
                        cancelId: 3
                    });
                    0 === i ? e("Play").then(e => {
                        t(e, !1)
                    }) : 1 === i && e("Spectate").then(e => {
                        t(e, !0)
                    })
                } else 0 === i ? t(n, !1) : 1 === i && t(n, !0)
            }()
    }), s.register(l, "Alt+F4", () => {
        console.log("Quit has been used"), i ? app.quit() : l.close()
    }), s.register(l, "Ctrl+F5", () => {
        l.webContents.reloadIgnoringCache()
    }), s.register(l, "F12", () => {
        l.webContents.openDevTools()
    }), s.register(l, "F11", () => {
        l.setSimpleFullScreen(!l.isSimpleFullScreen())
    }), s.register(l, "ESC", () => {
        l.webContents.executeJavaScript("\n                  document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;\n                  document.exitPointerLock();\n\t\t")
    }), s.register(l, "F10", () => {
        ! function() {
            0 === dialog.showMessageBoxSync(l, {
                type: "question",
                buttons: ["General"],
                title: "Settings",
                message: "",
                defaultId: 0,
                cancelId: 2
            }) && function() {
                if (config.get("utilities_FPS", !0)) var e = "Enable";
                else var e = "Disable"; if (config.get("utilities_D3D11OND12", !0)) var t = "Disable";
                else var t = "Enable"; if (config.get("utilities_RPC", !0)) var n = "Disable";
                else var n = "Enable";
                const i = dialog.showMessageBoxSync(l, {
                    type: "question",
                    buttons: [`${e} Frame Rate Limit Cap`, `${t} D3D11OND12`, `${n} Discord RPC`],
                    title: "Settings",
                    message: "",
                    defaultId: 0,
                    cancelId: 3
                });
                0 === i && (config.get("utilities_FPS", !0) ? config.set("utilities_FPS", !1) : config.set("utilities_FPS", !0), app.relaunch(), app.quit());
                1 === i && (config.get("utilities_D3D11OND12", !0) ? config.set("utilities_D3D11OND12", !1) : config.set("utilities_D3D11OND12", !0), app.relaunch(), app.quit());
                2 === i && (config.get("utilities_RPC", !0) ? config.set("utilities_RPC", !1) : config.set("utilities_RPC", !0), app.relaunch(), app.quit())
            }()
        }()
    }), l.webContents.on("will-prevent-unload", e => e.preventDefault()), l.webContents.on("dom-ready", e => {
        l.setTitle(`NeXi-Client V${app.getVersion()}`), e.preventDefault()
    }), l.webContents.on("new-window", (e, t) => {
        switch (r(t)) {
            case "social":
                e.preventDefault(), createInitWindow(t, !1, .75, !1);
                break;
            case "unknown":
                e.preventDefault(), shell.openExternal(t)
        }
    })
}
null == config.get("utilities_FPS") && config.set("utilities_FPS", !0), null == config.get("utilities_D3D11OND12") && config.set("utilities_D3D11OND12", !0), null == config.get("utilities_RPC") && config.set("utilities_RPC", !0), config.get("utilities_FPS") && (-1 != OS.cpus().findIndex(e => e.model.includes("AMD")) && app.commandLine.appendSwitch("enable-zero-copy"), app.commandLine.appendSwitch("disable-frame-rate-limit")), config.get("utilities_D3D11OND12") ? (app.commandLine.appendSwitch("use-angle", "d3d11ond12"), app.commandLine.appendSwitch("enable-webgl2-compute-context")) : app.commandLine.appendSwitch("use-angle", "d3d9"), app.commandLine.appendSwitch("enable-quic"), app.commandLine.appendSwitch("ignore-gpu-blacklist"), app.commandLine.appendSwitch("disable-gpu-vsync"), app.commandLine.appendSwitch("enable-pointer-lock-options"), app.commandLine.appendSwitch("disable-accelerated-video-decode", !1), app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required"), app.commandLine.appendSwitch("enable-quic"), app.commandLine.appendSwitch("high-dpi-support", 1);
const {
    autoUpdater: autoUpdater
} = require("electron-updater");
autoUpdater.logger = require("electron-log"), autoUpdater.logger.transports.file.level = "info", autoUpdater.on("checking-for-update", () => {
    console.log("Checking for updates...")
}), autoUpdater.on("update-available", () => {
    dialog.showMessageBox({
        type: "info",
        buttons: ["Alright!"],
        title: "NeXi-Client Update",
        message: "New Version of NeXi-Client has been found",
        detail: "Please don't play any matches until the download is complete"
    }).then(e => {
        0 === e.response && console.log("User saw New Version message")
    })
}), autoUpdater.on("update-not-available", () => {
    console.log("Version is up-to-date")
}), autoUpdater.on("download-progress", e => {
    console.log(`Download Speed: ${e.bytesPerSecond} - Downloaded ${e.transferred}/${e.total}`)
}), autoUpdater.on("update-downloaded", (e, t) => {
    const n = {
        type: "info",
        buttons: ["Restart", "Later"],
        title: "Application Update",
        message: "win32" === process.platform ? e : t,
        detail: "A new version has been downloaded. Want to update the client now?"
    };
    dialog.showMessageBox(n).then(e => {
        0 === e.response && autoUpdater.quitAndInstall()
    })
}), autoUpdater.on("error", e => {
    console.log(e)
}), app.on("ready", init);
