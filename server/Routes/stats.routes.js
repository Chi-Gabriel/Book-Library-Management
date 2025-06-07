import express from 'express'
import { getAppStatistics } from '../Controllers/stats.controller.js'

const router = express.Router()

router.get('/', getAppStatistics)

export default router
