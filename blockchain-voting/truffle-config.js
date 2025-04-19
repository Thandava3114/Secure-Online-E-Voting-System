const HDWalletProvider = require("@truffle/hdwallet-provider");

const privateKey = "0x517f479c9e43eb09d4394eef2db802c7edb2918f461b0fbb1acd91eff33b013f"; // Your private key

module.exports = {
  networks: {
    development: {
      provider: () => new HDWalletProvider([privateKey], "http://127.0.0.1:7545"), // Wrap private key in an array
      network_id: "*",
    },
  },
};
