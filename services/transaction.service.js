const os = require("os");
const { exec } = require("child_process");
const userHomeDir = os.homedir();
const {
  TransactionUnspentOutput,
  TransactionUnspentOutputs,
} = require("@emurgo/cardano-serialization-lib-nodejs");

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

const createServerWallet = async (id) => {
  return new Promise((resolve) => {
    exec(
      "sh " + userHomeDir + "/quadraticvoting/bashScripts/wallet-gen.sh " + id,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
        }
        resolve(stdout);
      }
    );
  });
};

const checkIfFundArrived = async (walletAddress) => {
  return new Promise((resolve) => {
    exec(
      "source " +
        userHomeDir +
        "/quadraticvoting/bashScripts/blockfrost.sh && get_first_utxo_of_wallet " +
        walletAddress,
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

module.exports = {
  formatUtxos,
  createServerWallet,
  checkIfFundArrived,
};
