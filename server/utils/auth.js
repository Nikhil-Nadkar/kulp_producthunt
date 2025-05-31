import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
  const config = useRuntimeConfig()
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  })
}

export const verifyToken = (token) => {
  const config = useRuntimeConfig()
  try {
    return jwt.verify(token, config.jwtSecret)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export const extractUserFromEvent = async (event) => {
  const token = getCookie(event, 'auth-token') || 
                getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  try {
    const payload = verifyToken(token)
    return payload.userId
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
}