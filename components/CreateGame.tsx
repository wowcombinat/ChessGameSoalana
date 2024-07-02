import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';

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
      const response = await fetch('/api/create-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stake,
          walletPublicKey: publicKey.toBase58(),
        }),
      });

      if (response.ok) {
        const { gameId } = await response.json();
        alert(`Game created with ID: ${gameId}`);
      } else {
        alert('Failed to create game');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Error creating game');
    }
  };

  // ... rest of the component
};

export default CreateGame;
