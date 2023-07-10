/** @format */

require('dotenv').config()
require('express-async-errors')
const colors = require('colors')

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
const divisionRouter = require('./routes/division')
const cluster = require('cluster')
const totalCPUs = require('os').cpus().length
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
    max: 300, // for testing, 60
  })
)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
//? enable colors for terminal
colors.enable()

const port = process.env.PORT || 5000
if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`.green)
  console.log(`Master ${process.pid} is running`.bold)

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`.yellow)
    console.log("Let's fork another worker!".blue)
    cluster.fork()
  })
} else {
  console.log(`Worker ${process.pid} started`.cyan)

  // routes
  app.get('/', (req, res) => {
    res.send('<h1>ITC App</h1>')
  })
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/user', userRouter)
  app.use('/api/v1/dashboard', dashboardRouter)
  app.use('/api/v1/division', divisionRouter)
  app.use(notFoundMiddleware)
  app.use(errorHandlerMiddleware)
  const start = async () => {
    try {
      await connectDB(process.env.MONGO_URL)
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`.america)
      )
    } catch (error) {
      console.log(error)
    }
  }

  start()
}

