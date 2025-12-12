const { createTimeBlockService, listReservationService } = require('../services/adminServices')

const createTimeBlock = async (req, res) => {
  if(req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acces Denied' })
  }

  const {startTime, endTime} = req.body

  try {
    const newTimeBlock = await createTimeBlockService(startTime, endTime)
    res.status(201).json(newTimeBlock)  
  } catch (error) {
    res.status(500).json({ Error: 'Error creating time block' })
  }
}

const listReservations = async (req, res) => {
  if(req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acces Denied' })
  }

  try {
    const reservations = await listReservationService()
    res.status(200).json(reservations)
  } catch (error) {
    res.status(500).json({ Error: 'Error Fetching reservations' })
  }
}

module.exports = {
  createTimeBlock,
  listReservations
}