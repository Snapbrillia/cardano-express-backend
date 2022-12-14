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
};
