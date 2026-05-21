const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const aiService  = require('../services/ai.service')
const userModel = require("../db/models/user.model")
const messageModel = require("../db/models/message.model")



function initSocketServer(httpServer)
{ 
    const io = new Server(httpServer,{})

    io.use(async (socket, next)=>{

        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if(!cookies.token)
        {
            next(new Error("Authentication error: No token provided"));
        }

        try {
            const decoded = jwt.verify(cookies.token,process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id);
            socket.user = user;
            next();
        } catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
        
    })

    io.on("connection", (socket)=>{

        
        console.log(socket.user);
        
        socket.on("ai-message",async (messagePayload)=>{
            
            console.log(typeof messagePayload);
            await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: messagePayload.content,
                role: "user"
            })
            
            const response = await aiService.generateResponse(messagePayload.content);

            await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: response,
                role: "model"
            })

            socket.emit("ai-response",{
                content: response,
                chat: messagePayload.chat
            })
        })

        
        
    })
}


module.exports = initSocketServer;