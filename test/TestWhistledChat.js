var WhistledChat = artifacts.require("../src/contracts/WhistledChat.sol");
const utils = require ("../src/components/myUtils/myTools")


contract("WhistledChat", accounts => { //accounts are injected by Ganache, it's an arry so we can address it individually as accounts[0]
    //all tests go inside here
    let seller = accounts[1];
    let deployer = accounts[0];
    let buyer = accounts[2];

    let acc1PrvKey = Buffer.from("e3f1cec76a5037c8bae3ebf3f080867b1b99cd40980fb7ca40374c5ae08114ce", 'hex')
    let acc2PrvKey = Buffer.from("f438e2c9eaa32527000e2f1f87a79dc79f64dc893189f42c459078c93808a0eb", 'hex')

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

        it('Encrypt/decrypt messages', () => {
            var pubkeyUser1 = '04' + utils.privateToPublic(acc1PrvKey).toString('hex');
            var pubkeyUser2 = '04' + utils.privateToPublic(acc2PrvKey).toString('hex');
            var secret1 = utils.computeSecret(acc1PrvKey, Buffer.from(pubkeyUser2, 'hex'));
            var secret2 = utils.computeSecret(acc2PrvKey, Buffer.from(pubkeyUser1, 'hex'));
    
            assert.equal(secret1.toString('hex'), secret2.toString('hex'));
    
            var message = 'this is just a test message';
            var encrypted = utils.encrypt(message, secret1);
            var decrypted = utils.decrypt(encrypted, secret2);
    
            assert.equal(message, decrypted.toString('hex'));
        });





    });

});