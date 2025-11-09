import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, options)

    console.log('✅ MongoDB Connected Successfully')
    console.log(`📊 Host: ${conn.connection.host}`)
    console.log(`📁 Database: ${conn.connection.name}`)
  } catch (error) {
    console.error('❌ MongoDB Connection Error:')
    console.error(`   Message: ${error.message}`)
    process.exit(1)
  }
}

// Connection Event Handlers
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error(`❌ Mongoose error: ${err}`)
})

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected')
})

// Graceful Shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('✅ MongoDB connection closed')
  process.exit(0)
})

export default connectDB