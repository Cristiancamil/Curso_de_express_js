const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('../../generated/prisma')

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter, log: ['query', 'info', 'warn', 'error'], })

const getUserAppointments = (userId) => {
  try {
    const appointments = prisma.appointment.findMany({
      where: { userId: userId },
      include: { timeBlock: true }
    })
    return appointments
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el historial de citas' })
  }
}

module.exports =  getUserAppointments