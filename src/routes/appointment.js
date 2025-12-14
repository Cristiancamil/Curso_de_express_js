const { Router } = require('express')
const authenticateToken = require('../middlewares/auth')

const getUserAppointment = require('../controllers/appointmentController')

const router = Router()

router.get('/:id/appointments', authenticateToken, getUserAppointment)

module.exports = router