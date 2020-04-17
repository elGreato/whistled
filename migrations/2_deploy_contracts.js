const Marketplace = artifacts.require("Marketplace");
const WhistledChat = artifacts.require("WhistledChat")

module.exports = function (deployer) {
  deployer.deploy(Marketplace, { overwrite: false });
  deployer.deploy(WhistledChat)
};
