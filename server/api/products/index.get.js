import Product from '~/server/models/product'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  const query = getQuery(event)
  const { category, sort = 'latest', page = 1, limit = 20 } = query

  try {
    const filter = { isActive: true }
    
    if (category && category !== 'all') {
      filter.category = category
    }

    let sortOption = {}
    switch (sort) {
      case 'trending':
        sortOption = { upvoteCount: -1, createdAt: -1 }
        break
      case 'latest':
      default:
        sortOption = { createdAt: -1 }
        break
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const products = await Product.find(filter)
      .populate('submittedBy', 'username avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Product.countDocuments(filter)

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    })
  }
})