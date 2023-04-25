const { ipcRenderer } = require('electron');
const fs = require('fs');


function addInfoButtonListener() {
  document.querySelectorAll('.menu li')[1].addEventListener('click', () => {
    showInfoPage();
  });
}

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

function loadContent(filename) {
  fetch(filename)
    .then((response) => response.text())
    .then((html) => {
      const pageContainer = document.querySelector('.page-container');
      pageContainer.innerHTML = html;
    })
    .catch((error) => {
      console.warn('Error loading content:', error);
    });
}

// Add this function to set up event listeners for the buttons
function addButtonListeners() {
  const homeButton = document.querySelector('.menu li:nth-child(1) a');
  const infoButton = document.querySelector('.menu li:nth-child(2) a');
  const settingsButton = document.querySelector('.menu li:nth-child(3) a');

  homeButton.addEventListener('click', () => {
    loadContent('main-page.html');
  });

  infoButton.addEventListener('click', () => {
    loadContent('info.html');
  });

  settingsButton.addEventListener('click', () => {
    loadContent('settings.html');
  });
}

// Modify the window.onload function to include the languageSelectionListener
window.onload = () => {
  addCloseButtonListener();
  languageSelectionListener();
  addButtonListeners();
};
