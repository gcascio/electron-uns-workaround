
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { chdir } = require('process');

/**
 * Give everybody the permission to read and execute chrome-sandbox.
 * 
 * @param {Object} obj - AfterPackContext.
 * @param {string} obj.appOutDir - Directory of unpacked app.
 */
const setSandboxPermission = ({ appOutDir }) =>
  execSync(`chmod 4755 ${path.join(appOutDir, 'chrome-sandbox')}`);

/**
 * Add loader script to unpacked app for AppImages and Snaps
 * 
 * @param {Object} obj - AfterPackContext.
 */
const disableSandboxing = (context) => {
  const needsCheck = context.targets.find((target) => target.name === 'appImage' || target.name === 'snap');

  if (!needsCheck) {
    return;
  }

  const appName = context.packager.appInfo.name.replace('/', '');
  const originalDir = process.cwd();
  const dirname = context.appOutDir;

  chdir(dirname);

  // Rename generated entry file
  execSync(`mv ${appName} ${appName}.bin`);

  // Create loader script with original entry file name
  const loaderScript = fs.readFileSync(path.join(originalDir, 'scripts/ensure-uns-loader.sh'), 'utf8');
  fs.writeFileSync(appName, loaderScript.replace('$APP_NAME', appName));
  execSync(`chmod +x ${appName}`);

  chdir(originalDir);
};

exports.default = (context) => {
  const platformName = context.electronPlatformName.toLowerCase();
  if (platformName === 'linux') {
    setSandboxPermission(context);
    disableSandboxing(context);
  }
};
