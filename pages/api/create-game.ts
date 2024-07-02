import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import { initializeGame } from '../../lib/solanaChess';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { stake, walletPublicKey } = req.body;
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!);
      const wallet = {
        publicKey: new PublicKey(walletPublicKey),
        signTransaction: async () => { throw new Error('Wallet method not implemented'); },
        signAllTransactions: async () => { throw new Error('Wallet method not implemented'); },
      };

      const gamePublicKey = await initializeGame(connection, wallet, stake);
      res.status(200).json({ gameId: gamePublicKey.toBase58() });
    } catch (error) {
      console.error('Error creating game:', error);
      res.status(500).json({ error: 'Error creating game' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
