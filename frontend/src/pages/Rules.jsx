import React from 'react';

const Rules = () => {
    return (
        <div className="max-w-5xl mx-auto bg-black-secondary text-base-300 p-6">
            <div id="pagebody" className="rounded-lg p-4 shadow-lg">
                <div id="content">
                    <h1 className="text-2xl font-bold text-green-secondary text-center mb-4">Rules of MinitChess</h1>
                    <p className="mb-4">
                        Here are brief rules for MinitChess (aka MiniChess 2011),
                        the MiniChess game we will build an adversary for. MinitChess is a simpler[!] version of <a href="http://www.ship.edu/~cgboeree/minichessvariants.html" className="text-green-primary hover:text-green-primary">Speed Chess</a>.
                    </p>

                    <ul className=" list-inside space-y-4">
                        <li>
                            <p className="font-semibold">The game is played on a 5x6 board</p>
                            <pre className="bg-neutral-700 rounded-lg p-2 mt-2 text-center font-mono text-lg">
                                .....
                                <br />.....
                                <br />.....
                                <br />.....
                                <br />.....
                                <br />.....
                            </pre>
                            <p className="mt-2 text-green-primary">
                                The columns are labeled a, b, c, d, e and the rows (from bottom) 1, 2, 3, 4, 5, 6.
                            </p>
                        </li>

                        <li><p className="font-medium">Pieces are King (K), Queen (Q), Bishop (B), Knight (N), Rook (R), and Pawn (P).</p></li>
                        <li><p className="font-semibold">White pieces: capital letters (KQBNRP); black pieces: lowercase letters (kqbnrp). White moves first.</p></li>

                        <li>
                            <p className="font-semibold">Starting layout:</p>
                            <pre className="bg-neutral-700 rounded-lg p-2 mt-2 text-center font-mono text-lg">
                                kqbnr
                                <br />ppppp
                                <br />.....
                                <br />.....
                                <br />PPPPP
                                <br />RNBQK
                            </pre>
                        </li>

                        <li>
                            <p className="font-semibold">Piece movements:</p>
                            <ul className="ml-4 space-y-2">
                                <li><p><strong>King:</strong> one space in any direction (N, S, E, W, NE, NW, SE, SW).</p></li>
                                <pre className="bg-neutral-700 rounded-lg p-2 mt-2 text-center font-mono text-lg">
                                    .....
                                    <br />xx...
                                    <br />Kx...
                                    <br />xx...
                                    <br />.....
                                    <br />.....
                                </pre>
                                <li><p><strong>Queen:</strong> any distance in any direction, as long as no piece blocks the path.</p></li>
                                <pre className="bg-neutral-700 rounded-lg p-2 mt-2 text-center font-mono text-lg">
                                    x.x..
                                    <br />xx...
                                    <br />QxxB.
                                    <br />xx...
                                    <br />x.x..
                                    <br />x..x.
                                </pre>
                            </ul>
                        </li>
                    </ul>

                    <h2 className="text-xl font-semibold text-green-primary mt-6">Victory Conditions</h2>
                    <ul className="list-disc space-y-4 mt-4 ml-5">
                        <li><p>The first player to capture the opponent's King wins.</p></li>
                        <li><p>A game lasting more than 40 moves (by each side) is a draw.</p></li>
                        <li><p>If a player has no legal move on their turn, that player loses. Note that in mini-chess there is no rule against "moving into check" (allowing your King to be captured is a legal move).</p></li>
                    </ul>

                    <h2 className="text-xl font-semibold text-green-primary mt-6">Game Changes from Standard Chess</h2>
                    <ul className="list-disc list-inside space-y-4 mt-4">
                        <li>Smaller board with fewer pieces</li>
                        <li>King capture wins the game</li>
                        <li>No "moving into check" restriction</li>
                        <li>No repetition draw</li>
                        <li>Draw by total moves, not by moves after capture</li>
                        <li>Bishops can move to an adjacent empty space in any direction</li>
                        <li>Pawn promotion always to a Queen</li>
                    </ul>
                </div>
            </div>

            <div id="footer" className="pagefooter mt-6 text-green-primary text-sm">
                <p>Original link to the rules: {` `}
                    <a href="https://wiki.cs.pdx.edu/mc-howto/rules.html" className='text-blue-500'>Click Here</a>
                </p>
            </div>
        </div>
    );
};

export default Rules;
