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
const { dir } = require('path');
const { link } = require('fs');
//Add Window to check :D

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

function init() {
    //createInitWindow('./loading.html', true, 1, true);
    createInitWindow('./index.html', true, 1.2, true);
}


//Create Start Window
function createInitWindow(url, isFullScreen, Size, isMain) {
    const {
        width, height
    } = screen.getPrimaryDisplay().workAreaSize;
    let initWin = new BrowserWindow({
        width: width * Size,
        height: height * Size,
        show: false,

    });

    initWin.setFullScreen(isFullScreen);
   
    initWin.once('ready-to-show', (event) => {
        initWin.setTitle('NeXi-Client V1.2.9');
        event.preventDefault();
        initWin.show();
    });
    if (url.indexOf('https://') !== -1) {
        initWin.loadURL(url);
    } else {
        initWin.loadFile(url);
    }
    initWin.removeMenu()
    CheckGame(initWin);
   
    if (config.get('utilities_RPC') && isMain){
        DiscordRPC();
    }
    //Just calls Discord RP (WIP).
    function DiscordRPC() {
        const rpc = new discord.Client({
            transport: 'ipc'
        })
        rpc.isConnected = false;
        rpc.login({
            'clientId': '750116161890287657'
        })
        rpc.isConnected = true;
        rpc.on("ready", () => {
            rpc.setActivity({
                largeImageKey: 'nexi-old',
                details: `${rpc.user.username}`,
                state: `Started Playing`,
            })
            
            setInterval(() => {
                updateDiscord();
            }, 1000);
            
        });
        function updateDiscord(){
            url = initWin.webContents.getURL();
            let activity = 'In Menu';
            if (isMain){
                if (url.indexOf('index.html#')!== -1){
                    let arr1 = url.split('/');
                    let inviteCode = arr1[arr1.length - 1];
                    inviteCode = inviteCode.replace('index.html#','');
                    let currentUrl = 'https://venge.io/#';
                    let arr2 = currentUrl.split(']');
                    arr2[arr2.length - 1] = `https://venge.io/#${inviteCode}`;
                    newUrl = arr2.join(']');
                    
                    url = newUrl;  
                    activity = 'Playing Venge.io!';
                    
                }
                else {
                    if (url.indexOf('index.html') !== -1){
                        url = rpc.user.username;
                    }
                }
            }

            rpc.setActivity({
                largeImageKey: 'nexi-old',
                details: `${url}`,
                state: `${activity}`,
            })
        
        }
    }
    shortcut.register(initWin, 'F1', () => {
        if (!isMain) {
            let URL = initWin.webContents.getURL();
            initWin.loadURL(URL);
        } else {
            initWin.loadFile('./index.html');
        }

    })
    if (isMain) {
        shortcut.register(initWin, 'F2', () => {
            console.log('Linkbox has been opened'), LinkBox()
        })
    }
    shortcut.register(initWin, 'Alt+F4', () => {
        initWin.webContents.executeJavaScript(onbeforeunload = null);
        console.log('Quit has been used');
        if (isMain) {
            app.quit();
        } else {
            initWin.close();
        }
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
    shortcut.register(initWin, 'ESC', () => {
        initWin.webContents.executeJavaScript(`
                  document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
                  document.exitPointerLock();
		`);
    })
    shortcut.register(initWin, '=', () => {
            createInitWindow('https://social.venge.io', false, 0.9, false)
        })
    shortcut.register(initWin, 'F10', ()=> {
        createSettingsWindow();
    })
    initWin.webContents.on('will-prevent-unload', (event) => {
        initWin.webContents.executeJavaScript(`
		onbeforeunload = null;
		`)
        event.preventDefault();
    })

    //Creating foundation (WIP, I may use HTML instead) for SettingsWindow
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
            if (config.get('utilities_FPS') == null){
                config.set('utilities_FPS',true);
            };
            if (config.get('utilities_D3D11OND12') == null){
                config.set('utilities_D3D11OND12',true);
            };
            if (config.get('utilities_RPC') == null){
                config.set('utilities_RPC',true);
            };
            const options = dialog.showMessageBoxSync(initWin, {
                type: 'question',
                buttons: ['Enable / Disable Frame Rate Limit', 'Enable / Disable D3D11OND12', 'Enable / Disable RPC'],
                title: 'Settings',
                message: '',
                defaultId: 0,
                cancelId: 3
            });
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
            /*if (options===2){
            if (config.get('ScopeURL',true)){
                var Scope = prompt({
                    title: 'Scope Input',
                    label: 'Please enter your Scope Link here',
                    value: null,
                    inputAttrs: {
                        type: 'url'
                    },
                    type: 'input'
                })
                config.set('utilities_scopeURL',Scope);
        }
    }*/
        }
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
                initWin.loadURL(url);
                return url;
            } else {
                if (url.isSocial()) {
                    createInitWindow(url, false, 0.9, false);
                    return url;
                } else {
                    shell.openExternal(url);
                    return url;
                }
            }
        };

        window.webContents.on('new-window', nav);
        window.webContents.on('will-navigate', nav);

    }

    //Asks for link and inputs it.
    function LinkBox() {
        //var isChecked = false;
        //Prompts user for input.
        function input(msg) {
            var prompting = prompt({
                title: msg,
                label: 'Please enter your Invite link here',
                value: paste,
                inputAttrs: {
                    type: 'url'
                },
                type: 'input'
            })
            return prompting;
        }

        //Asks the person to choose between 'Play and Spectate'.
        function question() {
            const choice = dialog.showMessageBoxSync(initWin, {
                type: 'question',
                buttons: ['Play', 'Spectate'],
                title: 'Join',
                message: 'Would you like to spectate or play?',
                defaultId: 0,
                cancelId: 3,
                //checkboxLabel: "Do not show this message again.",
                //checkboxChecked: false,
            });
            //isChecked = choice.checkboxChecked;
            return choice;
        }

        //Loads new URL.
        function isPaste(message, isSpectate) {
            let inputUrl = message;
            let arr1 = inputUrl.split('#');
            let inviteCode = arr1[arr1.length - 1];

            let currentUrl = initWin.webContents.getURL();
            let arr2 = currentUrl.split('/');
            if (isSpectate) {
                arr2[arr2.length - 1] = `index.html#Spectate:${inviteCode}`;
            } else {
                arr2[arr2.length - 1] = `index.html#${inviteCode}`;
            }
            let newUrl = arr2.join('/');

            console.log(newUrl)
            initWin.loadURL(newUrl);
        }

        //Check if link is already copied.

        let paste = clipboard.readText();
        if (paste.indexOf('venge.io/#') === -1) {
            if (!isChecked) {
                paste = 'https://venge.io/#00000';
                let choice = question();

                if (choice === 0) {
                    input("Play")
                        .then((r) => {
                            isPaste(r, false);
                        });
                } else {
                    if (choice === 1) {
                        input("Spectate")
                            .then((r) => {
                                isPaste(r, true);
                            });
                    }

                }

            } else {
                input("Play")
                    .then((r) => {
                        isPaste(r, false);
                    });
            }
        } else {
            let choice = question();
            if (choice === 0) {
                isPaste(paste, false);
            } else {
                if (choice !== 2) {
                    isPaste(paste, true);
                };
            }
        }

    };
}

app.on('ready', init)
