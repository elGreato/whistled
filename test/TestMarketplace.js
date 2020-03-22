var Marketplace = artifacts.require("./client/src/contracts/Marketplace.sol");



contract("Marketplace", accounts => { //accounts are injected by Ganache, it's an arry so we can address it individually as accounts[0]
  //all tests go inside here
  let seller = accounts[1];
  let deployer= accounts[0];
  let buyer = accounts[2];

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


  //    >> Cases Creation<<
  describe("cases", async () => {
    let result, caseCount;

    before(async () => {
      result = await marketplace.createCase(
        "money Laundary",
        2,
        "money laundary in Zurich",
        "Zurich",
         web3.utils.toWei("1", "Ether"),
         {from: seller}//from means the one who calls this function is the "seller"
         
         ); 
      caseCount = await marketplace.caseCount();
    });

    it("creates Cases", async () => {
      // SUCCESS
      assert.equal(caseCount, 1);
      
      const event = result.logs[0].args;//extract the logs values

      assert.equal(event.caseId.toNumber(),caseCount.toNumber(), "id is correct");
      assert.equal(event.caseTitle, "money Laundary", " Title is correct");
      assert.equal(event.caseLocation, "Zurich", "location is correct");
      assert.equal(event.casePrice, "1000000000000000000", "price is correct");
      assert.equal(event.owner, seller, " sender is correct");
      assert.equal(event.isPurchased, false, "purchase is correct");
    });

    //  >>Cases Listing<<
    it('Lists cases', async()=>{  //case is a reserved word in solidity use instance

      const instance = await marketplace.cases(caseCount);
      //SUCCESS
      assert.equal(instance.caseId.toNumber(), caseCount.toNumber(), 'id is correct')
      assert.equal(instance.caseTitle, 'money Laundary' , ' name is correct')
      assert.equal(instance.casePrice,'1000000000000000000' , 'price is correct')
      assert.equal(instance.owner, seller, ' sender is correct')
      assert.equal(instance.isPurchased, false, 'purchase is correct')
      
  });
  //    >>Cases Selling<<
  it('sells cases', async()=>{

    //track balance of seller (just for testing the receive fund)
    let oldSellerBalance
    oldSellerBalance = await web3.eth.getBalance(seller)
    oldSellerBalance = new web3.utils.BN(oldSellerBalance)


    // SUCCCESS buyer makes purchase
    result = await marketplace.purchaseCase(caseCount,{ from: buyer, value: web3.utils.toWei('1', 'Ether')})
    //check logs
    const event = result.logs[0].args
    assert.equal(event.caseId.toNumber(), caseCount.toNumber(), 'id is correct')
    assert.equal(event.caseTitle, 'money Laundary' , ' name is correct')
    assert.equal(event.casePrice, web3.utils.toWei('1', 'Ether') , 'price is correct')
    assert.equal(event.owner, buyer, ' sender is correct')
    assert.equal(event.isPurchased, true, 'purchase is correct')

    //console.log(event)
    //check that seller received funds
    //see balance before, then after, then check the difference (tracing is up there)

    let newSellerBalance
    newSellerBalance = await web3.eth.getBalance(seller)
    newSellerBalance = new web3.utils.BN(newSellerBalance)

    let price = web3.utils.toWei('1', 'Ether')
    price = new web3.utils.BN(price)

    //console.log("oldSellerBalance",oldSellerBalance,"newSellerBalance", newSellerBalance,"price" ,price)

    const expectedBalance = oldSellerBalance.add(price)

    assert.equal(newSellerBalance.toString(), expectedBalance.toString());

    //Failure: tries to buy a product that doesn't exist - no valid id >>>these need chai
    // await marketplace.purchaseCase(99,{ from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;

    // //Failure: tries to buy with less ether
    // await marketplace.purchaseProduct(productCount,{ from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected

    // //Failure: deployer tries to buy the product. i.e. product shouldn't be purchased twice
    // await marketplace.purchaseProduct(productCount,{ from: deployer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
    // //Failure to do : buyer tries to buy again ...etc. 
})




  });

  



});
