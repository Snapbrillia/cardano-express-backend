const TransactionController = require("../controllers/transaction.controller");

module.exports = function (app) {
  app.post(
    "/app/cardano/create-grant-tx",
    TransactionController.generateGrantTx
  );
};
