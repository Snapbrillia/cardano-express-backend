const TransactionController = require("../controllers/transaction.controller");

module.exports = function (app) {
  app.post(
    "/app/cardano/create-grant-tx",
    TransactionController.generateGrantTx
  );
  app.post(
    "/app/cardano/create-donate-tx",
    TransactionController.generateDonateTx
  );
  app.post(
    "/app/cardano/create-bounty-credit-tx",
    TransactionController.generateBountyCreditTx
  );
};
