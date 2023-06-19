const express = require('express')
const connectDB = require('./db')
const jobRoutes = require('./routes/jobs')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Connect to MongoDB
connectDB()
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')

  next()
})
// Middleware


app.use(bodyParser.json())
// app.use(express.json())

// Routes
app.use('/api/jobs', jobRoutes)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
