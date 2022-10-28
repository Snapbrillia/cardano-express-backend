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
        "/Users/shanzhang/quadraticVoting/scripts/register-project.sh" +
        " " +
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
        if (err) {
          console.log(err);
        }
        if (stderr) {
          console.log(stderr);
        }
        return res.json({ stdout });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err });
  }
};

module.exports = {
  generateGrantTx,
};
