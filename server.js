const express = require("express");

// initialise app object
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origins: ['http://localhost:4100'],
        methods: ["GET", "POST"]
      }
})

// const io = require("socket.io")(httpServer, {  cors: {    origin: "http://localhost:8080",    methods: ["GET", "POST"]  }});httpServer.listen(3000)

const compression = require("compression");
app.use(compression());

const _port = 4100;
const _app_folder = '../ng-admin/dist/ng-admin';

// ---- SERVE STATIC FILES ---- //
app.get('*.*', express.static(_app_folder, { maxAge: '1y' }));

// ---- SERVE APPLICATION PATHS ---- //
app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, { root: _app_folder });
});

// run anytime someone connects to the webpage
io.on('connection', socket => {
    console.log('user connected');

    // setup event when someone joins the room
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId, userId);
        // tell all the other users that we have joined
        socket.join(roomId);

        // send a message to the room about the user that just connected
        socket.to(roomId).broadcast.emit('user-connected', userId)
    })
})

// ---- START UP THE NODE SERVER  ----
server.listen(_port, function () {
    console.log("Node Express server for " + app.name + " listening on http://localhost:" + _port);
});