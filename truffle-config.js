const path = require('path')
var HDWalletProvider = require('@truffle/hdwallet-provider')
var mnemonic =
  'vast height recycle satoshi master borrow suit text affair piece swarm fury'

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      gas: 4612388, // Gas limit used for deploys
      network_id: '*', // Match any network id
    },
    myNetwork: {
      host: '127.0.0.1',
      port: 7545,
      network_id: 5777,
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          'https://ropsten.infura.io/v3/a42e4fb296704c3f9ab9442c8f26f2dc',
          0,
          1,
          true,
          "m/44'/1'/0'/0/",
        ),

      network_id: 3,
    },
    rinkeby: {
      host: 'localhost', // Connect to geth on the specified
      port: 7545,
      from: '0xde2F1c88d4dfE648e618B14bD2D736e9280B376E', // default address to use for any transaction Truffle makes during migrations
      network_id: '*',
      gas: 4612388, // Gas limit used for deploys
    },
  },
  contracts_directory: './client/src/contracts/',
  contracts_build_directory: './client/src/abis/',
}
