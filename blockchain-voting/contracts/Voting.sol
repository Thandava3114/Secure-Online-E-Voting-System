// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2; 

contract Voting {
    struct Candidate {
        uint id;
        string name;
        string party;
        string candidatePhoto;
        string partySymbol;
        uint voteCount;
    }

    struct Election {
        string electionName;
        uint[] candidateIds;
    }

    mapping(uint => Candidate) public candidates;
    mapping(string => Election) public elections;
    mapping(string => bool) public hasVoted; // Track votes using voter ID
    uint public candidatesCount = 0;

    event CandidateAdded(uint id, string name, string party, string candidatePhoto, string partySymbol);
    event ElectionCreated(string electionName, uint[] candidateIds);
    event VoteCasted(uint candidateId, string voterId, uint newVoteCount);

    // Add a new candidate to the blockchain
    function addCandidate(string memory _name, string memory _party, string memory _candidatePhoto, string memory _partySymbol) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate({
            id: candidatesCount,
            name: _name,
            party: _party,
            candidatePhoto: _candidatePhoto,
            partySymbol: _partySymbol,
            voteCount: 0  // 🔹 Explicitly initializing vote count
        });

        emit CandidateAdded(candidatesCount, _name, _party, _candidatePhoto, _partySymbol);
    }

    // Create an election with selected candidates
    function createElection(string memory _electionName, uint[] memory _candidateIds) public {
        elections[_electionName] = Election({
            electionName: _electionName,
            candidateIds: _candidateIds
        });

        emit ElectionCreated(_electionName, _candidateIds);
    }

    // Cast a vote
    function vote(uint _candidateId, string memory _voterId) public {
        require(!hasVoted[_voterId], "You have already voted");  // Ensure the voter hasn't voted before
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        candidates[_candidateId].voteCount++; // 🔹 Increment vote count
        hasVoted[_voterId] = true; // 🔹 Mark voter ID as voted

        emit VoteCasted(_candidateId, _voterId, candidates[_candidateId].voteCount);
    }

    function getCandidatesCount() public view returns (uint) {
        return candidatesCount;
    }

    function getCandidate(uint _id) public view returns (string memory, string memory, string memory, string memory, uint) {
        require(_id > 0 && _id <= candidatesCount, "Candidate does not exist");
        Candidate memory c = candidates[_id];
        return (c.name, c.party, c.candidatePhoto, c.partySymbol, c.voteCount);
    }

    // Get election results sorted by votes
    function getElectionResults() public view returns (Candidate[] memory) {
        Candidate[] memory sortedCandidates = new Candidate[](candidatesCount);
        
        // 🔹 Iterate over candidate mapping and store them in an array
        for (uint i = 1; i <= candidatesCount; i++) {
            sortedCandidates[i - 1] = candidates[i];
        }

        // 🔹 Bubble Sort for sorting candidates by vote count
        for (uint i = 0; i < candidatesCount - 1; i++) {
            for (uint j = 0; j < candidatesCount - i - 1; j++) {
                if (sortedCandidates[j].voteCount < sortedCandidates[j + 1].voteCount) {
                    Candidate memory temp = sortedCandidates[j];
                    sortedCandidates[j] = sortedCandidates[j + 1];
                    sortedCandidates[j + 1] = temp;
                }
            }
        }

        return sortedCandidates;
    }
}
