const execSync = require('child_process').execSync;

function getLatestVersion() {
  return JSON.parse(
    execSync(`npm show wix-tslint-custom-rules --registry=https://registry.npmjs.org/ --json`),
  ).version;
};

execSync(`npm --no-git-tag-version version ${getLatestVersion()}`);
execSync(`npm --no-git-tag-version version patch`);