const { exec } = require("child_process");

const generateGrantTx = async (req, res) => {
  try {
    const {
      walletAddress,
      pubKeyAddress,
      projectLabel,
      requestedAmount,
      txIn,
      txOut,
      txCollateral,
      projectIdUTxO,
      txOutCollateral,
    } = req.body;
    exec(
      "source " +
        __dirname +
        "/../../quadraticVoting/scripts/register-project.sh " +
        projectLabel +
        " " +
        requestedAmount +
        " " +
        walletAddress +
        " " +
        pubKeyAddress +
        " " +
        projectIdUTxO +
        " " +
        txIn +
        " " +
        txCollateral +
        " " +
        txOut +
        " " +
        txOutCollateral,
      (err, stdout, stderr) => {
        if (err) {
          res.status(500).json({ error: err });
        }
        if (stderr) {
          res.status(500).json({ error: stderr });
        }
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
      txCollateral,
      txOut,
      txOutCollateral,
    } = req.body;
    exec(
      "source " +
        __dirname +
        "/../../quadraticVoting/scripts/donate-to-project.sh " +
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
        txOut +
        " " +
        txOutCollateral,
      (err, stdout, stderr) => {
        if (err) {
          res.status(500).json({ error: err });
        }
        if (stderr) {
          res.status(500).json({ error: stderr });
        }
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
    const {
      projectOwnerPkh,
      projectWalletAddress,
      projectTokenName,
      txCollateral,
      txIn,
      txOut,
      consumeAmount,
      txOutCollateral,
    } = req.body;
    exec(
      "source " +
        __dirname +
        "/../../quadraticVoting/scripts/donate-to-project.sh " +
        projectOwnerPkh +
        " " +
        projectWalletAddress +
        " " +
        projectTokenName +
        " " +
        consumeAmount +
        " " +
        txIn +
        " " +
        txCollateral +
        " " +
        txOut +
        "" +
        txOutCollateral,
      (err, stdout, stderr) => {
        if (err) {
          res.status(500).json({ error: err });
        }
        if (stderr) {
          res.status(500).json({ error: stderr });
        }
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
};
