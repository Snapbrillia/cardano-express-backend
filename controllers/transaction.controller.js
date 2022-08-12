require("dotenv").config();
const fetch = require("node-fetch");
const { exec } = require("child_process");
const { spawn } = require("child_process");
const e = require("express");

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
      `find ${__dirname}/../WalletKeys -name ` + userId + `*`,
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

// checks if a user has a wallet by checking if the wallet file exists in the walletKeys folder
// if it doesnt exist then it creates a new wallet for the user and has the users id as the name of the wallet file

const createServerWallet = async (req, res) => {
  try {
    // the user id should be retrieved from the request body but is hardcoded for now
    // checks if the user has a wallet on our server already by using the find command on the walletKeys folder
    // which is where we are storing the wallets
    const userId = "bd705210-41ae-472f-9b2b-9e9772cbadadda0ab5a";
    let message;

    const walletExists = await checkIfWalletExists(userId);
    if (walletExists) {
      // wallet already exists
      message = "wallet already exists";
    } else {
      // creates a new wallet for the user since wallet doesnt exist
      const createWalletCommand = spawn("sh", [
        __dirname + "/../bashScripts/wallet-gen.sh",
        userId,
      ]);
      createWalletCommand.stdout.on("data", (data) => {
        console.log(data.toString());
      });
      message = "wallet created";
    }
    return res.json({ message });
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

module.exports = {
  getAddressUtxos,
  createServerWallet,
};
