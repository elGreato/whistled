const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    myNetwork: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 7545,
      from: "0xde2F1c88d4dfE648e618B14bD2D736e9280B376E", // default address to use for any transaction Truffle makes during migrations
      network_id: "*",
      gas: 4612388 // Gas limit used for deploys
    }
  },
  contracts_directory: "./client/src/contracts/",
  contracts_build_directory: "./client/src/abis/"
};
