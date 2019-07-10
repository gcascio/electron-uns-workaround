const {app, BrowserWindow} = require('electron');
const path = require('path');

let mainWindow;

function createMainWindow () {   
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
       
  mainWindow.loadURL('https://github.com');
}      

app.on('ready', createMainWindow);
