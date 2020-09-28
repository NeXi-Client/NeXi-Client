const {
    app, shell, clipboard, dialog, BrowserWindow, globalShortcut
} = require('electron');
const prompt = require('electron-prompt');
const discord = require('discord-rpc');
const Store = require('electron-store');
const config = new Store();
const OS = require('os');

//Add Window to check :D
//In progress, leave me along D:
if (config.get('utilities_FPS', true)){
    if (OS.cpus().findIndex(cpu => cpu.model.includes("AMD")) != -1){
        app.commandLine.appendSwitch('enable-zero-copy');
    }
    app.commandLine.appendSwitch('disable-frame-rate-limit');
}
if (config.get('utilities_useD3D9',true)){
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
    createWindow('./index.html');
    shortCuts();
    CheckGame();
    leave();
   
}

function DiscordRPC() {
    const rpc = new discord.Client({ transport: 'ipc' })
    rpc.isConnected = false;
    rpc.login({ 'clientId': '750116161890287657'})
    rpc.on("ready", () => {
        rpc.setActivity({
            state: 'Playing Venge.io!',
            details: "https://discord.gg/vQZbaT6",
            startTimestamp: new Date(),
            largeImageKey: 'nexi-old',
        })
            
   
    });

    app.once('before-quit', () => {
        if (rpc.destroy) rpc.destroy().catch(console.error);
        shortcut.unregisterAll();
        gameWindow.close();
    console.log("Rich presence is now active")
    
})
}


function UpdateRPC(){
    
}
//Create window
function createWindow(url) {
    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        icon: "files/game.png"
    })
    if (url.indexOf('https://') !== -1) {
        win.loadURL(url);
    }
    else {
        win.loadFile(url);
    }
    
    win.setFullScreen(true)
    win.removeMenu(true)
    win.setTitle('NeXi-Client')
    win.on('page-title-updated', function(e) {
        e.preventDefault()
    })
    console.log('Window has been created')

}

function CheckGame() {
    String.prototype.isVenge = function(){
        var VENGE_REGEX = /index.html/;
        return VENGE_REGEX.test(this, '')
    }
    String.prototype.isSocial = function(){
        var SOCIAL_REGEX = /https:\/\/social.venge.io\//; //Messy bad but lazy lol
        return SOCIAL_REGEX.test(this, '')
    }
    let nav = (e, url) => {
        e.preventDefault();
        if (url.isVenge()) {
            win.loadURL(url);
        } else {
            if (url.isSocial()){
                createWindow(url);
            }
            else {
                shell.openExternal(url);
            }
        }
    };

    win.webContents.on('new-window', nav);
    win.webContents.on('will-navigate', nav);

}

//For people who do not like the client:

var toggle = 0;
function SwitchToDefault(){
    //Kinda useless feature but will do for now, until I can come up with a window to fix this.
    //Inefficient but will do for now. Bad code but lazy so deal with it.
    if (toggle == 1){
        toggle = 0;
        win.loadFile('index.html');
    }
    else {
        toggle = 1;
        win.loadURL('https://venge.io');
    }
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
    if (paste.indexOf('venge.io/#') === -1){
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
    }
    else {
        const choice = dialog.showMessageBoxSync(win, {
            type: 'question',
            buttons: ['Play', 'Spectate'],
            title: 'Join',
            message: 'Would you like to spectate or play?',
            defaultId: 0,
            cancelId: 2
        });
        if (choice === 0){
            let inputUrl = paste;
            let arr1 = inputUrl.split('#');
            let inviteCode = arr1[arr1.length - 1];

            let currentUrl = win.webContents.getURL();
            let arr2 = currentUrl.split('/');

            arr2[arr2.length - 1] = `index.html#${inviteCode}`;

            let newUrl = arr2.join('/');

            console.log(newUrl)
            win.loadURL(newUrl);
        }
        else{
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
function shortCuts() {
    globalShortcut.register('F1', () => {
        win.loadFile('index.html'), console.log('Loading assets')
    })
    globalShortcut.register('F2', () => {
        console.log('Linkbox has been opened'), LinkBox()
    })
    globalShortcut.register('Alt+F4', () => {
        win.webContents.executeJavaScript(onbeforeunload = null),
            console.log('Quit has been used'),
            app.exit(0)
    })
    globalShortcut.register('Ctrl+F5', () => {
        win.webContents.reloadIgnoringCache();
    })
    globalShortcut.register('F9', () => {
        win.webContents.openDevTools(),
            console.log('DevTools opened')
    })
    globalShortcut.register('F11', () => {
        win.setSimpleFullScreen(!win.isSimpleFullScreen())
    })
    globalShortcut.register('ESCAPE', () => {
        win.webContents.executeJavaScript(`
                  document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
                  document.exitPointerLock();
		`);
    })
    /*
    globalShortcut.register('`', () => {
        
        SwitchToDefault();
    })
    
    globalShortcut.register('=', () => {
        createWindow('https://social.venge.io')
    })
    */
    console.log('Shortcuts has been registered')
}
app.on('ready', init)
