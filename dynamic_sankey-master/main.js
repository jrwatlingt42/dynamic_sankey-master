const electron = require('electron');
const url = require('url');
const path = require('path');
const convert = require('convert-units');
const{app, BrowserWindow} = electron;

//SET ENV
process.env.Node_ENV = 'production';

let mainWindow;

//Listen for the app to be ready
app.on('ready', function(){

     mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainframe.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function () {
        mainWindow = null
    });

    mainWindow.maximize();
});