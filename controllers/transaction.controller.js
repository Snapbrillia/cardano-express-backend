require("dotenv").config();
const fetch = require("node-fetch");
const { exec } = require("child_process");
const { spawn } = require("child_process");
const e = require("express");
let fs = require("fs");
const {
  BigNum,
  TransactionWitnessSet,
  Address,
  TransactionUnspentOutput,
  TransactionUnspentOutputs,
  TransactionOutput,
  Value,
  Transaction,
} = require("@emurgo/cardano-serialization-lib-nodejs");

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

const checkIfWalletExists = async (userId) => {
  return new Promise((resolve) => {
    exec(
      `find ${__dirname}/../WalletsKeys -name ` + userId + `*`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
        }
        resolve(stdout ? true : false);
      }
    );
  });
};

const formatUtxos = (rawUtxos) => {
  let Utxos = [];
  try {
    for (const rawUtxo of rawUtxos) {
      const utxo = TransactionUnspentOutput.from_bytes(
        Buffer.from(rawUtxo, "hex")
      );
      const input = utxo.input();
      const txid = Buffer.from(
        input.transaction_id().to_bytes(),
        "utf8"
      ).toString("hex");
      const txindx = input.index();
      const output = utxo.output();
      const amount = output.amount().coin().to_str();
      const multiasset = output.amount().multiasset();
      let multiAssetStr = "";

      if (multiasset) {
        const keys = multiasset.keys();
        const N = keys.len();

        for (let i = 0; i < N; i++) {
          const policyId = keys.get(i);
          const policyIdHex = Buffer.from(policyId.to_bytes(), "utf8").toString(
            "hex"
          );
          const assets = multiasset.get(policyId);
          const assetNames = assets.keys();
          const K = assetNames.len();

          for (let j = 0; j < K; j++) {
            const assetName = assetNames.get(j);
            const assetNameString = Buffer.from(
              assetName.name(),
              "utf8"
            ).toString();
            const assetNameHex = Buffer.from(assetName.name(), "utf8").toString(
              "hex"
            );
            const multiassetAmt = multiasset.get_asset(policyId, assetName);
            multiAssetStr += `+ ${multiassetAmt.to_str()} + ${policyIdHex}.${assetNameHex} (${assetNameString})`;
          }
        }
      }

      const obj = {
        txid: txid,
        txindx: txindx,
        amount: amount,
        str: `${txid} #${txindx} = ${amount}`,
        multiAssetStr: multiAssetStr,
        TransactionUnspentOutput: utxo,
      };
      Utxos.push(obj);
    }
    let txOutputs = TransactionUnspentOutputs.new();
    for (const utxo of Utxos) {
      txOutputs.add(utxo.TransactionUnspentOutput);
    }
    return txOutputs;
  } catch (err) {
    //TODO: Log error
  }
};

const createServerWallet = async (userId) => {
  return new Promise((resolve) => {
    let addr = "";
    const createWalletCommand = spawn("sh", [
      __dirname + "/../bashScripts/wallet-gen.sh",
      userId,
    ]);
    createWalletCommand.stdout.on("data", (data) => {
      addr += data.toString();
    });
    createWalletCommand.on("close", () => {
      resolve(addr);
    });
  });
};

const sendCreateProjectTransaction = async (req, res) => {
  try {
    // the user id should be retrieved from the request body but is hardcoded for now
    // checks if the user has a wallet on our server already by using the find command on the walletKeys folder
    // which is where we are storing the wallets
    let walletAdress;
    const userId =
      "bd705210-41ae-472f-9b2b-9e9772cbadadda0daadddadaaadddaadadadadaddaab5a";
    const walletExists = await checkIfWalletExists(userId);
    if (walletExists) {
      walletAdress = fs.readFileSync(
        __dirname + "/../WalletKeys/" + userId + ".addr",
        "utf8"
      );
    } else {
      walletAdress = await createServerWallet(userId);
    }

    // the transaction is built and back to user to sign
    const lovelaceToSend = 3000000;
    const txBuilder = await initTransactionBuilder();
    const shelleyChangeAddress = Address.from_bytes(
      Buffer.from(changeAddress, "hex")
    ).to_bech32();

    const shelleyOutputAddress = Address.from_bech32(walletAdress);
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
    return res.json({ transaction, tx });
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

const sendCreateProjectSignedTransaction = async (req, res) => {
  try {
    // get the signed transaction from the user and
    // and return a serialized transaction to the user
    // so their wallet can send it to the cardano network
    const { clientTxVkeyWitness, tx } = req.body;
    const transactionWitnessSet = TransactionWitnessSet.new();
    const txVkeyWitness = TransactionWitnessSet.from_bytes(
      Buffer.from(clientTxVkeyWitness, "hex")
    );

    transactionWitnessSet.set_vkeys(txVkeyWitness);
    const signedTx = Transaction.new(tx.body(), transactionWitnessSet);
    return res.json({ signedTx });
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

// uses cli application to check if the funds have arrived
// const checkIfFundsAreAvailable = async (req, res) => {
//   try {
//   } catch (err) {
//     return res.status(500).json({ err: err });
//   }
// };

// invoke the qvf-cli application to create a new project
const registerProject = async (req, res) => {
  try {
    const userId = "testing";
    const projectLabel = "ProjectZ";
    const requestedAmount = 1000000000;
    // . infront to load the script file
    const createWalletCommand = spawn("sh", [
      __dirname +
        "/../bashScripts/test_remote.sh " +
        userId +
        " " +
        projectLabel +
        " " +
        requestedAmount,
    ]);

    createWalletCommand.stderr.on("data", (data) => {
      console.log(`stderr: ${data}`);
    });

    createWalletCommand.on("error", (error) => {
      console.log(`error: ${error.message}`);
    });

    createWalletCommand.stdout.on("data", (data) => {
      console.log(data.toString());
    });
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

module.exports = {
  sendCreateProjectTransaction,
  getAddressUtxos,
  sendCreateProjectSignedTransaction,
  registerProject,
};
