const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
        type: String,
        duration: String,
        likes: Number
})

module.exports = mongoose.model('Workout', workoutSchema)