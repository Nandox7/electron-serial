const electron = require('electron');
const path = require('path')

const { app, BrowserWindow } = electron

require('electron-reload')(__dirname);

let mainWindow

app.on('ready', _ => {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 400
    })
    mainWindow.loadURL(`file://${__dirname}/list.html`);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    
})

app.on('close', _ => {
    mainWindow = null
})