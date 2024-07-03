import type { NextPage } from 'next'
import Head from 'next/head'
import ChessBoard from '../components/ChessBoard'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Solana Chess</title>
        <meta name="description" content="Chess game on Solana blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Solana Chess</h1>
        <ChessBoard />
      </main>
    </div>
  )
}

export default Home
