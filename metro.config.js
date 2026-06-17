// // metro.config.js
// const { getDefaultConfig } = require('expo/metro-config');

// const config = getDefaultConfig(__dirname);

// // Supprimez complètement withNativeWind pour l'instant
// module.exports = config;

// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ajouter cette ligne pour résoudre le problème
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...config.transformer?.minifierConfig,
    mangle: false,
  },
};

module.exports = config;