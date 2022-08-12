const express = require("express");
const app = express();

app.set("view_engine", "ejs");
require("./routes/transaction.routes")(app);

app.listen(8001, () => {
  console.log("App is running port 8000");
});
