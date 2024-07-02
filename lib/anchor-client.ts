import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import idl from './solana_chess.json';

const programID = new PublicKey('Hp8cLdkPkHkSW9PbXutVUmoDR8pWbrqXLRbY3TmVj5kn');
const opts: web3.ConfirmOptions = {
  preflightCommitment: 'processed' as const
};

export function getProvider(connection: Connection, wallet: any) {
  const provider = new AnchorProvider(
    connection,
    wallet,
    opts
  );
  return provider;
}

export async function getProgram(connection: Connection, wallet: any) {
  const provider = getProvider(connection, wallet);
  // @ts-ignore
  const program = new Program(idl, programID, provider);
  return program;
}
