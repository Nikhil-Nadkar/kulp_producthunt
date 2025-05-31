import Joi from 'joi'
import User from '~/server/models/user'
import { connectDB } from '~/server/utils/db'
import { generateToken } from '~/server/utils/auth'

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

export default defineEventHandler(async (event) => {
  await connectDB()
  
  const body = await readBody(event)
  
  // Validate input
  const { error, value } = loginSchema.validate(body)
  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.details[0].message
    })
  }

  const { email, password } = value

  try {
    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Generate token
    const token = generateToken(user._id)

    // Set cookie
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      },
      token
    }
  } catch (error) {
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Login failed'
    })
  }
})