require('v8-compile-cache');

// !!!!! MADE BY NEXI2K, URBAN, SYN7AX, AND MAYBE IZZIBABY (IDK) !!!!!

const
{
	app,
	shell,
	clipboard,
	dialog,
	BrowserWindow,
	screen
} = require('electron');
const discord = require('discord-rpc');
const
{
	createSettingsWindow,
	fps_boost,
	config
} = require('./nexi-client');
const prompt = require('electron-prompt');

fps_boost();

function init()
{
	createInitWindow(`file:///${__dirname}/index.html`, true, 1.2, true);
	autoUpdater.checkForUpdatesAndNotify();
}

//Create Start Window
function createInitWindow(url, isFullScreen, Size, isMain)
{
	const
	{
		width,
		height
	} = screen.getPrimaryDisplay().workAreaSize;
	var initWin = new BrowserWindow(
	{
		width: width * (Size + 1.7),
		height: height * (Size + 2.5),
		show: true,
	});
	initWin.setSimpleFullScreen(isFullScreen);
	initWin.loadURL(url);
	initWin.removeMenu();
	
	if (config.get('utilities_RPC') && isMain)
	{
		DiscordRPC();
	}
	function DiscordRPC()
	{
		//Change Variables Below if Given Permission to Do So. Yes, yes, Urban is the best, save it for later.
		var c = {a:'Idling',b:'In a Game',c:'Spectating a Match',d:'Looking for a Game', e:'In Menu',f:'Loading...'};
		const rpc = new discord.Client(
		{
			transport: 'ipc'
		})
		rpc.login(
		{
			'clientId': '750116161890287657'
		})
		var date = Date.now();
		rpc.once("connected", () =>
		{
			setRPCActivity(c.f);
			setInterval(() =>
			{
				updateDiscord();
			}, 1e3);

		});

		function setRPCActivity(msg){	
			rpc.setActivity(
				{
					largeImageKey: 'nexi-client',
					largeImageText: `NeXi-Client V${app.getVersion()}`,
					startTimestamp: date,
					details: `${msg}`,
				})
		}
		function updateDiscord()
		{
			let url = initWin.webContents.getURL();
			let e = null;
			let determineURL = checkURL(url);
			switch (determineURL){
				case 'menu': e = c.e; break;
				case 'game': e = c.b; break;
				case 'spectate': e = c.c; break;
				case 'searching for game': e = c.d; break;
				default: e = c.a; break;
			}
			
			setRPCActivity(e);

		}
	}
	// !!!!! REGISTERS SHORTCUTS !!!!!
	const shortcut = require('electron-localshortcut');
	shortcut.register(initWin, 'F1', () =>
	{
		if (!isMain)
		{
			let URL = initWin.webContents.getURL();
			initWin.loadURL(URL);
		}
		else
		{
			initWin.loadFile('./index.html');
		}

	})
	if (isMain)
	{
		shortcut.register(initWin, 'F2', () =>
		{
			console.log('Linkbox has been opened'), LinkBox()
		})
	}
	shortcut.register(initWin, 'Alt+F4', () =>
	{
		console.log('Quit has been used');
		if (isMain)
		{
			app.quit();
		}
		else
		{
			initWin.close();
		}
	})
	shortcut.register(initWin, 'Ctrl+F5', () =>
	{
		initWin.webContents.reloadIgnoringCache();
	})
	shortcut.register(initWin, 'F12', () =>
	{
		initWin.webContents.openDevTools();
	})
	shortcut.register(initWin, 'F11', () =>
	{
		initWin.setSimpleFullScreen(!initWin.isSimpleFullScreen());
	})
	shortcut.register(initWin, 'ESC', () =>
	{
		initWin.webContents.executeJavaScript(`
                  document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
                  document.exitPointerLock();
		`);
	})
	shortcut.register(initWin, 'F10', () =>
	{
		createSettingsWindow();
	})
	initWin.webContents.on('will-prevent-unload', (event) => event.preventDefault())
	initWin.webContents.on('dom-ready', (event) =>
	{
		initWin.setTitle(`NeXi-Client V${app.getVersion()}`);
		event.preventDefault();
	})
	initWin.webContents.on('new-window', (event, url) => {
		let e = checkURL(url);
		switch(e){
			case 'social': event.preventDefault(); createInitWindow(url,false,0.75,false); break;
			case 'unknown': event.preventDefault(); shell.openExternal(url); break;
		}
	})

	function checkURL(url){
		if (url.indexOf('social.venge.io') != -1) return 'social';
		if (url.includes('index.html') == false) return 'unknown';
		url = url.split('/');
		let newURL = url[url.length - 1];
		let path = newURL.substring('index.html'.length);
		switch (path.length){
			case 0: return 'menu';
			case 1: return 'searching for game';
			case 6: return 'game';
			case 15: return 'spectate';
			default: return 'weird thing should die'
		}
	}
	/*
	------------------------------------------------------------
	----------------Asks for link and Inputs it-----------------
	------------------------------------------------------------
	*/
	function LinkBox()
	{
		function input(msg)
		{
			var prompting = prompt(
			{
				title: msg,
				label: 'Please enter your Invite link here',
				value: paste,
				inputAttrs:
				{
					type: 'url'
				},
				type: 'input'
			})
			return prompting;
		}

		// !!!!! CHOOSE BETWEEN PLAY AND SPECTATE !!!!!
		function question()
		{
			const choice = dialog.showMessageBoxSync(initWin,
			{
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
		function isPaste(message, isSpectate)
		{
			let inputUrl = message;
			let arr1 = inputUrl.split('#');
			let inviteCode = arr1[arr1.length - 1];

			if (isSpectate)
			{
				initWin.loadURL(`${__dirname}/index.html#Spectate:${inviteCode}`);
			}
			else
			{
				initWin.loadURL(`${__dirname}/index.html#${inviteCode}`);
			}
		}

		// !!!!! CHECKS IF LINK IS ALREADY COPIED !!!!!
		let paste = clipboard.readText();
		if (paste.indexOf('venge.io/#') === -1)
		{
			paste = 'https://venge.io/#00000';
			let choice = question();

			if (choice === 0)
			{
				input("Play")
					.then((r) =>
					{
						isPaste(r, false);
					});
			}
			else
			{
				if (choice === 1)
				{
					input("Spectate")
						.then((r) =>
						{
							isPaste(r, true);
						});
				}
			}
		}
		else
		{
			let choice = question();
			if (choice === 0)
			{
				isPaste(paste, false)
			}
			else
			{
				if (choice === 1)
				{
					isPaste(paste, true)
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
const
{
	autoUpdater
} = require('electron-updater');
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.on('checking-for-update', () =>
{
	console.log('Checking for updates...');
});
autoUpdater.on('update-available', () =>
{
	const dialogOpts = {
		type: 'info',
		buttons: ['Alright!'],
		title: 'NeXi-Client Update',
		message: 'New Version of NeXi-Client has been found',
		detail: "Please don't play any matches until the download is complete"
	}

	dialog.showMessageBox(dialogOpts).then((returnValue) =>
	{
		if (returnValue.response === 0)
			console.log('User saw New Version message')
	})
});
autoUpdater.on('update-not-available', () =>
{
	console.log('Version is up-to-date');
});
autoUpdater.on('download-progress', (progressObj) =>
{
	console.log(`Download Speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.transferred}/${progressObj.total}`);
});
autoUpdater.on('update-downloaded', (releaseNotes, releaseName) =>
{
	const dialogOpts = {
		type: 'info',
		buttons: ['Restart', 'Later'],
		title: 'Application Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version has been downloaded. Want to update the client now?'
	}

	dialog.showMessageBox(dialogOpts).then((returnValue) =>
	{
		if (returnValue.response === 0) autoUpdater.quitAndInstall()
	})
})
autoUpdater.on('error', (error) =>
{
	console.log(error)
})

app.on('ready', init)
