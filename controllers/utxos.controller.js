require("dotenv").config();
const fetch = require("node-fetch");
const { exec } = require("child_process");

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

// finding a user in our database , check if the user has a wallet on our server already ,
// if not create a new wallet for the user
// still neeed work , just intial skeleton
const createServerWallet = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (user.serverWallet) {
      // code to find the corresponding private key by looking at the users server wallet
      //since he has created a wallet already
    } else {
      // need to get output of script and get the address and store it in the
      // users server wallet
      exec(`sh ${__dirname}/bashScipts/wallet-gen.sh`);
      const serverWalletAddress = "address to store in user";
      user.serverWallet = serverWalletAddress;
      await user.save();
    }
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

module.exports = {
  getAddressUtxos,
  createServerWallet,
};
