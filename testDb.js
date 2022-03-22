const db = require('./models')

const testUser = async()=>{
    try{

        const newUser = await db.User.create({
            name: "Jamel",
            email: "itsjamelscott@gmail.com",
            password: "12345"
        })
        

    } catch(err){
        console.log(err)
    }
}


testUser()