const { pathToScripts, pathToRepo } = require("../shared.js");
const { exec } = require("child_process");

const getProjectsInfo = async (req, res) => {
  try {
    exec(
      "bash " + __dirname + `${pathToScripts}/emulate-outcome.sh`,
      { env: { ...process.env, REPO: pathToRepo } },
      (err, stdout, stderr) => {
        if (stdout) {
          res.json({ stdout });
        } else {
          res.json({ err: true });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

const getBountyCreditAmount = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    exec(
      "bash " +
        __dirname +
        `${pathToScripts}/emulate-outcome.sh` +
        " " +
        walletAddress,
      { env: { ...process.env, REPO: pathToRepo } },
      (err, stdout, stderr) => {
        if (stdout) {
          res.json({ stdout });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

module.exports = {
  getProjectsInfo,
  getBountyCreditAmount,
};
