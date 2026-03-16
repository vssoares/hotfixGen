const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  run: (action, version, projectPath, extra = {}) =>
    ipcRenderer.invoke('run-command', { action, version, projectPath, ...extra }),

  onOut: (callback) =>
    ipcRenderer.on('ps:out', (_event, data) => callback(data)),

  onErr: (callback) =>
    ipcRenderer.on('ps:err', (_event, data) => callback(data)),

  onDone: (callback) =>
    ipcRenderer.on('ps:done', (_event, code) => callback(code)),

  selectFolder: () =>
    ipcRenderer.invoke('dialog:open-folder'),

  openGitk: (projectPath) =>
    ipcRenderer.invoke('open-gitk', { projectPath }),

  removeListeners: () => {
    ipcRenderer.removeAllListeners('ps:out')
    ipcRenderer.removeAllListeners('ps:err')
    ipcRenderer.removeAllListeners('ps:done')
  }
})
