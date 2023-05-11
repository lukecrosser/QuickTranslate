const keybindInput = document.getElementById('keybind');
const setKeybindButton = document.getElementById('setKeybind');
const keypressDisplay = document.getElementById('keypressDisplay');
const settings = require('electron-settings');


function handleKeydown(e) {
  e.preventDefault();
  
  // Ignore the 'Control', 'Shift', and 'Alt' keys themselves
  if (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt') {
    return;
  }

  const key = e.key === ' ' ? 'Space' : e.key; // Replace ' ' with 'Space'
  const ctrl = e.ctrlKey ? 'Ctrl+' : '';
  const shift = e.shiftKey ? 'Shift+' : '';
  const alt = e.altKey ? 'Alt+' : '';

  keybindInput.value = `${ctrl}${shift}${alt}${key}`;
  document.removeEventListener('keydown', handleKeydown);
  keypressDisplay.innerHTML = '';
   // Clear the display message
}


keybindInput.addEventListener('focus', () => {
  keypressDisplay.innerHTML = 'Press your desired key combination...';
  document.addEventListener('keydown', handleKeydown);
});

keybindInput.addEventListener('blur', () => {
  keypressDisplay.innerHTML = '';
  ipcRenderer.send('update-shortcut', keybindInput.value);

});
