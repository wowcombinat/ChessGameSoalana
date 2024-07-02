import type { NextPage } from 'next';
import Head from 'next/head';
import WalletConnect from '../components/WalletConnect';
import ChessBoard from '../components/ChessBoard';
import GameList from '../components/GameList';
import CreateGame from '../components/CreateGame';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Шахматы на Solana</title>
        <meta name="description" content="Играйте в шахматы на блокчейне Solana" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Шахматы на Solana</h1>
        <WalletConnect />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Создать игру</h2>
            <CreateGame />
            <h2 className="text-2xl font-bold mb-4 mt-8">Список игр</h2>
            <GameList />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Шахматная доска</h2>
            <ChessBoard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
