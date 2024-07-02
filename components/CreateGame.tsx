import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const CreateGame: FC = () => {
  const [stake, setStake] = useState<number>(0.1);
  const { connected, publicKey } = useWallet();

  const handleCreateGame = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const response = await fetch('/api/create-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerAddress: publicKey.toBase58(),
          stake: stake,
        }),
      });

      if (response.ok) {
        const game = await response.json();
        alert(`Game created with ID: ${game.id}`);
      } else {
        alert('Failed to create game');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Error creating game');
    }
  };

  return (
    <div className="mb-4">
      <input
        type="number"
        value={stake}
        onChange={(e) => setStake(Number(e.target.value))}
        className="border p-2 mr-2"
        step="0.1"
        min="0.1"
      />
      <button
        onClick={handleCreateGame}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!connected}
      >
        Create Game
      </button>
    </div>
  );
};

export default CreateGame;
