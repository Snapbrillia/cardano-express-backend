const GrantInfoController = require("../controllers/grantInfo.controller");

module.exports = function (app) {
  app.get(
    "/app/grant-info/get-emulation-result",
    GrantInfoController.getProjectsInfo
  );
  app.get(
    "/app/grant-info/get-bounty-credit-amount/:walletAddress",
    GrantInfoController.getBountyCreditAmount
  );
  app.get(
    "/app/grant-info/get-match-pool-amount",
    GrantInfoController.getMatchPoolAmount
  );
  app.get(
    "/app/grant-info/get-current-funding-round",
    GrantInfoController.getCurrentFundingRound
  );
  app.get(
    "/app/grant-info/get-current-state",
    GrantInfoController.getContractStateInfo
  );
};
