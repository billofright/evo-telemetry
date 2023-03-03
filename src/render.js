const socket = new io('ws://localhost:8080');

const button = document.getElementById('button')
const seconds = document.getElementById('seconds');
const tempChart = document.getElementById('tempChart');
const chart2 = document.getElementById('chart2');
const chart3 = document.getElementById('chart3');
const chart4 = document.getElementById('chart4');

require('chartjs-adapter-moment');
const { Chart } = require('chart.js/auto');

var updateInterval = 20;
var numberElements = 50;

var updateCount = 0;

button.onclick = () => {
    socket.emit('start', 0)
}

var commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'time',
            time: {
                displayFormats: {
                    millisecond: 'mm:ss:SSS'
                }
            }
            
        },
        y: {
            ticks: {
                beginAtZero:true
            }
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
            label: 'Chart2',
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
            label: 'Chart3',
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
            label: 'Chart4',
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
    if(data){
        chart.data.labels.push(new Date());
        chart.data.datasets.forEach((dataset) => {dataset.data.push(data)});
        if(updateCount > numberElements){
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        else updateCount++;
        chart.update();
    }
};
  
socket.on('message', (data) => {
    seconds.innerHTML = data.time
    addData(tempChartInstance, data.temp);
    addData(chart2Instance, data.data2);
    addData(chart3Instance, data.data3);
    addData(chart4Instance, data.data4);
});