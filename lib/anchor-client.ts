import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3, utils, BN } from '@project-serum/anchor';
import idl from './solana_chess.json';

const programID = new PublicKey('Hp8cLdkPkHkSW9PbXutVUmoDR8pWbrqXLRbY3TmVj5kn');
const opts = {
  preflightCommitment: 'processed'
};

export function getProvider(connection: Connection, wallet: any) {
  const provider = new AnchorProvider(
    connection,
    wallet,
    opts.preflightCommitment,
  );
  return provider;
}

export async function getProgram(connection: Connection, wallet: any) {
  const provider = getProvider(connection, wallet);
  const program = new Program(idl, programID, provider);
  return program;
}
