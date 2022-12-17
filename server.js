const express = require("express");
const app = express();
const expressQueue = require("express-queue");
const queueMw = expressQueue({ activeLimit: 1 });

app.use(express.json());
app.use(queueMw);

require("dotenv").config();

app.set("view_engine", "ejs");
require("./routes/transaction.routes")(app);

app.listen(8001, () => {
  console.log("App is running port 8000");
});
