import { useState } from 'react';
import getValidMoves from './MoveLogic';

const useDragAndDrop = (
  board,
  setBoard,
  setMoveCount,
  checkGameOver,
  currentPlayer,
  setCurrentPlayer,
  setGameHistory,
  setHighlightedCells,
  gameOver
) => {
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [originalPosition, setOriginalPosition] = useState(null);

  const onDragStart = (piece, startRow, startCol) => {
    if (!gameOver && piece[0] === currentPlayer) {
      setDraggedPiece(piece);
      setOriginalPosition({ row: startRow, col: startCol });

      // Show valid moves when dragging starts
      const validMoves = getValidMoves(piece, startRow, startCol, board);
      const newHighlightedCells = validMoves.map(move => ({
        row: move.row,
        col: move.col,
        isCapture: board[move.row][move.col] !== '.'
      }));
      setHighlightedCells(newHighlightedCells);
    }
  };

  const onDrop = (endRow, endCol) => {
    if (draggedPiece && originalPosition && !gameOver) {
      const validMoves = getValidMoves(draggedPiece, originalPosition.row, originalPosition.col, board);
      const isValidMove = validMoves.some(move => move.row === endRow && move.col === endCol);

      if (isValidMove) {
        const newBoard = board.map(row => [...row]);
        const capturedPiece = newBoard[endRow][endCol];
        if (capturedPiece !== ".") {
          const moveSound = new Audio("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3");
          moveSound.play();
        } else {
          const moveSound = new Audio("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-opponent.mp3");
          moveSound.play();
        }
        newBoard[endRow][endCol] = draggedPiece;
        newBoard[originalPosition.row][originalPosition.col] = '.';
        setBoard(newBoard);
        setMoveCount(prevCount => prevCount + 1);
        checkGameOver();
        setCurrentPlayer(current => current === 'w' ? 'b' : 'w');

        const notation = createMoveNotation(draggedPiece, capturedPiece, endRow, endCol);
        setGameHistory(prevHistory => [...prevHistory, notation]);
        setHighlightedCells([]);
      }
    }
    resetDrag();
  };

  const onDragEndOutsideBoard = () => {
    const moveSound = new Audio("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/illegal.mp3");
    moveSound.play();
    resetDrag();
    setHighlightedCells([]);
  };

  const resetDrag = () => {
    setDraggedPiece(null);
    setOriginalPosition(null);
  };

  const createMoveNotation = (piece, capturedPiece, endRow, endCol) => {
    const pieceNotation = piece[1].toUpperCase();
    const targetSquare = `${String.fromCharCode(97 + endCol)}${6 - endRow}`;

    if (capturedPiece !== '.') {
      return `${pieceNotation}x${targetSquare}`;
    }
    return pieceNotation === 'P' ? targetSquare : `${pieceNotation}${targetSquare}`;
  };

  return {
    onDragStart,
    onDrop,
    onDragEndOutsideBoard,
  };
};

export default useDragAndDrop;
