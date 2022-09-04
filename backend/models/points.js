const mongoose = require('mongoose')

const pointsSchema = new mongoose.Schema({
    username: String,
    wins: Number,
    cumulativePoints: Number
})

const Points = mongoose.model('Points', pointsSchema)

module.exports = Points