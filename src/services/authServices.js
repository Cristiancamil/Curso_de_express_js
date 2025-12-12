const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('../../generated/prisma')

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter, log: ['query', 'info', 'warn', 'error'], })

const registerUser = async (email, password, name) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = await prisma.user.create({
    data: { email, password: hashedPassword, name, role: 'USER'}
  })
  return newUser
}

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
      throw new Error('Correo o contraseña invalidos')
  }
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    throw new Error('Correo o contraseña invalidos')
  }
  const token = jwt.sign(
    { id: user.id, role: user.role }, 
    process.env.JWT_SECRET,
    {expiresIn: '4h'}
  )
  return token
}

module.exports = {
  registerUser,
  loginUser
}