const TransactionController = require("../controllers/transaction.controller");

module.exports = function (app) {
  app.get(
    "/app/transaction/get-adrress-utxos",
    TransactionController.getAddressUtxos
  );
  app.post(
    "/app/transaction/create-project-tx",
    TransactionController.sendCreateProjectTransaction
  );
  app.post(
    "/app/transaction/create-signed-tx",
    TransactionController.sendCreateProjectSignedTransaction
  );
  app.post(
    "/app/transaction/register-project",
    TransactionController.registerProject
  );
};
