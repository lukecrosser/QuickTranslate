module.exports = {
  packagerConfig: {
    ignore: (filePath) => {
      // List of folders to ignore
      const foldersToIgnore = [
        /installer-output/, // Replace folder1, folder2, folder3 with the actual folder names
        /release-builds/, // Ignore the 'src' folder
      ];

      // Check if filePath matches any of the folders to ignore
      return foldersToIgnore.some((pattern) => pattern.test(filePath));
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
