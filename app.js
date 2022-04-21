//Import packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('express-async-errors')
require('dotenv/config')
require('dotenv').config()

//routers
const prijaveRouter = require('./routes/prijave')
const loginRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')

//middleware
const errorHandler = require('./middleware/errorhandler')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/auth', loginRouter)
app.use('/api/prijave', prijaveRouter)
app.use('/api/admin/', adminRouter)
app.get('/', (req, res) => {
  res.send('C2S')
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log('Server started'))
mongoose.connect(process.env.DB_CONNECTION, () => console.log('connected'))
