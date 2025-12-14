const { Router } = require('express')

const authRouter = require('./auth')
const adminRouter = require('./admin')
const reservationRouter = require('./reservation')
const appointments = require('./appointment')

const router = Router()

router.use('/auth', authRouter)
router.use('/admin', adminRouter)
router.use('/reservations', reservationRouter)
router.use('/users', appointments)

module.exports = router