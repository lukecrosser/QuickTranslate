const keybindInput = document.getElementById('keybind');
const setKeybindButton = document.getElementById('setKeybind');
const keypressDisplay = document.getElementById('keypressDisplay');

console.log("hi");

function handleKeydown(e) {
  e.preventDefault();
  const key = e.key === ' ' ? 'Space' : e.key; // Replace ' ' with 'Space'
  const ctrl = e.ctrlKey ? 'Ctrl+' : '';
  const shift = e.shiftKey ? 'Shift+' : '';
  const alt = e.altKey ? 'Alt+' : '';

  keybindInput.value = `${ctrl}${shift}${alt}${key}`;
  document.removeEventListener('keydown', handleKeydown);
}

setKeybindButton.addEventListener('click', () => {
  keypressDisplay.innerHTML = 'Press your desired key combination...';
  document.addEventListener('keydown', handleKeydown);
});

keybindInput.addEventListener('blur', () => {
  keypressDisplay.innerHTML = '';
});