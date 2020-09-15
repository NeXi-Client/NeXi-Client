const { app } = require('electron')
const { BrowserWindow } = require('electron')
const { globalShortcut } = require('electron')
const { dialog } = require('electron')
const prompt = require('electron-prompt')
const RPC = require('discord-rpc')
const isDev = require('electron-is-dev')
const appVersion = app.getVersion()

app.commandLine.appendSwitch('disable-frame-rate-limit')
app.commandLine.appendSwitch('disable-gpu-vsync')
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-breakpad');
app.commandLine.appendSwitch('disable-component-update');
app.commandLine.appendSwitch('disable-print-preview');
app.commandLine.appendSwitch('disable-metrics');
app.commandLine.appendSwitch('disable-metrics-repo');
app.commandLine.appendSwitch('smooth-scrolling');
app.commandLine.appendSwitch('enable-javascript-harmony');
app.commandLine.appendSwitch('enable-future-v8-vm-features');
app.commandLine.appendSwitch('disable-hang-monitor');
app.commandLine.appendSwitch('no-referrers');
app.commandLine.appendSwitch('disable-2d-canvas-clip-aa');
app.commandLine.appendSwitch('disable-bundled-ppapi-flash');
app.commandLine.appendSwitch('disable-logging');
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('webrtc-max-cpu-consumption-percentage=100');
app.commandLine.appendSwitch('enable-pointer-lock-options');
app.commandLine.appendSwitch('disable-accelerated-video-decode', false);
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')
app.commandLine.appendSwitch('enable-quic');
app.commandLine.appendSwitch('high-dpi-support',1);

function init()
{
	DiscordRPC();
	createWindow();
	shortCuts();
	Leave();
}

function DiscordRPC()
{
	const rpc = new RPC.Client({ transport: "ipc" });
	rpc.on("ready", () => {
		rpc.setActivity({
			state: 'Playing Venge.io',
			startTimestamp: new Date(),
			largeImageKey: 'nexi-old',
		})
	});

	console.log("Rich presence is now active")

	rpc.login({ clientId: "750116161890287657" })
}

//Erstellt das Fenster für Venge.io
function createWindow()
{
	win = new BrowserWindow({ 
		width: 1920, height: 1080, icon: "files/game.png" 
		})
	win.loadFile('index.html')
	win.setFullScreen(true)
	win.removeMenu(true)
	win.setTitle('NeXi-Client')
	win.on('page-title-updated', function(e) { e.preventDefault() })
	console.log('Window has been created')
}

function Leave()
{
	win.webContents.on('will-prevent-unload', (event) => {
        const choice = dialog.showMessageBoxSync(win, {
            type: 'question',
            buttons: ['Leave', 'Stay'],
            title: 'Are you sure you want to leave?',
            message: 'You are in the middle of the game currently.',
            defaultId: 0,
            cancelId: 1
        });
        const leave = (choice === 0)
        if (leave) {
            event.preventDefault();

        };
    })
}

function shortCuts()
{
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
	globalShortcut.register('Ctrl+F5',() =>{
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
	console.log('Shortcuts has been registered')
}

//Funktion damit die Linkbox erstellt wird
function LinkBox()
{	
	const choice = dialog.showMessageBoxSync(win, {
		type: 'question',
		buttons: ['Play', 'Spectate'],
		title: 'Join',
		message: 'Would you like to spectate or join?',
		defaultId: 0,
		cancelId: 2
	});
	const link = (choice === 0)
	if (link) {
		prompt({
			title: 'Play',
			label: 'Please enter your Invite link here',
			value: 'https://venge.io/#00000',
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
				let arr2= currentUrl.split('/');
				
				arr2[arr2.length - 1] = `index.html#${inviteCode}`;
				
				let newUrl = arr2.join('/');
				
				console.log(newUrl)
				win.loadURL(newUrl);
			});
		}
	else {
		if (choice !== 2) {
			prompt({
				title: 'Spectate',
				label: 'Please enter your Invite link here',
				value: 'https://venge.io/#00000',
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
					let arr2= currentUrl.split('/');
					
					arr2[arr2.length - 1] = `index.html#Spectate:${inviteCode}`;
					
					let newUrl = arr2.join('/');
					
					console.log(newUrl)
					win.loadURL(newUrl);
				});
			}
		}
	};


	

app.on('ready', init)
