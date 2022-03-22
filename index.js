require('./models')
require('dotenv').config()
const express = require('express')
const app = express()

const cors = require('cors')
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors())
app.use(express.json())

const myMiddleware = (req, res, next)=>{
    console.log(`incoming require: ${req.method} - ${req.url}`)
    //move along there
    next()
}

app.use(myMiddleware)

// Controllers
app.use('/api-v1/users', require('./controllers/api-v1/users'))
// app.use('/ao')

app.get('/', (req, res)=>{

    res.json({ msg: "Welcome to the userApp 🙋‍♀️"})

})


app.listen(PORT, ()=>{
    console.log(`You're listening to the smooth sounds of port ${PORT}🎙`)
})