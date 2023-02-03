const { pathToScripts, pathToRepo } = require("../utils.js");
const { exec } = require("child_process");

const getProjectsInfo = async (req, res) => {
  try {
    exec(
      "bash " + `${pathToScripts}/emulate-outcome.sh`,
      { env: { ...process.env, REPO: pathToRepo } },
      (err, stdout, stderr) => {
        if (err) {
          return res.json({ err: err, success: false });
        }
        if (stderr) {
          return res.json({ stderr: stderr, success: false });
        }
        if (stdout) {
          return res.json({ stdout: stdout, success: true });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

const getBountyCreditAmount = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    exec(
      "bash " +
        `${pathToScripts}/get-bounty-credit-amount.sh` +
        " " +
        walletAddress,
      { env: { ...process.env, REPO: pathToRepo } },
      (err, stdout, stderr) => {
        if (err) {
          return res.json({ err: err, success: false });
        }
        if (stderr) {
          return res.json({ stderr: stderr, success: false });
        }
        if (stdout) {
          return res.json({ stdout: stdout, success: true });
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
