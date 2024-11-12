import { useState } from 'react';

const useDragAndDrop = (
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
) => {
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [originalPosition, setOriginalPosition] = useState(null);

  const onDragStart = (piece, startRow, startCol) => {
    if (!gameOver && piece[0] === currentPlayer) {
      setDraggedPiece(piece);
      setOriginalPosition({ row: startRow, col: startCol });

      // Show legal moves when dragging starts
      const legalMoves = getLegalMoves(piece, startRow, startCol);
      const newHighlightedCells = legalMoves.map(move => ({
        row: move.row,
        col: move.col,
        isCapture: board[move.row][move.col] !== '.'
      }));
      setHighlightedCells(newHighlightedCells);
    }
  };

  const onDrop = (endRow, endCol) => {
    if (draggedPiece && originalPosition && !gameOver) {
      const legalMoves = getLegalMoves(draggedPiece, originalPosition.row, originalPosition.col);
      const isValidMove = legalMoves.some(move => move.row === endRow && move.col === endCol);

      if (isValidMove) {
        const newBoard = board.map(row => [...row]);
        const capturedPiece = newBoard[endRow][endCol];
        newBoard[endRow][endCol] = draggedPiece;
        newBoard[originalPosition.row][originalPosition.col] = '.';

        if (capturedPiece !== ".") {
          new Audio("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3").play();
        } else {
          new Audio("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-opponent.mp3").play();
        }

        setBoard(newBoard);
        setMoveCount(prevCount => prevCount + 1);
        if (!checkGameOver(newBoard)) {
          setCurrentPlayer(current => current === 'w' ? 'b' : 'w');
        }
        setHighlightedCells([]);
      } else {
        new Audio("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/illegal.mp3").play();
      }
    }
    resetDrag();
  };

  const onDragEndOutsideBoard = () => {
    new Audio("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/illegal.mp3").play();
    resetDrag();
    setHighlightedCells([]);
  };

  const resetDrag = () => {
    setDraggedPiece(null);
    setOriginalPosition(null);
  };

  return {
    onDragStart,
    onDrop,
    onDragEndOutsideBoard,
  };
};

export default useDragAndDrop;