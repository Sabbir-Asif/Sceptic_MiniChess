import { useEffect, useState } from 'react';

const Records = () => {
    const [userStats, setUserStats] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [gameHistory, setGameHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/games');
                const data = await response.json();
                
                const userMap = {};

                data.forEach(game => {
                    const userId = game.user._id;
                    if (!userMap[userId]) {
                        userMap[userId] = {
                            displayName: game.user.displayName,
                            gamesPlayed: 0,
                            wins: 0,
                            losses: 0,
                            draws: 0,
                            history: []
                        };
                    }

                    userMap[userId].gamesPlayed++;
                    userMap[userId].history.push(game);
                    if (game.result === 'win') userMap[userId].wins++;
                    if (game.result === 'lose') userMap[userId].losses++;
                    if (game.result === 'draw') userMap[userId].draws++;
                });

                const statsArray = Object.values(userMap);
                statsArray.sort((a, b) => b.gamesPlayed - a.gamesPlayed);
                setUserStats(statsArray);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchData();
    }, []);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setGameHistory(user.history);
    };

    return (
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-green-secondary to-green-600 p-8 rounded-lg shadow-xl text-white">
            <h2 className="text-5xl font-bold mb-10 text-center">Records</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-400 rounded-lg bg-gray-700">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-6 py-3 border-b">User Name</th>
                            <th className="px-6 py-3 border-b">Games Played</th>
                            <th className="px-6 py-3 border-b">Wins</th>
                            <th className="px-6 py-3 border-b">Losses</th>
                            <th className="px-6 py-3 border-b">Draws</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userStats.map((user, index) => (
                            <tr 
                                key={index} 
                                className="bg-gray-600 even:bg-gray-500 hover:bg-gray-400 cursor-pointer"
                                onClick={() => handleUserClick(user)}
                            >
                                <td className="px-6 py-3 border-b text-center">{user.displayName}</td>
                                <td className="px-6 py-3 border-b text-center">{user.gamesPlayed}</td>
                                <td className="px-6 py-3 border-b text-center">{user.wins}</td>
                                <td className="px-6 py-3 border-b text-center">{user.losses}</td>
                                <td className="px-6 py-3 border-b text-center">{user.draws}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <div className="mt-10 p-6 bg-gray-800 rounded-lg shadow-md">
                    <h3 className="text-3xl font-semibold mb-4">Game History for {selectedUser.displayName}</h3>
                    <ul className="space-y-4">
                        {gameHistory.map((game, index) => (
                            <li key={index} className="p-4 bg-gray-700 rounded-lg shadow-md">
                                <p><span className="font-bold">Opponent:</span> {game.opponentName}</p>
                                <p><span className="font-bold">Result:</span> {game.result}</p>
                                <p><span className="font-bold">Date:</span> {new Date(game.date).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Records;
