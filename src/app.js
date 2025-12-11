const express = require('express')
const routes = require('./routes')
const LogguerMiddleware = require('./middlewares/logguer')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(LogguerMiddleware)

app.use('/api', routes)
app.get('/', (req, res) => {
  res.send('Hello world')
})

module.exports = app