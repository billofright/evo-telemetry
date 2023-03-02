const tempChart = document.getElementById('tempChart');
const chart2 = document.getElementById('chart2');
const chart3 = document.getElementById('chart3');
const chart4 = document.getElementById('chart4');

require('chartjs-adapter-moment');
const { Chart } = require('chart.js/auto');

var updateInterval = 20;
var numberElements = 100;

var updateCount = 0;

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

var chart3Instance = new Chart(chart3, {
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

var chart4Instance = new Chart(chart4, {
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