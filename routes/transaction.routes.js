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
    "/app/transaction/create-contribute-to-pool-tx",
    TransactionController.generateContributeToPoolTx
  );
  app.post(
    "/app/transaction/sign-donation-transaction",
    TransactionController.signDonationTransaction
  );
  app.post(
    "/app/transaction/sign-project-registration-transaction",
    TransactionController.signRegistrationTransaction
  );
  app.get(
    "/app/transaction/get-wallet-address-to-send-ada/:walletAddress",
    TransactionController.getWalletAddressToSendAda
  );
  app.get(
    "/app/transaction/check-if-utxo-present/:walletAddress",
    TransactionController.checkIfUTxOPresent
  );
  app.post(
    "/app/transaction/submit-project-registration-queue",
    TransactionController.submitProjectRegistrationQueue
  );
  app.post(
    "/app/transaction/submit-donation-queue",
    TransactionController.submitDonationQueue
  );
  app.post(
    "/app/transaction/create-contribute-to-match-pool-tx",
    TransactionController.contributeToMatchPool
  );
  app.post(
    "/app/transaction/sign-contribute-to-match-pool-transaction",
    TransactionController.signContributeMatchPoolTransaction
  );
  app.post(
    "/app/transaction/submit-contribute-to-match-pool-queue",
    TransactionController.submitContributeMatchPoolQueue
  );
};
