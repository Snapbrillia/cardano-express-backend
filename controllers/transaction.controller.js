const { exec } = require("child_process");
const pathToScripts = "/../../quadraticvoting/scripts";

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
      (err, stdout, stderr) => {
        res.json({ stdout });
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
      (err, stdout, stderr) => {
        res.json({ stdout });
      }
    );
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

const generateBountyCreditTx = async (req, res) => {
  try {
    const {
      projectOwnerAddress,
      projectTokenName,
      txIn,
      txOut,
      consumeAmount,
    } = req.body;
    exec(
      "bash " +
        __dirname +
        `${pathToScripts}/consume-bounty-utxo-tx.sh ` +
        projectTokenName +
        " " +
        consumeAmount +
        " " +
        projectOwnerAddress +
        " " +
        txIn +
        " " +
        txOut,
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
