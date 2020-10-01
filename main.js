require("v8-compile-cache");
const {
    app: app,
    shell: shell,
    clipboard: clipboard,
    dialog: dialog,
    BrowserWindow: BrowserWindow,
    screen: screen
} = require("electron"), prompt = require("electron-prompt"), discord = require("discord-rpc"), Store = require("electron-store"), config = new Store, OS = require("os"), shortcut = require("electron-localshortcut");
config.get("utilities_FPS", !0) && (-1 != OS.cpus().findIndex(e => e.model.includes("AMD")) && app.commandLine.appendSwitch("enable-zero-copy"), app.commandLine.appendSwitch("disable-frame-rate-limit")), config.get("utilities_useD3D11OND12", !0) && (app.commandLine.appendSwitch("use-angle", "d3d11ond12"), app.commandLine.appendSwitch("enable-webgl2-compute-context")), app.commandLine.appendSwitch("enable-quic"), app.commandLine.appendSwitch("ignore-gpu-blacklist"), app.commandLine.appendSwitch("disable-gpu-vsync"), app.commandLine.appendSwitch("enable-pointer-lock-options"), app.commandLine.appendSwitch("disable-accelerated-video-decode", !1), app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required"), app.commandLine.appendSwitch("enable-quic"), app.commandLine.appendSwitch("high-dpi-support", 1);
let initWin = null;

function init() {
    DiscordRPC(), createInitWindow("./index.html", !0, 1.2, !0)
}

function DiscordRPC() {
    const e = new discord.Client({
        transport: "ipc"
    });
    e.isConnected = !1, e.login({
        clientId: "750116161890287657"
    }), e.on("ready", () => {
        e.setActivity({
            state: "Playing Venge.io!",
            details: "https://discord.gg/vQZbaT6",
            startTimestamp: new Date,
            largeImageKey: "nexi-old"
        })
    })
}

function createInitWindow(e, t, n, i) {
    const {
        width: o,
        height: a
    } = screen.getPrimaryDisplay().workAreaSize;
    let l = new BrowserWindow({
        width: o * n,
        height: a * n,
        show: !1
    });
    l.setFullScreen(t), l.setTitle("NeXi-Client V1.2.8+ BETA"), l.once("ready-to-show", () => l.show()), -1 !== e.indexOf("https://") ? l.loadURL(e) : l.loadFile(e), l.removeMenu(), CheckGame(l), shortcut.register(l, "F1", () => {
        if (i) l.loadFile("./index.html");
        else {
            let e = l.getURL();
            l.loadURL(e)
        }
    }), i && shortcut.register(l, "F2", () => {
        console.log("Linkbox has been opened"), LinkBox()
    }), shortcut.register(l, "Alt+F4", () => {
        l.webContents.executeJavaScript(onbeforeunload = null), console.log("Quit has been used"), i ? app.quit() : l.close()
    }), shortcut.register(l, "Ctrl+F5", () => {
        l.webContents.reloadIgnoringCache()
    }), shortcut.register(l, "F9", () => {
        l.webContents.openDevTools(), console.log("DevTools opened")
    }), shortcut.register(l, "F11", () => {
        l.setSimpleFullScreen(!l.isSimpleFullScreen())
    }), shortcut.register(l, "ESCAPE", () => {
        l.webContents.executeJavaScript("\n                  document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;\n                  document.exitPointerLock();\n\t\t")
    }), shortcut.register(l, "=", () => {
        createInitWindow("https://social.venge.io", !1, .9, !1)
    }), l.webContents.on("will-prevent-unload", e => {
        l.webContents.executeJavaScript("\n\t\tonbeforeunload = null;\n\t\t"), e.preventDefault()
    })
}

function createSettingsWindow() {
    const e = dialog.showMessageBoxSync(initWin, {
        type: "question",
        buttons: ["General", "In-game"],
        title: "Settings",
        message: "",
        defaultId: 0,
        cancelId: 2
    });
    0 === e ? openGeneralSettings() : 1 === e && openGameSettings()
}

function CheckGame(e) {
    String.prototype.isGame = function() {
        return /index.html/.test(this, "")
    }, String.prototype.isSocial = function() {
        return /https:\/\/social.venge.io\//.test(this, "")
    };
    let t = (e, t) => {
        e.preventDefault(), t.isGame() ? initWin.loadURL(t) : t.isSocial() ? createInitWindow(t, !1, .9, !1) : shell.openExternal(t)
    };
    e.webContents.on("new-window", t), e.webContents.on("will-navigate", t)
}

function LinkBox() {
    function e(e) {
        return prompt({
            title: e,
            label: "Please enter your Invite link here",
            value: i,
            inputAttrs: {
                type: "url"
            },
            type: "input"
        })
    }

    function t() {
        return dialog.showMessageBoxSync(initWin, {
            type: "question",
            buttons: ["Play", "Spectate"],
            title: "Join",
            message: "Would you like to spectate or play?",
            defaultId: 0,
            cancelId: 2
        })
    }

    function n(e, t) {
        let n = e.split("#"),
            i = n[n.length - 1],
            o = win.webContents.getURL().split("/");
        o[o.length - 1] = t ? `index.html#Spectate:${i}` : `index.html#${i}`;
        let a = o.join("/");
        console.log(a), initWin.loadURL(a)
    }
    let i = clipboard.readText();
    if (-1 === i.indexOf("venge.io/#")) {
        i = "https://venge.io/#00000";
        let o = t();
        0 === o ? e("Play").then(e => {
            n(e, !1)
        }) : 2 !== o && e("Spectate").then(e => {
            n(e, !0)
        })
    } else {
        let e = t();
        0 === e ? n(i, !1) : 2 !== e && n(i, !0)
    }
}
app.on("ready", init);
