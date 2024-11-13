const express = require('express');
const router = express.Router();
const Game = require('./GameModel');
const validateGame = require('./GameValidation');

// Create a new game
router.post('/v1/games', async (req, res) => {
    try {
        const { error } = validateGame(req.body);
        if (error) {
            return res.status(400).json({ message: error.details.map(err => err.message) });
        }

        const { user, result, history } = req.body;
        const newGame = new Game({
            user,
            result,
            history
        });

        const savedGame = await newGame.save();
        const populatedGame = await Game.findById(savedGame._id).populate('user');
        res.status(201).json(populatedGame);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Failed to create game" });
    }
});

// Get all games
router.get('/v1/games', async (req, res) => {
    try {
        const games = await Game.find().populate('user');
        res.status(200).json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get games by user ID
router.get('/v1/games/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const games = await Game.find({ user: userId }).populate('user');
        
        if (games.length === 0) {
            return res.status(404).json({ message: "No games found for this user" });
        }
        
        res.status(200).json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch user games" });
    }
});

// Get game by ID
router.get('/v1/games/:id', async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await Game.findById(gameId).populate('user');
        
        if (!game) {
            return res.status(404).json({ message: `Game with id ${gameId} not found` });
        }
        
        res.status(200).json(game);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update game
router.patch('/v1/games/:id', async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await Game.findById(gameId);
        
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        const { error } = validateGame(req.body);
        if (error) {
            return res.status(400).json({ message: error.details.map(err => err.message) });
        }

        const { result, history } = req.body;
        
        if (result !== undefined) game.result = result;
        if (history !== undefined) game.history = history;

        const updatedGame = await game.save();
        const populatedGame = await Game.findById(updatedGame._id).populate('user');
        
        res.status(200).json(populatedGame);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update game" });
    }
});

// Delete game
router.delete('/v1/games/:id', async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await Game.findById(gameId);
        
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        
        await game.deleteOne();
        res.status(200).json({ message: "Game deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete game" });
    }
});

module.exports = router;