const express = require("express");
const app = express();
const cors = require("cors");
app.set("view_engine", "ejs");
app.use(cors());

require("./routes/transaction.routes")(app);

app.listen(8001, () => {
  console.log("App is running port 8000");
});
