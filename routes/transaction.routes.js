const TransactionController = require("../controllers/transaction.controller");

module.exports = function (app) {
  app.get(
    "app/transaction/get-adrress-utxos",
    TransactionController.getAddressUtxos
  );
  app.post(
    "app/transaction/create-server-wallet",
    TransactionController.createServerWallet
  );
};
