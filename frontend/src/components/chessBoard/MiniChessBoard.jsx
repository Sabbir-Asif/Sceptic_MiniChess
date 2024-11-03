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
import useDragAndDrop from './helper/DragAndDrop';

const initialBoard = [
  ['bk', 'bq', 'bb', 'bn', 'br'],
  ['bp', 'bp', 'bp', 'bp', 'bp'],
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.'],
  ['wp', 'wp', 'wp', 'wp', 'wp'],
  ['wr', 'wn', 'wb', 'wq', 'wk']
];

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

const files = ['a', 'b', 'c', 'd', 'e'];
const ranks = ['6', '5', '4', '3', '2', '1'];

const MiniChessBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const { onDragStart, onDrop, onDragEndOutsideBoard } = useDragAndDrop(board, setBoard);

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-green-secondary">5x6 Chess Game</h1>
      <div className="relative">
        <div className="absolute -left-5 top-0 flex flex-col">
          {ranks.map((rank) => (
            <div key={rank} className="h-24 flex items-center text-base-300 font-bold">
              {rank}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-24 h-24 flex items-center justify-center border 
                ${(rowIndex + colIndex) % 2 === 0 ? 'bg-green-primary' : 'bg-green-info'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(rowIndex, colIndex)}
              >
                {cell !== '.' && (
                  <img
                    src={pieceImages[cell]}
                    alt={cell}
                    className="w-20 h-20"
                    draggable
                    onDragStart={() => onDragStart(cell, rowIndex, colIndex)}
                    onDragEnd={onDragEndOutsideBoard}
                  />
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="absolute -bottom-7 left-10 flex">
          {files.map((file) => (
            <div key={file} className="w-24 text-start text-base-200 font-bold">
              {file}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiniChessBoard;
