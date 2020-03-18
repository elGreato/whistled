const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // match any network
      websockets: true
    }
  },
  contracts_directory: "./client/src/contracts/",
  contracts_build_directory: "./client/src/abis/"
};
