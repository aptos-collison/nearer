// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BasedRl {
    address public owner;
    mapping(address => uint256) public payments;
    mapping(address => uint256) public donations;
    
    struct Election {
        string name;
        VotingOption[] options;
        uint256 votingEndTime;
        bool votingClosed;
        mapping(address => bool) hasVoted;
    }
    
    struct VotingOption {
        string name;
        uint256 voteCount;
    }

    struct VotingState {
        bool isOpen;
        uint256 remainingTime;
        VotingOptionState[] options;
    }

    struct VotingOptionState {
        string name;
        uint256 voteCount;
    }
    
    mapping(string => Election) public elections;
    string[] public electionNames;
    
    event PaymentSent(address indexed from, address indexed to, uint256 amount);
    event DonationSent(address indexed from, address indexed to, uint256 amount);
    event VoteCast(string indexed electionName, address indexed voter, uint256 optionIndex);
    event ElectionInitialized(string electionName, uint256 duration);

    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    
    modifier votingOpen(string memory electionName) {
        Election storage election = elections[electionName];
        require(!election.votingClosed && block.timestamp < election.votingEndTime, "Voting is closed");
        _;
    }
    
    function payment(address payable addr) public payable {
        require(msg.value > 0, "Payment amount must be greater than 0");
        require(addr != address(0), "Invalid address");
        (bool success, ) = addr.call{value: msg.value}("");
        require(success, "Transfer failed");
        emit PaymentSent(msg.sender, addr, msg.value);
    }
    
    function donate(address payable addr) public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(addr != address(0), "Invalid address");
        (bool success, ) = addr.call{value: msg.value}("");
        require(success, "Transfer failed");
        emit DonationSent(msg.sender, addr, msg.value);
    }
    
    function initializeVoting(string memory electionName, string[] memory options, uint256 duration) public onlyOwner {
        require(elections[electionName].votingEndTime == 0, "Election with this name already exists");
        
        Election storage newElection = elections[electionName];
        newElection.name = electionName;
        newElection.votingEndTime = block.timestamp + duration;
        newElection.votingClosed = false;
        
        for (uint i = 0; i < options.length; i++) {
            newElection.options.push(VotingOption(options[i], 0));
        }
        
        electionNames.push(electionName);
        emit ElectionInitialized(electionName, duration);
    }
    
    function vote(string memory electionName, uint256 optionIndex) public votingOpen(electionName) {
        Election storage election = elections[electionName];
        require(!election.hasVoted[msg.sender], "You have already voted in this election");
        require(optionIndex < election.options.length, "Invalid option index");
        
        election.options[optionIndex].voteCount++;
        election.hasVoted[msg.sender] = true;
        
        emit VoteCast(electionName, msg.sender, optionIndex);
    }
    
    function checkWinner(string memory electionName) public view returns (string memory, uint256) {
        Election storage election = elections[electionName];
        require(election.votingClosed || block.timestamp >= election.votingEndTime, "Voting is still open");
        
        uint256 winningVoteCount = 0;
        uint256 winningIndex = 0;
        
        for (uint i = 0; i < election.options.length; i++) {
            if (election.options[i].voteCount > winningVoteCount) {
                winningVoteCount = election.options[i].voteCount;
                winningIndex = i;
            }
        }
        
        return (election.options[winningIndex].name, winningVoteCount);
    }
    
    function closeVoting(string memory electionName) public onlyOwner {
        Election storage election = elections[electionName];
        require(!election.votingClosed, "Voting is already closed");
        election.votingClosed = true;
    }

    function getCurrentVotingState(string memory electionName) public view returns (VotingState memory) {
        Election storage election = elections[electionName];
        require(election.votingEndTime > 0, "Election does not exist");

        bool isOpen = !election.votingClosed && block.timestamp < election.votingEndTime;
        uint256 remainingTime = isOpen ? election.votingEndTime - block.timestamp : 0;

        VotingOptionState[] memory optionStates = new VotingOptionState[](election.options.length);
        for (uint i = 0; i < election.options.length; i++) {
            optionStates[i] = VotingOptionState(election.options[i].name, election.options[i].voteCount);
        }

        return VotingState(isOpen, remainingTime, optionStates);
    }
    
    function getElectionOptions(string memory electionName) public view returns (string[] memory) {
        Election storage election = elections[electionName];
        string[] memory optionNames = new string[](election.options.length);
        for (uint i = 0; i < election.options.length; i++) {
            optionNames[i] = election.options[i].name;
        }
        return optionNames;
    }
}