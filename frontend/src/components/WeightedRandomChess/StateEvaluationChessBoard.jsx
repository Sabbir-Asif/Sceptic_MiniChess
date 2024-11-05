import { useEffect, useState } from 'react';
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


const pieceValues = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 100
};

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

const StateEvaluationChessBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState('w');
  const [gameOver, setGameOver] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [userSide, setUserSide] = useState('w');
  const [sideConfirmed, setSideConfirmed] = useState(false);

  const resetGame = () => {
    setBoard(initialBoard);
    setHighlightedCells([]);
    setMoveCount(0);
    setCurrentPlayer('w');
    setGameOver(false);
    setGameHistory([]);
    setShowModal(false);
    setSideConfirmed(false);
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


  const isInCheck = (color) => {
    const kingPos = findKingPosition(color);
    if (!kingPos) return false;

    const opponentColor = color === 'w' ? 'b' : 'w';
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = board[row][col];
        if (piece[0] === opponentColor) {
          const moves = getValidMoves(piece, row, col, board);
          if (moves.some(move => move.row === kingPos.row && move.col === kingPos.col)) {
            return true;
          }
        }
      }
    }
    return false;
  };


  const hasLegalMoves = (color) => {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = board[row][col];
        if (piece && piece[0] === color) {
          const validMoves = getValidMoves(piece, row, col, board);
          if (validMoves.some(move => {
            const newBoard = simulateMove(row, col, move.row, move.col);
            return !isInCheck(color, newBoard);
          })) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const checkGameOver = () => {
    const opponent = currentPlayer === 'w' ? 'b' : 'w';
    if (!findKingPosition(currentPlayer)) {
      setModalMessage(`${opponent} wins! The ${currentPlayer === 'w' ? 'white' : 'black'} king has been captured.`);
      setShowModal(true);
      setGameOver(true);
    } else if (!hasLegalMoves(currentPlayer)) {
      if (isInCheck(currentPlayer)) {
        setModalMessage(`${opponent} wins by checkmate!`);
      } else {
        setModalMessage("It's a stalemate! Draw.");
      }
      setShowModal(true);
      setGameOver(true);
    } else if (moveCount >= 40) {
      setModalMessage('Draw! Maximum number of moves (40) reached.');
      setShowModal(true);
      setGameOver(true);
    }
  };

  const aiMove = () => {
    if (gameOver || currentPlayer !== (userSide === 'w' ? 'b' : 'w')) return;

    let bestMove = null;
    let bestScore = -Infinity;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = board[row][col];
        if (piece[0] === currentPlayer) {
          const moves = getValidMoves(piece, row, col, board);
          for (const move of moves) {
            const newBoard = simulateMove(row, col, move.row, move.col);
            const moveScore = evaluateBoard(newBoard);
            if (moveScore > bestScore) {
              bestScore = moveScore;
              bestMove = { from: { row, col }, to: move };
            }
          }
        }
      }
    }
    if (bestMove) {
      const { from, to } = bestMove;
      setBoard(prevBoard => {
        const updatedBoard = prevBoard.map(row => [...row]);
        updatedBoard[to.row][to.col] = updatedBoard[from.row][from.col];
        updatedBoard[from.row][from.col] = '.';
        return updatedBoard;
      });
      setMoveCount(prev => prev + 1);
      setCurrentPlayer(currentPlayer === 'w' ? 'b' : 'w');
    }
  };


  const evaluateBoard = (board) => {
    let score = 0;
    for (const row of board) {
      for (const cell of row) {
        if (cell !== '.') {
          const value = pieceValues[cell[1]];
          score += cell[0] === 'b' ? value : -value;
        }
      }
    }
    return score;
  };

  const simulateMove = (startRow, startCol, endRow, endCol) => {
    const newBoard = board.map(row => [...row]);
    newBoard[endRow][endCol] = newBoard[startRow][startCol];
    newBoard[startRow][startCol] = '.';
    return newBoard;
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

  useEffect(() => {
    if (!sideConfirmed && userSide === 'b' && currentPlayer === 'w') {
      aiMove();
    }
  }, [sideConfirmed]);

  useEffect(() => {
    if (sideConfirmed && currentPlayer !== userSide) {
      aiMove();
    }
  }, [currentPlayer, sideConfirmed]);



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

  if (!sideConfirmed) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-green-info">Choose Your Side</h1>
        <select value={userSide} onChange={(e) => setUserSide(e.target.value)} className="select select-bordered mb-4 w-full max-w-xs">
          <option value="w">White</option>
          <option value="b">Black</option>
        </select>
        <button
          onClick={() => setSideConfirmed(true)}
          className="btn btn-primary"
        >
          Confirm
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-2 text-green-info">5x6 Chess Game</h1>
      <h2 className="text-lg text-gray-300 font-medium mb-4">You are playing as: {userSide === 'w' ? 'White' : 'Black'}</h2>
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
              <div key={index} className='text-gray-300 text-center'>{move}</div>
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
              <button className="btn" onClick={resetGame}>Play Again</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateEvaluationChessBoard;