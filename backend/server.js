// set dotenv
require('dotenv').config()

// import modules
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

// import routes
const pointsRouter = require('./routes/points')

// set up express ap
const app = express()

// middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

// connect to mongodb
mongoose.connect(process.env.MONGO_URI, () => {
    console.log('connected to mongodb')
})

// set up points routes
app.use('/api/points', pointsRouter)

// setup listener
app.listen(process.env.PORT, () => {
    console.log(`server listening on port ${process.env.PORT}`)
})