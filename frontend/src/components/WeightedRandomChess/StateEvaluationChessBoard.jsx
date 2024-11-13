import React, { useContext, useEffect, useState } from 'react';
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
import { AuthContext } from '../Authentication/AuthProvider';

const pieceValues = {
  p: 1,
  n: 3,
  b: 3.5,
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
  const { user } = useContext(AuthContext);
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
  const [isSavingGame, setIsSavingGame] = useState(false);
  const [saveError, setSaveError] = useState(null);

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

    // Pawn structure
    let pawnsPerSide = {
      w: 0,
      b: 0
    };
    let pawnChains = {
      w: 0,
      b: 0
    };
    let isolatedPawns = {
      w: 0,
      b: 0
    };
    let doubledPawns = {
      w: 0,
      b: 0
    };
    let passedPawns = {
      w: 0,
      b: 0
    };
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = currentBoard[row][col];
        if (piece[1] === 'p') {
          const color = piece[0];
          pawnsPerSide[color]++;

          // Pawn chains
          if (col > 0 && currentBoard[row][col - 1][1] === 'p' && currentBoard[row][col - 1][0] === color) {
            pawnChains[color]++;
          }
          if (col < 4 && currentBoard[row][col + 1][1] === 'p' && currentBoard[row][col + 1][0] === color) {
            pawnChains[color]++;
          }

          // Isolated pawns
          if ((col === 0 || currentBoard[row][col - 1][1] !== 'p' || currentBoard[row][col - 1][0] !== color) &&
              (col === 4 || currentBoard[row][col + 1][1] !== 'p' || currentBoard[row][col + 1][0] !== color)) {
            isolatedPawns[color]++;
          }

          // Doubled pawns
          if (row > 0 && currentBoard[row - 1][col][1] === 'p' && currentBoard[row - 1][col][0] === color) {
            doubledPawns[color]++;
          }

          // Passed pawns
          let passedPawn = true;
          for (let i = col - 1; i >= 0; i--) {
            if (currentBoard[row][i][1] === 'p' && currentBoard[row][i][0] === color) {
              passedPawn = false;
              break;
            }
          }
          if (passedPawn) {
            passedPawns[color]++;
          }
        }
      }
    }

    score += (pawnsPerSide[forColor] - pawnsPerSide[forColor === 'w' ? 'b' : 'w']) * 0.1;
    score += (pawnChains[forColor] - pawnChains[forColor === 'w' ? 'b' : 'w']) * 0.2;
    score += (isolatedPawns[forColor === 'w' ? 'b' : 'w'] - isolatedPawns[forColor]) * 0.3;
    score += (doubledPawns[forColor === 'w' ? 'b' : 'w'] - doubledPawns[forColor]) * 0.2;
    score += (passedPawns[forColor] - passedPawns[forColor === 'w' ? 'b' : 'w']) * 0.4;

    if (isInCheck(forColor, currentBoard)) {
      score -= 0.5;
    }
    if (isInCheck(forColor === 'w' ? 'b' : 'w', currentBoard)) {
      score += 0.5;
    }

    return score * multiplier;
  };

  const getMinMaxMove = (depth, isMaximizing, alpha, beta, currentBoard, color) => {
    if (depth === 0) {
      return { score: evaluateBoard(currentBoard, color) };
    }

    const moves = [];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = currentBoard[row][col];
        if (piece[0] === (isMaximizing ? color : (color === 'w' ? 'b' : 'w'))) {
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

    let bestMove = null;
    let bestScore = isMaximizing ? -Infinity : Infinity;

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

    const result = getMinMaxMove(6, true, -Infinity, Infinity, board, currentPlayer);
    
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

      if (board[to.row][to.col] !== '.') {
        new Audio("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3").play();
      } else {
        new Audio("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-opponent.mp3").play();
      }

      checkGameOver(newBoard);
    }
  };

  const saveGame = async (winner) => {
    if (!user || isSavingGame) return;

    setIsSavingGame(true);
    setSaveError(null);

    try {
      let result;
      if (winner === 'draw') {
        result = 'draw';
      } else {
        result = winner === userSide ? 'win' : 'lose';
      }

      const gameData = {
        user: user._id,
        result,
        history: gameHistory.map(move => ({
          move,
          timestamp: new Date()
        }))
      };

      const response = await fetch('http://localhost:8080/api/v1/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });

      if (!response.ok) {
        throw new Error('Failed to save game');
      }

      const savedGame = await response.json();
      console.log('Game saved successfully:', savedGame);
    } catch (error) {
      console.error('Error saving game:', error);
      setSaveError('Failed to save game. Please try again.');
    } finally {
      setIsSavingGame(false);
    }
  };

  const checkGameOver = (currentBoard = board) => {
    const opponent = currentPlayer === 'w' ? 'b' : 'w';
    
    if (!findKingPosition(currentPlayer, currentBoard)) {
      const winner = opponent;
      setModalMessage(`${opponent.toUpperCase()} wins! The ${currentPlayer === 'w' ? 'White' : 'Black'} king has been captured.`);
      setShowModal(true);
      setGameOver(true);
      saveGame(winner);
      return true;
    }

    if (moveCount >= 40) {
      setModalMessage('Draw! Maximum number of moves (40) reached.');
      setShowModal(true);
      setGameOver(true);
      saveGame('draw');
      return true;
    }

    const inCheck = isInCheck(currentPlayer, currentBoard);
    setInCheck(inCheck);

    return false;
  };

  const checkmated = (color) => {
    
    if (!isInCheck(color) || !hasLegalMoves(color)) {
      return false; 
    }
  
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = board[row][col];
        if (piece[0] === color) {
          const legalMoves = getLegalMoves(piece, row, col);
  
          for (const move of legalMoves) {
            const simulatedBoard = simulateMove(row, col, move.row, move.col, board);
  
            if (!isInCheck(color, simulatedBoard)) {
              return false;
            }
          }
        }
      }
    }

    return true;
  };
  
  useEffect(() => {
    if (checkmated(currentPlayer)) {
      const winner = currentPlayer === 'w' ? 'b' : 'w';
      setModalMessage(`${currentPlayer === 'w' ? 'White' : 'Black'} is checkmated! Game over.`);
      setShowModal(true);
      setGameOver(true);
      saveGame(winner);
    } else if (!hasLegalMoves(currentPlayer)) {
      const winner = currentPlayer === 'w' ? 'b' : 'w';
      setModalMessage(`${currentPlayer === 'w' ? 'White' : 'Black'} is checkmated! Game over.`);
      setShowModal(true);
      setGameOver(true);
      saveGame(winner);
    }
  }, [board, currentPlayer]);

  
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

  const {
    onDragStart,
    onDrop,
    onDragEndOutsideBoard,
  } = useDragAndDrop(
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
          className="btn btn-primary bg-green-secondary hover:bg-green-primary border-none rounded-md text-md text-white"
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
              <button className="btn bg-green-secondary text-white" onClick={resetGame}>Play Again</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateEvaluationChessBoard;