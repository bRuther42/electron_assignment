const { Menu, dialog } = require('electron');
const isMac = process.platform === 'darwin';
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static-electron');
const ffprobe = require('ffprobe-static-electron');
const ProgressBar = require('electron-progressbar');

// console.log(ffprobe.path);
ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobe.path);

let progressBar;
let selectedFilePath;
const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Video',
                submenu: [
                    {
                        label: 'Load...', 
                        click(_event,focusedWindow){
                            dialog.showOpenDialog(focusedWindow, {
                                properties: ['openFile'],
                                filters: [
                                    { name: 'Videos', extensions: ['mp4', 'webm', 'ogg', 'ogv', 'avi']}
                                ]
                            })
                            .then(fileObj=>{
                                console.log(fileObj)
                                if(fileObj.canceled){
                                    console.log('User cancelled')
                                }
                                else{
                                    selectedFilePath = fileObj.filePaths[0];
                                    console.log(`User selected ${selectedFilePath}`);
                                    focusedWindow.webContents.send('selected-file-path', selectedFilePath)
                                }
                            })
                        }
                    }, 
                    {type: "separator"},
                    {
                        label: "Convert to AVI...",
                        id: 'opt1',
                        enabled: false,
                        click(_event, focusedWindow){
                            dialog.showSaveDialog(focusedWindow, {
                                properties: ['showOverwriteConfirmation'],
                                title: 'Save Video AVI as...',
                                defaultPath: '../newAVI.avi',
                                buttonLabel: 'Save AVI',
                                filters: [
                                    {name: 'Video', extensions: ['avi']}
                                ],

                            })
                            .then(fileObj=> {
                                if(fileObj.canceled){
                                    console.log('User cancelled')
                                }
                                else{
                                    convertedFile = fileObj.filePath;
                                    progressBar = new ProgressBar({
                                        abortOnError: false,
                                        indeterminate: false,
                                        initialValue: 0,
                                        maxValue: 100,
                                        closeOnComplete: true,
                                        title: 'Conversion Progress',
                                        text: 'Converting AVI Video...',
                                        style: {
                                            text: {},
                                            detail: {'color': '#9C0B54'},
                                            bar: { 'width': '100%', 'background-color': '#FDBCDD', 'border': '2px solid #800644', 'border-radius': '10px'},
                                            value: {'background-color': '#F85FAC', 'border-radius': '10px'}
                                        },
                                        browserWindow: {
                                            parent: focusedWindow,
                                            modal: true,
                                            resizable: false,
                                            closable: false,
                                            minimizable: false,
                                            maximizable: false,
                                            width: 500,
                                            height: 170,
                                            webPreferences: {
                                                nodeIntegration: true
                                            }
                                        }
                                    });

                                    ffmpeg(selectedFilePath).toFormat('avi').on('progress', (progress)=> {                                
                                        console.log(parseInt(progress.percent) + '%');
                                        progressBar
                                        .on('completed', () => {
                                            // console.log(progressBar.isCompleted());
                                            // console.log('Progress Bar Completed');
                                            progressBar.detail = 'Task completed. Exiting...';
                                        })
                                        .on('ready', () => {
                                            console.log(progressBar.getOptions())
                                        })
                                        .on('aborted', (value) => {
                                            console.log(`aborted... ${value}`);
                                        })
                                        .on('progress', (value) => {
                                            progressBar.detail = `Value ${value} out of ${progressBar.getOptions().maxValue}...`;
                                        });
                                 
                                        if (!progressBar.isCompleted()) {
                                            progressBar.value = parseInt(progress.percent);
                                        }

                                    })
                                    .on('end', ()=> {
                                        console.log('File Successfully Converted');
                                    })
                                    .on('error', (error)=> {
                                        console.log(error);
                                    })
                                    .saveToFile(convertedFile);        
                                }
                            })
                        }
                    },
                    {
                        label: "Convert to MP4...",
                        id: 'opt2',
                        enabled: false,
                        click(_event, focusedWindow){
                            dialog.showSaveDialog(focusedWindow, {
                                properties: ['showOverwriteConfirmation'],
                                title: 'Save MP4 Video as...',
                                defaultPath: '../newMP4.mp4',
                                buttonLabel: 'Save MP4',
                                filters: [
                                    {name: 'Video', extensions: ['mp4']}
                                ],
                            })
                            .then(fileObj=> {
                                if(fileObj.canceled){
                                    console.log('User cancelled')
                                }
                                else{
                                    convertedFile = fileObj.filePath;
                                    progressBar = new ProgressBar({
                                        abortOnError: false,
                                        indeterminate: false,
                                        initialValue: 0,
                                        maxValue: 100,
                                        closeOnComplete: true,
                                        title: 'Conversion Progress',
                                        text: 'Converting MP4 Video...',
                                        style: {
                                            text: {},
                                            detail: {'color': '#9C0B54'},
                                            bar: { 'width': '100%', 'background-color': '#FDBCDD', 'border': '2px solid #800644', 'border-radius': '10px'},
                                            value: {'background-color': '#F85FAC', 'border-radius': '10px'}
                                        },
                                        browserWindow: {
                                            parent: focusedWindow,
                                            modal: true,
                                            resizable: false,
                                            closable: false,
                                            minimizable: false,
                                            maximizable: false,
                                            width: 500,
                                            height: 170,
                                            webPreferences: {
                                                nodeIntegration: true
                                            }
                                        }
                                    });

                                    ffmpeg(selectedFilePath).toFormat('mp4').on('progress', (progress)=> {
                                        console.log(parseInt(progress.percent) + '%');
                                        progressBar
                                        .on('completed', () => {
                                            // console.log(progressBar.isCompleted());
                                            // console.log('Progress Bar Completed');
                                            progressBar.detail = 'Task completed. Exiting...';
                                        })
                                        .on('ready', () => {
                                            console.log(progressBar.getOptions())
                                        })
                                        .on('aborted', (value) => {
                                            console.log(`aborted... ${value}`);
                                        })
                                        .on('progress', (value) => {
                                            progressBar.detail = `Value ${value} out of ${progressBar.getOptions().maxValue}...`;
                                        });
                                 
                                        if (!progressBar.isCompleted()) {
                                            progressBar.value = parseInt(progress.percent);
                                        }
                                    })
                                    .on('end', ()=> {
                                        console.log('File Successfully Converted');
                                    })
                                    .on('error', (error)=> {
                                        console.log(error);
                                    })
                                    .saveToFile(convertedFile);        
                                }
                            })
                        }
                    },
                    {
                        label: "Convert to WEBM...",
                        id: 'opt3',
                        enabled: false,
                        click(_event, focusedWindow){
                            dialog.showSaveDialog(focusedWindow, {
                                properties: ['showOverwriteConfirmation'],
                                title: 'Save Video webm as...',
                                defaultPath: '../newWEBM.webm',
                                buttonLabel: 'Save WEBM',
                                filters: [
                                    {name: 'Video', extensions: ['webm']}
                                ],
                            })
                            .then(fileObj=> {
                                if(fileObj.canceled){
                                    console.log('User cancelled')
                                }
                                else{
                                    convertedFile = fileObj.filePath;
                                    progressBar = new ProgressBar({
                                        abortOnError: false,
                                        indeterminate: false,
                                        initialValue: 0,
                                        maxValue: 100,
                                        closeOnComplete: true,
                                        title: 'Conversion Progress',
                                        text: 'Converting WEBM Video...',
                                        style: {
                                            text: {},
                                            detail: {'color': '#9C0B54'},
                                            bar: { 'width': '100%', 'background-color': '#FDBCDD', 'border': '2px solid #800644', 'border-radius': '10px'},
                                            value: {'background-color': '#F85FAC', 'border-radius': '10px'}
                                        },
                                        browserWindow: {
                                            parent: focusedWindow,
                                            modal: true,
                                            resizable: false,
                                            closable: false,
                                            minimizable: false,
                                            maximizable: false,
                                            width: 500,
                                            height: 170,
                                            webPreferences: {
                                                nodeIntegration: true
                                            }
                                        }
                                    });

                                    ffmpeg(selectedFilePath).toFormat('webm').on('progress', (progress)=> {
                                        console.log(parseInt(progress.percent) + '%');
                                        progressBar
                                        .on('completed', () => {
                                            // console.log(progressBar.isCompleted());
                                            // console.log('Progress Bar Completed');
                                            progressBar.detail = 'Task completed. Exiting...';
                                        })
                                        .on('ready', () => {
                                            console.log(progressBar.getOptions())
                                        })
                                        .on('aborted', (value) => {
                                            console.log(`aborted... ${value}`);
                                        })
                                        .on('progress', (value) => {
                                            progressBar.detail = `Value ${value} out of ${progressBar.getOptions().maxValue}...`;
                                        });
                                 
                                        if (!progressBar.isCompleted()) {
                                            progressBar.value = parseInt(progress.percent);
                                        }
                                    })
                                    .on('end', ()=> {
                                        console.log('File Successfully Converted');
                                    })
                                    .on('error', (error)=> {
                                        console.log(error);
                                    })
                                    .saveToFile(convertedFile);        
                                }
                            })
                        }
                    }
                ]
            },
            {type: 'separator'},
            isMac ? {role: 'close'} : {role: 'quit'}
        ]
    },
    {
        label: 'Developer',
        submenu: [
            {role: 'toggleDevTools'}
        ]
    }
];


module.exports = Menu.buildFromTemplate(template);

