var Marketplace = artifacts.require("./client/src/contracts/Marketplace.sol");

contract("Marketplace", accounts => {
  //all tests go inside here

  let marketplace;
  before(async () => {
    marketplace = await Marketplace.deployed(); //this will get the deployed copy of the contract
  });

  //describe comes from Mocha framework
  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await marketplace.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await marketplace.name();
      assert.equal(name, "Whistled marketplace");
    });
  });
});
