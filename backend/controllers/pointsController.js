const Points = require('../models/points')

const getAllPoints = async (req, res) => {
    try {
        const allPoints = await Points.find();
        res.json({
            allPoints
        })
    } catch (e) {
        res.status(500).json({
            error: e
        })
    }
}

const createNewPointRecord = async (req, res) => {
    const { username, wins, cumulativePoints } = req.body;

    try {
        const newPointRecord = await Points.create({
            username,
            wins,
            cumulativePoints
        })

        res.status(201).json({
            newPointRecord
        })
     } catch (e) {
        res.status(500).json({
            error: e
        })
    }
}

const updatePointRecord = async (req, res) => {
    const { wins, cumulativePoints } = req.body;
    const username = req.params.username

    try {
        const foundPointRecord = await Points.findOne({ username })
        console.log(foundPointRecord)

        if (foundPointRecord !== null) {
            const updatedPointRecord = await Points.findOneAndUpdate({ username }, {
                wins,
                cumulativePoints
            })

            res.status(200).json({
                msg: 'updated point record',
                updatedPointRecord
            })
        } else {
            res.status(204).json({
                msg: 'not found that record'
            })
        }
    } catch (e) {
        res.status(500).json({
            error: e
        })
    }
}

const get1PointRecord = async (req, res) => {
    const username = req.params.username;

    try {
        const record = await Points.findOne({ username })

        res.json({
            record
        })
    } catch (e) {
        res.status(500).json({
            error: e
        })
    }
}

module.exports = {
    getAllPoints,
    createNewPointRecord,
    updatePointRecord,
    get1PointRecord
}