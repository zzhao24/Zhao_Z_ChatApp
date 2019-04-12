// initialize an express app and set it up 
const express = require('express');
const app = express();
const io = require('socket.io')();

// some config stuff
const port = process.env.PORT || 3000;

// tell our app to use the public folder for static files
app.use(express.static('public'));

// instantiate the only route we need
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/views/index.html');
});

// create server variable for socket.io to use
const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    let r,g,b;

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    if ( color.charAt(0) == '#' ) {
        color = color.substr(1);
    }
    if ( color.length == 3 ) {
        color = color.substr(0,1) + color.substr(0,1) + color.substr(1,2) + color.substr(1,2) + color.substr(2,3) + color.substr(2,3);
    }
    r = color.charAt(0) + '' + color.charAt(1);
    g = color.charAt(2) + '' + color.charAt(3);
    b = color.charAt(4) + '' + color.charAt(5);
    r = parseInt( r,16 );
    g = parseInt( g,16 );
    b = parseInt( b ,16);
    return 'rgba(' + r + ',' + g + ',' + b + ',.5)';
}

// plug in the chat app package
io.attach(server);


io.on('connection', function(socket) {
    color = getRandomColor();
    console.log('a user has connected');
    socket.emit('connected', {sID: `${socket.id}`, message: 'new connection', color: color } );

    // listen for incoming messages, and then send them to everyone
    socket.on('chat message', function(msg) {
        // check the message contents
        console.log('message', msg, 'socket', socket.id);

        // send a message to every connected client
        io.emit('chat message', { id: `${socket.id}`, message: msg, color: getRandomColor()});
    });

    socket.on('disconnect', function() {
        console.log('a user has disconnected', socket.id);

        io.emit('disconnect', { id: `${socket.id}` });

    });
});
