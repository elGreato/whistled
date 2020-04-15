var WhistledChat = artifacts.require("../src/contracts/WhistledChat.sol");


contract("WhistledChat", accounts => { //accounts are injected by Ganache, it's an arry so we can address it individually as accounts[0]
    //all tests go inside here
    let seller = accounts[1];
    let deployer = accounts[0];
    let buyer = accounts[2];

    let whistledChat;

    before(async () => {
        whistledChat = await WhistledChat.deployed();
    });

    //        >> Deployment<<
    //describe comes from Mocha framework
    describe("deployment of Chat", async () => {
        it("Chat deploys successfully", async () => {
            const address = await whistledChat.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, "");
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it("Chat has a name", async () => {
            const name = await whistledChat.contractName();
            assert.equal(name, "Whistled Chat");
        });
    });

});