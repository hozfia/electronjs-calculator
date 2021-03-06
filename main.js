// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 320,
        height: 480,
        transparent: true,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        },
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const ipc = require('electron').ipcMain;
const MAX_NUMBER_ON_DISPLAY = 10;
displayBus = '';

ipc.on('number', (event, args) => {
    console.log(args);
    console.log(displayBus.length);

    if (displayBus.length < MAX_NUMBER_ON_DISPLAY) {
        displayBus = displayBus.concat(args);
    }
    event.sender.send('asynReply', displayBus)
});

ipc.on('Enter', (event, args) => {
    console.log(args);
    if (displayBus) {
        try {
            result = eval(displayBus);
            displayBus = result.toString();
        } catch (error) {
            displayBus = 'ERRORS'
        }

    }
    event.sender.send('asynReply', result)
});

ipc.on('Clear', (event, args) => {
    console.log(args);
    displayBus = "";
    event.sender.send('asynReply', displayBus)
});