export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const mintContractAddress = "0xA3e40bBe8E8579Cd2619Ef9C6fEA362b760dac9f";
export const mintABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "public",
    type: "function",
  },
] as const;

export const BASE_CONTRACT = "0x0466A29D90D95365E98FC477AD39D7c00E31Dc3C";

export const abi = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "checkWinner",
    inputs: [
      {
        name: "electionName",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "closeVoting",
    inputs: [
      {
        name: "electionName",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "donate",
    inputs: [
      {
        name: "addr",
        type: "address",
        internalType: "address payable",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "donations",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "electionNames",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "elections",
    inputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [
      {
        name: "name",
        type: "string",
        internalType: "string",
      },
      {
        name: "votingEndTime",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "votingClosed",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCurrentVotingState",
    inputs: [
      {
        name: "electionName",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct BasedRl.VotingState",
        components: [
          {
            name: "isOpen",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "remainingTime",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "options",
            type: "tuple[]",
            internalType: "struct BasedRl.VotingOptionState[]",
            components: [
              {
                name: "name",
                type: "string",
                internalType: "string",
              },
              {
                name: "voteCount",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getElectionOptions",
    inputs: [
      {
        name: "electionName",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [
      {
        name: "",
        type: "string[]",
        internalType: "string[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initializeVoting",
    inputs: [
      {
        name: "electionName",
        type: "string",
        internalType: "string",
      },
      {
        name: "options",
        type: "string[]",
        internalType: "string[]",
      },
      {
        name: "duration",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "payment",
    inputs: [
      {
        name: "addr",
        type: "address",
        internalType: "address payable",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "payments",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "vote",
    inputs: [
      {
        name: "electionName",
        type: "string",
        internalType: "string",
      },
      {
        name: "optionIndex",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "DonationSent",
    inputs: [
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ElectionInitialized",
    inputs: [
      {
        name: "electionName",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "duration",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PaymentSent",
    inputs: [
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VoteCast",
    inputs: [
      {
        name: "electionName",
        type: "string",
        indexed: true,
        internalType: "string",
      },
      {
        name: "voter",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "optionIndex",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
];
