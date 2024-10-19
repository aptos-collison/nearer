import { abi } from '@/constants';
import { ethers } from 'ethers';

export const BASE_CONTRACT = "0x0466A29D90D95365E98FC477AD39D7c00E31Dc3C";

// Define types for better type safety
export interface VotingOption {
  name: string;
  voteCount: bigint;
}

export interface VotingState {
  isOpen: boolean;
  remainingTime: bigint;
  options: VotingOption[];
}

// Define the contract ABI
export const contractABI = abi;

/**
 * Gets an instance of the voting contract
 * @param provider The Web3Provider instance
 * @returns Contract instance
 */
export const getContract = async (provider: ethers.BrowserProvider) => {
  const signer = await provider.getSigner();
  return new ethers.Contract(BASE_CONTRACT, contractABI, signer);
};

/**
 * Formats the remaining time into a readable string
 * @param seconds Time in seconds
 * @returns Formatted time string (HH:MM:SS)
 */
export const formatTimeRemaining = (seconds: bigint): string => {
  const secondsNumber = Number(seconds);
  const hours = Math.floor(secondsNumber / 3600);
  const minutes = Math.floor((secondsNumber % 3600) / 60);
  const remainingSeconds = secondsNumber % 60;
  
  return [hours, minutes, remainingSeconds]
    .map(val => String(val).padStart(2, '0'))
    .join(':');
};

/**
 * Calculates the vote percentage for an option
 * @param voteCount Number of votes for the option
 * @param totalVotes Total number of votes
 * @returns Formatted percentage string
 */
export const calculateVotePercentage = (voteCount: bigint, totalVotes: bigint): string => {
  if (totalVotes === 0n) return "0%";
  
  // Convert to numbers for percentage calculation
  const percentage = Number((voteCount * 1000n) / totalVotes) / 10;
  return `${percentage.toFixed(1)}%`;
};

/**
 * Validates an election name
 * @param name The election name to validate
 * @returns true if valid, false otherwise
 */
export const isValidElectionName = (name: string): boolean => {
  return name.length > 0 && name.length <= 32 && /^[a-zA-Z0-9-_]+$/.test(name);
};

/**
 * Helper function to handle contract errors
 * @param error The error object
 * @returns Formatted error message
 */
export const formatContractError = (error: any): string => {
  // Handle specific contract errors
  if (error.code === 'ACTION_REJECTED') {
    return 'Transaction was rejected by user';
  }
  
  // Extract error message from contract error
  const errorMessage = error.reason || error.message || 'An unknown error occurred';
  return errorMessage.replace('execution reverted: ', '');
};

// Helper function to convert number to BigInt
export const toBigInt = (value: number): bigint => {
  return BigInt(Math.floor(value));
};