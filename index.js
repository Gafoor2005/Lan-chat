const express = require('express');
const socketIO = require('socket.io');
const http = require('http')
const port = process.env.PORT || 80
var app = express();
let server = http.createServer(app);
var io = socketIO(server);

let ban=['hello','fuckoff',"fuck"]

// make connection with user from server side
io.on('connection',
    (socket) => {
        console.log('New user connected');
        //emit message from server to user
        
        socket.on('newUser',
            (newMessage) =>
                socket.broadcast.emit('newUser',
                   newMessage)
        
        );

        // listen for message from user
        socket.on('createMessage',
            (newMessage)=> {
                if((ban.indexOf(newMessage.from) != -1) && (ban.indexOf(newMessage.text)!= -1)){
                    console.log("banned: "+newMessage.from+" msg: "+newMessage.text);
                    return 0;
                }

                return socket.broadcast.emit('newMessage',
                    newMessage);
                }
        
        );

        // when server disconnects from user
        socket.on('disconnect',
            () => {
                console.log('disconnected from user');
            });
    });

app.get("/",
    (req, res) => {
        res.sendFile(__dirname + "/client.html");
    });

server.listen(port);
