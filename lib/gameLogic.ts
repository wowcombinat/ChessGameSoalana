import { Chess } from 'chess.js';

export interface GameState {
  id: string;
  fen: string;
  turn: 'w' | 'b';
  whiteAddress: string;
  blackAddress: string;
  stake: number;
}

export const createGame = (playerAddress: string, stake: number): GameState => {
  const game = new Chess();
  return {
    id: Math.random().toString(36).substr(2, 9),
    fen: game.fen(),
    turn: 'w',
    whiteAddress: playerAddress,
    blackAddress: '',
    stake: stake,
  };
};

export const makeMove = (gameState: GameState, from: string, to: string): GameState | null => {
  const game = new Chess(gameState.fen);
  const move = game.move({ from, to });

  if (move === null) {
    return null;
  }

  return {
    ...gameState,
    fen: game.fen(),
    turn: game.turn() as 'w' | 'b',
  };
};
