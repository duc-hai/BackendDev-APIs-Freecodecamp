//https://forum.freecodecamp.org/t/freecodecamp-challenge-guide-chain-search-query-helpers-to-narrow-search-results/301533

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const Schema = mongoose.Schema

const connectionString = 'mongodb+srv://jobconnect:gKgbOj9UHjyQY0OE@jobconnect.857z8e9.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })

const user = new Schema({
  username: { type: String },
  description: { type: String },
  duration: { type: Number }, 
  date: { type: String },
  log: [{
    description: { type: String },
    duration: { type: Number },
    date: { type: String },
    _id: false 
  }]
})

// const excercise = new Schema({
//   username: { type: String },
//   description: { type: String },
//   duration: { type: Number }, 
//   date: { type: String }
// })

const User = mongoose.model('User', user)
// const Exercise = mongoose.model('Exercise', excercise)

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create({ username: req.body.username })
    return res.json({
      username: user.username,
      _id: user._id
    })
  }
  catch (err) {
    console.error(`Error: ${err.message}`)
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select({ __v: 0 })
    return res.json(users)
  }
  catch (err) {
    console.error(`Error: ${err.message}`)
  }
})

app.post('/api/users/:_id/exercises', async (req, res) => {
  try { 
    let { description, duration, date } = req.body || null

    if (!date)
      date = new Date().toDateString()
    else 
      date = new Date(date).toDateString()

    const updateData = { description , duration, date }

    const update = await User.findOneAndUpdate({ _id: req.params._id }, updateData, {
      new: true //Return record after update
    }).select({ __v: 0 })

    update.log.push(updateData)

    await update.save()

    delete update.log

    return res.json({
      _id: update._id,
      username: update.username,
      date: update.date,
      description: update.description,
      duration: update.duration
    })
  }
  catch (err) {
    console.error(`Error: ${err.message}`)
  }
})

app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    // let user 
    // if (req.query.limit && req.query.from && req.query.to)
    const user = await User.findOne({ _id: req.params._id }).select({ __v: 0 }).limit(req.query.limit)
    // else if (req.query.limit)
      // user = await User.findOne({ _id: req.params._id }).select({ __v: 0 }).limit(req.query.limit)
    // else
      // user = await User.findOne({ _id: req.params._id }).select({ __v: 0 })

    let log = null
    if (req.query.from && req.query.to) {
      const from = req.query.from
      const to = req.query.to
      newLog = user.log.filter(value => {
        return new Date(value.date) >= new Date(from) && new Date(value.date) <= new Date (to)
      })
    }
    if (!log)
      log = user.log
    
    if (req.query.limit) {
      log = log.slice(0, parseInt(req.query.limit))
    }

    

    return res.json({
      username: user.username,
      count: user?.log?.length,
      _id: user._id,
      log: log
    })
  }
  catch (err) {
    console.error(`Error: ${err.message}`)
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})