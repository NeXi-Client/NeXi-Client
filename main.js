require('v8-compile-cache');

// !!!!! MADE BY NEXI2K, URBAN, SYN7AX, AND MAYBE IZZIBABY (IDK) !!!!!

const {
    app, shell, clipboard, dialog, BrowserWindow, screen
} = require('electron');
const prompt = require('electron-prompt');
const discord = require('discord-rpc');
const Store = require('electron-store');
const config = new Store();
const OS = require('os');
const log = require('electron-log')
const { autoUpdater } = require('electron-updater');
const shortcut = require('electron-localshortcut');
const { dir } = require('path');
const { link } = require('fs');
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';
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
    createInitWindow('./index.html', true, 1.2, true);
    autoUpdater.checkForUpdatesAndNotify();
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
    // !!!!! MINOR CHANGES DONE TO RPC (MORE TO COME (HOPEFULLY)) !!!!!
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
                largeImageKey: 'nexi-client',
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
            if (url === null){
                url = rpc.user.username;
                activity = 'Idling';
            }
            if (isMain){
                if (url.indexOf('index.html#')!== -1){
                    let arr1 = url.split('#');
                    let inviteCode = arr1[arr1.length - 1];
                    let arr2 = [undefined];
                    arr2[arr2.length - 1] = `https://venge.io/#${inviteCode}`;
                    url = arr2;
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

    // !!!!! REGISTERS SHORTCUTS !!!!!
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

    // !!!!! DECIDED TO STICK WITH DIALOG, MENU.HTML CAN COME LATER (I SUCK AT CSS) !!!!!
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

    // !!!!! ASKS FOR LINK !!!!!
    function LinkBox() {
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

        // !!!!! CHOOSE BETWEEN PLAY AND SPECTATE !!!!!
        function question() {
            const choice = dialog.showMessageBoxSync(initWin, {
                type: 'question',
                buttons: ['Play', 'Spectate'],
                title: 'Join',
                message: 'Would you like to spectate or play?',
                defaultId: 0,
                cancelId: 3,
            });
            return choice;
        }

        // !!!!! LOADS NEW URL !!!!!
        function isPaste(message, isSpectate) {
            let inputUrl = message;
            let arr1 = inputUrl.split('#');
            let inviteCode = arr1[arr1.length - 1];
            let currentURL = initWin.webContents.getURL();
            let arr2 = currentURL.split('/');
            if (isSpectate) {
                arr2[arr2.length - 1] = `index.html#Spectate:${inviteCode}`;
            } else {
                arr2[arr2.length - 1] = `index.html#${inviteCode}`;
            }
            let newUrl = arr2.join('/');

            console.log(newUrl)
            initWin.loadURL(newUrl);
        }

        // !!!!! CHECKS IF LINK IS ALREADY COPIED !!!!!
        let paste = clipboard.readText();
        if (paste.indexOf('venge.io/#') === -1) {
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
    } 
}

//---------------------------------------------
//----------------Auto-Updater-----------------
//---------------------------------------------

autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
});
autoUpdater.on('update-available', (info) => {
    console.log('Update available');
    console.log('Version', info.version);
    console.log('Release Date', info.releaseDate);
});
autoUpdater.on('update-not-available', () => {
    console.log('Version is up-to-date');
});
autoUpdater.on('download-pregress', (progress) => {
    console.log('Download Speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.transferred} + '/' ${progressObj.total}');
});
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
     }

     dialog.showMessageBox(dialogOpts).then((returnValue) => {
       if (returnValue.response === 0) autoUpdater.quitAndInstall()
     })
   })
autoUpdater.on('error', (error) => {})

app.on('ready', init)