const { exec } = require("child_process");
const { pathToScripts, pathToRepo } = require("../shared.js");

const generateGrantTx = async (req, res) => {
  try {
    const {
      walletAddress,
      pubKeyAddress,
      projectLabel,
      requestedAmount,
      txIn,
      txOut,
    } = req.body;

    exec(
      "bash " +
        __dirname +
        `${pathToScripts}/register-project.sh ` +
        projectLabel +
        " " +
        requestedAmount +
        " " +
        walletAddress +
        " " +
        pubKeyAddress +
        " " +
        txIn +
        " " +
        txOut,
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

const generateDonateTx = async (req, res) => {
  try {
    const {
      walletAddress,
      pubKeyAddress,
      projectTokenName,
      donationAmount,
      txIn,
      txOut,
    } = req.body;
    exec(
      "bash " +
        __dirname +
        `${pathToScripts}/donate-to-project.sh ` +
        projectTokenName +
        " " +
        donationAmount +
        " " +
        pubKeyAddress +
        " " +
        walletAddress +
        " " +
        txIn +
        " " +
        txOut,
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

const generateBountyCreditTx = async (req, res) => {
  try {
    const { projectOwnerAddress, txIn, txOut, consumeAmount } = req.body;
    exec(
      "bash " +
        __dirname +
        `${pathToScripts}/consume-bounty-credit.sh ` +
        consumeAmount +
        " " +
        projectOwnerAddress +
        " " +
        txIn +
        " " +
        txOut,
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

const generateContributeToPoolTx = async () => {
  try {
    const { sponsorAddress, txIn, txOut, contributeAmount } = req.body;
    exec(
      "bash " +
        __dirname +
        `${pathToScripts}/contribute.sh ` +
        sponsorAddress +
        " " +
        contributeAmount +
        " " +
        txIn +
        " " +
        txOut,
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

const signTransaction = (req, res) => {
  try {
    const { transactionCBOR } = req.body;
    exec(
      "bash " +
        __dirname +
        `${pathToScripts}/submit-transaction.sh ` +
        transactionCBOR,
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
  generateBountyCreditTx,
  generateGrantTx,
  generateDonateTx,
  generateContributeToPoolTx,
  signTransaction,
};
