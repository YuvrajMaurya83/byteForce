const jwt = require('jsonwebtoken');
const userModel = require('../db/models/user.model');

async function registerController(req,res)
{
    const {email, password} = req.body;
    
    const isUserAlreadyExist = await userModel.findOne({
        email
    })

    if(isUserAlreadyExist)
    {
        return res.status(400).json({
            message: "user already exist"
        })
    }

    const user = userModel.create({
        email,password
    })

    const token = jwt.sign({
        id: user._id,
    },JWT_SECRET);

    res.cookie("token",token);

    res.status(201).json({
        messsage: "Successfully registered",
        user: {
            id:user._id,
            email: user.email,

        }
    })
    

}

module.exports = {
    registerController
}