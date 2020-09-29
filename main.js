require('v8-compile-cache');
const {
    app, shell, clipboard, dialog, BrowserWindow, screen
} = require('electron');
const prompt = require('electron-prompt');
const discord = require('discord-rpc');
const Store = require('electron-store');
const config = new Store();
const OS = require('os');
const shortcut = require('electron-localshortcut');
//Add Window to check :D

if (config.get('utilities_FPS', true)) {
    if (OS.cpus().findIndex(cpu => cpu.model.includes("AMD")) != -1) {
        app.commandLine.appendSwitch('enable-zero-copy');
    }
    app.commandLine.appendSwitch('disable-frame-rate-limit');
}
if (config.get('utilities_useD3D11OND12', true)) {
    app.commandLine.appendSwitch('use-angle', 'd3d11ond12');
    app.commandLine.appendSwitch('enable-webgl2-compute-context');
}
app.commandLine.appendSwitch('enable-quic');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-gpu-vsync')
app.commandLine.appendSwitch('enable-pointer-lock-options');
app.commandLine.appendSwitch('disable-accelerated-video-decode', false);
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')
app.commandLine.appendSwitch('enable-quic');
app.commandLine.appendSwitch('high-dpi-support', 1);

function init() {

    DiscordRPC();
    createGameWindow('./index.html', true);
    leave();

}

function DiscordRPC() {
    const rpc = new discord.Client({
        transport: 'ipc'
    })
    rpc.isConnected = false;
    rpc.login({
        'clientId': '750116161890287657'
    })
    rpc.on("ready", () => {
        rpc.setActivity({
            state: 'Playing Venge.io!',
            details: "https://discord.gg/vQZbaT6",
            startTimestamp: new Date(),
            largeImageKey: 'nexi-old',
        })


    });
}



function createGameWindow(url, FullScreen) {
    // Create Venge.io Window.
    const {
        width, height
    } = screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({
        width: width,
        height: height,
        icon: "files/game.png",
        webPreferences: {
            nodeIntergration: true,
            webSecurity: true
        }
    })

    win.setFullScreen(FullScreen);
    win.removeMenu(true);
    win.setTitle('NeXi-Client');

    if (url.indexOf('https://') !== -1) {
        win.loadURL(url);
    } else {
        win.loadFile(url);
    }
    CheckGame(win);
    shortCuts(win);

}

//MESSY but fixes bugs so whatever.
function createInitWindow(url, FullScreen) {
    const {
        width, height
    } = screen.getPrimaryDisplay().workAreaSize;
    let initWin = new BrowserWindow({
        width: width * 0.7,
        height: height * 0.8,
        show: false,

    });

    initWin.setFullScreen(FullScreen);
    initWin.once('ready-to-show', () => initWin.show());
    initWin.loadURL(url);
    initWin.removeMenu()
    CheckGame(initWin);
    shortcut.register(initWin, 'F1', () => {
        let URL = initWin.getURL();
        initWin.loadURL(URL);
        console.log('Loading assets');
    })
    shortcut.register(initWin, 'F2', () => {
        console.log('Linkbox has been opened'), LinkBox()
    })
    shortcut.register(initWin, 'Alt+F4', () => {
        initWin.webContents.executeJavaScript(onbeforeunload = null),
            console.log('Quit has been used'),
            initWin.close();
    })
    shortcut.register(initWin, 'Ctrl+F5', () => {
        initWin.webContents.reloadIgnoringCache();
    })
    shortcut.register(initWin, 'F9', () => {
        initWin.webContents.openDevTools(),
            console.log('DevTools opened')
    })
    shortcut.register(initWin, 'F11', () => {
        initWin.setSimpleFullScreen(!initWin.isSimpleFullScreen())
    })
    shortcut.register(initWin, 'ESCAPE', () => {
            initWin.webContents.executeJavaScript(`
                  document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
                  document.exitPointerLock();
                  this.app.mouse.disablePointerLock();
		`);
        })
        /*shortcut.register(initWin,'`', () => {
        
        SwitchToDefault();
    })*/
    shortcut.register(initWin, '=', () => {
        createInitWindow('https://social.venge.io', false)
    })


}

function CheckGame(window) {
    String.prototype.isGame = function() {
        var VENGE_REGEX = /index.html/;
        return VENGE_REGEX.test(this, '')
    }
    String.prototype.isSocial = function() {
        var SOCIAL_REGEX = /https:\/\/social.venge.io\//;
        return SOCIAL_REGEX.test(this, '')
    }
    let nav = (event, url) => {
        event.preventDefault();
        if (url.isGame()) {
            win.loadURL(url);
        } else {
            if (url.isSocial()) {
                createInitWindow(url, false);
            } else {
                shell.openExternal(url);
            }
        }
    };

    window.webContents.on('new-window', nav);
    window.webContents.on('will-navigate', nav);

}





function leave() {
    win.webContents.on('will-prevent-unload', (event) => {
        win.webContents.executeJavaScript(`
		onbeforeunload = null;
		`)
        event.preventDefault();
    })
}

//Asks for link and inputs it.
function LinkBox() {

    let paste = clipboard.readText();
    if (paste.indexOf('venge.io/#') === -1) {
        paste = 'https://venge.io/#00000';
        const choice = dialog.showMessageBoxSync(win, {
            type: 'question',
            buttons: ['Play', 'Spectate'],
            title: 'Join',
            message: 'Would you like to spectate or play?',
            defaultId: 0,
            cancelId: 2
        });


        if (choice === 0) {
            prompt({
                    title: 'Play',
                    label: 'Please enter your Invite link here',
                    value: paste,
                    inputAttrs: {
                        type: 'url'
                    },
                    type: 'input'
                })
                .then((r) => {
                    let inputUrl = r;
                    let arr1 = inputUrl.split('#');
                    let inviteCode = arr1[arr1.length - 1];

                    let currentUrl = win.webContents.getURL();
                    let arr2 = currentUrl.split('/');

                    arr2[arr2.length - 1] = `index.html#${inviteCode}`;

                    let newUrl = arr2.join('/');

                    console.log(newUrl)
                    win.loadURL(newUrl);
                });
        } else {
            if (choice !== 2) {
                prompt({
                        title: 'Spectate',
                        label: 'Please enter your Invite link here',
                        value: paste,
                        inputAttrs: {
                            type: 'url'
                        },
                        type: 'input'
                    })
                    .then((r) => {
                        let inputUrl = r;
                        let arr1 = inputUrl.split('#');
                        let inviteCode = arr1[arr1.length - 1];

                        let currentUrl = win.webContents.getURL();
                        let arr2 = currentUrl.split('/');

                        arr2[arr2.length - 1] = `index.html#Spectate:${inviteCode}`;

                        let newUrl = arr2.join('/');

                        console.log(newUrl)
                        win.loadURL(newUrl);
                    });
            }
        }
    } else {
        const choice = dialog.showMessageBoxSync(win, {
            type: 'question',
            buttons: ['Play', 'Spectate'],
            title: 'Join',
            message: 'Would you like to spectate or play?',
            defaultId: 0,
            cancelId: 2
        });
        if (choice === 0) {
            let inputUrl = paste;
            let arr1 = inputUrl.split('#');
            let inviteCode = arr1[arr1.length - 1];

            let currentUrl = win.webContents.getURL();
            let arr2 = currentUrl.split('/');

            arr2[arr2.length - 1] = `index.html#${inviteCode}`;

            let newUrl = arr2.join('/');

            console.log(newUrl)
            win.loadURL(newUrl);
        } else {
            if (choice !== 2) {

                let inputUrl = paste;
                let arr1 = inputUrl.split('#');
                let inviteCode = arr1[arr1.length - 1];

                let currentUrl = win.webContents.getURL();
                let arr2 = currentUrl.split('/');

                arr2[arr2.length - 1] = `index.html#Spectate:${inviteCode}`;

                let newUrl = arr2.join('/');

                console.log(newUrl)
                win.loadURL(newUrl);
            };
        }
    }

};

//Shortcuts
function shortCuts(window) {
    shortcut.register(window, 'F1', () => {
        win.loadFile('index.html'),
            console.log('Back to menu.')
    })
    shortcut.register(win, 'F2', () => {
        console.log('Linkbox has been opened.'), LinkBox()
    })
    shortcut.register(window, 'Alt+F4', () => {
        window.webContents.executeJavaScript(onbeforeunload = null),
            console.log('Quit has been used.');
        app.exit(0);
        win = null;
        initWin = null;
    })
    shortcut.register(window, 'Ctrl+F5', () => {
        window.webContents.reloadIgnoringCache();
    })
    shortcut.register(window, 'F9', () => {
        window.webContents.openDevTools(),
            console.log('DevTools opened')
    })
    shortcut.register(window, 'F11', () => {
        window.setSimpleFullScreen(!window.isSimpleFullScreen())
    })
    shortcut.register(window, 'ESCAPE', () => {
            window.webContents.executeJavaScript(`
                  document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
                  document.exitPointerLock();
                  this.app.mouse.disablePointerLock();
		`);
        })
        /*shortcut.register(window,'`', () => {
        
        SwitchToDefault();
    })*/
    shortcut.register(window, '=', () => {
        createInitWindow('https://social.venge.io', false)
    })

    console.log('Shortcuts has been registered')
}
app.on('ready', init)
