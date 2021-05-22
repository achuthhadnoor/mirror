// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray } = require('electron');
const { askForCameraAccess } = require('node-mac-permissions');
const { join } = require('path')
const { ipcMain } = require('electron')

let tray,browserWin;

const createWindow = ()=>{
  browserWin = new BrowserWindow({
    frame:false,
    alwaysOnTop:true,
    width:450,
    height:300,
    webPreferences:{
      nodeIntegration:true,
      contextIsolation:false,
      devTools:true,
      preload:join(__dirname,'preload.js')
    }
  })
  browserWin.on("resized",(t)=>{
    console.log(browserWin.getBounds())
  })
  browserWin.loadFile('index.html') ;
  browserWin.webContents.openDevTools();
}

function createTray() {
  // Create the browser window.
  tray = new Tray(join(__dirname, 'appTemplate.png'));
  tray.on('click', () => {
  if(browserWin.isVisible()){
    browserWin.hide();
    browserWin.webContents.send('asynchronous-message', 'STOP_VIDEO');
  } 
  else{
    browserWin.show();
    browserWin.webContents.send('asynchronous-message', 'SHOW_VIDEO');
  }
  
  })
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
  createTray()
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

