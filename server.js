const app = require('express')();
const http = require('http').createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");
const join = require("path").join;
const express = require("express");

const history = [];
const users = {};

app.use(cors('*'));
io.on("connection", (sock) => { 
    console.log("user connected")
    users[sock.id]="New user...";
    sock.emit("messagehistory", history)
    io.emit("users", Object.values(users))
    sock.on("message", (msg) => {
        history.push(msg);
        io.emit("message", msg)
        console.log(msg)
        if(msg.userName != users[sock.id]){
        users[sock.id]=msg.userName;
        io.emit("users", Object.values(users))
        }
        console.log(Object.values(users))
    })

    sock.on("disconnect", () =>{
        delete users[sock.id];
        io.emit("users", Object.values(users))
        console.log('elo');
    })
})



app.use(express.static(join(__dirname,"dist")));

app.get("*",(req,res) => {
    res.sendFile(join(__dirname,"dist","index.html"));
})
http.listen(5000, () => {
  console.log('listening on *:5000');
});