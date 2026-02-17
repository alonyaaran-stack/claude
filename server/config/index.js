const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN,
  META_AD_ACCOUNT_ID: process.env.META_AD_ACCOUNT_ID,
  META_API_VERSION: 'v19.0',
  PORT: process.env.PORT || 3001,
};

/**
 * Validates that all required environment variables are set.
 * Exits the process with an error if any are missing.
 */
function validateConfig() {
  const required = ['META_ACCESS_TOKEN', 'META_AD_ACCOUNT_ID'];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please create a .env file based on .env.example');
    process.exit(1);
  }
}

module.exports = { config, validateConfig };
