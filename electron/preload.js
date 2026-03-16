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

  openGitk: (projectPath) =>
    ipcRenderer.invoke('open-gitk', { projectPath }),

  selectFolder: () =>
    ipcRenderer.invoke('dialog:open-folder'),

  removeListeners: () => {
    ipcRenderer.removeAllListeners('ps:out')
    ipcRenderer.removeAllListeners('ps:err')
    ipcRenderer.removeAllListeners('ps:done')
  },

  update: {
    onChecking:      (cb) => ipcRenderer.on('update:checking',     (_e)        => cb()),
    onAvailable:     (cb) => ipcRenderer.on('update:available',    (_e, ver)   => cb(ver)),
    onNotAvailable:  (cb) => ipcRenderer.on('update:not-available',(_e)        => cb()),
    onProgress:      (cb) => ipcRenderer.on('update:progress',     (_e, pct)   => cb(pct)),
    onDownloaded:    (cb) => ipcRenderer.on('update:downloaded',   (_e)        => cb()),
    onError:         (cb) => ipcRenderer.on('update:error',        (_e, msg)   => cb(msg)),
    download:        ()   => ipcRenderer.invoke('update:download'),
    install:         ()   => ipcRenderer.invoke('update:install'),
  }
})
