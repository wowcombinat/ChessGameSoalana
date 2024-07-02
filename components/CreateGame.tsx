import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { initializeGame } from '../lib/solanaChess';

const CreateGame: FC = () => {
  const [stake, setStake] = useState<number>(0.1);
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();

  const handleCreateGame = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const gamePublicKey = await initializeGame(connection, publicKey, stake);
      console.log('Game created with public key:', gamePublicKey.toBase58());
      alert(`Game created with ID: ${gamePublicKey.toBase58()}`);
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Error creating game');
    }
  };

  return (
    <div>
      <input
        type="number"
        value={stake}
        onChange={(e) => setStake(Number(e.target.value))}
        min="0.1"
        step="0.1"
      />
      <button onClick={handleCreateGame} disabled={!connected}>
        Create Game
      </button>
    </div>
  );
};

export default CreateGame;
