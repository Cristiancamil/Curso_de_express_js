const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('../../generated/prisma')

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter, log: ['query', 'info', 'warn', 'error'], })

const createTimeBlockService = async (startTime, endTime) => {
  const newTimeBlock = await prisma.timeBlock.create({
    data: { 
      startTime: new Date(startTime), 
      endTime: new Date(endTime)
    }
  })
  return newTimeBlock
}

const listReservationService = async () => {
  const reservations = await prisma.appointment.findMany({
    include: {
      user: true,
      timeBlock: true
    }
  })
  return reservations
}

module.exports = {
  createTimeBlockService,
  listReservationService
}