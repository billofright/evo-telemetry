const http = require('http').createServer();
var { SerialPort, ReadlineParser } = require('serialport');
const parser = new ReadlineParser();

const fs = require('fs');

const io = require('socket.io')(http, {
    cors: {origin: '*'}
});

function getRand(max) {
    return Math.random() * max;
} 

io.on('connection', (socket) => {
    console.log('connection success')
    socket.once('start', text => {
        const writeStream = fs.createWriteStream('data.csv');
        writeStream.write("temp,data2,data3,data4\n");
        start = Date.now();
        parser.on('data', async (data) => {            
            let split = data.split(',');

            const overWatermark = writeStream.write(data);

            if(!overWatermark){
                await new Promise((resolve) => 
                    writeStream.once('drain', resolve)
                );
            }

            socket.emit('message', {
                time: (Date.now() - start)/1000,
                temp: split[0],
                data2: split[1],
                data3: split[2],
                data4: split[3]
            });

            socket.on('stop', () => {
                writeStream.end();
            })

        });
    });


    socket.on('portSelect', port => {
        var port = new SerialPort({
            path: port.path, 
            baudRate: 9600,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            flowControl: false,
        });
        port.pipe(parser);
    });
});

http.listen(8080, () => console.log('listening on 8080'));


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