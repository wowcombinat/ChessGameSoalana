import { PublicKey } from '@solana/web3.js';
import { web3, BN } from '@project-serum/anchor';
import { getProgram } from './anchor-client';

export async function initializeGame(connection: web3.Connection, wallet: any, stake: number) {
  const program = await getProgram(connection, wallet);
  const game = web3.Keypair.generate();
  const stakeAmount = new BN(stake * web3.LAMPORTS_PER_SOL);

  await program.rpc.initializeGame(stakeAmount, {
    accounts: {
      game: game.publicKey,
      player: wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [game],
  });

  return game.publicKey;
}

export async function joinGame(connection: web3.Connection, wallet: any, gamePublicKey: PublicKey) {
  const program = await getProgram(connection, wallet);

  await program.rpc.joinGame({
    accounts: {
      game: gamePublicKey,
      player: wallet.publicKey,
    },
  });
}

export async function makeMove(connection: web3.Connection, wallet: any, gamePublicKey: PublicKey, from: number, to: number, promotion: string | null) {
  const program = await getProgram(connection, wallet);

  await program.rpc.makeMove(from, to, promotion, {
    accounts: {
      game: gamePublicKey,
      player: wallet.publicKey,
    },
  });
}

export async function resignGame(connection: web3.Connection, wallet: any, gamePublicKey: PublicKey) {
  const program = await getProgram(connection, wallet);

  await program.rpc.resign({
    accounts: {
      game: gamePublicKey,
      player: wallet.publicKey,
    },
  });
}

export async function offerDraw(connection: web3.Connection, wallet: any, gamePublicKey: PublicKey) {
  const program = await getProgram(connection, wallet);

  await program.rpc.offerDraw({
    accounts: {
      game: gamePublicKey,
      player: wallet.publicKey,
    },
  });
}

export async function acceptDraw(connection: web3.Connection, wallet: any, gamePublicKey: PublicKey) {
  const program = await getProgram(connection, wallet);

  await program.rpc.acceptDraw({
    accounts: {
      game: gamePublicKey,
      player: wallet.publicKey,
    },
  });
}
