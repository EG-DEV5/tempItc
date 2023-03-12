/** @format */

require('dotenv').config()
require('express-async-errors')
// express

const express = require('express')
const app = express()
// rest of the packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
// const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const dashboardRouter = require('./routes/dashboard')

// database
const { connectDB } = require('./db/connect')

//  routers

// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 150, // for testing, 60
  })
)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
// app.use(fileUpload());
// routes
app.get('/', (req, res) => {
  res.send('<h1>ITC App</h1>')
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/dashboard', dashboardRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// server
const port = process.env.PORT || 8000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
