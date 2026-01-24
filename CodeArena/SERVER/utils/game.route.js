const express= require('express')
const { bugHunterQuestions, rapidDuelQuestions } = require('../controllers/game.controller')
const router= express.Router()

router.get('/bug-hunter',bugHunterQuestions)
router.get('/rapid-duel',rapidDuelQuestions)

module.exports= router;