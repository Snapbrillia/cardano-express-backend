const express = require("express");
const app = express();

app.set("view_engine", "ejs");
require("./routes/transaction.routes")(app);

// /app/transaction/register-project
//app.post('/app/transaction/register-project', )

app.listen(8001, () => {
  console.log("App is running port 8000");
});
