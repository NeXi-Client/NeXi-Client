require('v8-compile-cache');

// !!!!! MADE BY NEXI2K, URBAN, SYN7AX, AND MAYBE IZZIBABY (IDK) !!!!!

const {
    app, shell, clipboard, dialog, BrowserWindow, screen
} = require('electron');
const discord = require('discord-rpc');
const {
    createSettingsWindow, fps_boost, config
} = require('./nexi-client');
const prompt = require('electron-prompt');

fps_boost();
function init() {
    createInitWindow('./index.html', true, 1.2, true);
    autoUpdater.checkForUpdatesAndNotify();
}

//Create Start Window
function createInitWindow(url, isFullScreen, Size, isMain) {
    const {
        width, height
    } = screen.getPrimaryDisplay().workAreaSize;
    var initWin = new BrowserWindow({
        width: width * Size,
        height: height * Size,
        show: false,
    });
    initWin.setFullScreen(isFullScreen);
    initWin.once('ready-to-show', (event) => {
        initWin.setTitle('NeXi-Client V1.2.9');
        event.preventDefault();
        setTimeout(() => {
            initWin.show();
        }, 800)
    });
    if (url.indexOf('https://') !== -1) {
        initWin.loadURL(url);
    } else {
        initWin.loadFile(url);
    }
    initWin.removeMenu();
    CheckGame(initWin);

    if (config.get('RPC') && isMain){
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
                largeImageText: 'NeXi-Client',
                details: `NeXi-Client`,
                state: `Started Playing`,
            })

            setInterval(() => {
                updateDiscord();
            }, 5000);

        });
        function updateDiscord(){
            url = initWin.webContents.getURL();
            let arr = url.split('#');
            if (arr.length == 1){
                url = rpc.user.username;
            }
            else {
                arr = arr[arr.length - 1];
                let newURL = `https://venge.io/#${arr}`;
                url = newURL;
            }
            let activity = 'In Menu';
            if (url === null){
                url = rpc.user.username;
            }
            if (isMain){
               if (url.indexOf('index.html#Spectate') !== -1){ 
                   activity = 'Spectating a Match';
               }
               else {
                   if (url.indexOf('index.html#') !== -1){
                       a = url.split('#');
                       let code = a[a.length - 1];
                       if (code.length > 0){
                           activity = 'In a Match';
                       }
                       else {
                            activity = 'Joining a Game...';
                       }
                   }
                   else {
                       if (url.indexOf('index.html') !== -1){
                           activity = 'In Menu' || 'Idling';
                       }
                   }
               }
            }

            rpc.setActivity({
                largeImageKey: 'nexi-client',
                largeImageText: 'NeXi-Client',
                details: `${url}`,
                state: `${activity}`,
            })

        }
    }

    // !!!!! REGISTERS SHORTCUTS !!!!!
    const shortcut = require('electron-localshortcut');
    shortcut.register(initWin, 'F1', () => {
        if (!isMain) {
            let URL = initWin.webContents.getURL();
            initWin.loadURL(URL);
        } else {
            let URL = initWin.webContents.getURL();
            if (URL.indexOf('index.html#') === -1){
                initWin.loadURL(`${__dirname}/index.html#Spectate:00000000000000000`);
            }
            else {
                initWin.loadURL(`${__dirname}/index.html`);
            }
        }

    })
    if (isMain) {
        shortcut.register(initWin, 'F2', () => {
            console.log('Linkbox has been opened'), LinkBox()
        })
    }
    shortcut.register(initWin, 'Alt+F4', () => {
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
    shortcut.register(initWin, 'F10', ()=> {
        createSettingsWindow();
    })
    initWin.webContents.on('will-prevent-unload', (event) => {
        initWin.webContents.executeJavaScript(`
		onbeforeunload = null;
		`)
        event.preventDefault();
    })

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

    /*
    ------------------------------------------------------------
    ----------------Asks for link and Inputs it-----------------
    ------------------------------------------------------------
    */
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
            newUrl = `${__dirname}/index.html#${inviteCode}`;
            if (isSpectate){
                newUrl = `${__dirname}/index.html#Spectate${inviteCode}`;
            }
            console.log(newUrl);
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
            let choice = question();
            if (choice === 0){
                isPaste(paste,false)
            }
            else {
                if (choice === 1){
                    isPaste(paste,true)
                }
            }
        }
    } 
}
/*
---------------------------------------------
----------------Auto-Updater-----------------
---------------------------------------------
*/
const { autoUpdater } = require('electron-updater');
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
});
autoUpdater.on('update-available', (info) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Alright!'],
        title: 'NeXi-Client Update',
        message: 'New Version of NeXi-Client has been released',
        detail: 'It will be downloaded in the background and notify you when the download is finished.'
       }
  
       dialog.showMessageBox(dialogOpts).then((returnValue) => {
         if (returnValue.response === 0)
         console.log('User saw New Version message')
       })
});
autoUpdater.on('update-not-available', () => {
    console.log('Version is up-to-date');
});
autoUpdater.on('download-progress', (progress) => {
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
autoUpdater.on('error', (error) => {
    console.log(error)
})

app.on('ready', init)
