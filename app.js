require('dotenv').config()
const express = require('express')
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('./generated/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// Importando funciones para realizar validaciones de datos y funciones para imprimir en el log
const { validateUser } = require('./utils/validation')
const LogguerMiddleware = require('./middlewares/logguer')
const errorHandler = require('./middlewares/errorHandler')
const authentikateToken = require('./middlewares/auth')

// Librería para trabajar con archivos en node.js
const fs = require('fs')
const path = require('path')
const usersFilePath = path.join(__dirname, 'users.json')

// Levantando la app del backend con express.
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Llama al middleware que imprime el log de todas las acciones que se realizaran en el backend
app.use(LogguerMiddleware)
app.use(errorHandler)

// Puerto donde está corriendo el backend
const PORT = process.env.PORT || 3000



// -------------------------------------------------------------------------------------------------------------
// Endpoint para obtener parámetros enviados por url
app.get('/search', (req, res) => {
  const terms = req.query.termino || 'No especificado'
  const category = req.query.categoria || 'Todas'

  res.send(
    `<h2>Resultados de busqueda:</h2>
    <p>Término: ${terms}</p>
    <p>Categoría: ${category}</p>`
  )
})

// Endpoint para obtener parámetros enviados por JSON
app.post('/form', (req, res) => {
  const name = req.body.nombre || 'Anónimo'
  const email = req.body.email || 'No proporcionado'

  res.json({
    message: 'Datos recibidos',
    data: {
      name,
      email
    }
  })
})

// Endpoint para validar que si hay parámetros presentes en la estructura JSON
app.post('/api/data', (req, res) => {
  const data = req.body

  if(!data || Object.keys(data).length == 0) {
    return res.status(400).json({ error: 'No se recibieron datos' })
  }

  res.status(200).json({
    message: 'Datos recibidos',
    data
  })
})



// ---------------------------------------------------------------------------------------------------------------
// Endpoint para obtener todos los usuarios
app.get('/users', (req, res) => {
  // Lee el archivo
  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    // Maneja el error
    if (err)  {
      return res.status(500).json({ error: 'Error con conexión de datos.' })
    }
    // Parsea la información
    const users = JSON.parse(data)
    // Retorna la información
    res.json(users)
  })
})

// Endpoiny para crear un usuario
app.post('/users', (req, res) => {
  // Obtiene el JSON que envía el frontend.
  const newUser = req.body
  
  // Lee el archivo
  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    // Maneja el error
    if (err) {
      return res.status(500).json({ error: 'Error con conexión de datos.' })
    }
    // Parsea la información
    const users = JSON.parse(data)

    // Valida que la información obtenida cumpla con las validaciones que se implementarón
    const validation = validateUser(newUser, users)
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error })
    }

    // Agrega la informcaión al archivo
    users.push(newUser)

    // Escribe la informcaión y guarda en el archivo.
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar el usuario.' })
      }
      res.status(201).json(newUser)
    })
  })
})

// Endpoint para actualizar un usuario
app.put('/users/:id', (req, res) => {
  // Obtenien la información que se envía desde el frontend
  const userId = parseInt(req.params.id, 10)
  const updateUser = req.body

  // Lee el archivo
  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    // Maneja el error
    if(err) {
      return res.status(400).json({ error: 'Error con conexión de datos.' })
    } 
    // Parsea la información
    let users = JSON.parse(data)

    // Valida que la infromación enviada por el frontend cumpla con las validaciones
    const validation = validateUser(updateUser, users)
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error })
    }

    // Mapeamos el archivo para saber si ya existe un archivo con el id que se envía
    users = users.map(user => 
      user.id === userId ? {...user, ...updateUser} : user
    )

    // Escribimos y guardamos el archivo
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if(err) {
        return res
          .status(500)
          .json({ error: 'Error al actualizar el usuario' })
      }
      // Retorna el usuario actualizado
      res.json(updateUser)
    })
  })
})

// Endpoint para eiliminar un usuario
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10)
  
  // Lee el archivo
  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    // Maneja los errores
    if (err) {
      return res.status(500).json({ error: 'Error con conexión de datos.' })
    }

    // Pasea la información
    let users = JSON.parse(data)

    // Filtra los usuario en el archivo para identificar a cual va a eliminar
    users = users.filter(user => user.id !== userId)
    
    // Escribimos y guardamos el archivo
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
      // Manejamos el error
      if (err) {
        return res.status(500).json({ error: 'Error al eliminar el usuario' })
      }
      res.status(204).send()
    })
  })

})


// Ruta para probar el manejo de los errores
app.get('/error', (req, res, next) => {
  next(new Error('Error Intencional'))
})

// Ruta para probar que se comunica el backend con la base de datos
app.get('/db/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al comunicarse con la base de datos" });
  }
});

// Ruta para probar la authenticación del token con JWT
app.get('/protected-route', authentikateToken, (req, res) => {
  res.send('Esta ruta está protegida.')
})


// --------------------------------------------------------------------------------------------
// Endpoint para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { email, password, name } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: 'USER'
    }
  })
  res.status(201).json({ message: 'Usuario Resgistrado Correctamente' })
})

// Endpoint para el login
app.post('/login', async (req, res) => {
  const {email, password} = req.body
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) return res.status(400).json({ error: 'Credenciales invalidas' })
  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) return res.status(400).json({ error: 'Credenciales invalidas' })
  
  const token = jwt.sign(
    { id: user.id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn:'4h' }
  )
  res.json({ token })
})


// -------------------------------------------------------------------------------------------------------------
// El servidor escucha en el puerto.
app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);  
})