const TransactionController = require("../controllers/transaction.controller");

module.exports = function (app) {
  app.get(
    "/api/transaction/get-adrress-utxos",
    TransactionController.getAddressUtxos
  );
  app.post(
    "/api/transaction/cardano-build-tx",
    TransactionController.sendBuiltTransaction
  );
  app.post(
    "/api/transaction/cardano-sign-tx",
    TransactionController.sendSignedTransaction
  );
  app.post(
    "/api/transaction/register-grant-to-blockchain",
    TransactionController.registerGrant
  );
  app.post(
    "/api/transaction/donate-grant-to-blockchain",
    TransactionController.donateFundsToGrant
  );
};
