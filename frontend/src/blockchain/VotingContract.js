import web3 from "./web3";
import Voting from "./Voting.json";

const contractAddress = "0x1d4Bf21841B6B78C99060872A62E5C5605Eb478d";

// Ensure web3 is initialized before using the contract
if (!web3) {
  console.error(
    "Web3 is not initialized. Make sure MetaMask is installed and connected."
  );
}

const VotingContract = new web3.eth.Contract(Voting.abi, contractAddress);

console.log("Voting Contract Address:", contractAddress); // Debugging
console.log("Voting Contract Methods:", VotingContract.methods); // Debugging

export default VotingContract;
