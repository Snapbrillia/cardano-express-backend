const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')

router.get('/', async (req, res) => {

    let myHeaders = new fetch.Headers();
    myHeaders.append("project_id", "testnetUEYYJPhM1RhYsHGJaruXq2inBiDcvy56");
    myHeaders.append("Accept", "application/json")
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append("Access-Control-Allow-Origin", "*")

    let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    const api_url = "https://cardano-testnet.blockfrost.io/api/v0/addresses/addr_test1wpl9c67dav6n9gjxlyafg6dmsql8tafy3pwd3fy06tu26nqzphnsx/utxos"
    const fetch_response = await fetch(api_url, requestOptions);
    const fetch_json = await fetch_response.json();
    res.json(fetch_json);

})

module.exports = router