const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('../../generated/prisma')

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter, log: ['query', 'info', 'warn', 'error'], })

const getReservationService = async (userId) => { 
  const reservation = await prisma.appointment.findUnique({ 
    where: {id: parseInt(userId, 10)}
  })

  if (!reservation) throw new Error(`Id ${userId} no existe`)  
  return reservation
}

const createReservationService = async (data) => {
  const create = await prisma.appointment.create({
    data: {
      date: new Date(data.date),
      userId: data.userId,
      timeblockId: data.timeblockId
    }
  })
  return create
}

const updateReservationService = async (id, data) => {
  const conflict = await prisma.appointment.findFirst({
    where: {
      date: data.date,
      timeBlockId: data.timeBlockId,
      id: { not: parseInt(id, 10) }
    }
  });
  if (conflict) {
    throw new Error('El horario solicitado ya está ocupado');
  }
  return prisma.appointment.update({
    where: { id: parseInt(id, 10) },
    data
  })
}

const deletedReservationService = async (id) => {
  return prisma.appointment.delete({
    where: {id: parseInt(id, 10)}
  })
}

module.exports = {
  getReservationService,
  createReservationService,
  updateReservationService,
  deletedReservationService
}