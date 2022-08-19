require("dotenv").config();
const fetch = require("node-fetch");
const { exec } = require("child_process");
const {
  BigNum,
  TransactionWitnessSet,
  Address,
  TransactionOutput,
  Value,
  Transaction,
  BaseAddress,
} = require("@emurgo/cardano-serialization-lib-nodejs");
const {
  formatUtxos,
  checkIfFundArrived,
  createServerWallet,
} = require("../services/transaction.service");
import { v4 as uuidv4 } from "uuid";

const getAddressUtxos = async (req, res) => {
  let myHeaders = new fetch.Headers();
  myHeaders.append("project_id", process.env.BLOCK_KEY);
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const api_url =
    "https://cardano-testnet.blockfrost.io/api/v0/addresses/addr_test1wpl9c67dav6n9gjxlyafg6dmsql8tafy3pwd3fy06tu26nqzphnsx/utxos";
  const fetch_response = await fetch(api_url, requestOptions);
  const fetch_json = await fetch_response.json();
  res.json(fetch_json);
};

const sendBuiltTransaction = async (req, res) => {
  try {
    // the user id should be retrieved from the request body but is hardcoded for now
    // checks if the user has a wallet on our server already by using the find command on the walletKeys folder
    // which is where we are storing the wallets
    const { changeAddress, rawUtxos, amount } = req.body;
    if (!amount) {
      amount = 10;
    }
    const generatedWalletId = uuidv4();
    const walletAddress = await createServerWallet(generatedWalletId);

    // the transaction is built and back to user to sign
    const lovelaceToSend = amount * 1000000;
    const txBuilder = await initTransactionBuilder();
    const shelleyChangeAddress = Address.from_bytes(
      Buffer.from(changeAddress, "hex")
    ).to_bech32();

    const shelleyOutputAddress = Address.from_bech32(walletAddress);
    txBuilder.add_output(
      TransactionOutput.new(
        shelleyOutputAddress,
        Value.new(BigNum.from_str(lovelaceToSend.toString()))
      )
    );

    const txUnspentOutputs = formatUtxos(rawUtxos);
    txBuilder.add_inputs_from(txUnspentOutputs, 0);

    txBuilder.add_change_if_needed(Address.from_bech32(shelleyChangeAddress));

    const txBody = txBuilder.build();

    const transactionWitnessSet = TransactionWitnessSet.new();

    const tx = Transaction.new(
      txBody,
      TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
    );
    const transaction = Buffer.from(tx.to_bytes(), "utf8").toString("hex");

    return res.json({
      transaction,
      walletAddress,
    });
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

const sendSignedTransaction = async (req, res) => {
  try {
    const { vKeyWitness, transaction } = req.body;
    const tx = Transaction.from_bytes(Buffer.from(transaction, "hex"));

    const transactionWitnessSet = TransactionWitnessSet.new();
    const txVkeyWitness = TransactionWitnessSet.from_bytes(
      Buffer.from(vKeyWitness, "hex")
    );
    transactionWitnessSet.set_vkeys(txVkeyWitness.vkeys());
    const signedTx = Transaction.new(tx.body(), transactionWitnessSet);
    const signedTransaction = Buffer.from(signedTx.to_bytes(), "utf8").toString(
      "hex"
    );
    return res.json({ signedTransaction });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

const registerGrant = async (req, res) => {
  // parameters are hardcoded for now for testing purposes
  try {
    const {
      walletAddress,
      projectLabel,
      requestedAmount,
      generatedWalletId,
      changeAddress,
    } = req.body;
    let timeRan = 0;

    const userChangeAddress = Address.from_bytes(
      Buffer.from(changeAddress, "hex")
    ).to_bech32();

    const pkh = BaseAddress.from_address(
      Address.from_bytes(Buffer.from(changeAddress, "hex"))
    )
      .payment_cred()
      .to_keyhash();

    const userWalletPKH = Buffer.from(pkh.to_bytes()).toString("hex");

    const timeInterval = setInterval(async () => {
      timeRan++;
      if (timeRan > 12) {
        clearInterval(timeInterval);
        return res.status(500).json({ error: "Did not recieve fund" });
      }
      const fundArrived = await checkIfFundArrived(walletAddress);

      if (fundArrived) {
        exec(
          "source " +
            userHomeDir +
            "/quadraticvoting/scripts/main.sh && register_project" +
            " " +
            generatedWalletId +
            " " +
            userWalletPKH +
            " " +
            projectLabel +
            " " +
            requestedAmount * 1000000 +
            " " +
            userChangeAddress,
          (err, stdout, stderr) => {
            if (err) {
              console.log(`error: ${err.message}`);
            }
            if (stderr) {
              console.log(`stderr: ${stderr}`);
            }
            return res.json({ stdout, cardanoPkh: userPKH });
          }
        );
        clearInterval(timeInterval);
      }
    }, 5000);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const donateFundsToGrant = async (req, res) => {
  try {
    const {
      walletAddress,
      donateToProjectPkh,
      donateAmount,
      generatedWalletId,
      changeAddress,
    } = req.body;
    let timeRan = 0;

    const userChangeAddress = Address.from_bytes(
      Buffer.from(changeAddress, "hex")
    ).to_bech32();

    const timeInterval = setInterval(async () => {
      timeRan++;
      if (timeRan > 12) {
        clearInterval(timeInterval);
        return res.status(500).json({ error: "Did not recieve fund" });
      }
      const fundArrived = await checkIfFundArrived(walletAddress);
      if (fundArrived) {
        exec(
          "source " +
            userHomeDir +
            "/quadraticvoting/scripts/main.sh && donate_from_to_with" +
            " " +
            generatedWalletId +
            " " +
            donateToProjectPkh +
            " " +
            donateAmount * 1000000 +
            " " +
            userChangeAddress,
          (err, stdout, stderr) => {
            if (err) {
              console.log(`error: ${err.message}`);
            }
            if (stderr) {
              console.log(`stderr: ${stderr}`);
            }
            console.log(stdout);
            return res.json({ stdout });
          }
        );
        clearInterval(timeInterval);
      }
    }, 5000);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

module.exports = {
  sendBuiltTransaction,
  getAddressUtxos,
  sendSignedTransaction,
  registerGrant,
  donateFundsToGrant,
};
