import { useState } from 'react';
import blackKing from '/images/bK.png';
import blackQueen from '/images/bQ.png';
import blackBishop from '/images/bB.png';
import blackKnight from '/images/bN.png';
import blackRook from '/images/bR.png';
import blackPawn from '/images/bP.png';
import whiteKing from '/images/wK.png';
import whiteQueen from '/images/wQ.png';
import whiteBishop from '/images/wB.png';
import whiteKnight from '/images/wN.png';
import whiteRook from '/images/wR.png';
import whitePawn from '/images/wP.png';
import useDragAndDrop from './helper/useDragAndDrop';
import getValidMoves from './helper/MoveLogic';

const pieceImages = {
  bk: blackKing,
  bq: blackQueen,
  bb: blackBishop,
  bn: blackKnight,
  br: blackRook,
  bp: blackPawn,
  wk: whiteKing,
  wq: whiteQueen,
  wb: whiteBishop,
  wn: whiteKnight,
  wr: whiteRook,
  wp: whitePawn,
};

const initialBoard = [
  ['br', 'bn', 'bb', 'bq', 'bk'],
  ['bp', 'bp', 'bp', 'bp', 'bp'],
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.'],
  ['wp', 'wp', 'wp', 'wp', 'wp'],
  ['wr', 'wn', 'wb', 'wq', 'wk']
];

const MiniChessBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState('w');
  const [gameOver, setGameOver] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const resetGame = () => {
    setBoard(initialBoard);
    setHighlightedCells([]);
    setMoveCount(0);
    setCurrentPlayer('w');
    setGameOver(false);
    setGameHistory([]);
    setShowModal(false);
  };

  const checkGameOver = () => {
    const whiteKingPosition = findKingPosition('w');
    const blackKingPosition = findKingPosition('b');

    if (!whiteKingPosition) {
      setModalMessage('Black wins! The white king has been captured.');
      setShowModal(true);
      setGameOver(true);
      return;
    } else if (!blackKingPosition) {
      setModalMessage('White wins! The black king has been captured.');
      setShowModal(true);
      setGameOver(true);
      return;
    }

    if (moveCount >= 40) {
      setModalMessage('Draw! Maximum number of moves (40) reached.');
      setShowModal(true);
      setGameOver(true);
      return;
    }

    if (!hasLegalMoves(currentPlayer)) {
      setModalMessage(`${currentPlayer === 'w' ? 'White' : 'Black'} has no legal moves. ${currentPlayer === 'w' ? 'Black wins!' : 'White wins!'}`);
      setShowModal(true);
      setGameOver(true);
    }
  };

  const findKingPosition = (color) => {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        if (board[row][col] === (color === 'w' ? 'wk' : 'bk')) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const hasLegalMoves = (color) => {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = board[row][col];
        if (piece && piece[0] === color) {
          const validMoves = getValidMoves(piece, row, col, board);
          if (validMoves.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const handlePieceClick = (piece, row, col) => {
    if (!gameOver && piece[0] === currentPlayer) {
      const validMoves = getValidMoves(piece, row, col, board);
      const newHighlightedCells = validMoves.map(move => ({
        row: move.row,
        col: move.col,
        isCapture: board[move.row][move.col] !== '.'
      }));
      setHighlightedCells(newHighlightedCells);
    }
  };

  const { onDragStart, onDrop, onDragEndOutsideBoard } = useDragAndDrop(
    board,
    setBoard,
    setMoveCount,
    checkGameOver,
    currentPlayer,
    setCurrentPlayer,
    setGameHistory,
    setHighlightedCells,
    gameOver
  );

  const renderCell = (cell, row, col) => {
    const highlight = highlightedCells.find(
      (highlight) => highlight.row === row && highlight.col === col
    );

    return (
      <div
        key={`${row}-${col}`}
        className={`w-24 h-24 flex items-center justify-center border relative 
          ${(row + col) % 2 === 0 ? 'bg-green-primary' : 'bg-green-info'}
        `}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => onDrop(row, col)}
        onClick={() => cell !== '.' && handlePieceClick(cell, row, col)}
      >
        {highlight && (
          <div
            className={`absolute w-16 h-16 rounded-full 
              ${highlight.isCapture ? 'bg-red-500' : 'bg-black'} 
              opacity-30 z-10`}
          />
        )}
        {cell !== '.' && (
          <img
            src={pieceImages[cell]}
            alt={cell}
            className="w-20 h-20 z-20 relative"
            draggable
            onDragStart={() => onDragStart(cell, row, col)}
            onDragEnd={onDragEndOutsideBoard}
          />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-2 text-green-info">5x6 Chess Game</h1>
      <h2 className="text-lg text-gray-300 font-medium mb-4">
        Current Turn: <span className={currentPlayer === 'w' ? 'text-green-info' : 'text-green-info'}>
          {currentPlayer === 'w' ? 'White' : 'Black'}
        </span>
      </h2>
      <div className="flex gap-4">
        <div className="relative grid grid-cols-5">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
          )}
        </div>
        <div className="text-green-info">
          <h2 className="text-lg font-bold">Game History</h2>
          <div className="mt-2 max-h-[530px] overflow-scroll">
            {gameHistory.map((move, index) => (
              <div key={index}
                className='text-gray-300 text-center'>
                {move}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Game Over!</h3>
            <p className="py-4">{modalMessage}</p>
            <div className="modal-action">
              <button className="btn" onClick={resetGame}>
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniChessBoard;
