const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'ChessUser',
        required: true
    },
    result: {
        type: String,
        enum: ['win', 'lose', 'draw'],
        required: true
    },
    history: [{
        move: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;