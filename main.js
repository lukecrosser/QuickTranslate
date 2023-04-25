const { app, BrowserWindow,  Tray, nativeImage, Menu, globalShortcut, clipboard, ipcMain } = require('electron');
const robot = require('robotjs');
const fetch = require('node-fetch');
const AutoLaunch = require('auto-launch');
const settings = require('electron-settings');
const path = require('path');

let tray;

// Check if the auto-launch setting exists; if not, set it to true by default
if (!settings.has('autoLaunch')) {
  settings.set('autoLaunch', true);
}

const autoLauncher = new AutoLaunch({
  name: 'QuickTranslate',
  path: app.getPath('exe'),
  isHidden: true,
});

autoLauncher.isEnabled().then((isEnabled) => {
  const autoLaunch = settings.get('autoLaunch');

  if (isEnabled && !autoLaunch) {
    autoLauncher.disable();
  } else if (!isEnabled && autoLaunch) {
    autoLauncher.enable();
  }
});

try {
  require('electron-reloader')(module);
} catch (_) {}

function getMousePosition() {
  const mousePos = robot.getMousePos();
  return { x: mousePos.x, y: mousePos.y };
}

let win;

//close button
ipcMain.on('close-app', () => {
  win.hide();
});

// Add this code after the 'close-app' listener in main.js
let targetLanguage = 'en';

ipcMain.on('language-selected', (_, language) => {
  targetLanguage = language;
});

ipcMain.on('retranslate', async (_, text) => {
  if (text) {
    const translatedText = await translateText(text, 'auto', targetLanguage);
    win.webContents.send('displayText', translatedText);
  }
});

app.disableHardwareAcceleration();

function createTray() {
  const trayIconPath = path.join(__dirname, 'qtlogo.png');
 // Replace with your tray icon path

  // Create a native image from the icon path
  const trayIcon = nativeImage.createFromPath(trayIconPath);

  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => {
        win.show();
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('QuickTranslate');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    win.show();
  });
}

const appIconPath = path.join(__dirname, 'qtlogo.png');

function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 350,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    transparent: true,
    frame: false,
    backgroundColor: '#00000000',
    icon: appIconPath, // Add this line for a transparent background color
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
    createTray();
  
    
    const shortcut = 'Control+Q';
  
    globalShortcut.register(shortcut, async () => {
      clipboard.writeText('');
    
      robot.keyTap('c', 'control'); // Simulate Ctrl+C to copy the highlighted text
    
      let clipboardContent = '';
    
      // Add a loop to wait for the clipboard content to be updated
      // Add a loop to wait for the clipboard content to be updated
      while (!clipboardContent) {
        await new Promise((resolve) => setTimeout(resolve, 100));
          clipboardContent = clipboard.readText();
      }

// Add a small delay before performing the translation
      
    
      if (win) {
        const translatedText = await translateText(clipboardContent, 'auto', targetLanguage);
        win.webContents.send('displayText', translatedText);
        
        // Get the mouse position and set the window position accordingly
        const { x, y } = getMousePosition();
        win.setPosition(x, y);
        
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
  
});
