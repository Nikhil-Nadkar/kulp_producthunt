import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async () => {
  const config = useRuntimeConfig()
  
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    isConnected = true
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}