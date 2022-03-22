const express = require('express')
const router = express.Router()
const db = require('../../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const requiresToken = require('../requiresToken')



// POST /users/register -- CREATE a new user
router.post('/register', async (req, res)=>{
    // res.send('sign a user in')
    try{
        //check if the user exists already  --- dont allow them to sugn up again
        const userCheck = await db.User.findOne({
            email: req.body.email
        })
        if(userCheck) return  req.status(409).json({msg: "email in use"})
        // hash the pass (could valudate if we wanted)
        const salt = 12
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        //create a user in the database
        const newUser = await db.User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        // create a jwt payload to send back to the client
        const payload = {
            name: newUser.name,
            email: newUser.email,
            id: newUser._id
        }
        // sign the jwt and send it
        const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 60*60})

        res.json({token})

    }catch(err){
        res.status(504).json({msg: "opps server error 503🔥"})
    }
})

// POST /users/login -- validate login credentials
router.post('/login', async (req, res)=>{
    try{
        // try to find the user in the BD that is logged in
        // console.log(req.body)
        const userCheck = await db.User.findOne({
            email: req.body.email
        })
        // if the user is not found -- reutrn and send back a message that the user needs to sign up
        if(!userCheck) return  res.status(409).json({msg: "user credentials are incorrectttt"})
        // check if the password from the req.body against the password in the db
        const matchPasswords = await bcrypt.compare(req.body.password, userCheck.password)
        console.log(matchPasswords)
        // if the provided info does not match -- send back an error message and return
        if(!matchPasswords) return  res.status(409).json({msg: "user credentials are incorrect"})
    
        // ccreate a jwt payload
        const payload = {
            name: userCheck.name,
            email: userCheck.email,
            id: userCheck._id
        }
        // sign the jwt 
        const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 60*60})
    
        //send it back
        res.json({token})
    } catch(err){

    }

})
// GET /users/auth-locked -- example of checking an jwt and not serving data unlesss the jwt is valid
router.get('/auth-locked', requiresToken, (req,res)=>{
    //here we have access to the user on the res.locals
    console.log(`logged in user: ${res.locals.user}`)
    res.json({msg: `welcome to the auth locked route`})
})



module.exports = router