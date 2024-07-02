import type { NextPage } from 'next';
import Head from 'next/head';
import WalletConnect from '../components/WalletConnect';
import ChessBoard from '../components/ChessBoard';

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
        <div className="mt-8">
          <ChessBoard />
        </div>
      </main>
    </div>
  );
};

export default Home;
