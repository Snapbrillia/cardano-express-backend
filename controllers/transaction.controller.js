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
      txCollateral,
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
        txCollateral +
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
      txCollateral,
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
        txCollateral +
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
      txCollateral,
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
        txCollateral +
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
    const {
      sponsorAddress,
      txCollateral,
      txIn,
      txOut,
      contributeAmount,
      txOutCollateral,
    } = req.body;
    exec(
      "bash " +
        __dirname +
        "/../../quadraticvoting/scripts/contribute.sh " +
        sponsorAddress +
        " " +
        contributeAmount +
        " " +
        txIn +
        " " +
        txCollateral +
        " " +
        txOut +
        "" +
        txOutCollateral,
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
};
