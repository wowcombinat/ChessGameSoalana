import type { NextPage } from 'next'
import Head from 'next/head'
import ChessBoard from '../components/ChessBoard'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Chess Game</title>
        <meta name="description" content="Simple chess game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Chess Game</h1>
        <ChessBoard />
      </main>
    </div>
  )
}

export default Home
