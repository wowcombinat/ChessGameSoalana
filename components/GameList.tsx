import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface Game {
  id: string;
  whiteAddress: string;
  blackAddress: string;
  stake: number;
}

const GameList: FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/get-games');
      if (response.ok) {
        const fetchedGames = await response.json();
        setGames(fetchedGames);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleJoinGame = async (gameId: string) => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const response = await fetch('/api/join-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: gameId,
          playerAddress: publicKey.toBase58(),
        }),
      });

      if (response.ok) {
        alert('Successfully joined the game');
        fetchGames();
      } else {
        alert('Failed to join the game');
      }
    } catch (error) {
      console.error('Error joining game:', error);
      alert('Error joining game');
    }
  };

  return (
    <div>
      {games.map((game) => (
        <div key={game.id} className="border p-4 mb-4">
          <p>Game ID: {game.id}</p>
          <p>Stake: {game.stake} SOL</p>
          <p>White: {game.whiteAddress}</p>
          <p>Black: {game.blackAddress || 'Waiting for player'}</p>
          {!game.blackAddress && (
            <button
              onClick={() => handleJoinGame(game.id)}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
              disabled={!connected}
            >
              Join Game
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default GameList;
