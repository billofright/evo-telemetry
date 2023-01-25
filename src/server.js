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
start = Date.now()

io.on('connection', (socket) => {
    console.log('node is listening');
    parser.on('data', (data) => {
        //console.log(data);
        socket.broadcast.emit('data', {
            time: (Date.now() - start)/1000,
            value: data
        });
    });
})

server.listen(3001, () => {
    console.log('SERVER IS RUNNING');
});