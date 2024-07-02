import { FC, useState, useEffect } from 'react';
import { Chess } from 'chess.js';

const ChessBoard: FC = () => {
  const [game, setGame] = useState<Chess>(new Chess());
  const [board, setBoard] = useState<string[][]>([]);

  useEffect(() => {
    updateBoard();
  }, [game]);

  const updateBoard = () => {
    setBoard(game.board());
  };

  const handleSquareClick = (row: number, col: number) => {
    const square = String.fromCharCode(97 + col) + (8 - row);
    const moves = game.moves({ square: square, verbose: true });

    if (moves.length > 0) {
      const move = moves[0];
      game.move(move);
      updateBoard();
    }
  };

  return (
    <div className="grid grid-cols-8 gap-0 w-96 h-96 border border-gray-300">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-12 h-12 flex items-center justify-center ${
              (rowIndex + colIndex) % 2 === 0 ? 'bg-white' : 'bg-gray-200'
            }`}
            onClick={() => handleSquareClick(rowIndex, colIndex)}
          >
            {piece && (
              <span className="text-3xl">
                {piece.type === 'p' ? (piece.color === 'w' ? '♙' : '♟︎') :
                 piece.type === 'r' ? (piece.color === 'w' ? '♖' : '♜') :
                 piece.type === 'n' ? (piece.color === 'w' ? '♘' : '♞') :
                 piece.type === 'b' ? (piece.color === 'w' ? '♗' : '♝') :
                 piece.type === 'q' ? (piece.color === 'w' ? '♕' : '♛') :
                 piece.type === 'k' ? (piece.color === 'w' ? '♔' : '♚') : ''}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ChessBoard;
