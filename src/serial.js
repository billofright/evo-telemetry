const http = require('http').createServer();
var { SerialPort, ReadlineParser } = require('serialport');
const parser = new ReadlineParser({delimiter: '\r\n'});

const fs = require('fs');

const io = require('socket.io')(http, {
    cors: {origin: '*'}
});

function emptyData(date) {
    return {
        name: date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + "_" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds(),
        data: {
            temp:[],
            data2:[],
            data3:[],
            data4:[]
        }
    }
}

io.on('connection', (socket) => {
    console.log('connection success')
    socket.once('start', text => {
        start = Date.now();
        let recording = emptyData(new Date());
        parser.on('data', async (data) => {            
            let split = data.split(',');
            let dataLine = Array(split.length);
            for(let i = 0; i < split.length; i++){
                dataLine[i] = parseFloat(split[i]);
            }

            recording.data.temp.push(dataLine[0]);
            recording.data.data2.push(dataLine[1]);
            recording.data.data3.push(dataLine[2]);
            recording.data.data4.push(dataLine[3]);

            socket.emit('message', {
                time: (Date.now() - start)/1000,
                temp: dataLine[0],
                data2: dataLine[1],
                data3: dataLine[2],
                data4: dataLine[3]
            });

            socket.on('stop', () => {
                dataString = JSON.stringify(recording, null, 2);
                fs.writeFile(`data_logs/${recording.name}.json`, dataString, err => {
                    if(err){
                        console.log(err);
                    }
                });
                // recording = emptyData(new Date());
            });

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