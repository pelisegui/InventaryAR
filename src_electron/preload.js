const { contextBridge, ipcRenderer } = require('electron');

console.trace('preload.js loaded');

// whitelist channels
var validChannels = ["toMain", "fromMain", "invokeMain", "printToPDF", 'electronLogger']

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "apiKy", {
        sendApi: (channel, ...args) => { // sends arguments from Renderer Process to Main process
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, ...args);
            }
        },
        onApi: (channel, func) => { // gets arguments from Main Process
            if (validChannels.includes(channel)) {
                // Deliberately strip event in func as it includes 'sender'
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        invokeApi: (channel, ...args) => {
            if ( validChannels.includes(channel) ) {
                const result = ipcRenderer.invoke(channel, ...args);
                return result;
            };
        },
    }
);