const socket = new io('ws://localhost:8080');

const button = document.getElementById('button')
const portSelectBtn = document.getElementById('portSelectBtn');
const logSelectBtn = document.getElementById('logSelectBtn');
const seconds = document.getElementById('seconds');
const tempChart = document.getElementById('tempChart');
const chart2 = document.getElementById('chart2');
const chart3 = document.getElementById('chart3');
const chart4 = document.getElementById('chart4');

//require('chartjs-adapter-moment');
const { Menu } = require('@electron/remote');
//const { Chart } = require('chart.js/auto');
const { autoDetect } = require('@serialport/bindings-cpp')
let serialport = require('serialport');
const fs = require('fs');
const path = require('path');

const Binding = autoDetect()

var updateInterval = 20;
var numberElements = 40;

var updateCount = 0;

button.onclick = () => {
    if(button.innerText == 'Start'){
        clearData(tempChartInstance);
        clearData(chart2Instance);
        clearData(chart3Instance);
        clearData(chart4Instance);
        logSelectBtn.disabled = true;
        socket.emit('start');
        socket.on('message', updateChart);
        button.innerText = 'Stop';

    }
    else{        
        socket.emit('stop');
        socket.off('message', updateChart);
        button.innerText = 'Start';
        logSelectBtn.disabled = false;
    }
    
}

portSelectBtn.onclick = getSerialPorts;

async function getSerialPorts() {
    const serialPorts = await Binding.list();

    const portsMenu = Menu.buildFromTemplate(
        serialPorts.map(port => {
            return {
                label: port.path,
                click: () => selectPort(port)
            };
        })
    );

    portsMenu.popup();
}

async function selectPort(port) {
    portSelectBtn.innerText = port.path;
    socket.emit('portSelect', port)
}

logSelectBtn.onclick = getLogs;

async function getLogs(){
    let logs = [];

    fs.readdirSync('data_logs').forEach(file => {
        logs.push(file);
    })

    const logsMenu = Menu.buildFromTemplate(
        logs.map(file => {
            return {
                label: file,
                click: () => selectLog(file)
            };
        })
    );

    logsMenu.popup();

}

async function selectLog(file){
    logSelectBtn.innerText = file;
    filePath = `data_logs/${file}`;
    if(fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath).toString());
        loadData(tempChartInstance, data.data.temp);
        loadData(chart2Instance, data.data.data2);
        loadData(chart3Instance, data.data.data3);
        loadData(chart4Instance, data.data.data4);

    }
    else console.log('file does not exist');
}


var commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'realtime',
        },
        y: {
            beginAtZero:true
        }
    },
    legend: {display: false},
    tooltips:{
        enabled: true
    }
};
var tempChartInstance = new Chart(tempChart, {
    type:'line',
    data: {
        datasets:[{
            label: 'Temperature',
            data: 0,
            fill: false,
            borderColor: '#343e9a',
            borderWidth: 1
        }]
    },
    options: Object.assign({}, commonOptions, {
    title:{
        display: true,
        text: 'Temperature',
        fontSize: 18
    },
    animation: {
        duration: 0
    },
    })
});

var chart2Instance = new Chart(chart2, {
    type:'line',
    data: {
        datasets:[{
            label: 'Joystick X',
            data: 0,
            fill: false,
            borderColor: '#343e9a',
            borderWidth: 1
        }]
    },
    options: Object.assign({}, commonOptions, {
    title:{
        display: true,
        text: 'data',
        fontSize: 18
    },
    animation: {
        duration: 0
    },
    })
});

var chart3Instance = new Chart(chart3, {
    type:'line',
    data: {
        datasets:[{
            label: 'Joystick Y',
            data: 0,
            fill: false,
            borderColor: '#343e9a',
            borderWidth: 1
        }]
    },
    options: Object.assign({}, commonOptions, {
    title:{
        display: true,
        text: 'data',
        fontSize: 18
    },
    animation: {
        duration: 0
    },
    })
});

var chart4Instance = new Chart(chart4, {
    type:'line',
    data: {
        datasets:[{
            label: 'Rotary Encoder Ticks',
            data: 0,
            fill: false,
            borderColor: '#343e9a',
            borderWidth: 1
        }]
    },
    options: Object.assign({}, commonOptions, {
    title:{
        display: true,
        text: 'data',
        fontSize: 18
    },
    animation: {
        duration: 0
    },
    })
});

function addData(chart, data){
    if(data != null){
        chart.data.labels.push(new Date());
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        if(updateCount > numberElements){
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        else updateCount++;
        chart.update();
    }
};

function loadData(chart, data){
    timeScale = [];
    for(let i = 0; i < data.length; i++){
        timeScale.push(i*250);
    }
    
    chart.data.labels = timeScale;
    chart.data.datasets.forEach((dataset) => {
        dataset.data = data;
    });
    chart.update();
}

function clearData(chart){
    chart.data.labels = [];
    chart.data.datasets.data = [];
    chart.update();
}
  
const updateChart = ('message', (data) => {
    seconds.innerHTML = data.time
    addData(tempChartInstance, data.temp);
    addData(chart2Instance, data.data2);
    addData(chart3Instance, data.data3);
    addData(chart4Instance, data.data4);
});