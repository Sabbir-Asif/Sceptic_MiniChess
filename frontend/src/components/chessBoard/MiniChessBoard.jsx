import React, { useState } from 'react';
import blackKing from './images/bK.png';
import blackQueen from './images/bQ.png';
import blackBishop from './images/bB.png';
import blackKnight from './images/bN.png';
import blackRook from './images/bR.png';
import blackPawn from './images/bP.png';
import whiteKing from './images/wK.png';
import whiteQueen from './images/wQ.png';
import whiteBishop from './images/wB.png';
import whiteKnight from './images/wN.png';
import whiteRook from './images/wR.png';
import whitePawn from './images/wP.png';

// Initial 5x6 board configuration
const initialBoard = [
  ['blackRook', 'blackKnight', 'blackBishop', 'blackQueen', 'blackKing'],
  ['blackPawn', 'blackPawn', 'blackPawn', 'blackPawn', 'blackPawn'],
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.'],
  ['whitePawn', 'whitePawn', 'whitePawn', 'whitePawn', 'whitePawn'],
  ['whiteRook', 'whiteKnight', 'whiteBishop', 'whiteQueen', 'whiteKing']
];

const pieceImages = {
  blackKing,
  blackQueen,
  blackBishop,
  blackKnight,
  blackRook,
  blackPawn,
  whiteKing,
  whiteQueen,
  whiteBishop,
  whiteKnight,
  whiteRook,
  whitePawn,
};

const MiniChessBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [history, setHistory] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handleClick = (row, col) => {
    const piece = board[row][col];

    // Selecting a piece
    if (selectedPiece === null && piece !== '.') {
      setSelectedPiece(piece);
      setSelectedPosition([row, col]);
      return;
    }

    // If there's already a piece selected, attempt to move
    if (selectedPiece !== null) {
      if (isValidMove(selectedPiece, selectedPosition, [row, col])) {
        const newBoard = board.map((r) => [...r]);
        newBoard[row][col] = selectedPiece; // Move the piece to the new cell
        newBoard[selectedPosition[0]][selectedPosition[1]] = '.'; // Clear the old cell
        setBoard(newBoard);
        
        // Update history
        setHistory([...history, `${selectedPiece} moved from ${selectedPosition[0]}-${selectedPosition[1]} to ${row}-${col}`]);

        // Deselect the piece
        setSelectedPiece(null);
        setSelectedPosition(null);
      } else {
        alert('Invalid move');
        setSelectedPiece(null);
        setSelectedPosition(null);
      }
    }
  };

  // Simple movement validation function
  const isValidMove = (piece, from, to) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;

    // Add movement rules for each type of piece
    switch (piece) {
      case 'blackPawn':
        return fromRow + 1 === toRow && fromCol === toCol;
      case 'whitePawn':
        return fromRow - 1 === toRow && fromCol === toCol;
      case 'blackKnight':
      case 'whiteKnight':
        return (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) ||
               (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2);
      case 'blackBishop':
      case 'whiteBishop':
        return Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol); // Diagonal moves
      case 'blackRook':
      case 'whiteRook':
        return fromRow === toRow || fromCol === toCol; // Horizontal or vertical moves
      case 'blackQueen':
      case 'whiteQueen':
        return (fromRow === toRow || fromCol === toCol ||
                Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)); // Queen moves in all directions
      case 'blackKing':
      case 'whiteKing':
        return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1; // King moves one square in any direction
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8 text-indigo-600">5x6 Chess Game</h1>

      <div className="grid grid-cols-1 gap-8">
        <div className="p-4 bg-white rounded-lg shadow-lg grid grid-cols-5">
          {board.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-16 h-16 flex items-center justify-center border ${ (rowIndex + colIndex) % 2 === 0 ? 'bg-white' : 'bg-gray-300' }`}
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {cell !== '.' && (
                  <img src={pieceImages[cell]} alt={cell} className="w-12 h-12" />
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col items-start">
          <h2 className="text-2xl font-semibold mb-4">Game History</h2>
          <div className="overflow-y-auto max-h-96 w-full">
            <ul className="list-decimal list-inside">
              {history.map((move, index) => (
                <li key={index} className="py-1">
                  {move}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniChessBoard;
