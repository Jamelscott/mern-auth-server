const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtTest = async () => {

    try{
    // simulate a server response when a user is logged in
    //create jwt payload
    const payload = {
        name: "hi, im a user",
        id: "akjshdfkjshdf",
        //password??? NO. not secure
        email: "email@domain.com"
    }

    // sign the jwt token    
    // jwt.sign(payload, secret, )
    // the secret identifies your server
    // expires in = how long the token is good for in minutes.
    // const secret = "my secret that the token is signed with"
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:(60*60)*24} )
    console.log(token)

    // decode the jwt -- makes sure the secret in the jwt is the same as our server's secret
    // verify the soruce of the data
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decode)
    
    }catch(err){
        console.log(err)
    }
}


jwtTest()