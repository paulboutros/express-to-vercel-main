export const ABIBASE= [
    {
      "type": "constructor",
      "name": "",
      "inputs": [
        {
          "type": "address",
          "name": "_defaultAdmin",
          "internalType": "address"
        },
        {
          "type": "string",
          "name": "_name",
          "internalType": "string"
        },
        {
          "type": "string",
          "name": "_symbol",
          "internalType": "string"
        },
        {
          "type": "address",
          "name": "_royaltyRecipient",
          "internalType": "address"
        },
        {
          "type": "uint128",
          "name": "_royaltyBps",
          "internalType": "uint128"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "ApprovalForAll",
      "inputs": [
        {
          "type": "address",
          "name": "_owner",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "_operator",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "bool",
          "name": "_approved",
          "indexed": false,
          "internalType": "bool"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BatchMetadataUpdate",
      "inputs": [
        {
          "type": "uint256",
          "name": "_fromTokenId",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "type": "uint256",
          "name": "_toTokenId",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ContractURIUpdated",
      "inputs": [
        {
          "type": "string",
          "name": "prevURI",
          "indexed": false,
          "internalType": "string"
        },
        {
          "type": "string",
          "name": "newURI",
          "indexed": false,
          "internalType": "string"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "DefaultRoyalty",
      "inputs": [
        {
          "type": "address",
          "name": "newRoyaltyRecipient",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "newRoyaltyBps",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "GameTokensClaimed",
      "inputs": [
        {
          "type": "address",
          "name": "user",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "gameTokenAmount",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "LogBalance",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "id",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "type": "uint256",
          "name": "balance",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "LogERC1155TokenAddress",
      "inputs": [
        {
          "type": "address",
          "name": "erc1155Token",
          "indexed": true,
          "internalType": "contract ERC1155Base"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "MetadataFrozen",
      "inputs": [],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnerUpdated",
      "inputs": [
        {
          "type": "address",
          "name": "prevOwner",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "newOwner",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoyaltyForToken",
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "type": "address",
          "name": "royaltyRecipient",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "royaltyBps",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "TransferBatch",
      "inputs": [
        {
          "type": "address",
          "name": "_operator",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "_from",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "_to",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "uint256[]",
          "name": "_ids",
          "indexed": false,
          "internalType": "uint256[]"
        },
        {
          "type": "uint256[]",
          "name": "_values",
          "indexed": false,
          "internalType": "uint256[]"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "TransferSingle",
      "inputs": [
        {
          "type": "address",
          "name": "_operator",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "_from",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "_to",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "_id",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "type": "uint256",
          "name": "_value",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "URI",
      "inputs": [
        {
          "type": "string",
          "name": "_value",
          "indexed": false,
          "internalType": "string"
        },
        {
          "type": "uint256",
          "name": "_id",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "function",
      "name": "addFunds",
      "inputs": [
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "balanceOf",
      "inputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "balanceOfBatch",
      "inputs": [
        {
          "type": "address[]",
          "name": "accounts",
          "internalType": "address[]"
        },
        {
          "type": "uint256[]",
          "name": "ids",
          "internalType": "uint256[]"
        }
      ],
      "outputs": [
        {
          "type": "uint256[]",
          "name": "",
          "internalType": "uint256[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "batchFrozen",
      "inputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "batchMintTo",
      "inputs": [
        {
          "type": "address",
          "name": "_to",
          "internalType": "address"
        },
        {
          "type": "uint256[]",
          "name": "_tokenIds",
          "internalType": "uint256[]"
        },
        {
          "type": "uint256[]",
          "name": "_amounts",
          "internalType": "uint256[]"
        },
        {
          "type": "string",
          "name": "_baseURI",
          "internalType": "string"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "burn",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "id",
          "internalType": "uint256"
        },
        {
          "type": "uint256",
          "name": "value",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "burnAndClaim",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        },
        {
          "type": "uint256[]",
          "name": "ids",
          "internalType": "uint256[]"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "burnBatch",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        },
        {
          "type": "uint256[]",
          "name": "ids",
          "internalType": "uint256[]"
        },
        {
          "type": "uint256[]",
          "name": "values",
          "internalType": "uint256[]"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "burnableErc1155Token",
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "contract ERC1155Base"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "contractURI",
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "displayBurnableTokenInfos",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "id",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getApproved",
      "inputs": [
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getBalance",
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getBaseURICount",
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getBatchIdAtIndex",
      "inputs": [
        {
          "type": "uint256",
          "name": "_index",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getDefaultRoyaltyInfo",
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "address"
        },
        {
          "type": "uint16",
          "name": "",
          "internalType": "uint16"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRoyaltyInfoForToken",
      "inputs": [
        {
          "type": "uint256",
          "name": "_tokenId",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "address"
        },
        {
          "type": "uint16",
          "name": "",
          "internalType": "uint16"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "isApprovedForAll",
      "inputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "mintTo",
      "inputs": [
        {
          "type": "address",
          "name": "_to",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "_tokenId",
          "internalType": "uint256"
        },
        {
          "type": "string",
          "name": "_tokenURI",
          "internalType": "string"
        },
        {
          "type": "uint256",
          "name": "_amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "multicall",
      "inputs": [
        {
          "type": "bytes[]",
          "name": "data",
          "internalType": "bytes[]"
        }
      ],
      "outputs": [
        {
          "type": "bytes[]",
          "name": "results",
          "internalType": "bytes[]"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "name",
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "nextTokenIdToMint",
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "rewardToken",
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "contract IERC20"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "royaltyInfo",
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId",
          "internalType": "uint256"
        },
        {
          "type": "uint256",
          "name": "salePrice",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "address",
          "name": "receiver",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "royaltyAmount",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "safeBatchTransferFrom",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "to",
          "internalType": "address"
        },
        {
          "type": "uint256[]",
          "name": "ids",
          "internalType": "uint256[]"
        },
        {
          "type": "uint256[]",
          "name": "amounts",
          "internalType": "uint256[]"
        },
        {
          "type": "bytes",
          "name": "data",
          "internalType": "bytes"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "safeTransferFrom",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "to",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "id",
          "internalType": "uint256"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        },
        {
          "type": "bytes",
          "name": "data",
          "internalType": "bytes"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setApprovalForAll",
      "inputs": [
        {
          "type": "address",
          "name": "operator",
          "internalType": "address"
        },
        {
          "type": "bool",
          "name": "approved",
          "internalType": "bool"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setContractURI",
      "inputs": [
        {
          "type": "string",
          "name": "_uri",
          "internalType": "string"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setDefaultRoyaltyInfo",
      "inputs": [
        {
          "type": "address",
          "name": "_royaltyRecipient",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "_royaltyBps",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setOwner",
      "inputs": [
        {
          "type": "address",
          "name": "_newOwner",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setRewardAmount",
      "inputs": [
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setRoyaltyInfoForToken",
      "inputs": [
        {
          "type": "uint256",
          "name": "_tokenId",
          "internalType": "uint256"
        },
        {
          "type": "address",
          "name": "_recipient",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "_bps",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "inputs": [
        {
          "type": "bytes4",
          "name": "interfaceId",
          "internalType": "bytes4"
        }
      ],
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "symbol",
      "inputs": [],
      "outputs": [
        {
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "totalSupply",
      "inputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "transfetRewardToUser",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "rewardAmount",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "uri",
      "inputs": [
        {
          "type": "uint256",
          "name": "_tokenId",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    }
  ]