// const { v4: uuidv4 } = require('uuid');
const express = require('express')
const mongoose = require('mongoose')
const Workout = require('./models/workout')
const cors = require('cors');

const app = express()
mongoose.set('strictQuery', false);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// enable cors for all routes, change this
app.use(
    cors({
        origin: [
            "http://127.0.0.1:5173",
            "http://localhost:5173"
        ], 
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "HEAD"],
        credentials: true,
}));

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const PORT = process.env.PORT || 3005
const CONNECTION = process.env.CONNECTION

app.use(express.static('public'))


app.get("/", (req, res) => {
    res.send("hello world")
})
// get request
app.get("/api/workouts", async (req, res) => {
    try {
        const result = await Workout.find()
        res.json(result)
    } catch (err) {
        res.status(500).json({
            success: false, 
            error: err.message
        })
    }
})
// post request
app.post("/api/workouts", async (req, res) => {
    try {
        console.log(req.body)
        const workout = new Workout({...req.body, likes: 0 })
        await workout.save()
        res.status(200).json({
            success: true,
            data: workout
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false, 
            message: "an error occurred"
        })
    }
})

app.get("/api/workouts/:id", async (req, res) => {
    console.log({ requestParams: req.params })
    try {
        const { id: postId } = req.params
        console.log(postId)
        const post = await Workout.findById(postId)
        console.log(post)
        if (!post) {
            res.status(404).json({error: 'post not found'})
        } else {
            // res.json(post)
            res.json({
                success: true,
                data: post
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false, 
            error: 'Ooops, something went wrong'
        })
    }
})

// update data
app.patch('/api/workouts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Workout.findOneAndUpdate({ _id: postId }, req.body, { new: true })
        res.json(post)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            success: false, 
            error: "something went wrong"
        })
    }
})

// delete request 
app.delete("/api/workouts/:id", async (req, res) => { 
    try {
        const postId = req.params.id;
        const result = await Workout.deleteOne({ _id: postId })
        res.json({deletedCount: result.deletedCount})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            success: false, 
            error: 'something went wrong'
        })
    }
})

// start listening when connected
const start = async () => {
    try {
        await mongoose.connect(CONNECTION);
        app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) })
    } catch (err) {
        console.log(err.message)
    }
}

start();
