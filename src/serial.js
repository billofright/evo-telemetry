const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: {origin: '*'}
});

function getRand(max) {
    return Math.random() * max;
} 

io.on('connection', (socket) => {
    console.log('connection success')
    socket.on('start', text => {
        let currTime = 0;
        setInterval(() => {
           currTime++;
           message = {
            'time': currTime,
            'temp': getRand(50),
            'data2': getRand(50),
            'data3': getRand(50),
            'data4': getRand(50),
           }
           socket.emit('message', message); 
        }, 1000);
    });
});

http.listen(8080, () => console.log('listening on 8080'))


/*
const browserEnv = require('browser-env')
browserEnv(['navigator']);

const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

app.use(cors());

var SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
    delimiter: '\r\n'
});

var port = new SerialPort('/dev/cu.usbserial-140',{
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

port.pipe(parser);

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: 'http://localhost:3000'
    }
});

io.on('connection', (socket) => {
    console.log('node is listening');
    start = Date.now()
    parser.on('data', (data) => {
        socket.broadcast.emit('data', {
            time: (Date.now() - start)/1000,
            value: data
        });
    });
})

server.listen(3001, () => {
    console.log('SERVER IS RUNNING');
});
*/