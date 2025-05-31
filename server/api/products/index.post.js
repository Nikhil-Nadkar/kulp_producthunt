import Joi from 'joi'
import Product from '~/server/models/product'
import { connectDB } from '~/server/utils/db'
import { extractUserFromEvent } from '~/server/utils/auth'

const productSchema = Joi.object({
  name: Joi.string().max(100).required(),
  tagline: Joi.string().max(200).required(),
  description: Joi.string().max(2000).required(),
  websiteUrl: Joi.string().uri().required(),
  logo: Joi.string().optional(),
  category: Joi.string().valid('AI', 'SaaS', 'DevTools', 'Mobile', 'Web', 'Design', 'Marketing', 'Productivity', 'Other').required()
})

export default defineEventHandler(async (event) => {
  await connectDB()
  
  const userId = await extractUserFromEvent(event)
  const body = await readBody(event)
  
  // Validate input
  const { error, value } = productSchema.validate(body)
  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.details[0].message
    })
  }

  try {
    const product = new Product({
      ...value,
      submittedBy: userId
    })

    await product.save()
    await product.populate('submittedBy', 'username avatar')

    return product
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create product'
    })
  }
})