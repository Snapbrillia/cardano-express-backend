// There are two express apps running on two different ports
// One is running with express-queue and the other is running without express-queue
// The one without the express-queue are interactions that does not requre a queue such as
// getting information about bounty credit and emulation results
const express = require("express");
const app = express();
const expressQueue = require("express-queue");
const queueMw = expressQueue({ activeLimit: 1 });
app.use(express.json());
app.use(queueMw);
app.set("view_engine", "ejs");
require("./routes/transaction.routes")(app);

const appNoQueue = express();
appNoQueue.use(express.json());
require("./routes/grantInfo.routes")(appNoQueue);

require("dotenv").config();

app.listen(8000, () => {
  console.log("Queued App is running port 8000");
});

appNoQueue.listen(8001, () => {
  console.log("Not Queued App is running port 8001");
});
