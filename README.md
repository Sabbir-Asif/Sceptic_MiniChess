
# Minichess AI

This project is an AI-based Minichess game designed to play against a human or AI opponent. Minichess is a compact version of traditional chess played on a smaller 6x5 board, reducing the complexity while maintaining strategic depth. The project incorporates the Minimax algorithm with alpha-beta pruning to efficiently search for optimal moves, along with a custom evaluation function to gauge board positions.

## About Minichess

Minichess is a variation of chess that maintains the same basic rules but is played on a smaller grid. This makes for faster-paced games, focusing on tactical prowess over extended strategy. Our project implements the popular 6x5 board version, sometimes referred to as 6×5 chess.

## How to Play 6x5 Minichess

Minichess on a 6x5 board is played similarly to traditional chess but with a few adjustments to accommodate the reduced board size.

### Game Setup
1. **Board Layout**:
   - The 6x5 board is organized with six columns (`a` through `f`) and five rows (`1` through `5`).
   - Initial piece layout mirrors traditional chess, adapted for the 6x5 grid:
     ```
     a b c d e f
     5 R N B Q K
     4 P P P P P
     2 p p p p p
     1 r n b q k
     ```
   - **White** pieces start on rows 1 and 2; **Black** pieces start on rows 4 and 5.
   
2. **Piece Movement**:
   - Pieces move the same way they do in standard chess:
     - **Rook** (R): Moves vertically or horizontally any number of squares.
     - **Knight** (N): Moves in an "L" shape (two squares in one direction and one perpendicular).
     - **Bishop** (B): Moves diagonally any number of squares.
     - **Queen** (Q): Combines the moves of a rook and bishop.
     - **King** (K): Moves one square in any direction.
     - **Pawn** (P): Moves one square forward and captures diagonally forward.
   - Initial double move for pawns is generally disallowed to simplify the game.

### Game Objective

The primary goal is to checkmate the opponent’s king. Checkmate occurs when the king is in a position to be captured ("in check") and no legal move can prevent the capture.

### Special Rules

1. **Castling**:
   - Castling is typically disabled in Minichess due to the limited board space.

2. **Pawn Promotion**:
   - Pawns reaching the opposite end of the board (row 5 for White, row 1 for Black) are promoted.
   - Promotion is usually limited to Queen, as the smaller board size makes other promotions less impactful.

3. **Stalemate and Draw**:
   - As in regular chess, stalemate results in a draw if a player has no legal moves and is not in check.
   - Draws can also occur by threefold repetition or the fifty-move rule, though these are less common in the shortened format.

### Differences from Traditional Chess

- No castling or en passant.
- Limited board size increases the likelihood of piece exchanges, resulting in faster and often more tactical play.

## AI Program Components

To play an optimal game of Minichess, our AI will use the following components:

### 1. Game Tree Search

   - The game tree represents all possible moves at each stage. The AI will use a suitable search algorithm to explore potential moves and evaluate board positions up to a specific depth.

### 2. Minimax Algorithm with Alpha-Beta Pruning

   - **Minimax Algorithm**: This algorithm helps the AI maximize its advantage while minimizing the opponent’s possible gain by choosing moves that lead to the most favorable outcomes.
   - **Alpha-Beta Pruning**: This optimization technique reduces the number of nodes evaluated by eliminating branches that cannot possibly influence the final decision, speeding up the search.

### 3. Evaluation Function

   - The evaluation function provides a "score" for board positions, helping the AI decide which moves are most advantageous. This function considers:
     - **Material Value**: The value of pieces (e.g., Queen > Rook > Knight/Bishop > Pawn).
     - **Positioning**: Favorable positions for pieces.
     - **Threats and Safety**: Immediate threats to the king or valuable pieces.
     - **Game Stage**: Adjustments based on the opening, midgame, or endgame.

### 4. Early Stopping Mechanism

   - The AI uses an early stopping mechanism to allow it to end the search early if computational resources are low or if a clear advantage has been identified based on current evaluation scores.

### 5. User Interface

   - A basic user interface will be included, allowing players to make moves, view the AI's moves, and monitor the game state. An optional graphical interface may be developed to enhance visual appeal and usability.

## How to Run the Project

1. Clone the repository and navigate to the project folder.
2. Ensure the necessary libraries and dependencies are installed.
3. Run the main script to start the game. You can choose to play against the AI or watch two AIs play against each other.

## Future Enhancements

- **Improved Evaluation Function**: Enhance by adding more nuanced heuristics.
- **Different Minichess Variants**: Implement additional board sizes and rule variations.
- **Advanced Graphical UI**: Develop a fully graphical UI for a more immersive experience.

## Resources

Here are some useful resources that inspired this project and may help you understand Minichess and the algorithms involved:

- [Minichess - Wikipedia](https://en.wikipedia.org/wiki/Minichess#5%C3%976_chess)
- [Minichess Overview - sniklaus.com](https://sniklaus.com/minichess)
- [Chess AI - GitHub (ApostolisV)](https://github.com/apostolisv/chess-ai)
- [Minimax Algorithm Tutorial - YouTube](https://www.youtube.com/watch?v=l-hh51ncgDI)
- [StackOverflow - Implementing Minimax in Chess](https://stackoverflow.com/questions/68684989/how-to-implement-a-minimax-algorithm-in-a-chess-like-game)
- [Simple Chess AI - GitHub (lhartikk)](https://github.com/lhartikk/simple-chess-ai?tab=readme-ov-file)
- [Chess Game AI Project - GitHub (ahmadrazakhawaja)](https://github.com/ahmadrazakhawaja/chess-game-AI-project/blob/master/playchess.py)
- [Python Chess AI Tutorial - YouTube (AlejoG10)](https://www.youtube.com/watch?v=OpL0Gcfn4B4)
- [AI in Games - YouTube Playlist](https://www.youtube.com/watch?v=D1O5dmpCmxI&list=PLnWzgq1mKyAsFZoMyZQbB8bNuNufSD0Sz&index=19)
