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
    } = req.body;
    exec(
      "source " +
        __dirname +
        "../quadraticVoting/scripts/register-project.sh " +
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
        if (stdout) {
          res.json({ stdout });
        } else {
          return res.status(500).json({ error: "Failed to build transaction" });
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
      "source " +
        __dirname +
        "../quadraticVoting/scripts/donate-to-project.sh " +
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
        if (stdout) {
          res.json({ stdout });
        } else {
          return res.status(500).json({ error: "Failed to build transaction" });
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
