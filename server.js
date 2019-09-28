const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, './public');

const {validateEmail, validateName, validatePassword} = require('./utils/validation');
const {authenticate} = require('./utils/authenticate');
const {User} = require('./models/user');

const port = process.env.PORT;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log("new user connected");

    socket.on('login', (params, callback) => {
        User.findByCredentials(params.email, params.password).then((user) => {
            return user.generateAuthToken();
        }).then((token) => {
            return socket.emit('token', token);
        }).catch((err) => {
           callback();
            console.log("error", err);
        });
    });
})