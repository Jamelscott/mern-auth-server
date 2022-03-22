const jwt = require('jsonwebtoken')
const db = require('../models')

async function requiresToken(req,res,next){
    try {
        // get token from the client 
        // console.log(req.headers)
        const token = req.headers.authorization
        //verify the token -- if not verified, wind up in catch
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
        //find the user from the token data
        const foundUser = await db.User.findById(decoded.id)
        // mount user on response for the next middle/route
        res.locals.user = foundUser
        // invoke next to go next middleware function
        next()
    }catch (err){
        console.log(err)
        res.status(401).json({message: 'unauthorized'})
        //auth has failed
    }
}
 module.exports = requiresToken