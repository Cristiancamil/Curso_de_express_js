require('dotenv').config()
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('../generated/prisma')

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  //Creación de usuarios de demostración
  // const users = [
  //   { name: 'Usuario 1', email: 'usuario1@ejemplo.com' },
  //   { name: 'Usuario 2', email: 'usuario2@ejemplo.com' },
  //   { name: 'Usuario 3', email: 'usuario3@ejemplo.com' }
  // ];

  // for (const user of users) {
  //   await prisma.user.create({
  //     data: user
  //   });
  // }

  // console.log('Usuarios de demostración creados con éxito');
  // await prisma.user.deleteMany()

  // Crear usuarios

  const user1 = await prisma.user.create({
    data: {
      email: 'sistemas@gmail.com',
      password: 'W0k32xu9fIyJ2H',
      name: 'Admin',
      role: 'ADMIN'
    }
  });

  // Crear bloques de tiempo
  const timeBlock1 = await prisma.timeBlock.create({
    data: {
      startTime: new Date('2025-12-11T17:55:00Z'),
      endTime: new Date('2025-12-11T18:55:00Z')
    }
  });

  const timeBlock2 = await prisma.timeBlock.create({
    data: {
      startTime: new Date('2025-12-11T18:55:00Z'),
      endTime: new Date('2025-12-11T19:55:00Z')
    }
  });

  // Crear citas
  await prisma.appointment.create({
    data: {
      date: new Date('2025-12-11T17:55:00Z'),
      user: { connect: { id: user1.id } },
      timeBlock: { connect: { id: timeBlock1.id } }
    }
  });
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  });