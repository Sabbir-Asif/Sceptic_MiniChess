const getValidMoves = (piece, startRow, startCol, board) => {
    const moves = [];
    const color = piece[0];
    const type = piece[1];

    const isValidPosition = (row, col) => {
        return row >= 0 && row < 6 && col >= 0 && col < 5;
    };

    const isValidMove = (row, col) => {
        if (!isValidPosition(row, col)) return false;
        const targetPiece = board[row][col];
        return targetPiece === '.' || targetPiece[0] !== color;
    };

    switch (type) {
        case 'p': // Pawn
            const direction = color === 'w' ? -1 : 1;
            // Forward move
            if (isValidPosition(startRow + direction, startCol) &&
                board[startRow + direction][startCol] === '.') {
                moves.push({ row: startRow + direction, col: startCol });
            }
            // Diagonal captures
            const captureCols = [startCol - 1, startCol + 1];
            captureCols.forEach(col => {
                if (isValidPosition(startRow + direction, col) &&
                    board[startRow + direction][col] !== '.' &&
                    board[startRow + direction][col][0] !== color) {
                    moves.push({ row: startRow + direction, col });
                }
            });
            break;

        case 'r': // Rook
            const rookDirections = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            rookDirections.forEach(([dr, dc]) => {
                let row = startRow + dr;
                let col = startCol + dc;
                while (isValidMove(row, col)) {
                    moves.push({ row, col });
                    if (board[row][col] !== '.') break;
                    row += dr;
                    col += dc;
                }
            });
            break;

        case 'n': // Knight
            const knightMoves = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1]
            ];
            knightMoves.forEach(([dr, dc]) => {
                const row = startRow + dr;
                const col = startCol + dc;
                if (isValidMove(row, col)) {
                    moves.push({ row, col });
                }
            });
            break;

        case 'b': // Bishop
            const bishopDirections = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
            bishopDirections.forEach(([dr, dc]) => {
                let row = startRow + dr;
                let col = startCol + dc;
                while (isValidMove(row, col)) {
                    moves.push({ row, col });
                    if (board[row][col] !== '.') break;
                    row += dr;
                    col += dc;
                }
            });
            break;

        case 'q': // Queen
            const queenDirections = [
                [0, 1], [0, -1], [1, 0], [-1, 0],
                [1, 1], [1, -1], [-1, 1], [-1, -1]
            ];
            queenDirections.forEach(([dr, dc]) => {
                let row = startRow + dr;
                let col = startCol + dc;
                while (isValidMove(row, col)) {
                    moves.push({ row, col });
                    if (board[row][col] !== '.') break;
                    row += dr;
                    col += dc;
                }
            });
            break;

        case 'k': // King
            const kingMoves = [
                [0, 1], [0, -1], [1, 0], [-1, 0],
                [1, 1], [1, -1], [-1, 1], [-1, -1]
            ];
            kingMoves.forEach(([dr, dc]) => {
                const row = startRow + dr;
                const col = startCol + dc;
                if (isValidMove(row, col)) {
                    moves.push({ row, col });
                }
            });
            break;
    }
    return moves;
};

export default getValidMoves;