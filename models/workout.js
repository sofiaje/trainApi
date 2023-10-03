const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
        type: String,
        duration: Number,
        likes: Number
})

module.exports = mongoose.model('Workout', workoutSchema)