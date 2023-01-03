const GrantInfoController = require("../controllers/grantInfo.controller");

module.exports = function (app) {
  app.get(
    "/app/grants/get-emulation-result",
    GrantInfoController.getProjectsInfo
  );
  app.get(
    "/app/grants/get-bounty-credit-amount/:walletAddress",
    GrantInfoController.getBountyCreditAmount
  );
};
