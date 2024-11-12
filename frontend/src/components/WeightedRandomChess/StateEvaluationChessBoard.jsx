import React, { useEffect, useState } from 'react';
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
import getValidMoves from './helper/MoveLogic'

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
  const [inCheck, setInCheck] = useState(false);

  const findKingPosition = (color, currentBoard = board) => {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        if (currentBoard[row][col] === `${color}k`) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const isInCheck = (color, testBoard = board) => {
    const kingPos = findKingPosition(color, testBoard);
    if (!kingPos) return false;

    const opponentColor = color === 'w' ? 'b' : 'w';
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = testBoard[row][col];
        if (piece[0] === opponentColor) {
          const moves = getValidMoves(piece, row, col, testBoard, true);
          if (moves.some(move => move.row === kingPos.row && move.col === kingPos.col)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const simulateMove = (startRow, startCol, endRow, endCol, currentBoard = board) => {
    const newBoard = currentBoard.map(row => [...row]);
    newBoard[endRow][endCol] = newBoard[startRow][startCol];
    newBoard[startRow][startCol] = '.';
    return newBoard;
  };

  const getLegalMoves = (piece, row, col) => {
    const validMoves = getValidMoves(piece, row, col, board, true);
    return validMoves.filter(move => {
      const simulatedBoard = simulateMove(row, col, move.row, move.col);
      return !isInCheck(piece[0], simulatedBoard);
    });
  };

  const hasLegalMoves = (color) => {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = board[row][col];
        if (piece[0] === color) {
          const legalMoves = getLegalMoves(piece, row, col);
          if (legalMoves.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const evaluateBoard = (currentBoard, forColor) => {
    let score = 0;
    const multiplier = forColor === 'b' ? 1 : -1;

    // Material score
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = currentBoard[row][col];
        if (piece !== '.') {
          const value = pieceValues[piece[1]] * (piece[0] === 'b' ? 1 : -1);
          score += value;
        }
      }
    }

    // Positional evaluation
    const centerControl = (row, col) => {
      if (row >= 2 && row <= 3 && col >= 1 && col <= 3) {
        return 0.3; // Center squares are valuable
      }
      return 0;
    };

    const mobilityScore = (piece, row, col) => {
      const legalMoves = getLegalMoves(piece, row, col);
      return legalMoves.length * 0.1;
    };

    const kingsSafetyScore = (currentBoard) => {
      const whiteKingPos = findKingPosition('w', currentBoard);
      const blackKingPos = findKingPosition('b', currentBoard);

      let whiteKingSafetyScore = 0;
      let blackKingSafetyScore = 0;

      if (whiteKingPos) {
        const whiteKingRow = whiteKingPos.row;
        const whiteKingCol = whiteKingPos.col;
        whiteKingSafetyScore = (4 - Math.abs(whiteKingRow - 3)) * 0.2 + (2 - Math.abs(whiteKingCol - 2)) * 0.2;
      }

      if (blackKingPos) {
        const blackKingRow = blackKingPos.row;
        const blackKingCol = blackKingPos.col;
        blackKingSafetyScore = (4 - Math.abs(blackKingRow - 2)) * 0.2 + (2 - Math.abs(blackKingCol - 2)) * 0.2;
      }

      return (whiteKingSafetyScore - blackKingSafetyScore) * multiplier;
    };

    // Add positional bonuses
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = currentBoard[row][col];
        if (piece !== '.') {
          score += centerControl(row, col) * (piece[0] === 'b' ? 1 : -1);
          score += mobilityScore(piece, row, col) * (piece[0] === 'b' ? 1 : -1);
        }
      }
    }

    // King safety
    score += kingsSafetyScore(currentBoard);

    // Check status
    if (isInCheck('w', currentBoard)) {
      score -= 0.5 * multiplier;
    }
    if (isInCheck('b', currentBoard)) {
      score += 0.5 * multiplier;
    }

    return score;
  };

  const getMinMaxMove = (depth, isMaximizing, alpha, beta, currentBoard, color) => {
    // Check if the AI's king is in check
    const isAIInCheck = isInCheck(color, currentBoard);

    // If the search depth is 0 or the game is over, return the evaluated score
    if (depth === 0 || !hasLegalMoves(color)) {
      return { score: evaluateBoard(currentBoard, color) };
    }

    let bestMove = null;
    let bestScore = isMaximizing ? -Infinity : Infinity;

    // Get all legal moves for the current player
    const moves = [];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = currentBoard[row][col];
        if (piece[0] === color) {
          const validMoves = getLegalMoves(piece, row, col);
          validMoves.forEach(move => {
            moves.push({
              from: { row, col },
              to: move,
              piece
            });
          });
        }
      }
    }

    // If the AI's king is in check, prioritize moves that get the king out of check
    if (isAIInCheck) {
      moves.sort((a, b) => {
        const aNewBoard = simulateMove(a.from.row, a.from.col, a.to.row, a.to.col, currentBoard);
        const bNewBoard = simulateMove(b.from.row, b.from.col, b.to.row, b.to.col, currentBoard);
        const aInCheck = isInCheck(color, aNewBoard);
        const bInCheck = isInCheck(color, bNewBoard);

        if (aInCheck && !bInCheck) return 1;
        if (!aInCheck && bInCheck) return -1;
        return 0;
      });
    }

    for (const move of moves) {
      const newBoard = simulateMove(
        move.from.row,
        move.from.col,
        move.to.row,
        move.to.col,
        currentBoard
      );

      const result = getMinMaxMove(
        depth - 1,
        !isMaximizing,
        alpha,
        beta,
        newBoard,
        color
      );

      if (isMaximizing) {
        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, bestScore);
      } else {
        if (result.score < bestScore) {
          bestScore = result.score;
          bestMove = move;
        }
        beta = Math.min(beta, bestScore);
      }

      if (beta <= alpha) {
        break;
      }
    }

    return { move: bestMove, score: bestScore };
  };

  const aiMove = () => {
    if (gameOver || currentPlayer !== (userSide === 'w' ? 'b' : 'w')) return;

    const result = getMinMaxMove(3, true, -Infinity, Infinity, board, currentPlayer);
    
    if (result.move) {
      const { from, to } = result.move;
      const newBoard = simulateMove(from.row, from.col, to.row, to.col);
      setBoard(newBoard);
      setMoveCount(prev => prev + 1);
      setCurrentPlayer(current => current === 'w' ? 'b' : 'w');

      const notation = createMoveNotation(
        board[from.row][from.col],
        board[to.row][to.col],
        to.row,
        to.col
      );
      setGameHistory(prev => [...prev, notation]);

      // Play sound based on move type
      if (board[to.row][to.col] !== '.') {
        new Audio("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3").play();
      } else {
        new Audio("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-opponent.mp3").play();
      }

      checkGameOver(newBoard);
    }
  };

  const checkGameOver = (currentBoard = board) => {
    const opponent = currentPlayer === 'w' ? 'b' : 'w';
    
    if (!findKingPosition(currentPlayer, currentBoard)) {
      setModalMessage(`${opponent.toUpperCase()} wins! The ${currentPlayer === 'w' ? 'White' : 'Black'} king has been captured.`);
      setShowModal(true);
      setGameOver(true);
      return true;
    }

    const inCheck = isInCheck(currentPlayer, currentBoard);
    setInCheck(inCheck);

    if (!hasLegalMoves(currentPlayer)) {
      if (inCheck) {
        setModalMessage(`${opponent.toUpperCase()} wins by checkmate!`);
        setShowModal(true);
        setGameOver(true);
        return true;
      } else {
        setModalMessage("It's a stalemate! Draw.");
        setShowModal(true);
        setGameOver(true);
        return true;
      }
    }

    if (moveCount >= 40) {
      setModalMessage('Draw! Maximum number of moves (40) reached.');
      setShowModal(true);
      setGameOver(true);
      return true;
    }

    return false;
  };

  const handlePieceClick = (piece, row, col) => {
    if (!gameOver && piece[0] === currentPlayer) {
      const legalMoves = getLegalMoves(piece, row, col);
      const newHighlightedCells = legalMoves.map(move => ({
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
      setTimeout(aiMove, 500);
    }
  }, [currentPlayer, sideConfirmed]);

  const createMoveNotation = (piece, capturedPiece, endRow, endCol) => {
    const pieceNotation = piece[1].toUpperCase();
    const targetSquare = `${String.fromCharCode(97 + endCol)}${6 - endRow}`;
    
    if (capturedPiece !== '.') {
      return `${pieceNotation}x${targetSquare}${isInCheck(currentPlayer === 'w' ? 'b' : 'w') ? '+' : ''}`;
    }
    return `${pieceNotation === 'P' ? '' : pieceNotation}${targetSquare}${isInCheck(currentPlayer === 'w' ? 'b' : 'w') ? '+' : ''}`;
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
  gameOver,
  getLegalMoves
);

const resetGame = () => {
  setBoard(initialBoard);
  setHighlightedCells([]);
  setMoveCount(0);
  setCurrentPlayer('w');
  setGameOver(false);
  setGameHistory([]);
  setShowModal(false);
  setSideConfirmed(false);
  setInCheck(false);
};

const renderCell = (cell, row, col) => {
  const highlight = highlightedCells.find(
    (highlight) => highlight.row === row && highlight.col === col
  );

  const isKingInCheck = cell !== '.' && 
    cell[1] === 'k' && 
    isInCheck(cell[0], board) && 
    findKingPosition(cell[0], board)?.row === row && 
    findKingPosition(cell[0], board)?.col === col;

  return (
    <div
      key={`${row}-${col}`}
      className={`w-24 h-24 flex items-center justify-center border relative 
        ${(row + col) % 2 === 0 ? 'bg-green-primary' : 'bg-green-info'}
        ${isKingInCheck ? 'ring-2 ring-red-500' : ''}
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
      {inCheck && <span className="text-red-500 ml-2">(Check!)</span>}
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