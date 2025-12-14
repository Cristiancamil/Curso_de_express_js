const  getUserAppointments  = require('../services/appointmentServices')

const getUserAppointment = (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10)
    const data = getUserAppointments(userId)
    return res.status(200).json({ message: 'Listado de citas', data})
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el listado de citas' })
  }
} 

module.exports = getUserAppointment