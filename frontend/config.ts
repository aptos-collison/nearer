import { Chain } from 'wagmi/chains';

export const aurora: Chain = {
  id: 1313161554,
  name: 'Aurora Mainnet',
  testnet: false,
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.aurora.dev'],
    },
    public: {
      http: ['https://mainnet.aurora.dev'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Aurorascan',
      url: 'https://aurorascan.dev',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 62840020,
    },
  },
};

export const auroraTestnet: Chain = {
  id: 1313161555,
  name: 'Aurora Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.aurora.dev'],
    },
    public: {
      http: ['https://testnet.aurora.dev'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Aurorascan',
      url: 'https://testnet.aurorascan.dev',
    },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 7385001,
    },
  },
};