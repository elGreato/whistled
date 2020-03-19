const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  console.log("inside migration1");
  deployer.deploy(Migrations);
};
