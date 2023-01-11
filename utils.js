const os = require("os");
const pathToRepo = `${os.homedir()}/quadraticvoting`;
const pathToScripts = `${pathToRepo}/scripts`;

module.exports = {
  pathToScripts,
  pathToRepo,
};
