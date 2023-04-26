const electronInstaller = require('electron-winstaller');

async function createWindowsInstaller() {
  try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: './out/quicktranslate-win32-x64', // Replace with the path to your app's build directory
      outputDirectory: './installer-output',
      authors: 'luodog',
      exe: 'quicktranslate.exe', // Replace with your app's .exe filename
    });
    console.log('Installer created successfully.');
  } catch (error) {
    console.error(`Error creating installer: ${error.message}`);
  }
}

createWindowsInstaller();
