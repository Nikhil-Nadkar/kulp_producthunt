import Joi from 'joi'
import User from '~/server/models/user'
import { connectDB } from '~/server/utils/db'
import { generateToken } from '~/server/utils/auth'

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

export default defineEventHandler(async (event) => {
  await connectDB()
  
  const body = await readBody(event)
  
  // Validate input
  const { error, value } = registerSchema.validate(body)
  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.details[0].message
    })
  }

  const { username, email, password } = value

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User already exists with this email or username'
      })
    }

    // Create new user
    const user = new User({ username, email, password })
    await user.save()

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
      statusMessage: 'Registration failed'
    })
  }
})
