import React, { useState } from 'react';

const Donate: React.FC = () => {
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  
  const predefinedAmounts: number[] = [10, 50, 100];

  const handlePredefinedDonation = (amount: number): void => {
    setDonationAmount(amount.toString());
    handleDonation(amount);
  };

  const handleDonation = async (amount: number): Promise<void> => {
    setLoading(true);
    setSuccess(false);

    const recipient = '0x53FA684bDd93da5324BDc8B607F8E35eC79ccF5A';
    const tokenAddress = '0x4d224452801ACEd8B2F0aebE155379bb5D594381'; // replace with token address
    const decimals = 18; // replace with token decimals

    if (typeof window.ethereum !== 'undefined') {
      try {
        console.log('Sending transaction');
        const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const publicKey: string = accounts[0];
        const amountToSend: string = (amount * Math.pow(10, decimals)).toString(16);

        const data: string = '0xa9059cbb' + recipient.substring(2).padStart(64, '0') + amountToSend.padStart(64, '0');
        const transactionParameters = {
          to: tokenAddress,
          from: publicKey,
          data: data,
        };

        const txHash: string = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });

        checkTransactionStatus(txHash);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    } else {
      alert('MetaMask is not installed');
      setLoading(false);
    }
  };

  const checkTransactionStatus = async (hash: string): Promise<void> => {
    const receipt: any = await window.ethereum.request({
      method: 'eth_getTransactionReceipt',
      params: [hash],
    });

    if (receipt && receipt.blockNumber) {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setDonationAmount('');
      }, 3000);
    } else {
      setTimeout(() => checkTransactionStatus(hash), 1000);
    }
  };

  const handleClick = (): void => {
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
    handleDonation(amount);
  };

  return (
    <div className="relative bg-white rounded-lg p-4 w-full max-w-md shadow-md mt-4">
      <img
        src="https://t4.ftcdn.net/jpg/05/76/12/63/360_F_576126362_ll2tqdvXs27cDRRovBTmFCkPM9iX68iL.jpg"
        alt="Background Image"
        className="w-full rounded-lg mb-2"
      />
      <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-2">
        <div className="flex items-center border border-gray-300 rounded-lg p-2">
          <img
            src="https://etherscan.io/token/images/apecoin_32.png"
            alt="APE"
            className="w-6 h-6 mr-2"
          />
          <input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder="Enter donation amount"
            className="flex-1 bg-transparent focus:outline-none"
          />
        </div>
        <button
          onClick={handleClick}
          disabled={loading}
          className={`bg-blue-500 text-white font-bold py-2 rounded-lg w-full transition duration-300 ${loading ? 'bg-gradient-to-r from-blue-400 to-pink-400 animate-pulse' : ''} ${success ? 'bg-green-500' : ''}`}
        >
          {loading ? 'Donating...' : (success ? <span className="text-white text-2xl mr-2">✓</span> : 'Donate APE')}
        </button>
        <div className="flex justify-between mt-2">
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handlePredefinedDonation(amount)}
              className="flex-1 mx-1 bg-blue-200 text-blue-800 font-semibold py-1 rounded-lg"
            >
              Donate {amount} APE
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Donate;
