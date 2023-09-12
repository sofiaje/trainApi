// const { v4: uuidv4 } = require('uuid');
const express = require('express')
const mongoose = require('mongoose')
const Workout = require('./models/workout')
const cors = require('cors');

const app = express()
mongoose.set('strictQuery', false);

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// enable cors for all routes, change this
app.use(cors());


if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const PORT = process.env.PORT || 3005
const CONNECTION = process.env.CONNECTION

app.use(express.static('public'))

const workout = new Workout({
    type: "walk",
    duration: 60
})


app.get("/", (req, res) => {
    res.send("hello world")
})

app.get("/api/workouts", async (req, res) => {
    try {
        const result = await Workout.find()
        res.json(result)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

app.post("/api/workouts", async (req, res) => {
    console.log(req.body)
    const workout = new Workout(req.body)

    try {
        await workout.save(workout)
        res.status(200).json({
            susses: true,
            data: req.body
        })
    } catch (e) {
        console.log(e.message)
    }
    

})

// start listening when connected
const start = async () => {
    try {
        await mongoose.connect(CONNECTION);
        app.listen(PORT, () => { `Listening on port ${PORT}` })
    } catch(err) {
        console.log(err.message)
    }
}

start();
