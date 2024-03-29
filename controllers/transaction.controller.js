const { exec } = require("child_process");
const { pathToScripts, pathToRepo } = require("../utils.js");

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
        `${pathToScripts}/register-project.sh ` +
        `"${projectLabel}"` +
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

const consumeBountyCreditTx = async (req, res) => {
  try {
    const { projectOwnerAddress, consumeAmount } = req.body;
    exec(
      "bash " +
        `${pathToScripts}/consume-bounty-credit.sh ` +
        consumeAmount +
        " " +
        projectOwnerAddress,
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

const generateContributeToPoolTx = async (req, res) => {
  try {
    const { walletAddress, txIn, txOut, contributeAmount } = req.body;
    exec(
      "bash " +
        `${pathToScripts}/contribute.sh ` +
        contributeAmount +
        " " +
        walletAddress +
        " " +
        txIn +
        " " +
        txOut,
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

const signDonationTransaction = (req, res) => {
  try {
    const { transactionCBOR, projectTokenName } = req.body;
    exec(
      "bash " +
        `${pathToScripts}/collateral-key-holder-sign-transaction.sh ` +
        transactionCBOR +
        " " +
        projectTokenName,
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

const signRegistrationTransaction = (req, res) => {
  try {
    const { transactionCBOR, projectTokenName } = req.body;
    exec(
      "bash " +
        `${pathToScripts}/collateral-key-holder-sign-transaction.sh ` +
        transactionCBOR +
        " " +
        projectTokenName +
        " " +
        "--sign-registration-tx",
      {
        env: { ...process.env, REPO: pathToRepo },
      },
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

const signContributeMatchPoolTransaction = (req, res) => {
  try {
    const { transactionCBOR } = req.body;
    exec(
      "bash " +
        `${pathToScripts}/collateral-key-holder-sign-transaction.sh ` +
        transactionCBOR +
        " " +
        "''" +
        " " +
        "--sign-contribution-tx",
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

const submitProjectRegistrationQueue = async (req, res) => {
  const { projectLabel, fundraisingAmount, walletAddress } = req.body;
  try {
    exec(
      "bash " +
        `${pathToScripts}/register-project.sh ` +
        `"${projectLabel}"` +
        " " +
        fundraisingAmount +
        " " +
        walletAddress +
        " " +
        "--queue",
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

const submitDonationQueue = async (req, res) => {
  const { walletAddress, donationAmount, projectTokenName } = req.body;
  try {
    exec(
      "bash " +
        `${pathToScripts}/donate-to-project.sh ` +
        projectTokenName +
        " " +
        donationAmount +
        " " +
        walletAddress +
        " " +
        "--queue",
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

const submitContributeMatchPoolQueue = (req, res) => {
  try {
    const { walletAddress, contributeAmount } = req.body;
    exec(
      "bash " +
        `${pathToScripts}/contribute.sh ` +
        contributeAmount +
        " " +
        walletAddress +
        " " +
        "--queue",
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

const getWalletAddressToSendAda = (req, res) => {
  const { walletAddress } = req.params;
  try {
    exec(
      "bash " + `${pathToScripts}/get-custodial-wallet.sh ` + walletAddress,
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
  } catch (error) {
    return res.status(500).json({ err: err });
  }
};

const checkIfUTxOPresent = async (req, res) => {
  const { walletAddress } = req.params;
  try {
    exec(
      "bash " +
        `${pathToScripts}/check-if-utxo-present.sh ` +
        `${walletAddress}`,
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
  consumeBountyCreditTx,
  generateGrantTx,
  generateDonateTx,
  generateContributeToPoolTx,
  signDonationTransaction,
  signRegistrationTransaction,
  signContributeMatchPoolTransaction,
  submitProjectRegistrationQueue,
  submitDonationQueue,
  submitContributeMatchPoolQueue,
  getWalletAddressToSendAda,
  checkIfUTxOPresent,
};
