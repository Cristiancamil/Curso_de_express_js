const isValidEmail = (email) => {
  const emailRegex = /^[\w-\.]+@[\w]+\.[\w-]{2,4}$/
  return emailRegex.test(email)
}

const isValidName = (name) => {
  return typeof name === 'string' && name.length >= 0
}

const isUniqueNumericId = (id, users) => {
  return typeof id === 'number' && !users.some(user => user.id === id)
}

const validateUser = (user, users) => {
  const { name, email, id } = user
  if (!isValidName(name)) {
    return { isValid: false, error: 'El nombre debe tener almenos 3 carácteres.'} 
  }
  if (!isValidEmail(email)) {
    return { isValid: false, error: 'El correo electrónico no es valido.' }
  }
  if (isUniqueNumericId(id, users)) {
    return { isValid: false, error: 'EL ID debe ser numérico y único.' }
  }
  return { isValid: true }
}


module.exports = {
  isValidEmail,
  isValidName,
  isUniqueNumericId,
  validateUser
}