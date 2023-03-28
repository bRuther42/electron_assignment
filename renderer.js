const {ipcRenderer} = require('electron');


ipcRenderer.on('selected-file-path', (_event, value)=> {
    console.log(value);
    document.querySelector('#videoDisplay').src = value;
    document.querySelector('.js-player').load();
    ipcRenderer.send('file-loaded-in');
});

