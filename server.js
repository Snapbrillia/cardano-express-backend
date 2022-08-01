const express = require('express');
const utxoRouter = require('./routes/utxos')
const app = express();

app.set("view_engine", "ejs");

app.use("/utxos", utxoRouter);

app.listen(8000, () => {
    console.log("App is running port 8000")
});