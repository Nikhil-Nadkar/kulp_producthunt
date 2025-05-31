import Product from '~/server/models/product'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  const productId = getRouterParam(event, 'id')

  try {
    const product = await Product.findById(productId)
      .populate('submittedBy', 'username avatar bio')
      .populate('comments.user', 'username avatar')

    if (!product || !product.isActive) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    return product
  } catch (error) {
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch product'
    })
  }
})