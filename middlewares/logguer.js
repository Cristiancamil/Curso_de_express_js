// Función intermedia que se ejecuta antes de que se ejecute la lógica del servidor
const LogguerMiddleware = (req, res, next) => {
  const timeStamp = new Date().toISOString()

  console.log(`[${timeStamp} ${req.method} ${req.url} - IP: ${req.ip}]`)  
  // console.log(`[${req.params} ${req.body}]`)  

  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[${timeStamp}] Response ${res.statusCode} - ${duration}ms`)
  })

  next();
}

module.exports = LogguerMiddleware