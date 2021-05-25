// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu } = require('electron');
const { join } = require('path')
const { ipcMain } = require('electron')
const Store = require('electron-store');
const AutoLaunch = require('auto-launch');

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit();
}


let tray, browserWin, isAutolaunch = true;

let store = new Store();

var _autoLaunch = new AutoLaunch({
  name: 'Mirror',
  path: '/Applications/Mirror.app',
});

const createWindow = () => {
  browserWin = new BrowserWindow({
    frame: false,
    alwaysOnTop: true,
    width: 450,
    height: 300,
    maxWidth: 800,
    maxHeight: 800,
    transparent: true,
    fullscreenable: false, 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  browserWin.setVisibleOnAllWorkspaces(true,{visibleOnFullScreen:true})
  browserWin.setAlwaysOnTop(true,"floating",1);
  browserWin.on("resized", (t) => {
    console.log(browserWin.getBounds())
  })
  browserWin.loadFile('index.html'); 
  // browserWin.webContents.openDevTools();
}

function createTray() {
  // Create the browser window.
  tray = new Tray(join(__dirname, 'appTemplate.png'));
  tray.setToolTip('Mirror | Camera preview')
  tray.on('click', () => {
    if (browserWin.isVisible()) {
      browserWin.hide();
      browserWin.webContents.send('asynchronous-message', 'STOP_VIDEO');
    }
    else {
      browserWin.show();
      browserWin.webContents.send('asynchronous-message', 'SHOW_VIDEO');
    }
  })
  tray.on('right-click', () => {
    let template = [
      {
        label: 'launch on startup',
        type: 'checkbox',
        checked: isAutolaunch,
        click: () => {
          isAutolaunch = !isAutolaunch
          isAutolaunch ? _autoLaunch.enable() : _autoLaunch.disable();
          store.set("mirrorApp", { autolaunch: isAutolaunch })
        }
      },
      { type: 'separator' },
      {
        role: "quit"
      },
    ]
    const menu = Menu.buildFromTemplate(template);
    tray.popUpContextMenu(menu);
  })
}

if (store.get('mirrorApp')) {
  let _store = store.get('mirrorApp');
  isAutolaunch = _store.autolaunch;
}
else {
  store.set('mirrorApp', { autolaunch: true })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  try {
    createWindow();
  }
  catch {
    app.quit();
  }
  createTray();
  _autoLaunch.isEnabled().then((isEnabled) => {
    if (isEnabled) {
      return;
    }
    _autoLaunch.enable();
  });
})
if (app.dock) {
  app.dock.hide();
}
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('quit', () => {
  app.quit();
})
