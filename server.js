require('./config/config.js');

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, './public');

var {mongoose} = require('./db/mongoose');
const {validateEmail, validateName, validatePassword} = require('./utils/validation');
const {authenticate} = require('./utils/authenticate');
const {User} = require('./models/user');

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath, { //removing .html file endings
    extensions: ['html'],
}));

io.on('connection', (socket) => {
    console.log("new user connected");

    socket.on('login', (params, callback) => {
        console.log("login request receieved by server");

        User.findByCredentials(params.email, params.password).then((user) => {
            console.log("login fun entered");
            return user.generateAuthToken();
        }).then((token) => {
            console.log("token generated . in next fun now");
            return socket.emit('token', token);
        }).catch((err) => {
            console.log("error encountered");
           callback();
            console.log("error", err);
        });
    });

    socket.on('register', (params, callback) => {
        var user = new User({
            email: params.email,
            password: params.password,
            name: params.name,
            phone: params.phone
        });

        user.save().then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            console.log("user saved");
            socket.emit('registered', token);
        }).catch((err) => {
           callback(false);
            console.log("User saving failed", err);
        });
    });
})

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
  });