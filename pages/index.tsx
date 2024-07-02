import type { NextPage } from 'next'
import Head from 'next/head'
import { useWallet } from '@solana/wallet-adapter-react'
import dynamic from 'next/dynamic'
import styles from '../styles/Home.module.css'
import ChessBoard from '../components/ChessBoard'
import CreateGame from '../components/CreateGame'

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

const Home: NextPage = () => {
  const { connected } = useWallet()

  return (
    <div className={styles.container}>
      <Head>
        <title>Solana Chess</title>
        <meta name="description" content="Chess game on Solana blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Solana Chess
        </h1>

        <WalletMultiButtonDynamic />

        {connected ? (
          <div>
            <p>Your wallet is connected!</p>
            <CreateGame />
            <ChessBoard />
          </div>
        ) : (
          <p>Please connect your wallet to play</p>
        )}
      </main>

      <footer className={styles.footer}>
        
          href="https://solana.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Solana
        </a>
      </footer>
    </div>
  )
}

export default Home
