import './App.css';
import io from "socket.io-client";

import { useEffect, useState } from 'react';
import { Chart, TimeScale, LinearScale, LineController, PointElement, LineElement } from 'chart.js';
import 'react-chartjs-2'
import "chartjs-adapter-date-fns";
Chart.register(TimeScale, LinearScale, LineController, PointElement, LineElement);

const socket = io.connect('http://localhost:3001');

function App() {
  window.onload = function() {
    console.log('LOADED');

    var updateInterval = 20;
    var numberElements = 100;

    var updateCount = 0;

    var commonOptions = {
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
    var tempChartInstance = new Chart(document.getElementById('tempChart'), {
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
          duration: 10
        },
      })
    });

    function addData(data){
      if(data){
        tempChartInstance.data.labels.push(new Date());
        tempChartInstance.data.datasets.forEach((dataset) => {dataset.data.push(data)});
        if(updateCount > numberElements){
          tempChartInstance.data.labels.shift();
          tempChartInstance.data.datasets[0].data.shift();
        }
        else updateCount++;
        tempChartInstance.update();
      }
    };
    
    socket.on('data', (data) => {
      addData(data.value);
    })
  }

  return (
    <div className="App">
      <h1>Current temperature</h1>
      <div id='tempContainer' className='container'>
        <div id='temp' className='temp'>
          <canvas id='tempChart'></canvas>
        </div>
      </div>
    </div>
  );
}

export default App;
