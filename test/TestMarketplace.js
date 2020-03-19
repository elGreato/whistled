var Marketplace = artifacts.require("./client/src/contracts/Marketplace.sol");

contract("Marketplace", accounts => {
  //all tests go inside here

  let marketplace;
  before(async () => {
    marketplace = await Marketplace.deployed(); //this will get the deployed copy of the contract
  });

  //        >> Deployment<<
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
      const name = await marketplace.contractName();
      assert.equal(name, "Whistled Market");
    });
  });


  //        >> Cases Creation<<

  describe("cases", async () => {
    let result, caseCount;

    before(async () => {
      result = await marketplace.createCase(
        "money Laundary",
        2,
        "money laundary in Zurich",
        web3.utils.toWei("1", "Ether")
      );
      caseCount = await marketplace.caseCount();
    });

    it("creates Cases", async () => {
      // SUCCESS
      assert.equal(caseCount, 1);

      //extract the logs values
      const event = result.logs[0].args;
      assert.equal(event.caseId.toNumber(),caseCount.toNumber(), "id is correct");
      assert.equal(event.caseTitle, "money Laundary", " Title is correct");
      assert.equal(event.casePrice, "1000000000000000000", "price is correct");
      //assert.equal(event.owner, seller, " sender is correct");
      assert.equal(event.isPurchased, false, "purchase is correct");
    });
  });




  
});
