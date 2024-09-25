import { useState } from 'react';

const Bridge = () => {
  const [fromNetwork, setFromNetwork] = useState('eth');
  const [toNetwork, setToNetwork] = useState('eth');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBridge = async () => {
    setLoading(true);
    setSuccess(false);
    
    // Simulating the bridging process
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    setLoading(false);
    setSuccess(true);
    
    console.log(`Bridged ${amount} USDC from ${fromNetwork} to ${toNetwork}`);
    
    setTimeout(() => {
      setSuccess(false);
      setAmount('');
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-md mx-auto">
      <img 
        src="https://zengo.com/wp-content/uploads/USDC-to-Chainlink.png" 
        alt="Bridge USDC" 
        className="w-full h-auto max-h-64 object-contain rounded-lg mb-4"
      />
      <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-sm text-gray-600 mb-1">From Network</label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <img 
                src="https://cryptologos.cc/logos/ethereum-eth-logo.png" 
                alt="From Network" 
                className="w-6 h-6 mr-2" 
              />
              <select 
                value={fromNetwork} 
                onChange={(e) => setFromNetwork(e.target.value)} 
                className="flex-1 bg-transparent focus:outline-none"
              >
                <option value="eth">Ethereum</option>
                <option value="avax">Avalanche</option>
                <option value="bsc">Binance Smart Chain</option>
              </select>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-600 mb-1">To Network</label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <img 
                src="https://cryptologos.cc/logos/ethereum-eth-logo.png" 
                alt="To Network" 
                className="w-6 h-6 mr-2" 
              />
              <select 
                value={toNetwork} 
                onChange={(e) => setToNetwork(e.target.value)} 
                className="flex-1 bg-transparent focus:outline-none"
              >
                <option value="eth">Ethereum</option>
                <option value="avax">Avalanche</option>
                <option value="bsc">Binance Smart Chain</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center border border-gray-300 rounded-lg p-2">
          <img 
            src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" 
            alt="USDC" 
            className="w-6 h-6 mr-2" 
          />
          <input 
            type="number" 
            placeholder="Amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            className="flex-1 bg-transparent focus:outline-none"
          />
        </div>
        <button 
          onClick={handleBridge} 
          disabled={loading} 
          className={`bg-blue-500 text-white font-bold py-3 rounded-lg w-full transition duration-300 ${loading ? 'bg-gradient-to-r from-blue-400 to-pink-400 animate-pulse' : ''} ${success ? 'bg-green-500' : ''}`}
        >
          {loading ? 'Bridging...' : (success ? <span className="text-white text-2xl mr-2">✓</span> : 'Bridge USDC')}
        </button>
      </div>
    </div>
  );
};

export default Bridge;
