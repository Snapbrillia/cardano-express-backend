const express = require("express");
const app = express();

app.use(express.json());

app.set("view_engine", "ejs");
require("./routes/transaction.routes")(app);

app.listen(8001, () => {
  console.log("App is running port 8001");
});
