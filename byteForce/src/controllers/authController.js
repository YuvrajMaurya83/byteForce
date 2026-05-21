const jwt = require('jsonwebtoken');
const userModel = require('../db/models/user.model');
const bcrypt = require('bcryptjs')

async function registerController(req,res)
{
    const { fullName : {firstName,lastName} ,email, password} = req.body;
    
    const isUserAlreadyExist = await userModel.findOne({
        email
    })

    if(isUserAlreadyExist)
    {
        return res.status(400).json({
            message: "user already exist"
        })
    }

    const hashedPassord = await bcrypt.hash(password,10);

    const user = await userModel.create({
        fullName: {
            firstName,
            lastName
        },email,
        password : hashedPassord
    })

    const token = jwt.sign({
        id: user._id,
    },process.env.JWT_SECRET);

    res.cookie("token",token);

    res.status(201).json({
        message: "Successfully registered",
        user: {
            id:user._id,
            fullName : {
                firstName: user.firstName,
                lastName: user.lastName
            },
            email: user.email,
        }
    })
    

}

async function loginController(req,res)
{
    const {email,password} = req.body;

    const user = await userModel.findOne({
        email
    });

    if(!user)
    {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password,user.password);

    if(!isPasswordCorrect)
    {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    
    const token = jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET);

    res.cookie("token",token);

    res.status(200).json({
        message: "User login succesfully"
    })


}

module.exports = {
    registerController,
    loginController
}