const ctx = document.getElementById("tempChart");

//lets simulate 'simutime'
let simutime = Math.floor(Math.random(100)*100);
setInterval(() => {
  //i added some random values just to have raising values like in my original simutime from matlab model
  simutime += 3;
}, 500);

const data = {
  datasets: [
    {
      label: "Mains_1_Voltage",
      data: [],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
    {
      label: "Mains_1_Frequency",
      data: [],
      backgroundColor: "rgba(248, 109, 181, 1)",
      borderColor: "rgba(163, 109, 181, 1)",
      borderWidth: 1,
    }
  ]
};
const config = {
  type: "line",
  data: data,
  options: {
    plugins: {
      tooltip: {
        callbacks: {
          title(items) {
            if (items.length) {
              const item = items[0];
              const {chart, datasetIndex, dataIndex} = item;
              const simutimeData = chart.data.datasets[0].data[dataIndex];
              return 'Simutime: ' + simutimeData.simutime;
            }
          }
        }
      }
    },
    scales: {
      x: {
        type: 'realtime',
        realtime: {
          delay: 1000,
          onRefresh: chart => {
            // get unique time stamp for all data
            const now = Date.now(); 
            // check if the simutime is already stored
            // if yes, set undefined
            const data = chart.data.datasets[0].data.filter(element => element.simutime);
            let simu = simutime;
            if (data.length) {
              const lastData = data[data.length - 1];
              if (lastData.simutime === simu) {
                simu = undefined;
              }
            }
            chart.data.datasets[0].data.push({
              x: now,
              y: Math.random() * 100,
              simutime: simu
            });
            chart.data.datasets[1].data.push({
              x: now,
              y: Math.random() * 100
            });
          }
        },
        ticks: {
          // this forces to use the data for ticks 
          source: 'data',
          callback(value, index, ticks) {
            const tickValue = ticks[index].value;
            if (tickValue) {
              const dataset1Data = this.chart.data.datasets[0].data;
              const data = dataset1Data.filter(element => element.x === tickValue);
              if (data.length) {
                return data[0].simutime;
              }
            }
          }
        }
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 100
      },
    },
  },
};
const myChart = new Chart(ctx, config);