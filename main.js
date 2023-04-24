const { app, BrowserWindow, globalShortcut, clipboard } = require('electron');
const robot = require('robotjs');

try {
  require('electron-reloader')(module);
} catch (_) {}


let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 500,
    show: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

async function translateText(inputText, from, to) {
    try {
      const apiUrl = 'https://64442ac615a2696458879a4e--coruscating-pavlova-daa411.netlify.app/.netlify/functions/translate-api';
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText, from, to }),
      });
  
      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
      }
  
      const result = await response.json();
      return result.translatedText;
    } catch (error) {
      console.error(error);
      return null;
    }
}

app.whenReady().then(() => {
    createWindow();
  
    const shortcut = 'Control+Q';
  
    globalShortcut.register(shortcut, async () => {
      clipboard.writeText('');
  
      robot.keyTap('c', 'control'); // Simulate Ctrl+C to copy the highlighted text
  
      let clipboardContent = '';
  
      // Add a loop to wait for the clipboard content to be updated
      while (!clipboardContent) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        clipboardContent = clipboard.readText();
      }
  
      if (win) {
        const translatedText = await translateText(clipboardContent, 'auto', 'en');
        win.webContents.send('displayText', translatedText);
        win.show();
      }
    });
     // Add a small delay to give the system time to copy the text to the clipboard

  
    app.on('activate', () => {
      if (!win) {
        createWindow();
      }
    });
  });
  

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
