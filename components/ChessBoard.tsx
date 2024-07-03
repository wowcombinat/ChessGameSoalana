import { FC, useState, useEffect } from 'react';
import { Chess } from 'chess.js';

interface Piece {
  type: string;
  color: string;
}

const ChessBoard: FC = () => {
  const [game, setGame] = useState<Chess>(new Chess());
  const [board, setBoard] = useState<(Piece | null)[][]>([]);

  useEffect(() => {
    updateBoard();
  }, [game]);

  const updateBoard = () => {
    setBoard(game.board());
  };

  const handleSquareClick = (row: number, col: number) => {
    // Implement move logic here
  };

  return (
    <div className="chess-board">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`square ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'}`}
            onClick={() => handleSquareClick(rowIndex, colIndex)}
          >
            {piece && (
              <div className={`piece ${piece.color}`}>
                {piece.type}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ChessBoard;
