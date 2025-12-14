const { Router } = require('express')
const authenticateToken = require('../middlewares/auth')
const {getReservation, createReservation, updateReservation, deleteReservation} = require('../controllers/reservationController')

const router = Router()

router.post('/', authenticateToken, createReservation)
router.get('/:id', authenticateToken, getReservation)
router.put('/:id', authenticateToken, updateReservation)
router.delete('/id', authenticateToken, deleteReservation)

module.exports = router