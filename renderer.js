const { ipcRenderer } = require('electron');

ipcRenderer.on('displayText', (_, text) => {
  document.getElementById('display').textContent = text;
});

function addCloseButtonListener() {
  document.getElementById('closeButton').addEventListener('click', () => {
    ipcRenderer.send('close-app');
  });
}

window.onload = addCloseButtonListener;