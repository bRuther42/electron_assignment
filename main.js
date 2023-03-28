const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const menu = require('./menu');

Menu.setApplicationMenu(menu);

let win;
app.on('ready',()=> {
    console.log("ARE YOU READAAAYYY!!!");

    const win = new BrowserWindow({
        width:1000, 
        height:605,  
        resizable: false, 
        fullscreenable: false, 
        webPreferences: {
            nodeIntegration: true, 
            contextIsolation: false 
        }
    });
    win.loadFile('index.html');    

    ipcMain.on('file-loaded-in', ()=> {
        Menu.getApplicationMenu().getMenuItemById('opt1').enabled = true;
        Menu.getApplicationMenu().getMenuItemById('opt2').enabled = true;
        Menu.getApplicationMenu().getMenuItemById('opt3').enabled = true;
    })

});

module.exports = {
    mainWindow: win
}

