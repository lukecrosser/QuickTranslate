const { ipcRenderer } = require('electron');

ipcRenderer.on('displayText', (_, text) => {
  document.getElementById('display').textContent = text;
});

function addCloseButtonListener() {
  document.getElementById('closeButton').addEventListener('click', () => {
    ipcRenderer.send('close-app');
  });
}

function requestRetranslation() {
  ipcRenderer.send('retranslate', document.getElementById('display').textContent);
}

// Add this function at the end of the renderer.js file
function languageSelectionListener() {
  const languageSelect = document.querySelector('select');
  languageSelect.addEventListener('change', () => {
    ipcRenderer.send('language-selected', languageSelect.value);
    requestRetranslation();
  });
}

// Modify the window.onload function to include the languageSelectionListener
window.onload = () => {
  addCloseButtonListener();
  languageSelectionListener();
};
