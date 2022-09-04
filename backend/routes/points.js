const express = require('express')

const router = express.Router()

// import controllers
const { getAllPoints, createNewPointRecord, updatePointRecord, get1PointRecord } = require('../controllers/pointsController')

router.get('/', getAllPoints)

router.post('/', createNewPointRecord)

router.put('/:username', updatePointRecord)

router.get('/:username', get1PointRecord)

module.exports = router