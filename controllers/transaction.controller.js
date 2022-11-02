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
        txOut,
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
        txOut,
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
  generateGrantTx,
  generateDonateTx,
};
