import { Connection, PublicKey } from '@solana/web3.js';
import { Program, web3, BN } from '@project-serum/anchor';
import { getProgram } from './anchor-client';

export async function initializeGame(connection: Connection, wallet: PublicKey, stake: number) {
  const program = await getProgram(connection, wallet);
  const game = web3.Keypair.generate();
  const stakeAmount = new BN(stake * web3.LAMPORTS_PER_SOL);

  await program.rpc.initializeGame(stakeAmount, {
    accounts: {
      game: game.publicKey,
      player: wallet,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [game],
  });

  return game.publicKey;
}
