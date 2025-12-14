const {getReservationService, createReservationService, updateReservationService, deletedReservationService} = require('../services/reservationServices')

const createReservation = async (req, res) => {
  try {
    const reservation = await createReservationService(req.body)
    return res.status(201).json(reservation)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
} 

const getReservation = async(req, res) => {
  try {
    const userId = parseInt(req.params.id, 10)
    const reservation = await getReservationService(userId)
    return res.status(200).json(reservation)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const updateReservation = async(req, res) => {
  try {
    const userId = parseInt(req.params.id, 10)
    const getReservation = await getReservationService(userId)
    if (!getReservation) {
      res.status(404).json({ error: 'No se encontro la reservación'})
    }
    const reservation = await updateReservationService(getReservation.id, req.body)
    return res.status(200).json({message: 'Información actualizada', reservation})
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const deleteReservation = async(req, res) => {
  try {
    const deleted = await deletedReservationService(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Reservation not found or already deleted'})
    }

    return res.status(204).send()
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation
}