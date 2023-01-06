const TransactionController = require("../controllers/transaction.controller");

module.exports = function (app) {
  app.post(
    "/app/transaction/create-grant-tx",
    TransactionController.generateGrantTx
  );
  app.post(
    "/app/transaction/create-donate-tx",
    TransactionController.generateDonateTx
  );
  app.post(
    "/app/transaction/create-bounty-credit-tx",
    TransactionController.generateBountyCreditTx
  );
  app.post(
    "/app/transaction/contribute-to-pool-tx",
    TransactionController.generateContributeToPoolTx
  );
  app.post(
    "/app/transaction/sign-transaction",
    TransactionController.signTransaction
  );
  app.get(
    "/app/transaction/get-network-status/:getStatusOf",
    TransactionController.getNetworkStatus
  );
};
