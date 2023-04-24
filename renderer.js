const { ipcRenderer } = require('electron');

ipcRenderer.on('displayText', (_, text) => {
  document.getElementById('display').textContent = text;
});
