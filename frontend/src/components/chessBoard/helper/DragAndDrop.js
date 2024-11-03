import { useState } from 'react';

const useDragAndDrop = (board, setBoard) => {
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [originalPosition, setOriginalPosition] = useState(null);

  const onDragStart = (piece, startRow, startCol) => {
    setDraggedPiece(piece);
    setOriginalPosition({ row: startRow, col: startCol });
  };

  const onDrop = (endRow, endCol) => {
    if (draggedPiece && originalPosition) {
      const newBoard = board.map(row => [...row]);

      if (originalPosition.row !== endRow || originalPosition.col !== endCol) {
        newBoard[endRow][endCol] = draggedPiece;
        newBoard[originalPosition.row][originalPosition.col] = '.';
      }
      setBoard(newBoard);
    }
    resetDrag();
  };

  const onDragEndOutsideBoard = () => {
    resetDrag();
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
